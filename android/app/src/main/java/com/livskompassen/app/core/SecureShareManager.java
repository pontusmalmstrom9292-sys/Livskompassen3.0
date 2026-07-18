package com.livskompassen.app.core;

import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.util.Base64;
import android.webkit.URLUtil;
import android.widget.Toast;

import androidx.core.content.FileProvider;

import com.livskompassen.app.util.LCLog;

import java.io.File;
import java.io.FileOutputStream;

/**
 * SECURE SHARE - Våg 32.
 * Manages temporary, secure file sharing from the Vault to external apps,
 * plus https downloads via system DownloadManager (Titanium — no plaintext prefs).
 */
public class SecureShareManager {
    /** Must match cache-path in res/xml/file_paths.xml */
    private static final String TEMP_SHARE_DIR = "export";
    private final Context context;

    public SecureShareManager(Context context) {
        this.context = context.getApplicationContext();
    }

    /**
     * Delar en textsträng som en temporär fil.
     */
    public void shareTextAsFile(String content, String fileName, String mimeType) {
        if (content == null) {
            LCLog.e("SecureShareManager: shareTextAsFile called with null content");
            return;
        }
        shareBytesAsFile(content.getBytes(java.nio.charset.StandardCharsets.UTF_8), fileName, mimeType);
    }

    /**
     * Decodes Base64 (optional data-URL prefix) and shares as a temporary file.
     */
    public void shareBase64AsFile(String base64Payload, String fileName, String mimeType) {
        if (base64Payload == null || base64Payload.trim().isEmpty()) {
            LCLog.e("SecureShareManager: empty base64 payload");
            return;
        }
        try {
            String raw = base64Payload.trim();
            int comma = raw.indexOf(',');
            if (raw.startsWith("data:") && comma > 0) {
                raw = raw.substring(comma + 1);
            }
            byte[] bytes = Base64.decode(raw, Base64.DEFAULT);
            shareBytesAsFile(bytes, sanitizeFileName(fileName, "export.bin"), mimeType);
        } catch (Exception e) {
            LCLog.e("SecureShareManager: shareBase64AsFile failed: " + e.getMessage());
            Toast.makeText(context, "Kunde inte exportera filen.", Toast.LENGTH_LONG).show();
        }
    }

    /**
     * Writes bytes to cache and opens the system share sheet.
     */
    public void shareBytesAsFile(byte[] bytes, String fileName, String mimeType) {
        try {
            File shareDir = new File(context.getCacheDir(), TEMP_SHARE_DIR);
            if (!shareDir.exists() && !shareDir.mkdirs()) {
                throw new IllegalStateException("Could not create share dir");
            }

            File[] oldFiles = shareDir.listFiles();
            if (oldFiles != null) {
                for (File oldFile : oldFiles) {
                    //noinspection ResultOfMethodCallIgnored
                    oldFile.delete();
                }
            }

            String safeName = sanitizeFileName(fileName, "export.bin");
            File tempFile = new File(shareDir, safeName);
            try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                fos.write(bytes);
            }

            Uri contentUri = FileProvider.getUriForFile(
                    context,
                    context.getPackageName() + ".fileprovider",
                    tempFile);

            String type = (mimeType != null && !mimeType.trim().isEmpty())
                    ? mimeType.trim()
                    : "application/octet-stream";

            Intent intent = new Intent(Intent.ACTION_SEND);
            intent.setType(type);
            intent.putExtra(Intent.EXTRA_STREAM, contentUri);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

            Intent chooser = Intent.createChooser(intent, "Exportera från Valvet");
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(chooser);

            LCLog.d("SecureShareManager: Temporary file shared successfully (" + safeName + ").");
        } catch (Exception e) {
            LCLog.e("SecureShareManager: Failed to share file: " + e.getMessage());
            Toast.makeText(context, "Kunde inte exportera filen.", Toast.LENGTH_LONG).show();
        }
    }

    /**
     * Enqueues an https download to the public Downloads folder via DownloadManager.
     * Rejects non-https URLs (fail-closed).
     */
    public void enqueueHttpsDownload(String url, String fileName, String mimeType) {
        if (url == null || url.trim().isEmpty()) {
            LCLog.e("SecureShareManager: empty download URL");
            return;
        }
        String trimmed = url.trim();
        if (!trimmed.startsWith("https://")) {
            LCLog.e("SecureShareManager: refusing non-https download URL");
            Toast.makeText(context, "Nedladdning blockerad (osäker länk).", Toast.LENGTH_LONG).show();
            return;
        }
        try {
            String guessed = URLUtil.guessFileName(trimmed, null, mimeType);
            String safeName = sanitizeFileName(
                    (fileName != null && !fileName.trim().isEmpty()) ? fileName : guessed,
                    "livskompassen-download.bin");

            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(trimmed));
            request.setTitle(safeName);
            request.setDescription("Livskompassen — säker nedladdning");
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, safeName);
            if (mimeType != null && !mimeType.trim().isEmpty()) {
                request.setMimeType(mimeType.trim());
            }
            request.addRequestHeader("User-Agent", "Livskompassen-Android");

            DownloadManager dm = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
            if (dm == null) {
                throw new IllegalStateException("DownloadManager unavailable");
            }
            dm.enqueue(request);
            Toast.makeText(context, "Laddar ner till Downloads…", Toast.LENGTH_SHORT).show();
            LCLog.d("SecureShareManager: enqueued https download " + safeName);
        } catch (Exception e) {
            LCLog.e("SecureShareManager: enqueueHttpsDownload failed: " + e.getMessage());
            Toast.makeText(context, "Nedladdning misslyckades.", Toast.LENGTH_LONG).show();
        }
    }

    private static String sanitizeFileName(String fileName, String fallback) {
        if (fileName == null || fileName.trim().isEmpty()) {
            return fallback;
        }
        String cleaned = fileName.trim().replaceAll("[\\\\/:*?\"<>|]", "_");
        if (cleaned.isEmpty() || cleaned.equals(".") || cleaned.equals("..")) {
            return fallback;
        }
        return cleaned.length() > 120 ? cleaned.substring(0, 120) : cleaned;
    }
}

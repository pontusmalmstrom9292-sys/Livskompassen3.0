package com.livskompassen.app.widgets;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.widget.Toast;

import androidx.annotation.RequiresApi;
import androidx.security.crypto.EncryptedFile;

import com.livskompassen.app.R;
import com.livskompassen.app.core.SecureShareManager;
import com.livskompassen.app.util.LCLog;
import com.livskompassen.app.util.SecurePrefs;
import com.livskompassen.app.util.SecurityUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

/**
 * @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET*.md
 *
 * Secure local vault for Companion widget recordings.
 * At rest: AES EncryptedFile under app-private files/.
 * Export: decrypt to temp → share sheet (phone/PC) or MediaStore Downloads.
 */
public final class WidgetCaptureStore {

    private static final String INDEX_KEY = "widget_capture_index";
    private static final String ENC_DIR = "widget_captures_enc";
    private static final String META_SEP = "\u001f";

    public static final class Entry {
        public final String id;
        public final long createdAt;
        public final String encFileName;
        public final long sizeBytes;
        public final String displayName;

        Entry(String id, long createdAt, String encFileName, long sizeBytes, String displayName) {
            this.id = id;
            this.createdAt = createdAt;
            this.encFileName = encFileName;
            this.sizeBytes = sizeBytes;
            this.displayName = displayName;
        }
    }

    private WidgetCaptureStore() {}

    public static File encDir(Context context) {
        File dir = new File(context.getFilesDir(), ENC_DIR);
        if (!dir.exists()) {
            //noinspection ResultOfMethodCallIgnored
            dir.mkdirs();
        }
        return dir;
    }

    /**
     * Encrypt plaintext m4a into private store; delete plaintext; update index + sync queue.
     */
    public static Entry storePlainRecording(Context context, File plainM4a) throws Exception {
        if (plainM4a == null || !plainM4a.exists() || plainM4a.length() == 0) {
            throw new IllegalArgumentException("empty recording");
        }
        String id = UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        long now = System.currentTimeMillis();
        String display = "hemlig_" + new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(new Date(now)) + ".m4a";
        String encName = id + ".m4a.enc";
        File encFile = new File(encDir(context), encName);
        if (encFile.exists()) {
            //noinspection ResultOfMethodCallIgnored
            encFile.delete();
        }

        EncryptedFile encrypted = SecurityUtils.getEncryptedFile(context, encFile);
        try (InputStream in = new FileInputStream(plainM4a);
             OutputStream out = encrypted.openFileOutput()) {
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) >= 0) {
                out.write(buf, 0, n);
            }
            out.flush();
        }

        long size = plainM4a.length();
        //noinspection ResultOfMethodCallIgnored
        plainM4a.delete();

        Entry entry = new Entry(id, now, encName, size, display);
        prependIndex(context, entry);

        SharedPreferences prefs = SecurePrefs.get(context);
        prefs.edit()
            .putString("widget_draft_capture_id", id)
            .putString("widget_draft_capture_name", display)
            .putString("widget_queue_capture", id + "|" + now + "|" + display)
            .apply();

        return entry;
    }

    public static List<Entry> listEntries(Context context) {
        List<Entry> out = new ArrayList<>();
        String raw = SecurePrefs.get(context).getString(INDEX_KEY, "");
        if (raw == null || raw.trim().isEmpty()) return out;
        String[] lines = raw.split("\n");
        for (String line : lines) {
            Entry e = parseLine(line);
            if (e != null) out.add(e);
        }
        return out;
    }

    public static Entry latest(Context context) {
        List<Entry> list = listEntries(context);
        return list.isEmpty() ? null : list.get(0);
    }

    public static Entry find(Context context, String id) {
        if (id == null) return null;
        for (Entry e : listEntries(context)) {
            if (id.equals(e.id)) return e;
        }
        return null;
    }

    /** Decrypt to cache/export for FileProvider share. */
    public static File decryptToExportTemp(Context context, Entry entry) throws Exception {
        File encFile = new File(encDir(context), entry.encFileName);
        if (!encFile.exists()) {
            throw new IllegalStateException("missing encrypted file");
        }
        File shareDir = new File(context.getCacheDir(), "export");
        if (!shareDir.exists() && !shareDir.mkdirs()) {
            throw new IllegalStateException("export dir");
        }
        File out = new File(shareDir, entry.displayName);
        if (out.exists()) {
            //noinspection ResultOfMethodCallIgnored
            out.delete();
        }
        EncryptedFile encrypted = SecurityUtils.getEncryptedFile(context, encFile);
        try (InputStream in = encrypted.openFileInput();
             OutputStream fos = new FileOutputStream(out)) {
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) >= 0) {
                fos.write(buf, 0, n);
            }
            fos.flush();
        }
        return out;
    }

    /** System share sheet — phone apps / AirDrop / PC via USB/share. */
    public static void shareToDevice(Context context, String id) {
        try {
            Entry entry = find(context, id);
            if (entry == null) entry = latest(context);
            if (entry == null) {
                Toast.makeText(context, R.string.widget_capture_none, Toast.LENGTH_SHORT).show();
                return;
            }
            File temp = decryptToExportTemp(context, entry);
            new SecureShareManager(context).shareFile(temp, entry.displayName, "audio/mp4");
        } catch (Exception e) {
            LCLog.e("WidgetCaptureStore: share failed: " + e.getMessage());
            Toast.makeText(context, R.string.widget_capture_export_fail, Toast.LENGTH_LONG).show();
        }
    }

    /** Save decrypted copy into public Downloads (accessible from PC via USB/Files). */
    public static void downloadToDownloads(Context context, String id) {
        try {
            Entry entry = find(context, id);
            if (entry == null) entry = latest(context);
            if (entry == null) {
                Toast.makeText(context, R.string.widget_capture_none, Toast.LENGTH_SHORT).show();
                return;
            }
            File temp = decryptToExportTemp(context, entry);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                writeToMediaStoreDownloads(context, temp, entry.displayName);
            } else {
                File dest = new File(
                    Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS),
                    entry.displayName
                );
                copyFile(temp, dest);
            }
            // Wipe plaintext temp after copy
            //noinspection ResultOfMethodCallIgnored
            temp.delete();
            Toast.makeText(context, R.string.widget_capture_downloaded, Toast.LENGTH_LONG).show();
        } catch (Exception e) {
            LCLog.e("WidgetCaptureStore: download failed: " + e.getMessage());
            Toast.makeText(context, R.string.widget_capture_export_fail, Toast.LENGTH_LONG).show();
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    private static void writeToMediaStoreDownloads(Context context, File source, String displayName)
            throws Exception {
        ContentResolver resolver = context.getContentResolver();
        ContentValues values = new ContentValues();
        values.put(MediaStore.Downloads.DISPLAY_NAME, displayName);
        values.put(MediaStore.Downloads.MIME_TYPE, "audio/mp4");
        values.put(MediaStore.Downloads.IS_PENDING, 1);
        Uri collection = MediaStore.Downloads.EXTERNAL_CONTENT_URI;
        Uri item = resolver.insert(collection, values);
        if (item == null) throw new IllegalStateException("MediaStore insert failed");
        try (InputStream in = new FileInputStream(source);
             OutputStream out = resolver.openOutputStream(item)) {
            if (out == null) throw new IllegalStateException("null output stream");
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) >= 0) {
                out.write(buf, 0, n);
            }
            out.flush();
        }
        values.clear();
        values.put(MediaStore.Downloads.IS_PENDING, 0);
        resolver.update(item, values, null, null);
    }

    private static void copyFile(File src, File dest) throws Exception {
        try (InputStream in = new FileInputStream(src);
             OutputStream out = new FileOutputStream(dest)) {
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) >= 0) {
                out.write(buf, 0, n);
            }
            out.flush();
        }
    }

    /** Zero Footprint helper — wipe encrypted captures + index. */
    public static void clearAll(Context context) {
        File dir = encDir(context);
        File[] files = dir.listFiles();
        if (files != null) {
            for (File f : files) {
                //noinspection ResultOfMethodCallIgnored
                f.delete();
            }
        }
        SecurePrefs.get(context).edit()
            .remove(INDEX_KEY)
            .remove("widget_draft_capture_id")
            .remove("widget_draft_capture_name")
            .remove("widget_draft_capture_path")
            .remove("widget_queue_capture")
            .apply();
    }

    private static void prependIndex(Context context, Entry entry) {
        String line = entry.id + META_SEP + entry.createdAt + META_SEP + entry.encFileName
            + META_SEP + entry.sizeBytes + META_SEP + entry.displayName;
        String prev = SecurePrefs.get(context).getString(INDEX_KEY, "");
        String next = (prev == null || prev.isEmpty()) ? line : line + "\n" + prev;
        // Cap index at 40 entries
        String[] parts = next.split("\n");
        if (parts.length > 40) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 40; i++) {
                if (i > 0) sb.append('\n');
                sb.append(parts[i]);
            }
            next = sb.toString();
        }
        SecurePrefs.get(context).edit().putString(INDEX_KEY, next).apply();
    }

    private static Entry parseLine(String line) {
        if (line == null || line.isEmpty()) return null;
        String[] p = line.split(META_SEP, -1);
        if (p.length < 5) return null;
        try {
            return new Entry(p[0], Long.parseLong(p[1]), p[2], Long.parseLong(p[3]), p[4]);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}

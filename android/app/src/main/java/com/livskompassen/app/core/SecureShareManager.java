package com.livskompassen.app.core;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import androidx.core.content.FileProvider;
import com.livskompassen.app.util.LCLog;
import java.io.File;
import java.io.FileOutputStream;

/**
 * SECURE SHARE - Våg 32.
 * Manages temporary, secure file sharing from the Vault to external apps.
 */
public class SecureShareManager {
    private static final String TEMP_SHARE_DIR = "secure_exports";
    private final Context context;

    public SecureShareManager(Context context) {
        this.context = context;
    }

    /**
     * Delar en textsträng som en temporär fil.
     */
    public void shareTextAsFile(String content, String fileName, String mimeType) {
        try {
            File shareDir = new File(context.getCacheDir(), TEMP_SHARE_DIR);
            if (!shareDir.exists()) shareDir.mkdirs();

            // Rensa gamla filer först
            for (File oldFile : shareDir.listFiles()) oldFile.delete();

            File tempFile = new File(shareDir, fileName);
            try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                fos.write(content.getBytes("UTF-8"));
            }

            Uri contentUri = FileProvider.getUriForFile(context, 
                    context.getPackageName() + ".fileprovider", tempFile);

            Intent intent = new Intent(Intent.ACTION_SEND);
            intent.setType(mimeType);
            intent.putExtra(Intent.EXTRA_STREAM, contentUri);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

            Intent chooser = Intent.createChooser(intent, "Exportera från Valvet");
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(chooser);

            LCLog.d("SecureShareManager: Temporary file shared successfully.");
        } catch (Exception e) {
            LCLog.e("SecureShareManager: Failed to share file: " + e.getMessage());
        }
    }
}

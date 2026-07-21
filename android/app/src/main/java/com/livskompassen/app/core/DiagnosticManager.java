package com.livskompassen.app.core;

import android.content.Context;
import androidx.security.crypto.EncryptedFile;
import androidx.security.crypto.MasterKey;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/**
 * THE BLACK BOX - CRITICAL COMPONENT.
 * Manages encrypted diagnostic logging for troubleshooting without compromising privacy.
 */
public class DiagnosticManager {
    private static final String LOG_FILE_NAME = "diagnostic_blackbox.txt";
    private static final int MAX_LOG_SIZE_BYTES = 64 * 1024; // 64KB cap for G85 performance
    private static final int BUFFER_FLUSH_THRESHOLD = 20; // Flush after 20 lines

    private static DiagnosticManager instance;
    private final Context context;
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS", Locale.US);
    private final List<String> logBuffer = new ArrayList<>();

    private DiagnosticManager(Context context) {
        this.context = context.getApplicationContext();
    }

    public static synchronized void init(Context context) {
        if (instance == null) {
            instance = new DiagnosticManager(context);
        }
    }

    public static DiagnosticManager getInstance() {
        return instance;
    }

    /**
     * Skriver en loggrad till den krypterade filen.
     * På G85 använder vi en buffer för att undvika tung disk-I/O vid varje anrop.
     */
    public synchronized void writeLog(String level, String message) {
        String timeStamp = dateFormat.format(new Date());
        String logLine = String.format("[%s] [%s] %s", timeStamp, level, message);
        logBuffer.add(logLine);

        // Flush direkt vid fel eller när bufferten är full
        if ("ERROR".equals(level) || logBuffer.size() >= BUFFER_FLUSH_THRESHOLD) {
            flushToDisk();
        }
    }

    /**
     * Tvingar fram en skrivning av bufferten till den krypterade filen.
     * EncryptedFile tillåter inte append/overwrite — filen måste raderas före ny write.
     * Bufferten rensas först efter lyckad skrivning (fail-closed för diagnostik).
     */
    public synchronized void flushToDisk() {
        if (logBuffer.isEmpty()) return;

        try {
            MasterKey masterKey = new MasterKey.Builder(context)
                    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                    .build();

            File file = new File(context.getFilesDir(), LOG_FILE_NAME);

            // 1. Läs in befintlig data (om filen finns)
            List<String> allLines = new ArrayList<>();
            if (file.exists()) {
                try {
                    EncryptedFile encryptedFile = new EncryptedFile.Builder(
                            context,
                            file,
                            masterKey,
                            EncryptedFile.FileEncryptionScheme.AES256_GCM_HKDF_4KB
                    ).build();

                    try (BufferedReader reader = new BufferedReader(new InputStreamReader(encryptedFile.openFileInput()))) {
                        String line;
                        while ((line = reader.readLine()) != null) {
                            allLines.add(line);
                        }
                    }
                } catch (Exception e) {
                    android.util.Log.e("DiagnosticManager", "Failed to read existing Black Box: " + e.getMessage());
                    // Korrupt fil: starta om med endast bufferten; gammal fil raderas nedan.
                    allLines.clear();
                }
            }

            // 2. Merge buffert (rensa INTE förrän write lyckats)
            allLines.addAll(logBuffer);

            // 3. Rotation — senaste 500 raderna (~under 64KB på G85)
            if (allLines.size() > 500) {
                allLines = new ArrayList<>(allLines.subList(allLines.size() - 500, allLines.size()));
            }

            // 4. EncryptedFile.openFileOutput() kräver att filen inte finns
            if (file.exists() && !file.delete()) {
                android.util.Log.e("DiagnosticManager", "Failed to delete Black Box for rewrite — buffer retained.");
                return;
            }

            try {
                EncryptedFile encryptedFile = new EncryptedFile.Builder(
                        context,
                        file,
                        masterKey,
                        EncryptedFile.FileEncryptionScheme.AES256_GCM_HKDF_4KB
                ).build();

                try (OutputStream os = encryptedFile.openFileOutput();
                     BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os))) {
                    for (String line : allLines) {
                        writer.write(line);
                        writer.newLine();
                    }
                }

                // 5. Endast efter lyckad write
                logBuffer.clear();
            } catch (Exception writeError) {
                // Delete redan klar — återställ mergeade rader så nästa flush kan försöka igen
                logBuffer.clear();
                logBuffer.addAll(allLines);
                throw writeError;
            }
        } catch (Exception e) {
            android.util.Log.e("DiagnosticManager", "Failed to flush Black Box: " + e.getMessage());
            // Buffert behålls för nästa försök
        }
    }

    public File getLogFile() {
        return new File(context.getFilesDir(), LOG_FILE_NAME);
    }
}

package com.livskompassen.app.core;

import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.security.crypto.EncryptedFile;
import androidx.security.crypto.MasterKey;

import com.livskompassen.app.R;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.concurrent.Executor;

/**
 * THE BLACK BOX EXPLORER - Våg 180.
 * Biometric-protected viewer for encrypted diagnostic logs.
 */
public class DiagnosticViewerActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.layout_diagnostic_viewer);
        
        findViewById(R.id.diag_btn_close).setOnClickListener(v -> finish());
        
        authenticate();
    }

    private void authenticate() {
        BiometricManager biometricManager = BiometricManager.from(this);
        int authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG | BiometricManager.Authenticators.DEVICE_CREDENTIAL;
        
        if (biometricManager.canAuthenticate(authenticators) != BiometricManager.BIOMETRIC_SUCCESS) {
            Toast.makeText(this, "Säkerhetsautentisering saknas", Toast.LENGTH_LONG).show();
            finish();
            return;
        }

        Executor executor = ContextCompat.getMainExecutor(this);
        BiometricPrompt biometricPrompt = new BiometricPrompt(this, executor,
                new BiometricPrompt.AuthenticationCallback() {
                    @Override
                    public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                        super.onAuthenticationSucceeded(result);
                        loadLogs();
                    }

                    @Override
                    public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                        super.onAuthenticationError(errorCode, errString);
                        finish();
                    }

                    @Override
                    public void onAuthenticationFailed() {
                        super.onAuthenticationFailed();
                    }
                });

        BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                .setTitle("Black Box Access")
                .setSubtitle("Verifiera din identitet för att läsa systemloggarna")
                .setAllowedAuthenticators(authenticators)
                .build();

        biometricPrompt.authenticate(promptInfo);
    }

    private void loadLogs() {
        try {
            MasterKey masterKey = new MasterKey.Builder(this)
                    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                    .build();

            File file = new File(getFilesDir(), "diagnostic_blackbox.txt");
            if (!file.exists()) {
                ((TextView) findViewById(R.id.diag_log_text)).setText("Inga loggar tillgängliga.");
                return;
            }

            EncryptedFile encryptedFile = new EncryptedFile.Builder(
                    this,
                    file,
                    masterKey,
                    EncryptedFile.FileEncryptionScheme.AES256_GCM_HKDF_4KB
            ).build();

            StringBuilder sb = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(encryptedFile.openFileInput()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line).append("\n");
                }
            }
            
            ((TextView) findViewById(R.id.diag_log_text)).setText(sb.toString());
        } catch (Exception e) {
            ((TextView) findViewById(R.id.diag_log_text)).setText("Fel vid läsning: " + e.getMessage());
        }
    }
}

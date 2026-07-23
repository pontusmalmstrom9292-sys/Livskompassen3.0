package com.livskompassen.app.core;

import android.content.Context;
import androidx.annotation.NonNull;
import com.google.mlkit.nl.languageid.LanguageIdentification;
import com.google.mlkit.nl.languageid.LanguageIdentifier;
import com.livskompassen.app.util.LCLog;

import java.util.Locale;

/**
 * THE OMNI MIND (EDGE AI) - Våg 111.
 * Processes user intent and categorizes data locally using ML Kit.
 */
public class IntelligenceManager {
    private final Context context;
    private final LanguageIdentifier languageIdentifier;

    public interface IntelligenceCallback {
        void onResult(String silo, String language);
    }

    public IntelligenceManager(Context context) {
        this.context = context;
        this.languageIdentifier = LanguageIdentification.getClient();
    }

    /**
     * Analyserar text lokalt och föreslår ett silo (Tanke, Idé, Handling).
     */
    public void analyzeIntent(String text, IntelligenceCallback callback) {
        if (text == null || text.trim().isEmpty()) {
            callback.onResult("tanke", "und");
            return;
        }

        languageIdentifier.identifyLanguage(text)
            .addOnSuccessListener(languageCode -> {
                String silo = classifySilo(text.toLowerCase(Locale.getDefault()));
                LCLog.d("Intelligence: Detected lang=" + languageCode + ", silo=" + silo);
                callback.onResult(silo, languageCode);
            })
            .addOnFailureListener(e -> {
                callback.onResult("tanke", "und");
            });
    }

    private String classifySilo(String text) {
        // Enkel men kraftfull lokal logik (Edge AI start)
        // I framtiden kan detta ersättas av en TFLite-modell
        
        if (text.contains("ska") || text.contains("måste") || text.contains("ring") || 
            text.contains("boka") || text.contains("köp") || text.contains("do")) {
            return "handling";
        }
        
        if (text.contains("kanske") || text.contains("undrar") || text.contains("varför") || 
            text.contains("tänker") || text.contains("känns")) {
            return "tanke";
        }
        
        if (text.contains("idé") || text.contains("projekt") || text.contains("skapa") || 
            text.contains("bygga") || text.contains("vision")) {
            return "idé";
        }

        return "tanke"; // Default
    }
}

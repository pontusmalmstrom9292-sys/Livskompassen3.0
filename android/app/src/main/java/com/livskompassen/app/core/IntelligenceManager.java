package com.livskompassen.app.core;

import android.content.Context;
import androidx.annotation.NonNull;
import com.google.mlkit.nl.entityextraction.Entity;
import com.google.mlkit.nl.entityextraction.EntityAnnotation;
import com.google.mlkit.nl.entityextraction.EntityExtraction;
import com.google.mlkit.nl.entityextraction.EntityExtractor;
import com.google.mlkit.nl.entityextraction.EntityExtractorOptions;
import com.google.mlkit.nl.languageid.LanguageIdentification;
import com.google.mlkit.nl.languageid.LanguageIdentifier;
import com.livskompassen.app.util.LCLog;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * THE OMNI MIND (EDGE AI) - Våg 111.
 * Processes user intent and categorizes data locally using ML Kit.
 */
public class IntelligenceManager {
    private final Context context;
    private final LanguageIdentifier languageIdentifier;
    private final EntityExtractor entityExtractor;
    private final BatteryManager batteryManager;

    /** ML Kit entity extraction has no Swedish model — EN + SV keyword enrich. */
    private static final Pattern SV_DATE_TIME = Pattern.compile(
            "(?i)\\b(imorgon|idag|igår|i\\s*övermorgon|"
                    + "måndag|tisdag|onsdag|torsdag|fredag|lördag|söndag|"
                    + "nästa\\s+vecka|denna\\s+vecka|"
                    + "kl\\.?\\s*\\d{1,2}([.:]\\d{2})?|"
                    + "\\d{1,2}[/:.-]\\d{1,2}([/:.-]\\d{2,4})?)\\b");

    public interface IntelligenceCallback {
        void onResult(String silo, String language, List<String> entities);
    }

    public IntelligenceManager(Context context) {
        this.context = context;
        this.batteryManager = new BatteryManager(context);
        this.languageIdentifier = LanguageIdentification.getClient();
        this.entityExtractor = EntityExtraction.getClient(
                new EntityExtractorOptions.Builder(EntityExtractorOptions.ENGLISH).build());

        if (!batteryManager.shouldReducePerformance()) {
            entityExtractor.downloadModelIfNeeded();
        }
    }

    /**
     * Analyserar text lokalt och föreslår ett silo (Tanke, Idé, Handling).
     * Entity Extraction (datum/tid) + svensk keyword-enrichment.
     */
    public void analyzeIntent(String text, IntelligenceCallback callback) {
        if (text == null || text.trim().isEmpty()) {
            callback.onResult("tanke", "und", new ArrayList<>());
            return;
        }

        languageIdentifier.identifyLanguage(text)
            .addOnSuccessListener(languageCode -> {
                String silo = classifySilo(text.toLowerCase(Locale.getDefault()));

                if (batteryManager.shouldReducePerformance()) {
                    List<String> entities = enrichSwedishDateEntities(text, new ArrayList<>());
                    callback.onResult(silo, languageCode, entities);
                    return;
                }

                entityExtractor.annotate(text)
                    .addOnSuccessListener(annotations -> {
                        List<String> entities = new ArrayList<>();
                        for (EntityAnnotation annotation : annotations) {
                            if (annotation.getEntities().isEmpty()) continue;
                            int type = annotation.getEntities().get(0).getType();
                            entities.add(entityTypeLabel(type) + ":" + annotation.getAnnotatedText());
                        }
                        entities = enrichSwedishDateEntities(text, entities);
                        LCLog.d("Intelligence: lang=" + languageCode + ", silo=" + silo + ", entities=" + entities.size());
                        callback.onResult(silo, languageCode, entities);
                    })
                    .addOnFailureListener(e -> {
                        List<String> entities = enrichSwedishDateEntities(text, new ArrayList<>());
                        callback.onResult(silo, languageCode, entities);
                    });
            })
            .addOnFailureListener(e -> {
                callback.onResult("tanke", "und", enrichSwedishDateEntities(text, new ArrayList<>()));
            });
    }

    @NonNull
    static String entityTypeLabel(int type) {
        switch (type) {
            case Entity.TYPE_DATE_TIME:
                return "DATE_TIME";
            case Entity.TYPE_ADDRESS:
                return "ADDRESS";
            case Entity.TYPE_PHONE:
                return "PHONE";
            case Entity.TYPE_EMAIL:
                return "EMAIL";
            case Entity.TYPE_URL:
                return "URL";
            case Entity.TYPE_MONEY:
                return "MONEY";
            case Entity.TYPE_FLIGHT_NUMBER:
                return "FLIGHT";
            case Entity.TYPE_IBAN:
            case Entity.TYPE_ISBN:
            case Entity.TYPE_PAYMENT_CARD:
            case Entity.TYPE_TRACKING_NUMBER:
            default:
                return "ENTITY_" + type;
        }
    }

    private List<String> enrichSwedishDateEntities(String text, List<String> entities) {
        if (text == null) return entities;
        Matcher m = SV_DATE_TIME.matcher(text);
        while (m.find()) {
            String hit = m.group();
            String tagged = "DATE_TIME:" + hit;
            boolean exists = false;
            for (String e : entities) {
                if (e.endsWith(":" + hit) || e.contains(hit)) {
                    exists = true;
                    break;
                }
            }
            if (!exists) entities.add(tagged);
        }
        return entities;
    }

    private String classifySilo(String text) {
        if (text.contains("inte") || text.contains("sluta") || text.contains("aldrig") || text.contains("avboka")) {
            return "tanke";
        }

        if (text.contains("ska") || text.contains("måste") || text.contains("ring") ||
            text.contains("boka") || text.contains("köp") || text.contains("gör") ||
            text.contains("fixa") || text.contains("behöver") || text.contains("idag") ||
            text.contains("nu") || text.contains("snart") || text.contains("möte")) {
            return "handling";
        }

        if (text.contains("idé") || text.contains("projekt") || text.contains("skapa") ||
            text.contains("bygga") || text.contains("vision") || text.contains("framtid") ||
            text.contains("testa") || text.contains("dröm") || text.contains("tänk om") ||
            text.contains("starta") || text.contains("koncept")) {
            return "idé";
        }

        return "tanke";
    }
}

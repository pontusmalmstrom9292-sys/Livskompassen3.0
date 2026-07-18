package com.livskompassen.app.util;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.Nullable;
import androidx.security.crypto.EncryptedSharedPreferences;
import androidx.security.crypto.MasterKey;

import java.io.File;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * CRITICAL — Titanium Aura Omni Baseline.
 * All sensitive prefs MUST use AES-256 EncryptedSharedPreferences.
 * NEVER fall back to plaintext SharedPreferences.
 */
public class SecurePrefs {
    private static final String SECURE_PREFS_NAME = "secure_livskompassen_prefs";
    private static final String PREF_KEY_GENERATION = "key_generation";
    private static final String META_PREFS = "system_meta";
    private static final String META_STORAGE_FAILED = "secure_storage_failed";

    private static volatile boolean degraded = false;

    /** True when encrypted storage failed and only ephemeral in-memory prefs are in use. */
    public static boolean isDegraded() {
        return degraded;
    }

    public static SharedPreferences get(Context context) {
        Context app = context.getApplicationContext();
        try {
            SharedPreferences prefs = openEncrypted(app);
            degraded = false;
            clearStorageFailureFlag(app);
            wipeLegacyPlaintextFallback(app);
            return prefs;
        } catch (GeneralSecurityException | IOException primary) {
            LCLog.e("SecurePrefs: primary open failed: " + primary.getMessage());
            try {
                // One-shot recovery: new key generation — still encrypted, never plaintext.
                rotateKeys(app);
                SharedPreferences prefs = openEncrypted(app);
                degraded = false;
                clearStorageFailureFlag(app);
                wipeLegacyPlaintextFallback(app);
                LCLog.w("SecurePrefs: recovered via key rotation.");
                return prefs;
            } catch (GeneralSecurityException | IOException recovery) {
                degraded = true;
                flagStorageFailure(app);
                wipeLegacyPlaintextFallback(app);
                LCLog.e("FATAL: SecurePrefs unavailable after recovery. "
                        + "Refusing plaintext fallback. Using ephemeral memory only. "
                        + recovery.getMessage());
                return new InMemorySharedPreferences();
            }
        }
    }

    private static SharedPreferences openEncrypted(Context context)
            throws GeneralSecurityException, IOException {
        int currentGen = context.getSharedPreferences(META_PREFS, Context.MODE_PRIVATE)
                .getInt(PREF_KEY_GENERATION, 1);
        String alias = MasterKey.DEFAULT_MASTER_KEY_ALIAS + "_gen" + currentGen;

        MasterKey masterKey = new MasterKey.Builder(context, alias)
                .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                .build();

        return EncryptedSharedPreferences.create(
                context,
                SECURE_PREFS_NAME + "_gen" + currentGen,
                masterKey,
                EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        );
    }

    /**
     * Triggar en rotation av krypteringsnycklar.
     * Kräv biometri innan du anropar detta i produktion!
     */
    public static void rotateKeys(Context context) {
        SharedPreferences meta = context.getApplicationContext()
                .getSharedPreferences(META_PREFS, Context.MODE_PRIVATE);
        int currentGen = meta.getInt(PREF_KEY_GENERATION, 1);
        meta.edit().putInt(PREF_KEY_GENERATION, currentGen + 1).apply();
        LCLog.w("SecurePrefs: Key rotation triggered. New generation: " + (currentGen + 1));
    }

    private static void flagStorageFailure(Context context) {
        context.getSharedPreferences(META_PREFS, Context.MODE_PRIVATE)
                .edit()
                .putBoolean(META_STORAGE_FAILED, true)
                .apply();
    }

    private static void clearStorageFailureFlag(Context context) {
        context.getSharedPreferences(META_PREFS, Context.MODE_PRIVATE)
                .edit()
                .remove(META_STORAGE_FAILED)
                .apply();
    }

    /**
     * Removes any legacy plaintext prefs file created by the old insecure fallback.
     */
    private static void wipeLegacyPlaintextFallback(Context context) {
        try {
            SharedPreferences legacy = context.getSharedPreferences(SECURE_PREFS_NAME, Context.MODE_PRIVATE);
            if (!legacy.getAll().isEmpty()) {
                LCLog.w("SecurePrefs: wiping legacy plaintext prefs file.");
                legacy.edit().clear().commit();
            }
            File prefsDir = new File(context.getApplicationInfo().dataDir, "shared_prefs");
            File legacyXml = new File(prefsDir, SECURE_PREFS_NAME + ".xml");
            if (legacyXml.exists() && !legacyXml.delete()) {
                LCLog.w("SecurePrefs: could not delete legacy plaintext file.");
            }
        } catch (Exception e) {
            LCLog.w("SecurePrefs: legacy wipe skipped: " + e.getMessage());
        }
    }

    /**
     * Ephemeral prefs — never written to disk. Process death loses all values.
     * Callers MUST treat {@link #isDegraded()} as locked / high-risk.
     */
    private static final class InMemorySharedPreferences implements SharedPreferences {
        private final Map<String, Object> data = new ConcurrentHashMap<>();

        @Override
        public Map<String, ?> getAll() {
            return new HashMap<>(data);
        }

        @Nullable
        @Override
        public String getString(String key, @Nullable String defValue) {
            Object v = data.get(key);
            return v instanceof String ? (String) v : defValue;
        }

        @Nullable
        @Override
        @SuppressWarnings("unchecked")
        public Set<String> getStringSet(String key, @Nullable Set<String> defValues) {
            Object v = data.get(key);
            return v instanceof Set ? (Set<String>) v : defValues;
        }

        @Override
        public int getInt(String key, int defValue) {
            Object v = data.get(key);
            return v instanceof Integer ? (Integer) v : defValue;
        }

        @Override
        public long getLong(String key, long defValue) {
            Object v = data.get(key);
            return v instanceof Long ? (Long) v : defValue;
        }

        @Override
        public float getFloat(String key, float defValue) {
            Object v = data.get(key);
            return v instanceof Float ? (Float) v : defValue;
        }

        @Override
        public boolean getBoolean(String key, boolean defValue) {
            Object v = data.get(key);
            return v instanceof Boolean ? (Boolean) v : defValue;
        }

        @Override
        public boolean contains(String key) {
            return data.containsKey(key);
        }

        @Override
        public Editor edit() {
            return new MemoryEditor();
        }

        @Override
        public void registerOnSharedPreferenceChangeListener(OnSharedPreferenceChangeListener listener) {
            // No-op: ephemeral store does not notify.
        }

        @Override
        public void unregisterOnSharedPreferenceChangeListener(OnSharedPreferenceChangeListener listener) {
            // No-op.
        }

        private final class MemoryEditor implements Editor {
            private final Map<String, Object> pending = new HashMap<>();
            private final Set<String> removals = new HashSet<>();
            private boolean clearAll = false;

            @Override
            public Editor putString(String key, @Nullable String value) {
                if (value == null) {
                    removals.add(key);
                    pending.remove(key);
                } else {
                    removals.remove(key);
                    pending.put(key, value);
                }
                return this;
            }

            @Override
            public Editor putStringSet(String key, @Nullable Set<String> values) {
                if (values == null) {
                    removals.add(key);
                    pending.remove(key);
                } else {
                    removals.remove(key);
                    pending.put(key, new HashSet<>(values));
                }
                return this;
            }

            @Override
            public Editor putInt(String key, int value) {
                removals.remove(key);
                pending.put(key, value);
                return this;
            }

            @Override
            public Editor putLong(String key, long value) {
                removals.remove(key);
                pending.put(key, value);
                return this;
            }

            @Override
            public Editor putFloat(String key, float value) {
                removals.remove(key);
                pending.put(key, value);
                return this;
            }

            @Override
            public Editor putBoolean(String key, boolean value) {
                removals.remove(key);
                pending.put(key, value);
                return this;
            }

            @Override
            public Editor remove(String key) {
                pending.remove(key);
                removals.add(key);
                return this;
            }

            @Override
            public Editor clear() {
                clearAll = true;
                pending.clear();
                removals.clear();
                return this;
            }

            @Override
            public boolean commit() {
                apply();
                return true;
            }

            @Override
            public void apply() {
                if (clearAll) {
                    data.clear();
                }
                for (String key : removals) {
                    data.remove(key);
                }
                data.putAll(pending);
                pending.clear();
                removals.clear();
                clearAll = false;
            }
        }
    }
}

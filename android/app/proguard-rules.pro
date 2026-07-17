# ProGuard rules for Livskompassen (Capacitor + Firebase)

-keepattributes Signature
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable

# Capacitor JS Interface
-keepclassmembers class ** {
  @android.webkit.JavascriptInterface <methods>;
}

# Firebase Auth / App Check
-keep class com.google.firebase.** { *; }

# Prevent obfuscation of Capacitor plugins
-keep class com.getcapacitor.** { *; }
-keep class com.livskompassen.app.widgets.** { *; }

# Security Hardening
-keep class com.livskompassen.app.core.SacredLockManager { *; }
-keep class com.livskompassen.app.core.WebViewManager { *; }
-keep class com.livskompassen.app.util.SecurityUtils { *; }
-keep class com.livskompassen.app.util.SecurePrefs { *; }

# EncryptedSharedPreferences (Jetpack Security)
-keep class androidx.security.crypto.** { *; }
-dontwarn androidx.security.crypto.**


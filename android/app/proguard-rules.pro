# ProGuard rules for Livskompassen (Titanium Aura Omni)

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

# CRITICAL: Preserve all Core Managers
-keep class com.livskompassen.app.core.** { *; }
-keep class com.livskompassen.app.util.** { *; }

# EncryptedSharedPreferences (Jetpack Security)
-keep class androidx.security.crypto.** { *; }
-dontwarn androidx.security.crypto.**

# AppSearch
-keep class androidx.appsearch.annotation.** { *; }
-keep @androidx.appsearch.annotation.Document class * { *; }

# Biometric
-keep class androidx.biometric.** { *; }

# Support for dynamic haptics & sensors
-dontwarn android.hardware.**

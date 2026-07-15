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

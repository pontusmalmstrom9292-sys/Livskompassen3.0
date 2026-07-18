package com.livskompassen.app;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Exponerar BuildConfig-gate till WebView så App Check-debug aldrig styrs enbart av Vite .env.
 * Release (BuildConfig.DEBUG=false) → Play Integrity; debug-APK → debug provider + bootstrap-token.
 */
@CapacitorPlugin(name = "LkNativeBuild")
public class LkNativeBuildPlugin extends Plugin {

    @PluginMethod
    public void getAppCheckDebugGate(PluginCall call) {
        String token = BuildConfig.FIREBASE_APP_CHECK_DEBUG_TOKEN;
        boolean hasToken = token != null && !token.isEmpty() && !"null".equals(token);
        boolean useDebug = BuildConfig.DEBUG && hasToken;
        JSObject result = new JSObject();
        result.put("useDebugProvider", useDebug);
        result.put("isDebugBuild", BuildConfig.DEBUG);
        // Debug only: pass BuildConfig token to Capacitor so debug provider
        // does not depend solely on SharedPreferences / ephemeral adb setprop.
        if (useDebug) {
            result.put("debugToken", token);
        }
        call.resolve(result);
    }
}

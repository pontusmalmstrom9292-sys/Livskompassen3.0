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
        JSObject result = new JSObject();
        result.put("useDebugProvider", BuildConfig.DEBUG && hasToken);
        result.put("isDebugBuild", BuildConfig.DEBUG);
        call.resolve(result);
    }
}

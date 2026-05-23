package com.livskompassen.app;

import android.content.Intent;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.livskompassen.app.widgets.WidgetLaunch;

/**
 * Capacitor shell + native Android widgets (WH1–WH4).
 */
public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        scheduleWidgetNavigation(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        scheduleWidgetNavigation(intent);
    }

    private void scheduleWidgetNavigation(Intent intent) {
        if (intent == null) {
            return;
        }
        String path = intent.getStringExtra(WidgetLaunch.EXTRA_WIDGET_PATH);
        if (path == null || path.isEmpty()) {
            return;
        }
        intent.removeExtra(WidgetLaunch.EXTRA_WIDGET_PATH);

        if (getBridge() == null || getBridge().getWebView() == null) {
            return;
        }

        getBridge().getWebView().post(() -> {
            String safe = path.replace("\\", "\\\\").replace("'", "\\'");
            String js =
                "window.dispatchEvent(new CustomEvent('livskompassen-widget-nav', { detail: { path: '"
                    + safe
                    + "' } }));";
            getBridge().getWebView().evaluateJavascript(js, null);
        });
    }
}

package com.livskompassen.app.util;

import android.content.Context;
import android.net.Uri;
import androidx.browser.customtabs.CustomTabColorSchemeParams;
import androidx.browser.customtabs.CustomTabsIntent;
import androidx.core.content.ContextCompat;
import com.livskompassen.app.R;

public class NavigationUtils {

    public static void openExternalUrl(Context context, String url) {
        try {
            int toolbarColor = ContextCompat.getColor(context, R.color.colorPrimary);
            
            CustomTabColorSchemeParams defaultColors = new CustomTabColorSchemeParams.Builder()
                    .setToolbarColor(toolbarColor)
                    .build();

            CustomTabsIntent customTabsIntent = new CustomTabsIntent.Builder()
                    .setDefaultColorSchemeParams(defaultColors)
                    .setShowTitle(true)
                    .build();

            customTabsIntent.launchUrl(context, Uri.parse(url));
        } catch (Exception e) {
            LCLog.e("Failed to open custom tab: " + e.getMessage());
        }
    }

    public static boolean isExternalUrl(String url) {
        if (url == null) return false;
        // Basic check: if it starts with http/https but isn't localhost or our production domain
        return (url.startsWith("http://") || url.startsWith("https://")) &&
               !url.contains("localhost") &&
               !url.contains("gen-lang-client-0481875058.web.app") &&
               !url.contains("firebaseapp.com");
    }
}

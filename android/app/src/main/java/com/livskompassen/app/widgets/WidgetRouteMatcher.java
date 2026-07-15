package com.livskompassen.app.widgets;

import android.net.Uri;
import java.util.Set;

/**
 * Normaliserar och jämför rutter för att undvika onödiga WebView-omladdningar.
 */
public final class WidgetRouteMatcher {

    private WidgetRouteMatcher() {}

    /**
     * Jämför två URL:er (t.ex. nuvarande WebView-URL och widgetens mål-URL).
     * Ignorerar ordning på query-parametrar.
     */
    public static boolean isSameRoute(String url1, String url2) {
        if (url1 == null || url2 == null) {
            return url1 == url2;
        }
        if (url1.equals(url2)) {
            return true;
        }

        try {
            Uri uri1 = Uri.parse(url1);
            Uri uri2 = Uri.parse(url2);

            // Jämför path
            if (!safeEquals(uri1.getPath(), uri2.getPath())) {
                return false;
            }

            // Jämför query-parametrar oberoende av ordning
            Set<String> params1 = uri1.getQueryParameterNames();
            Set<String> params2 = uri2.getQueryParameterNames();

            if (params1.size() != params2.size()) {
                return false;
            }

            for (String name : params1) {
                if (!safeEquals(uri1.getQueryParameter(name), uri2.getQueryParameter(name))) {
                    return false;
                }
            }

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private static boolean safeEquals(Object o1, Object o2) {
        return (o1 == null) ? (o2 == null) : o1.equals(o2);
    }
}

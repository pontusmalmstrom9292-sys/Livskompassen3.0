package com.livskompassen.app.widgets;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Normaliserar och jämför rutter för att undvika onödiga WebView-omladdningar.
 * Implementerad utan android.net.Uri för att vara testbar i rena JUnit-tester.
 */
public final class WidgetRouteMatcher {

    private WidgetRouteMatcher() {}

    /**
     * Jämför två URL:er. Ignorerar ordning på query-parametrar.
     */
    public static boolean isSameRoute(String url1, String url2) {
        if (url1 == null || url2 == null) {
            return Objects.equals(url1, url2);
        }
        if (url1.equals(url2)) {
            return true;
        }

        try {
            URI uri1 = new URI(url1);
            URI uri2 = new URI(url2);

            // Jämför path (normalisera genom att ta bort trailing slash om den inte är ensam)
            String path1 = normalizePath(uri1.getPath());
            String path2 = normalizePath(uri2.getPath());

            if (!Objects.equals(path1, path2)) {
                return false;
            }

            // Jämför query-parametrar oberoende av ordning
            Map<String, String> params1 = parseQuery(uri1.getQuery());
            Map<String, String> params2 = parseQuery(uri2.getQuery());

            return Objects.equals(params1, params2);
        } catch (Exception e) {
            return false;
        }
    }

    private static String normalizePath(String path) {
        if (path == null) return "";
        if (path.length() > 1 && path.endsWith("/")) {
            return path.substring(0, path.length() - 1);
        }
        return path;
    }

    private static Map<String, String> parseQuery(String query) {
        Map<String, String> params = new HashMap<>();
        if (query == null || query.isEmpty()) {
            return params;
        }
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            if (idx > 0) {
                params.put(pair.substring(0, idx), pair.substring(idx + 1));
            } else {
                params.put(pair, "");
            }
        }
        return params;
    }
}

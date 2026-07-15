package com.livskompassen.app.widgets;

import org.junit.Test;
import static org.junit.Assert.*;

public class WidgetRouteMatcherTest {

    @Test
    public void testSameRouteSimple() {
        assertTrue(WidgetRouteMatcher.isSameRoute("/widget/anteckning", "/widget/anteckning"));
    }

    @Test
    public void testDifferentRoute() {
        assertFalse(WidgetRouteMatcher.isSameRoute("/widget/anteckning", "/widget/kompass"));
    }

    @Test
    public void testQueryOrder() {
        assertTrue(WidgetRouteMatcher.isSameRoute(
            "http://localhost/widget/inspelning?a=1&b=2",
            "http://localhost/widget/inspelning?b=2&a=1"
        ));
    }

    @Test
    public void testStamplaIn() {
        assertTrue(WidgetRouteMatcher.isSameRoute(
            "capacitor://localhost/widget/stampla?action=in",
            "capacitor://localhost/widget/stampla?action=in"
        ));
    }

    @Test
    public void testDifferentQueryValue() {
        assertFalse(WidgetRouteMatcher.isSameRoute(
            "/widget/stampla?action=in",
            "/widget/stampla?action=out"
        ));
    }

    @Test
    public void testTrailingSlash() {
        assertTrue(WidgetRouteMatcher.isSameRoute("/widget/anteckning/", "/widget/anteckning"));
    }

    @Test
    public void testNull() {
        assertTrue(WidgetRouteMatcher.isSameRoute(null, null));
        assertFalse(WidgetRouteMatcher.isSameRoute("/a", null));
        assertFalse(WidgetRouteMatcher.isSameRoute(null, "/b"));
    }

    @Test
    public void testEmpty() {
        assertTrue(WidgetRouteMatcher.isSameRoute("", ""));
    }
}

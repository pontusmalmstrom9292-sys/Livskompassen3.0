package com.livskompassen.app.core;

import android.content.Context;
import android.hardware.display.DisplayManager;
import android.view.Display;
import com.livskompassen.app.util.LCLog;

/**
 * THE PROJECTION GUARD - Våg 52.
 * Detects if the screen is being mirrored or projected to an external display.
 */
public class ProjectionManager implements DisplayManager.DisplayListener {
    private final DisplayManager displayManager;
    private final ProjectionListener listener;

    public interface ProjectionListener {
        void onProjectionStateChanged(boolean isProjecting);
    }

    public ProjectionManager(Context context, ProjectionListener listener) {
        this.displayManager = (DisplayManager) context.getSystemService(Context.DISPLAY_SERVICE);
        this.listener = listener;
    }

    public void start() {
        if (displayManager != null) {
            displayManager.registerDisplayListener(this, null);
            checkCurrentProjectionState();
        }
    }

    public void stop() {
        if (displayManager != null) {
            displayManager.unregisterDisplayListener(this);
        }
    }

    public boolean isCurrentlyProjecting() {
        if (displayManager == null) return false;
        Display[] displays = displayManager.getDisplays();
        // Om det finns mer än en skärm, projicerar vi troligtvis
        return displays.length > 1;
    }

    private void checkCurrentProjectionState() {
        if (listener != null) {
            listener.onProjectionStateChanged(isCurrentlyProjecting());
        }
    }

    @Override
    public void onDisplayAdded(int displayId) {
        LCLog.w("ProjectionManager: External display ADDED (displayId: " + displayId + ")");
        checkCurrentProjectionState();
    }

    @Override
    public void onDisplayRemoved(int displayId) {
        LCLog.d("ProjectionManager: External display REMOVED");
        checkCurrentProjectionState();
    }

    @Override
    public void onDisplayChanged(int displayId) {
        checkCurrentProjectionState();
    }
}

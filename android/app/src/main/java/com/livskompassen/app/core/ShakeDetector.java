package com.livskompassen.app.core;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

/**
 * THE PANIC KEY - CRITICAL COMPONENT.
 * Detects heavy shaking to immediately lock the app and mask content.
 */
public class ShakeDetector implements SensorEventListener {
    private static final float SHAKE_THRESHOLD_GRAVITY = 2.7F;
    private static final int SHAKE_SLOP_TIME_MS = 500;
    private static final int SHAKE_COUNT_RESET_TIME_MS = 3000;
    
    // Våg 151: Tap detection for Silent Panic
    private static final float TAP_THRESHOLD_Z = 13.5F;
    private static final int TAP_WINDOW_MS = 1200;

    private OnShakeListener listener;
    private long mShakeTimestamp;
    private int mShakeCount;
    
    private long lastTapTime;
    private int tapCount;

    public void setOnShakeListener(OnShakeListener listener) {
        this.listener = listener;
    }

    public interface OnShakeListener {
        void onShake(int count);
        void onTripleTap();
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // Not used
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (listener != null) {
            float x = event.values[0];
            float y = event.values[1];
            float z = event.values[2];

            // 1. Shake Detection (G-force based)
            float gX = x / SensorManager.GRAVITY_EARTH;
            float gY = y / SensorManager.GRAVITY_EARTH;
            float gZ = z / SensorManager.GRAVITY_EARTH;

            float gForce = (float) Math.sqrt(gX * gX + gY * gY + gZ * gZ);

            if (gForce > SHAKE_THRESHOLD_GRAVITY) {
                handleShake();
            }

            // 2. Silent Panic (Z-axis tap detection)
            if (Math.abs(z) > TAP_THRESHOLD_Z) {
                handleTap();
            }
        }
    }

    private void handleShake() {
        if (listener == null) return;
        final long now = System.currentTimeMillis();
        if (mShakeTimestamp + SHAKE_SLOP_TIME_MS > now) return;
        // Ignore taps that collide with a shake window (false triple-tap).
        if (now - lastTapTime < SHAKE_SLOP_TIME_MS) return;
        if (mShakeTimestamp + SHAKE_COUNT_RESET_TIME_MS < now) mShakeCount = 0;

        mShakeTimestamp = now;
        mShakeCount++;
        listener.onShake(mShakeCount);
    }

    private void handleTap() {
        if (listener == null) return;
        long now = System.currentTimeMillis();
        if (now - lastTapTime < 250) return; // Debounce same tap
        // Ignore shake collision
        if (mShakeTimestamp + SHAKE_SLOP_TIME_MS > now) return;
        if (now - lastTapTime > TAP_WINDOW_MS) tapCount = 0;

        lastTapTime = now;
        tapCount++;
        if (tapCount >= 3) {
            tapCount = 0;
            listener.onTripleTap();
        }
    }
}

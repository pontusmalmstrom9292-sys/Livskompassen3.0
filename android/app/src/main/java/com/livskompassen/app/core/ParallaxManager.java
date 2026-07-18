package com.livskompassen.app.core;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.view.View;

/**
 * UI DEPTH ENGINE - Våg 33.
 * Uses device sensors to create a premium parallax depth effect in the UI.
 */
public class ParallaxManager implements SensorEventListener {
    private final SensorManager sensorManager;
    private final Sensor rotationSensor;
    private View targetView;
    
    private float baseTranslationX = 0;
    private float baseTranslationY = 0;
    private static final float MAX_OFFSET = 30f;

    public ParallaxManager(android.content.Context context) {
        this.sensorManager = (SensorManager) context.getSystemService(android.content.Context.SENSOR_SERVICE);
        this.rotationSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR);
    }

    public void start(View view) {
        this.targetView = view;
        if (rotationSensor != null) {
            sensorManager.registerListener(this, rotationSensor, SensorManager.SENSOR_DELAY_UI);
        }
    }

    public void stop() {
        sensorManager.unregisterListener(this);
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (targetView == null) return;

        float[] rotationMatrix = new float[9];
        SensorManager.getRotationMatrixFromVector(rotationMatrix, event.values);
        float[] orientation = new float[3];
        SensorManager.getOrientation(rotationMatrix, orientation);

        // orientation[1] = pitch (upp/ner), orientation[2] = roll (vänster/höger)
        float pitch = orientation[1];
        float roll = orientation[2];

        float targetX = roll * MAX_OFFSET;
        float targetY = pitch * MAX_OFFSET;

        targetView.setTranslationX(targetX);
        targetView.setTranslationY(targetY);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {}
}

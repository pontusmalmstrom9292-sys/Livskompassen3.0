package com.livskompassen.app.core;

import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioRecord;
import android.media.AudioTrack;
import android.media.MediaRecorder;
import android.os.Handler;
import android.os.Looper;

/**
 * THE SONIC AURA - Våg 210 / Våg 230 / Våg 285 (Ambient Gain).
 * Generates real-time procedural audio for meditative breathing.
 * Now noise-aware: increases volume in loud environments.
 */
public class AuraAudioManager {
    private static final int SAMPLE_RATE = 44100;
    private AudioTrack audioTrack;
    private AudioRecord audioRecord;
    private boolean isPlaying = false;
    private double currentFreqL = 220.0;
    private double currentFreqR = 226.0; // 6Hz offset for Theta entrainment
    private double targetFreqL = 220.0;
    private float currentVolume = 0.0f;
    private float targetVolume = 0.0f;
    private float ambientNoiseGain = 1.0f;

    public void start() {
        if (isPlaying) return;
        isPlaying = true;

        int minBufferSize = AudioTrack.getMinBufferSize(SAMPLE_RATE, 
            AudioFormat.CHANNEL_OUT_STEREO, AudioFormat.ENCODING_PCM_16BIT);
        
        audioTrack = new AudioTrack(AudioManager.STREAM_MUSIC, SAMPLE_RATE,
            AudioFormat.CHANNEL_OUT_STEREO, AudioFormat.ENCODING_PCM_16BIT,
            minBufferSize, AudioTrack.MODE_STREAM);

        audioTrack.play();
        startNoiseListener();

        new Thread(() -> {
            double phaseL = 0.0;
            double phaseR = 0.0;
            while (isPlaying) {
                // Stereo buffer: L, R, L, R...
                short[] pcmBuffer = new short[minBufferSize];
                for (int i = 0; i < minBufferSize; i += 2) {
                    // Smooth transitions
                    currentFreqL += (targetFreqL - currentFreqL) * 0.0005;
                    double targetFreqR = targetFreqL + 6.0; // Fixed Theta offset
                    currentFreqR += (targetFreqR - currentFreqR) * 0.0005;
                    
                    // Våg 286: Combine target volume with ambient gain
                    float totalTarget = targetVolume * ambientNoiseGain;
                    currentVolume += (float) ((totalTarget - currentVolume) * 0.0005);

                    // Left Channel
                    pcmBuffer[i] = (short) (Math.sin(phaseL) * currentVolume * Short.MAX_VALUE);
                    phaseL += 2.0 * Math.PI * currentFreqL / SAMPLE_RATE;
                    if (phaseL > 2.0 * Math.PI) phaseL -= 2.0 * Math.PI;

                    // Right Channel
                    if (i + 1 < minBufferSize) {
                        pcmBuffer[i + 1] = (short) (Math.sin(phaseR) * currentVolume * Short.MAX_VALUE);
                        phaseR += 2.0 * Math.PI * currentFreqR / SAMPLE_RATE;
                        if (phaseR > 2.0 * Math.PI) phaseR -= 2.0 * Math.PI;
                    }
                }
                if (audioTrack != null && audioTrack.getPlayState() == AudioTrack.PLAYSTATE_PLAYING) {
                    audioTrack.write(pcmBuffer, 0, pcmBuffer.length);
                }
            }
        }).start();
    }

    private void startNoiseListener() {
        int bufferSize = AudioRecord.getMinBufferSize(8000, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT);
        try {
            audioRecord = new AudioRecord(MediaRecorder.AudioSource.MIC, 8000, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, bufferSize);
            audioRecord.startRecording();
            new Thread(() -> {
                short[] buffer = new short[bufferSize];
                while (isPlaying) {
                    int read = audioRecord.read(buffer, 0, bufferSize);
                    if (read > 0) {
                        double sum = 0;
                        for (int i = 0; i < read; i++) sum += Math.abs(buffer[i]);
                        double avg = sum / read;
                        // Map avg (0-32768) to gain (1.0 - 2.5)
                        ambientNoiseGain = (float) (1.0 + (Math.min(avg, 5000.0) / 5000.0) * 1.5);
                    }
                    try { Thread.sleep(500); } catch (InterruptedException ignored) {}
                }
                audioRecord.stop();
                audioRecord.release();
                audioRecord = null;
            }).start();
        } catch (SecurityException e) {
            ambientNoiseGain = 1.0f;
        }
    }

    public void stop() {
        isPlaying = false;
        targetVolume = 0.0f;
        if (audioTrack != null) {
            try {
                audioTrack.stop();
                audioTrack.release();
            } catch (Exception ignored) {}
            audioTrack = null;
        }
    }

    public void setBreathingState(boolean inhale) {
        if (inhale) {
            targetFreqL = 330.0; 
            targetVolume = 0.12f; // Slightly lower for binaural comfort
        } else {
            targetFreqL = 220.0;
            targetVolume = 0.08f;
        }
    }
}

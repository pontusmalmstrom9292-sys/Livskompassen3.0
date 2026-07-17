package com.livskompassen.app.core;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;

import com.livskompassen.app.R;

public class AppNotificationManager {
    public static final String CHANNEL_ID_VAULT = "sacred_vault_notifications";
    public static final String CHANNEL_ID_DAILY = "daily_reminders";

    public static void createNotificationChannels(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // Sacred Vault Channel (Hög prioritet, diskret ljud om möjligt)
            NotificationChannel vaultChannel = new NotificationChannel(
                    CHANNEL_ID_VAULT,
                    "Valv-aviseringar",
                    NotificationManager.IMPORTANCE_HIGH
            );
            vaultChannel.setDescription("Viktiga säkerhetsnotiser rörande ditt valv.");
            vaultChannel.enableLights(true);
            vaultChannel.setLightColor(0xFDE68A); // Guld

            // Daily Reminders (Standard prioritet)
            NotificationChannel dailyChannel = new NotificationChannel(
                    CHANNEL_ID_DAILY,
                    "Dagliga påminnelser",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            dailyChannel.setDescription("Påminnelser för din dagliga mix och reflektion.");

            NotificationManager manager = context.getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(vaultChannel);
                manager.createNotificationChannel(dailyChannel);
            }
        }
    }
}

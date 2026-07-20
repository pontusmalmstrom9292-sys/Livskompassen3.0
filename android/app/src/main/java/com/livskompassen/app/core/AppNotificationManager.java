package com.livskompassen.app.core;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import com.livskompassen.app.R;

/**
 * THE NOTIFIER - Våg 60.
 * @locked TITANIUM-BASE-CORE
 * Manages rich, actionable notifications.
 */
public class AppNotificationManager {
    public static final String CHANNEL_ID_VAULT = "sacred_vault_notifications";
    public static final String CHANNEL_ID_DAILY = "daily_reminders";
    private static final int NOTIFICATION_ID_PREMIUM = 1002;

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

    /**
     * Triggars en rik notis med interaktiva knappar och sekretess-skydd.
     */
    public static void showPremiumNotification(Context context, String title, String message, String channelId, HapticManager hapticManager) {
        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager == null) return;

        // Trigger native haptics based on channel
        if (hapticManager != null) {
            if (CHANNEL_ID_VAULT.equals(channelId)) hapticManager.vaultAlert();
            else hapticManager.reminderGentle();
        }

        // Stealth Logic: Om skärmen är låst eller användaren valt hög sekretess, maskera innehåll
        boolean shouldMask = true; // Detta kan styras via en global inställning senare
        String displayTitle = shouldMask ? "Livskompassen" : title;
        String displayMessage = shouldMask ? "Skyddad avisering. Lås upp för att läsa." : message;

        // Intent för att låsa valvet direkt
        Intent lockIntent = new Intent(context, NotificationActionReceiver.class);
        lockIntent.setAction(NotificationActionReceiver.ACTION_VAULT_LOCK);
        PendingIntent lockPendingIntent = PendingIntent.getBroadcast(context, 0, lockIntent, 
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);

        // Intent för snabb incheckning
        Intent checkinIntent = new Intent(context, com.livskompassen.app.MainActivity.class);
        checkinIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        checkinIntent.putExtra("widget_path", "/widget/kompass");
        PendingIntent checkinPendingIntent = PendingIntent.getActivity(context, 1, checkinIntent, 
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);

        // Action: Mark as Done
        Intent doneIntent = new Intent(context, NotificationActionReceiver.class);
        doneIntent.setAction(NotificationActionReceiver.ACTION_REMINDER_DONE);
        PendingIntent donePendingIntent = PendingIntent.getBroadcast(context, 2, doneIntent,
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);

        // Action: Remind in 1h
        Intent snoozeIntent = new Intent(context, NotificationActionReceiver.class);
        snoozeIntent.setAction(NotificationActionReceiver.ACTION_REMINDER_SNOOZE);
        PendingIntent snoozePendingIntent = PendingIntent.getBroadcast(context, 3, snoozeIntent,
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channelId)
                .setSmallIcon(R.drawable.ic_lock_sacred)
                .setContentTitle(displayTitle)
                .setContentText(displayMessage)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setCategory(NotificationCompat.CATEGORY_MESSAGE)
                .setVisibility(NotificationCompat.VISIBILITY_PRIVATE)
                .setColor(0xFDE68A)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(displayMessage));

        if (CHANNEL_ID_VAULT.equals(channelId)) {
            builder.addAction(R.drawable.ic_lock_sacred, "Säkra Valvet", lockPendingIntent);
        } else {
            builder.addAction(R.drawable.ic_lock_sacred, "Klar", donePendingIntent);
            builder.addAction(R.drawable.ic_error_outline, "Senare", snoozePendingIntent);
        }

        manager.notify(NOTIFICATION_ID_PREMIUM, builder.build());
    }
}

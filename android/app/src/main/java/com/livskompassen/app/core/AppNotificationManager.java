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

import java.util.Locale;

/**
 * THE NOTIFIER - Våg 60.
 * @locked TITANIUM-BASE-CORE
 * Manages rich, actionable notifications.
 */
public class AppNotificationManager {
    public static final String CHANNEL_ID_VAULT = "sacred_vault_notifications";
    public static final String CHANNEL_ID_DAILY = "daily_reminders";
    public static final String CHANNEL_ID_DROGFRIHET = "drogfrihet_reminders";
    private static final int NOTIFICATION_ID_PREMIUM = 1002;
    private static final int NOTIFICATION_ID_DROGFRIHET = 1003;
    private static final int NOTIFICATION_ID_ACTIONABLE = 1004;

    public static void createNotificationChannels(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // Sacred Vault Channel (Hög prioritet, diskret ljud om möjligt)
            NotificationChannel vaultChannel = new NotificationChannel(
                    CHANNEL_ID_VAULT,
                    context.getString(R.string.notification_channel_vault_name),
                    NotificationManager.IMPORTANCE_HIGH
            );
            vaultChannel.setDescription(context.getString(R.string.notification_channel_vault_desc));
            vaultChannel.enableLights(true);
            vaultChannel.setLightColor(0xFDE68A); // Guld

            // Daily Reminders (Standard prioritet)
            NotificationChannel dailyChannel = new NotificationChannel(
                    CHANNEL_ID_DAILY,
                    context.getString(R.string.notification_channel_daily_name),
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            dailyChannel.setDescription(context.getString(R.string.notification_channel_daily_desc));

            NotificationChannel dfChannel = new NotificationChannel(
                    CHANNEL_ID_DROGFRIHET,
                    context.getString(R.string.channel_drogfrihet),
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            dfChannel.setDescription(context.getString(R.string.notification_channel_drogfrihet_desc));

            NotificationManager manager = context.getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(vaultChannel);
                manager.createNotificationChannel(dailyChannel);
                manager.createNotificationChannel(dfChannel);
            }
        }
    }

    /** Drogfrihet / SOS Ankare — öppnar /widget/drogfrihet-akut. */
    public static void showDrogfrihetNotification(Context context, String title, String message, HapticManager hapticManager) {
        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager == null) return;
        if (hapticManager != null) hapticManager.reminderGentle();

        Intent open = new Intent(context, com.livskompassen.app.MainActivity.class);
        open.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        open.putExtra("widget_path", "/widget/drogfrihet-akut");
        PendingIntent openPi = PendingIntent.getActivity(
                context, 41, open, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID_DROGFRIHET)
                .setSmallIcon(R.drawable.ic_lock_sacred)
                .setContentTitle(title != null ? title : context.getString(R.string.app_name))
                .setContentText(message != null ? message : context.getString(R.string.notification_drogfrihet_default_text))
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setAutoCancel(true)
                .setContentIntent(openPi)
                .setCategory(NotificationCompat.CATEGORY_REMINDER)
                .setVisibility(NotificationCompat.VISIBILITY_PRIVATE)
                .setColor(0xFDE68A)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(message));

        manager.notify(NOTIFICATION_ID_DROGFRIHET, builder.build());
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
        String displayTitle = shouldMask ? context.getString(R.string.app_name) : title;
        String displayMessage = shouldMask ? context.getString(R.string.notification_masked_text) : message;

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
            builder.addAction(R.drawable.ic_lock_sacred, context.getString(R.string.notification_action_lock_vault), lockPendingIntent);
        } else {
            builder.addAction(R.drawable.ic_lock_sacred, context.getString(R.string.notification_action_done), donePendingIntent);
            builder.addAction(R.drawable.ic_error_outline, context.getString(R.string.notification_action_later), snoozePendingIntent);
        }

        manager.notify(NOTIFICATION_ID_PREMIUM, builder.build());
    }

    /**
     * Våg 160: AI-driven actionable notification with smart buttons.
     */
    public static void showActionableNotification(Context context, String title, String message, java.util.List<String> entities) {
        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager == null) return;

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID_DAILY)
                .setSmallIcon(R.drawable.ic_lock_sacred)
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setCategory(NotificationCompat.CATEGORY_REMINDER)
                .setVisibility(NotificationCompat.VISIBILITY_PRIVATE);

        boolean hasDate = false;
        if (entities != null) {
            for (String entity : entities) {
                if (entity == null) continue;
                String upper = entity.toUpperCase(Locale.US);
                if (upper.startsWith("DATE_TIME:") || upper.startsWith("DATE:") || upper.startsWith("TIME:")) {
                    hasDate = true;
                    break;
                }
            }
        }

        if (hasDate) {
            Intent cal = new Intent(Intent.ACTION_INSERT)
                    .setData(android.net.Uri.parse("content://com.android.calendar/events"))
                    .putExtra("title", title)
                    .putExtra("description", message);
            PendingIntent calPi = PendingIntent.getActivity(context, 100, cal, 
                    PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
            
            builder.addAction(R.drawable.ic_error_outline, "Planera", calPi);
        }

        manager.notify(NOTIFICATION_ID_ACTIONABLE, builder.build());
    }
}

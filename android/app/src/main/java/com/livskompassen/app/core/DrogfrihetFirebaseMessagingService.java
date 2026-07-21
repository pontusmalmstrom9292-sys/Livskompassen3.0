package com.livskompassen.app.core;

import androidx.annotation.NonNull;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.livskompassen.app.util.LCLog;
import com.livskompassen.app.util.SecurePrefs;

/**
 * FCM receive for Drogfrihet nudges / buddy ping.
 * Deep-links to SOS Ankare. Never logs message body (Zero Footprint).
 */
public class DrogfrihetFirebaseMessagingService extends FirebaseMessagingService {
    public static final String PREF_FCM_TOKEN = "df_fcm_token";

    @Override
    public void onNewToken(@NonNull String token) {
        SecurePrefs.get(this).edit().putString(PREF_FCM_TOKEN, token).apply();
        LCLog.d("Drogfrihet FCM token refreshed");
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        String title = "Livskompassen";
        String body = "Ett ankare finns här.";
        if (message.getNotification() != null) {
            if (message.getNotification().getTitle() != null) {
                title = message.getNotification().getTitle();
            }
            if (message.getNotification().getBody() != null) {
                body = message.getNotification().getBody();
            }
        } else if (message.getData() != null) {
            if (message.getData().containsKey("title")) title = message.getData().get("title");
            if (message.getData().containsKey("body")) body = message.getData().get("body");
        }
        AppNotificationManager.showDrogfrihetNotification(this, title, body, null);
    }
}

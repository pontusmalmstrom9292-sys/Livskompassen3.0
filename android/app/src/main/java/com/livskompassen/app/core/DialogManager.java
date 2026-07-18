package com.livskompassen.app.core;

import android.app.AlertDialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import com.livskompassen.app.R;

/**
 * THE DIALOG GUARDIAN - Våg 37.
 * Replaces browser-style web dialogs with premium Obsidian-themed native dialogs.
 */
public class DialogManager {
    private final Context context;
    private final HapticManager hapticManager;

    public DialogManager(Context context, HapticManager hapticManager) {
        this.context = context;
        this.hapticManager = hapticManager;
    }

    public void showMessage(String title, String message, final Runnable onDismiss) {
        hapticManager.lightClick(null);
        
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        View view = LayoutInflater.from(context).inflate(R.layout.dialog_premium_alert, null);
        
        TextView titleView = view.findViewById(R.id.dialog_title);
        TextView messageView = view.findViewById(R.id.dialog_message);
        Button btnOk = view.findViewById(R.id.btn_dialog_ok);

        titleView.setText(title);
        messageView.setText(message);

        builder.setView(view);
        final AlertDialog dialog = builder.create();
        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        }

        btnOk.setOnClickListener(v -> {
            hapticManager.lightClick(v);
            dialog.dismiss();
            if (onDismiss != null) onDismiss.run();
        });

        dialog.show();
    }

    public void showConfirm(String title, String message, final ConfirmCallback callback) {
        hapticManager.lightClick(null);
        
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        View view = LayoutInflater.from(context).inflate(R.layout.dialog_premium_confirm, null);
        
        TextView titleView = view.findViewById(R.id.dialog_title);
        TextView messageView = view.findViewById(R.id.dialog_message);
        Button btnCancel = view.findViewById(R.id.btn_dialog_cancel);
        Button btnConfirm = view.findViewById(R.id.btn_dialog_confirm);

        titleView.setText(title);
        messageView.setText(message);

        builder.setView(view);
        final AlertDialog dialog = builder.create();
        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        }

        btnCancel.setOnClickListener(v -> {
            dialog.dismiss();
            callback.onResult(false);
        });

        btnConfirm.setOnClickListener(v -> {
            hapticManager.success();
            dialog.dismiss();
            callback.onResult(true);
        });

        dialog.show();
    }

    public interface ConfirmCallback {
        void onResult(boolean confirmed);
    }
}

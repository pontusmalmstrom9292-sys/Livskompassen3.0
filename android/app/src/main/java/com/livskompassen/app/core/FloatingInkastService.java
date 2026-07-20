package com.livskompassen.app.core;

import android.app.Service;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;

import com.livskompassen.app.MainActivity;
import com.livskompassen.app.R;

/**
 * THE FLOATING INKAST - Våg 80.
 * @locked TITANIUM-BASE-CORE
 * Shows a persistent bubble that allows quick access to Inkast from any app.
 */
public class FloatingInkastService extends Service {
    private WindowManager windowManager;
    private View floatingView;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        floatingView = LayoutInflater.from(this).inflate(R.layout.layout_floating_bubble, null);

        int type = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O ? 
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY : 
                WindowManager.LayoutParams.TYPE_PHONE;

        final WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                type,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT);

        params.gravity = Gravity.TOP | Gravity.START;
        params.x = 0;
        params.y = 100;

        ImageView closeButton = floatingView.findViewById(R.id.close_bubble);
        closeButton.setOnClickListener(view -> stopSelf());

        ImageView bubbleIcon = floatingView.findViewById(R.id.bubble_icon);
        bubbleIcon.setOnClickListener(view -> {
            Intent intent = new Intent(FloatingInkastService.this, MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            intent.putExtra("widget_path", "/planering/input?inputMode=inkast");
            startActivity(intent);
            stopSelf();
        });

        floatingView.setOnTouchListener(new View.OnTouchListener() {
            private int initialX;
            private int initialY;
            private float initialTouchX;
            private float initialTouchY;

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        initialX = params.x;
                        initialY = params.y;
                        initialTouchX = event.getRawX();
                        initialTouchY = event.getRawY();
                        return true;
                    case MotionEvent.ACTION_MOVE:
                        params.x = initialX + (int) (event.getRawX() - initialTouchX);
                        params.y = initialY + (int) (event.getRawY() - initialTouchY);
                        windowManager.updateViewLayout(floatingView, params);
                        return true;
                }
                return false;
            }
        });

        windowManager.addView(floatingView, params);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (floatingView != null) windowManager.removeView(floatingView);
    }
}

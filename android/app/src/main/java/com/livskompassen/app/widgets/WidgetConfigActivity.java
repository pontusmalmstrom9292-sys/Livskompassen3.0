package com.livskompassen.app.widgets;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.RadioGroup;

import com.livskompassen.app.R;
import com.livskompassen.app.util.SecurePrefs;

public class WidgetConfigActivity extends Activity {
    private static final String PREF_PREFIX_KEY = "appwidget_";
    
    int appWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setResult(RESULT_CANCELED);
        setContentView(R.layout.activity_widget_config);

        Intent intent = getIntent();
        Bundle extras = intent.getExtras();
        if (extras != null) {
            appWidgetId = extras.getInt(AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID);
        }

        if (appWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
            finish();
            return;
        }

        findViewById(R.id.btn_save_config).setOnClickListener(v -> {
            saveConfig();
            
            // Push update to widget
            Context context = WidgetConfigActivity.this;
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            RecordWidgetProvider.updateAppWidget(context, appWidgetManager, appWidgetId);

            Intent resultValue = new Intent();
            resultValue.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
            setResult(RESULT_OK, resultValue);
            finish();
        });
    }

    private void saveConfig() {
        RadioGroup rg = findViewById(R.id.config_radio_group);
        String selection = "/widget/inspelning";
        int checkedId = rg.getCheckedRadioButtonId();
        
        if (checkedId == R.id.radio_vault) {
            selection = "/valv";
        } else if (checkedId == R.id.radio_journal) {
            selection = "/widget/dagbok";
        }

        SharedPreferences.Editor prefs = SecurePrefs.get(this).edit();
        prefs.putString(PREF_PREFIX_KEY + appWidgetId, selection);
        prefs.apply();
    }

    public static String loadConfig(Context context, int appWidgetId) {
        SharedPreferences prefs = SecurePrefs.get(context);
        return prefs.getString(PREF_PREFIX_KEY + appWidgetId, "/widget/inspelning");
    }
}

package com.livskompassen.app.core;

import android.content.Context;
import android.os.Build;
import com.google.common.util.concurrent.ListenableFuture;
import androidx.appsearch.app.AppSearchSession;
import androidx.appsearch.app.PutDocumentsRequest;
import androidx.appsearch.app.SetSchemaRequest;
import androidx.appsearch.platformstorage.PlatformStorage;
import com.livskompassen.app.util.LCLog;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

/**
 * THE VAULT SENTRY (SEARCH) - Våg 45.
 * Manages the on-device search index for quick navigation.
 */
public class SearchManager {
    private final Context context;
    private final Executor executor = Executors.newSingleThreadExecutor();
    private AppSearchSession searchSession;

    public SearchManager(Context context) {
        this.context = context;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            initSession();
        }
    }

    private void initSession() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            PlatformStorage.SearchContext searchContext = new PlatformStorage.SearchContext.Builder(context, "livskompassen_db").build();
            ListenableFuture<AppSearchSession> sessionFuture = PlatformStorage.createSearchSessionAsync(searchContext);

            sessionFuture.addListener(() -> {
                try {
                    this.searchSession = sessionFuture.get();
                    
                    // Register the document schema
                    searchSession.setSchemaAsync(new SetSchemaRequest.Builder()
                            .addDocumentClasses(SearchDocument.class)
                            .build());
                    
                    LCLog.d("SearchManager: AppSearch session and schema initialized.");
                } catch (Exception e) {
                    LCLog.e("SearchManager: Failed to init AppSearch: " + e.getMessage());
                }
            }, executor);
        }
    }

    /**
     * Indexerar en modul eller genväg i telefonens globala sök.
     */
    public void indexGenvag(String id, String label, String path) {
        if (searchSession == null) return;

        try {
            SearchDocument doc = new SearchDocument("shortcuts", id, label, path);
            searchSession.putAsync(new PutDocumentsRequest.Builder()
                    .addDocuments(doc)
                    .build());
            
            LCLog.d("SearchManager: Indexed " + label);
        } catch (Exception e) {
            LCLog.e("SearchManager: Failed to index " + label + ": " + e.getMessage());
        }
    }
}

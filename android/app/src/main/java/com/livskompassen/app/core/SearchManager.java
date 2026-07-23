package com.livskompassen.app.core;

import android.content.Context;
import androidx.annotation.NonNull;
import androidx.appsearch.app.AppSearchSession;
import androidx.appsearch.app.PutDocumentsRequest;
import androidx.appsearch.app.SearchResult;
import androidx.appsearch.app.SearchResults;
import androidx.appsearch.app.SearchSpec;
import androidx.appsearch.app.SetSchemaRequest;
import androidx.appsearch.localstorage.LocalStorage;
import com.google.common.util.concurrent.ListenableFuture;
import com.livskompassen.app.util.LCLog;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

/**
 * THE VAULT SENTRY (SEARCH) - Våg 45.
 * Manages the on-device search index for quick navigation.
 * Now compatible with older Android versions using LocalStorage.
 */
public class SearchManager {
    private final Context context;
    private final Executor executor = Executors.newSingleThreadExecutor();
    private AppSearchSession searchSession;

    public SearchManager(Context context) {
        this.context = context;
        initSession();
    }

    private void initSession() {
        ListenableFuture<AppSearchSession> sessionFuture = LocalStorage.createSearchSessionAsync(
                new LocalStorage.SearchContext.Builder(context, "livskompassen_db").build()
        );

        sessionFuture.addListener(() -> {
            try {
                this.searchSession = sessionFuture.get();
                
                // Register the document schema
                searchSession.setSchemaAsync(new SetSchemaRequest.Builder()
                        .addDocumentClasses(SearchDocument.class)
                        .build());
                
                LCLog.d("SearchManager: AppSearch session and schema initialized.");
                
                // Våg 100: Pre-index standard modules for Omni search
                indexStandardModules();
            } catch (Exception e) {
                LCLog.e("SearchManager: Failed to init AppSearch: " + e.getMessage());
            }
        }, executor);
    }

    private void indexStandardModules() {
        indexGenvag("mod_valv", "Valvet", "/valv");
        indexGenvag("mod_hamn", "Hamn", "/widget/hamn");
        indexGenvag("mod_kompass", "Kompass", "/widget/kompass");
        indexGenvag("mod_dagbok", "Dagbok", "/widget/journal");
        indexGenvag("mod_inkast", "Inkast", "/planering/input?inputMode=inkast");
    }

    /**
     * Indexerar en modul eller genväg i telefonens globala sök.
     */
    public void indexGenvag(String id, String label, String path) {
        if (searchSession == null) {
            LCLog.w("SearchManager: Session not ready, skipping index for " + label);
            return;
        }

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

    /**
     * Söker efter genvägar baserat på en söksträng.
     */
    public void queryGenvagar(String query, SearchCallback callback) {
        if (searchSession == null) {
            callback.onResult(new ArrayList<>());
            return;
        }

        SearchSpec searchSpec = new SearchSpec.Builder()
                .addFilterNamespaces("shortcuts")
                .setSnippetCount(10)
                .build();

        SearchResults searchResults = searchSession.search(query, searchSpec);
        ListenableFuture<List<SearchResult>> nextPagesFuture = searchResults.getNextPageAsync();

        nextPagesFuture.addListener(() -> {
            try {
                List<SearchResult> results = nextPagesFuture.get();
                List<SearchDocument> documents = new ArrayList<>();
                for (SearchResult result : results) {
                    documents.add(result.getGenericDocument().toDocumentClass(SearchDocument.class));
                }
                callback.onResult(documents);
            } catch (Exception e) {
                LCLog.e("SearchManager: Search failed: " + e.getMessage());
                callback.onResult(new ArrayList<>());
            }
        }, executor);
    }

    public interface SearchCallback {
        void onResult(List<SearchDocument> results);
    }
}

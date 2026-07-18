package com.livskompassen.app.core;

import androidx.appsearch.annotation.Document;
import androidx.appsearch.app.AppSearchSchema;

/**
 * Search Document Schema for AppSearch.
 */
@Document
public class SearchDocument {
    @Document.Namespace
    private final String namespace;

    @Document.Id
    private final String id;

    @Document.StringProperty(indexingType = AppSearchSchema.StringPropertyConfig.INDEXING_TYPE_PREFIXES)
    private final String label;

    @Document.StringProperty
    private final String path;

    public SearchDocument(String namespace, String id, String label, String path) {
        this.namespace = namespace;
        this.id = id;
        this.label = label;
        this.path = path;
    }

    public String getNamespace() { return namespace; }
    public String getId() { return id; }
    public String getLabel() { return label; }
    public String getPath() { return path; }
}

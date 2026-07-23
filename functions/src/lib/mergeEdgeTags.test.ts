import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mergeEdgeTagsIntoClassification } from './submitInkastLite';
import type { InboxClassification } from './inboxClassifier';

describe('mergeEdgeTagsIntoClassification', () => {
  it('merges edge tags without changing routing', () => {
    const base: InboxClassification = {
      routing: 'bevis',
      category: 'sms',
      tags: ['bevis'],
      summary: 'x',
      confidence: 0.9,
      rationale: 'y',
      traumaSensitive: false,
    };
    const merged = mergeEdgeTagsIntoClassification(base, [
      'edge:silo:tanke',
      'edge:stress',
      'not-edge',
      'edge:silo:tanke',
    ]);
    assert.equal(merged.routing, 'bevis');
    assert.ok(merged.tags.includes('bevis'));
    assert.ok(merged.tags.includes('edge:silo:tanke'));
    assert.ok(merged.tags.includes('edge:stress'));
    assert.equal(merged.tags.includes('not-edge'), false);
  });
});

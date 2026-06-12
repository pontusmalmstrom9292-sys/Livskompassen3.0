import React from 'react';
import type { Entry, JournalEntry, VaultEntry } from '../types';
import { JournalView } from './JournalView';
import { VaultView } from './VaultView';
import { InsightsView } from './InsightsView';

interface ContentWorkspaceProps {
  entry: Entry | null;
  activeTab?: 'journal' | 'vault' | 'insights';
  data?: Entry[];
}

export const ContentWorkspace: React.FC<ContentWorkspaceProps> = ({ entry, activeTab, data }) => {
  if (activeTab === 'insights') {
    return (
      <div className="h-full overflow-y-auto">
        <InsightsView data={data || []} />
      </div>
    );
  }

  if (!entry) return null;
  return (
    <div className="h-full overflow-y-auto">
      {entry.type === 'journal' ? (
        <JournalView entry={entry as JournalEntry} />
      ) : (
        <VaultView entry={entry as VaultEntry} />
      )}
    </div>
  );
};

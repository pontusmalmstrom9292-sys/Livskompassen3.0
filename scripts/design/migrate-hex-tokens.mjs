import fs from 'fs';
import path from 'path';

// Hex to Obsidian Calm CSS Variable mapping
const colorMap = {
  '#d4af37': 'var(--color-accent-gold)',
  '#020617': 'var(--bg-teal-deep)',
  '#050b14': 'var(--bg-dusk)',
  '#f8fafc': 'var(--text)',
  '#94a3b8': 'var(--text-muted)',
  '#64748b': 'var(--text-dim)',
  '#f59e0b': 'var(--warning)',
  '#818cf8': 'var(--accent-ai)',
  '#10b981': 'var(--success)',
  '#0d3b3b': 'var(--compass-disk)',
  '#6b8f71': 'var(--success)', // from tokens.ts
  '#e8d48a': 'var(--accent-light)', // from tokens.ts
  '#1a1a1a': 'var(--surface-2)',
  '#222222': 'var(--surface-3)',
  '#fde68a': 'var(--accent-light)',
  '#0f172a': 'var(--bg-teal-deep)',
  '#ef4444': 'var(--danger)',
  '#6366f1': 'var(--accent-secondary)'
};

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p, callback);
    } else {
      callback(p);
    }
  }
}

let totalReplaced = 0;

walk('src', (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  // Skip theme packs and sandbox
  if (filePath.includes('themePack') || filePath.includes('sandbox') || filePath.includes('tokens.ts')) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip locked files
  if (content.includes('@locked')) return;

  let newContent = content;
  let replacedInFile = 0;

  for (const [hex, cssVar] of Object.entries(colorMap)) {
    // Case insensitive replacement of the hex string (e.g. #d4af37 or #D4AF37)
    // Only replace if it's followed by a non-hex character (word boundary for hex)
    const regex = new RegExp(hex + '(?![0-9a-fA-F])', 'gi');
    newContent = newContent.replace(regex, () => {
      replacedInFile++;
      totalReplaced++;
      return cssVar;
    });
  }

  if (replacedInFile > 0) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Updated ${filePath}: ${replacedInFile} replacements`);
  }
});

console.log(`Total hex values replaced: ${totalReplaced}`);

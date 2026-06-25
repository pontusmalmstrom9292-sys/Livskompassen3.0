import { describe, expect, it } from 'vitest';
import {
  computeProjectCounts,
  filterProjects,
  shouldShowSearch,
  shouldShowStatusTabs,
  totalProjects,
} from './projectHubFilters';
import { PROJECT_BLOCK_META, projectBlockLabel } from './projectBlockMeta';
import type { Project } from './types';

function makeProject(over: Partial<Project>): Project {
  return {
    id: over.id ?? Math.random().toString(36).slice(2),
    title: over.title ?? 'Projekt',
    status: over.status ?? 'active',
    primaryBlockType: over.primaryBlockType,
    updatedAt: over.updatedAt,
    createdAt: over.createdAt,
  };
}

const sample: Project[] = [
  makeProject({ id: 'a', title: 'Advokat 2026', status: 'active', primaryBlockType: 'note' }),
  makeProject({ id: 'b', title: 'Skolmat lista', status: 'active', primaryBlockType: 'list' }),
  makeProject({ id: 'c', title: 'Renovering kök', status: 'paused', primaryBlockType: 'task' }),
  makeProject({ id: 'd', title: 'Gammalt bevis', status: 'archived', primaryBlockType: 'image' }),
];

describe('computeProjectCounts', () => {
  it('räknar per status', () => {
    const counts = computeProjectCounts(sample);
    expect(counts).toEqual({ active: 2, paused: 1, archived: 1 });
    expect(totalProjects(counts)).toBe(4);
  });

  it('ger nollor för tom lista', () => {
    expect(computeProjectCounts([])).toEqual({ active: 0, paused: 0, archived: 0 });
  });
});

describe('shouldShowStatusTabs', () => {
  it('döljs när inget är arkiverat', () => {
    expect(shouldShowStatusTabs({ active: 3, paused: 0, archived: 0 })).toBe(false);
    expect(shouldShowStatusTabs({ active: 1, paused: 1, archived: 0 })).toBe(false);
  });

  it('visas när något är arkiverat', () => {
    expect(shouldShowStatusTabs({ active: 0, paused: 0, archived: 2 })).toBe(true);
  });
});

describe('filterProjects', () => {
  it('filtrerar på status', () => {
    expect(filterProjects(sample, 'active', '').map((p) => p.id)).toEqual(['a', 'b']);
    expect(filterProjects(sample, 'archived', '').map((p) => p.id)).toEqual(['d']);
  });

  it('söker fritext i titeln (skiftlägesokänsligt)', () => {
    expect(filterProjects(sample, 'active', 'skol').map((p) => p.id)).toEqual(['b']);
    expect(filterProjects(sample, 'active', 'ADVOKAT').map((p) => p.id)).toEqual(['a']);
    expect(filterProjects(sample, 'active', 'finns-ej')).toEqual([]);
  });
});

describe('shouldShowSearch', () => {
  it('visas först när listan är lång', () => {
    expect(shouldShowSearch(4)).toBe(false);
    expect(shouldShowSearch(5)).toBe(true);
  });
});

describe('projektnamn på svenska', () => {
  it('mappar varje typ till svenskt namn', () => {
    expect(projectBlockLabel('list')).toBe('Lista');
    expect(projectBlockLabel('note')).toBe('Anteckning');
    expect(projectBlockLabel('image')).toBe('Bild');
    expect(projectBlockLabel('video')).toBe('Video');
    expect(projectBlockLabel('task')).toBe('Uppgift');
  });

  it('faller tillbaka till "Projekt" utan typ', () => {
    expect(projectBlockLabel(undefined)).toBe('Projekt');
  });

  it('har en ikon för varje typ', () => {
    for (const meta of Object.values(PROJECT_BLOCK_META)) {
      expect(typeof meta.icon).toBe('object');
      expect(meta.label.length).toBeGreaterThan(0);
    }
  });
});

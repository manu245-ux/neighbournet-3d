import { ComplaintRecord } from '../types';

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'is', 'in', 'at', 'of', 'on', 
  'to', 'for', 'with', 'by', 'it', 'this', 'that', 'our', 'my', 
  'there', 'has', 'have', 'been', 'near', 'from', 'area', 'floor',
  'please', 'issue', 'problem', 'not', 'very', 'here', 'door', 'flat'
]);

export function tokenizeAndClean(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOPWORDS.has(word));
}

export function detectDuplicates(
  newEntry: { 
    buildingId: string; 
    floorId: string; 
    category: string; 
    locationZone: string; 
    description: string; 
    title: string 
  },
  existingComplaints: ComplaintRecord[]
): ComplaintRecord[] {
  const activeStatuses = new Set([
    'PENDING_VERIFICATION', 
    'APPROVED', 
    'ASSIGNED', 
    'IN_PROGRESS'
  ]);

  // 1. Scope filter: Same building, same floor, same category, currently active
  const candidates = existingComplaints.filter(c => 
    c.buildingId === newEntry.buildingId &&
    c.floorId === newEntry.floorId &&
    c.category === newEntry.category &&
    activeStatuses.has(c.status)
  );

  if (candidates.length === 0) return [];

  const newTokens = new Set([
    ...tokenizeAndClean(newEntry.title),
    ...tokenizeAndClean(newEntry.description)
  ]);

  const matches: ComplaintRecord[] = [];

  for (const candidate of candidates) {
    // Condition A: Same micro-zone
    const isSameZone = candidate.locationZone === newEntry.locationZone;

    // Condition B: At least 2 meaningful keyword overlaps
    const candidateTokens = [
      ...tokenizeAndClean(candidate.title),
      ...tokenizeAndClean(candidate.description)
    ];

    let sharedCount = 0;
    for (const token of candidateTokens) {
      if (newTokens.has(token)) {
        sharedCount++;
      }
    }

    if (isSameZone || sharedCount >= 2) {
      matches.push(candidate);
    }
  }

  return matches;
}

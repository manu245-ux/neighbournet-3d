/**
 * Atomic Sequential ID Generator & Formatter for NeighbourNet 3D
 * Standard format: NN-YYYY-NNNN (e.g. NN-2026-0001)
 */

export function formatComplaintId(year: number, sequenceNumber: number): string {
  const padded = String(sequenceNumber).padStart(4, '0');
  return `NN-${year}-${padded}`;
}

export function isValidComplaintId(id: string): boolean {
  return /^NN-\d{4}-\d{4}$/.test(id);
}

export function parseComplaintId(id: string): { year: number; sequence: number } | null {
  const match = id.match(/^NN-(\d{4})-(\d{4})$/);
  if (!match) return null;
  return {
    year: parseInt(match[1], 10),
    sequence: parseInt(match[2], 10)
  };
}

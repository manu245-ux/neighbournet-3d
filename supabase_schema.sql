-- ====================================================================
-- NeighbourNet 3D — Complete Supabase PostgreSQL Schema & Policies
-- Run this script in your Supabase SQL Editor
-- ====================================================================

-- 1. Create Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
  "complaintId" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "buildingId" TEXT NOT NULL,
  "floorId" TEXT NOT NULL,
  "exactLocation" TEXT NOT NULL,
  "locationZone" TEXT NOT NULL,
  "imageUrl" TEXT,
  "reporterId" TEXT NOT NULL,
  "suggestedPriority" TEXT DEFAULT 'medium',
  "priority" TEXT DEFAULT 'high',
  "status" TEXT DEFAULT 'PENDING_VERIFICATION',
  "visibility" TEXT DEFAULT 'public',
  "assignedTo" TEXT,
  "assignedTeamId" TEXT,
  "expectedResolutionAt" TIMESTAMPTZ,
  "resolutionNote" TEXT,
  "rejectionReason" TEXT,
  "possibleDuplicateOf" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "confirmationCounts" JSONB DEFAULT '{"stillExists": 0, "resolved": 0}'::JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  "updatedAt" TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  "resolvedAt" TIMESTAMPTZ
);

-- 2. Create Complaint Timeline Table
CREATE TABLE IF NOT EXISTS complaint_timelines (
  "timelineId" TEXT PRIMARY KEY,
  "complaintId" TEXT REFERENCES complaints("complaintId") ON DELETE CASCADE,
  "action" TEXT NOT NULL,
  "previousStatus" TEXT,
  "newStatus" TEXT NOT NULL,
  "updatedBy" TEXT NOT NULL,
  "updatedByRole" TEXT NOT NULL,
  "remarks" TEXT,
  "timestamp" TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. Create Atomic Counter Table
CREATE TABLE IF NOT EXISTS counters (
  "name" TEXT PRIMARY KEY,
  "year" INT NOT NULL,
  "lastNumber" INT NOT NULL
);

-- Seed initial counter
INSERT INTO counters ("name", "year", "lastNumber")
VALUES ('complaints', 2026, 8)
ON CONFLICT ("name") DO NOTHING;

-- 4. Enable Row Level Security (RLS) & Public Read/Write for Hackathon
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to complaints" ON complaints FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to timelines" ON complaint_timelines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to counters" ON counters FOR ALL USING (true) WITH CHECK (true);

-- 5. Enable Real-Time Replication
ALTER PUBLICATION supabase_realtime ADD TABLE complaints;
ALTER PUBLICATION supabase_realtime ADD TABLE complaint_timelines;

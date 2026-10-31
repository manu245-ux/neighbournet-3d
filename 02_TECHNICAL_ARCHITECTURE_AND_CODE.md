# NeighbourNet 3D — Part 2: Technical Architecture, Schemas & Code Artifacts

> **Document 2 of 3:** System Architecture, Schemas, Component Models & Production Source Code  
> **Project Tagline:** *Your neighbourhood. Your voice. Your safety.*  
> **Core Architecture:** Dual-Provider Service Abstraction (Firebase Cloud $\longleftrightarrow$ Offline LocalStorage Demo Bus)

---

## 1. Technology Stack & Project Structure

### 1.1 Technical Stack Matrix
* **Build Tooling & Frontend:** React 18+ with TypeScript, Vite, React Router v6.
* **Styling & Icons:** Tailwind CSS, PostCSS, Lucide React (`lucide-react`), clsx, tailwind-merge.
* **Charts & Analytics:** Recharts (used strictly on Admin Dashboard).
* **Backend & Storage:** Firebase Web SDK v10 (Auth, Firestore, Storage) with automatic fallback to browser LocalStorage.

### 1.2 Comprehensive Directory Blueprint
```
neighbournet-3d/
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── firestore.rules
├── storage.rules
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── index.ts                 # Full TypeScript domain contracts
│   ├── context/
│   │   ├── AuthContext.tsx          # Dual-mode authentication provider
│   │   └── DataContext.tsx          # Real-time state provider
│   ├── services/
│   │   ├── apiInterface.ts          # Unified service contracts
│   │   ├── authService.ts           # Hybrid auth provider
│   │   ├── complaintService.ts      # Dual Firebase/LocalStorage complaint pipeline
│   │   ├── demoDataService.ts       # Local repository and seed state manager
│   │   ├── eventEmitter.ts          # Browser Pub/Sub for Demo Mode reactivity
│   │   └── notificationService.ts   # In-app notification engine
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.tsx            # Accessible status & priority chips
│   │   │   ├── Button.tsx           # Standard button with loading spinners
│   │   │   ├── Modal.tsx            # Accessible dialog component
│   │   │   ├── EmergencyBanner.tsx  # Persistent warning for hazard categories
│   │   │   └── TimelineStepper.tsx  # Vertical chronological audit stepper
│   │   ├── map/
│   │   │   ├── CampusSvgMap.tsx     # Interactive SVG society campus
│   │   │   ├── FloorSchematic.tsx   # Micro-zone floor vector schematic
│   │   │   └── MarkerPin.tsx        # Dynamic SVG marker pin with jitter offset
│   │   └── layout/
│   │       ├── Navbar.tsx           # Responsive navigation + unread notification bell
│   │       ├── Footer.tsx           # System information & Demo Mode badge
│   │       └── ProtectedRoute.tsx   # Role-based route guard
│   ├── pages/
│   │   ├── LandingPage.tsx          # Public homepage with demo access
│   │   ├── LoginPage.tsx            # Fast credential picker for judges
│   │   ├── RegistrationPage.tsx     # Resident onboarding
│   │   ├── ResidentDashboard.tsx    # Resident ticket cards & quick links
│   │   ├── SocietyMapView.tsx       # Campus map with building inspection drawer
│   │   ├── FloorIssueView.tsx       # Interactive floor schematic & zone issues
│   │   ├── ReportComplaintPage.tsx  # Multi-field form with duplicate interception
│   │   ├── ComplaintDetailPage.tsx  # Deep link tracking & chronological timeline
│   │   ├── CommunityFeedPage.tsx    # Public verified issues & resident confirmations
│   │   ├── NotificationCenter.tsx   # In-app notification tray
│   │   ├── ProfilePage.tsx          # Resident profile management
│   │   ├── AdminDashboard.tsx       # Metrics, Recharts trends & "Needs Attention" queue
│   │   ├── AdminComplaintTable.tsx  # Multi-filtered operations management grid
│   │   └── AdminComplaintReview.tsx # Full triage, duplicate review & dispatch desk
│   └── utils/
│       ├── duplicateDetector.ts     # Deterministic token-matching algorithm
│       ├── idGenerator.ts           # Atomic NN-YYYY-NNNN sequence generator
│       └── sanitize.ts              # XSS protection string sanitizer
```

---

## 2. Complete TypeScript Domain Contracts

#### File: `src/types/index.ts`
```typescript
export type UserRole = 'resident' | 'admin';

export type ComplaintStatus = 
  | 'PENDING_VERIFICATION'
  | 'APPROVED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export type LocationZone = 
  | 'FLAT_DOOR_AREA'
  | 'CORRIDOR'
  | 'LIFT_LOBBY'
  | 'STAIRCASE'
  | 'COMMON_AREA';

export type ComplaintCategory =
  | 'Water Leakage'
  | 'Water Supply Problem'
  | 'Electricity Failure'
  | 'Lift Malfunction'
  | 'Security Concern'
  | 'Theft or Suspicious Activity'
  | 'Garbage and Sanitation'
  | 'Road Damage'
  | 'Stray Animals'
  | 'Fire or Safety Hazard'
  | 'Other Maintenance Issue';

// 1. User Record
export interface UserRecord {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  building: string;
  apartmentNumber: string;
  createdAt: string;
}

// 2. Building Model
export interface BuildingRecord {
  buildingId: string;
  buildingName: string;
  totalFloors: number;
  location: { x: number; y: number; width: number; height: number };
}

// 3. Floor Model
export interface FloorRecord {
  floorId: string;
  buildingId: string;
  floorName: string;
  floorNumber: number;
}

// 4. Complaint Record
export interface ComplaintRecord {
  complaintId: string; // e.g., "NN-2026-0001"
  title: string;
  category: ComplaintCategory;
  description: string;
  buildingId: string;
  floorId: string;
  exactLocation: string;
  locationZone: LocationZone;
  imageUrl?: string;
  reporterId: string;
  suggestedPriority: PriorityLevel;
  priority: PriorityLevel;
  status: ComplaintStatus;
  visibility: 'public' | 'private';
  assignedTo?: string;
  assignedTeamId?: string;
  expectedResolutionAt?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
  rejectionReason?: string;
  possibleDuplicateOf: string[];
  confirmationCounts: {
    stillExists: number;
    resolved: number;
  };
}

// 5. Timeline Entry
export interface TimelineEntry {
  timelineId: string;
  complaintId: string;
  action: string;
  previousStatus: ComplaintStatus;
  newStatus: ComplaintStatus;
  updatedBy: string;
  updatedByRole: UserRole;
  remarks?: string;
  timestamp: string;
}

// 6. In-App Notification
export interface InAppNotification {
  notificationId: string;
  userId: string;
  complaintId: string;
  title: string;
  message: string;
  readStatus: boolean;
  createdAt: string;
}

// 7. Maintenance Team
export interface MaintenanceTeam {
  teamId: string;
  name: string;
  categoriesHandled: ComplaintCategory[];
}

// 8. Resident Confirmation
export interface ResidentConfirmation {
  confirmationId: string;
  complaintId: string;
  userId: string;
  type: 'STILL_EXISTS' | 'RESOLVED';
  createdAt: string;
}

// 9. Community Announcement
export interface CommunityAnnouncement {
  announcementId: string;
  title: string;
  message: string;
  createdBy: string;
  createdAt: string;
}
```

---

## 3. Decoupled Service Layer Implementation

### 3.1 Event Bus for Offline Reactivity

#### File: `src/services/eventEmitter.ts`
```typescript
type Listener = (...args: any[]) => void;

class SimpleEventEmitter {
  private events: Record<string, Listener[]> = {};

  on(event: string, listener: Listener): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event: string, listener: Listener): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(...args));
  }
}

export const eventEmitter = new SimpleEventEmitter();
```

---

### 3.2 Dual Complaint Service (Cloud + Demo Mode)

#### File: `src/services/complaintService.ts`
```typescript
import { ComplaintRecord, TimelineEntry, ComplaintStatus, PriorityLevel } from '../types';
import { demoDataService } from './demoDataService';
import { eventEmitter } from './eventEmitter';

const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE === 'true';

export const complaintService = {
  async getComplaints(): Promise<ComplaintRecord[]> {
    if (USE_FIREBASE) {
      try {
        const { collection, getDocs } = await import('firebase/firestore');
        const { db } = await import('./firebase');
        const snapshot = await getDocs(collection(db, 'complaints'));
        return snapshot.docs.map(doc => doc.data() as ComplaintRecord);
      } catch (err) {
        console.warn('Firebase unreachable, falling back to Demo Mode', err);
        return demoDataService.getAllComplaints();
      }
    }
    return demoDataService.getAllComplaints();
  },

  async getComplaintById(id: string): Promise<ComplaintRecord | null> {
    if (USE_FIREBASE) {
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('./firebase');
        const snap = await getDoc(doc(db, 'complaints', id));
        return snap.exists() ? (snap.data() as ComplaintRecord) : null;
      } catch (err) {
        return demoDataService.getComplaintById(id);
      }
    }
    return demoDataService.getComplaintById(id);
  },

  async getTimeline(complaintId: string): Promise<TimelineEntry[]> {
    if (USE_FIREBASE) {
      try {
        const { collection, query, where, getDocs, orderBy } = await import('firebase/firestore');
        const { db } = await import('./firebase');
        const q = query(
          collection(db, 'complaintTimeline'),
          where('complaintId', '==', complaintId),
          orderBy('timestamp', 'asc')
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => d.data() as TimelineEntry);
      } catch (err) {
        return demoDataService.getTimelineForComplaint(complaintId);
      }
    }
    return demoDataService.getTimelineForComplaint(complaintId);
  },

  async createComplaint(payload: Omit<ComplaintRecord, 'complaintId' | 'status' | 'createdAt' | 'updatedAt' | 'confirmationCounts'>): Promise<ComplaintRecord> {
    if (USE_FIREBASE) {
      try {
        const { runTransaction, doc, collection } = await import('firebase/firestore');
        const { db } = await import('./firebase');

        return await runTransaction(db, async (transaction) => {
          const counterRef = doc(db, 'counters', 'complaints');
          const counterSnap = await transaction.get(counterRef);
          const currentYear = new Date().getFullYear();
          let lastNumber = 0;

          if (counterSnap.exists()) {
            const data = counterSnap.data();
            lastNumber = data.year === currentYear ? data.lastNumber : 0;
          }

          const nextNumber = lastNumber + 1;
          const newId = `NN-${currentYear}-${String(nextNumber).padStart(4, '0')}`;

          transaction.set(counterRef, { lastNumber: nextNumber, year: currentYear }, { merge: true });

          const newComplaint: ComplaintRecord = {
            ...payload,
            complaintId: newId,
            status: 'PENDING_VERIFICATION',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            confirmationCounts: { stillExists: 0, resolved: 0 }
          };

          const complaintRef = doc(collection(db, 'complaints'), newId);
          transaction.set(complaintRef, newComplaint);

          const timelineRef = doc(collection(db, 'complaintTimeline'));
          transaction.set(timelineRef, {
            timelineId: timelineRef.id,
            complaintId: newId,
            action: 'SUBMITTED',
            previousStatus: 'PENDING_VERIFICATION',
            newStatus: 'PENDING_VERIFICATION',
            updatedBy: 'Resident',
            updatedByRole: 'resident',
            remarks: 'Complaint registered in portal',
            timestamp: new Date().toISOString()
          });

          return newComplaint;
        });
      } catch (err) {
        console.warn('Firebase write failed, using Demo Mode', err);
      }
    }

    return demoDataService.createComplaint(payload);
  },

  async updateStatus(
    complaintId: string, 
    newStatus: ComplaintStatus, 
    actor: { name: string; role: 'admin' | 'resident' },
    details: { 
      remarks?: string; 
      teamId?: string; 
      staffName?: string; 
      eta?: string; 
      resolutionNote?: string; 
      priority?: PriorityLevel;
      visibility?: 'public' | 'private';
    }
  ): Promise<void> {
    if (USE_FIREBASE) {
      try {
        const { doc, updateDoc, collection, addDoc } = await import('firebase/firestore');
        const { db } = await import('./firebase');

        const compRef = doc(db, 'complaints', complaintId);
        const updates: any = { status: newStatus, updatedAt: new Date().toISOString() };

        if (details.priority) updates.priority = details.priority;
        if (details.visibility) updates.visibility = details.visibility;
        if (details.teamId) updates.assignedTeamId = details.teamId;
        if (details.staffName) updates.assignedTo = details.staffName;
        if (details.eta) updates.expectedResolutionAt = details.eta;
        if (details.resolutionNote) {
          updates.resolutionNote = details.resolutionNote;
          updates.resolvedAt = new Date().toISOString();
        }
        if (newStatus === 'REJECTED' && details.remarks) {
          updates.rejectionReason = details.remarks;
        }

        await updateDoc(compRef, updates);

        await addDoc(collection(db, 'complaintTimeline'), {
          complaintId,
          action: newStatus,
          previousStatus: 'ACTIVE',
          newStatus,
          updatedBy: actor.name,
          updatedByRole: actor.role,
          remarks: details.remarks || details.resolutionNote || 'Status updated',
          timestamp: new Date().toISOString()
        });
        return;
      } catch (err) {
        console.warn('Firebase status update failed, switching to local', err);
      }
    }

    demoDataService.updateComplaintStatus(complaintId, newStatus, actor, details);
  },

  subscribeToComplaints(callback: (complaints: ComplaintRecord[]) => void): () => void {
    if (USE_FIREBASE) {
      let unsubscribe = () => {};
      import('firebase/firestore').then(({ collection, onSnapshot }) => {
        import('./firebase').then(({ db }) => {
          unsubscribe = onSnapshot(collection(db, 'complaints'), (snap) => {
            const list = snap.docs.map(d => d.data() as ComplaintRecord);
            callback(list);
          }, () => {
            // Error fallback
            const list = demoDataService.getAllComplaints();
            callback(list);
          });
        });
      });
      return () => unsubscribe();
    }

    // Demo Mode Pub/Sub
    const handleUpdate = () => callback(demoDataService.getAllComplaints());
    eventEmitter.on('COMPLAINTS_CHANGED', handleUpdate);
    callback(demoDataService.getAllComplaints());
    return () => eventEmitter.off('COMPLAINTS_CHANGED', handleUpdate);
  }
};
```

---

## 4. Rule-Based Duplicate Detection Engine

#### File: `src/utils/duplicateDetector.ts`
```typescript
import { ComplaintRecord } from '../types';

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'is', 'in', 'at', 'of', 'on', 
  'to', 'for', 'with', 'by', 'it', 'this', 'that', 'our', 'my', 
  'there', 'has', 'have', 'been', 'near', 'from', 'area', 'floor',
  'please', 'issue', 'problem', 'not', 'very'
]);

export function tokenize(text: string): string[] {
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
  const activeStatuses = new Set(['PENDING_VERIFICATION', 'APPROVED', 'ASSIGNED', 'IN_PROGRESS']);

  // 1. Hard filter: Same building, same floor, same category, currently active
  const candidates = existingComplaints.filter(c => 
    c.buildingId === newEntry.buildingId &&
    c.floorId === newEntry.floorId &&
    c.category === newEntry.category &&
    activeStatuses.has(c.status)
  );

  if (candidates.length === 0) return [];

  const newTokens = new Set([
    ...tokenize(newEntry.title),
    ...tokenize(newEntry.description)
  ]);

  const matches: ComplaintRecord[] = [];

  for (const candidate of candidates) {
    const isSameZone = candidate.locationZone === newEntry.locationZone;

    const candidateTokens = [
      ...tokenize(candidate.title),
      ...tokenize(candidate.description)
    ];

    let sharedCount = 0;
    for (const token of candidateTokens) {
      if (newTokens.has(token)) {
        sharedCount++;
      }
    }

    // Match if identical micro-zone or at least 2 shared meaningful keywords
    if (isSameZone || sharedCount >= 2) {
      matches.push(candidate);
    }
  }

  return matches;
}
```

---

## 5. Interactive SVG Map & Floor Schematic Components

### 5.1 Interactive Campus Vector Map

#### File: `src/components/map/CampusSvgMap.tsx`
```tsx
import React, { useState } from 'react';
import { ComplaintRecord } from '../../types';

interface CampusMapProps {
  complaints: ComplaintRecord[];
  onSelectBuilding: (buildingId: string) => void;
  selectedBuildingId?: string;
}

export const CampusSvgMap: React.FC<CampusMapProps> = ({
  complaints,
  onSelectBuilding,
  selectedBuildingId
}) => {
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  const buildings = [
    { id: 'bldg-a', name: 'Building A', x: 80, y: 70, width: 220, height: 170 },
    { id: 'bldg-b', name: 'Building B', x: 500, y: 70, width: 220, height: 170 },
    { id: 'bldg-c', name: 'Building C', x: 80, y: 350, width: 220, height: 170 },
    { id: 'bldg-d', name: 'Building D', x: 500, y: 350, width: 220, height: 170 },
  ];

  const getActiveCount = (bldgId: string) => {
    return complaints.filter(
      c => c.buildingId === bldgId && !['RESOLVED', 'REJECTED', 'WITHDRAWN'].includes(c.status)
    ).length;
  };

  const getSeverityBadgeColor = (bldgId: string) => {
    const active = complaints.filter(
      c => c.buildingId === bldgId && !['RESOLVED', 'REJECTED', 'WITHDRAWN'].includes(c.status)
    );
    if (active.some(c => c.priority === 'urgent' || c.priority === 'high')) return '#EF4444'; // Red
    if (active.some(c => c.status === 'IN_PROGRESS')) return '#F97316'; // Orange
    if (active.some(c => c.status === 'PENDING_VERIFICATION')) return '#EAB308'; // Yellow
    if (active.length > 0) return '#3B82F6'; // Blue
    return '#10B981'; // Green
  };

  return (
    <div className="relative w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 p-4">
      <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
        <span className="font-semibold text-white">Green Valley Residency</span> • Interactive Campus Map
      </div>

      <svg viewBox="0 0 800 600" className="w-full h-auto select-none">
        <defs>
          <linearGradient id="roadFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <pattern id="lawn" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#064E3B" fillOpacity="0.35" />
            <circle cx="2" cy="2" r="1.5" fill="#047857" fillOpacity="0.6" />
          </pattern>
        </defs>

        {/* Campus Lawn */}
        <rect width="800" height="600" fill="url(#lawn)" rx="16" />

        {/* Internal Roads */}
        <path d="M 350 0 L 450 0 L 450 600 L 350 600 Z" fill="url(#roadFill)" />
        <path d="M 0 270 L 800 270 L 800 330 L 0 330 Z" fill="url(#roadFill)" />
        <circle cx="400" cy="300" r="46" fill="#1E293B" stroke="#475569" strokeWidth="3" />

        {/* Central Fountain & Green Island */}
        <rect x="365" y="265" width="70" height="70" rx="35" fill="#059669" />
        <text x="400" y="304" textAnchor="middle" fill="#ECFDF5" fontSize="10" fontWeight="bold">GARDEN</text>

        {/* Main Entrance Gate */}
        <rect x="360" y="555" width="80" height="35" rx="4" fill="#475569" stroke="#94A3B8" strokeWidth="1.5" />
        <text x="400" y="577" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">MAIN GATE</text>

        {/* Buildings */}
        {buildings.map((b) => {
          const count = getActiveCount(b.id);
          const badgeColor = getSeverityBadgeColor(b.id);
          const isSelected = selectedBuildingId === b.id;
          const isHovered = hoveredBuilding === b.id;

          return (
            <g
              key={b.id}
              className="cursor-pointer transition-all duration-200"
              onClick={() => onSelectBuilding(b.id)}
              onMouseEnter={() => setHoveredBuilding(b.id)}
              onMouseLeave={() => setHoveredBuilding(null)}
            >
              {/* Drop Shadow */}
              <rect
                x={b.x + 6}
                y={b.y + 6}
                width={b.width}
                height={b.height}
                rx="12"
                fill="#020617"
                fillOpacity="0.7"
              />

              {/* Building Base */}
              <rect
                x={b.x}
                y={b.y}
                width={b.width}
                height={b.height}
                rx="12"
                fill={isSelected ? '#1E293B' : isHovered ? '#334155' : '#1E293B'}
                stroke={isSelected ? '#38BDF8' : isHovered ? '#94A3B8' : '#475569'}
                strokeWidth={isSelected ? 3.5 : 1.5}
              />

              <text x={b.x + b.width / 2} y={b.y + 50} textAnchor="middle" fill="#F8FAFC" fontSize="17" fontWeight="bold">
                {b.name}
              </text>
              <text x={b.x + b.width / 2} y={b.y + 75} textAnchor="middle" fill="#94A3B8" fontSize="12">
                5 Floors • 20 Flats
              </text>

              {/* Status Pill Badge */}
              <g transform={`translate(${b.x + b.width / 2 - 48}, ${b.y + 105})`}>
                <rect width="96" height="28" rx="14" fill={badgeColor} fillOpacity="0.25" stroke={badgeColor} strokeWidth="1.5" />
                <circle cx="16" cy="14" r="5" fill={badgeColor} />
                <text x="54" y="18" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600">
                  {count === 0 ? 'All Clear' : `${count} Active`}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
```

---

### 5.2 Floor Plan Vector Schematic with Non-Overlapping Pins

#### File: `src/components/map/FloorSchematic.tsx`
```tsx
import React from 'react';
import { ComplaintRecord, LocationZone } from '../../types';

interface FloorSchematicProps {
  buildingName: string;
  floorName: string;
  complaints: ComplaintRecord[];
  onSelectComplaint: (complaint: ComplaintRecord) => void;
  onZoneClick: (zone: LocationZone) => void;
}

export const FloorSchematic: React.FC<FloorSchematicProps> = ({
  buildingName,
  floorName,
  complaints,
  onSelectComplaint,
  onZoneClick
}) => {
  // Center coordinates for each micro-zone
  const zoneCenters: Record<LocationZone, { x: number; y: number }> = {
    FLAT_DOOR_AREA: { x: 170, y: 110 },
    CORRIDOR: { x: 400, y: 150 },
    LIFT_LOBBY: { x: 580, y: 220 },
    STAIRCASE: { x: 220, y: 220 },
    COMMON_AREA: { x: 400, y: 310 }
  };

  // Group complaints by zone for offset calculation
  const complaintsByZone: Record<LocationZone, ComplaintRecord[]> = {
    FLAT_DOOR_AREA: [],
    CORRIDOR: [],
    LIFT_LOBBY: [],
    STAIRCASE: [],
    COMMON_AREA: []
  };

  complaints.forEach(c => {
    if (complaintsByZone[c.locationZone]) {
      complaintsByZone[c.locationZone].push(c);
    }
  });

  const getPinColor = (status: string) => {
    switch (status) {
      case 'PENDING_VERIFICATION': return '#EAB308'; // Yellow
      case 'APPROVED': return '#3B82F6';             // Blue
      case 'ASSIGNED': return '#A855F7';             // Purple
      case 'IN_PROGRESS': return '#F97316';          // Orange
      case 'RESOLVED': return '#10B981';             // Green
      default: return '#6B7280';
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{buildingName} — {floorName}</h3>
          <p className="text-xs text-slate-400">Interactive Floor Schematic • Click any pin or zone</p>
        </div>
      </div>

      <svg viewBox="0 0 800 420" className="w-full h-auto select-none">
        {/* Floor Base */}
        <rect x="50" y="20" width="700" height="380" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="2" />

        {/* Flat 1 */}
        <rect x="70" y="40" width="200" height="130" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
        <text x="170" y="90" textAnchor="middle" fill="#CBD5E1" fontSize="14" fontWeight="600">Flat 01</text>
        <rect x="150" y="150" width="40" height="20" fill="#334155" rx="2" />
        <text x="170" y="164" textAnchor="middle" fill="#94A3B8" fontSize="9">DOOR</text>

        {/* Flat 2 */}
        <rect x="530" y="40" width="200" height="130" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
        <text x="630" y="90" textAnchor="middle" fill="#CBD5E1" fontSize="14" fontWeight="600">Flat 02</text>
        <rect x="610" y="150" width="40" height="20" fill="#334155" rx="2" />
        <text x="630" y="164" textAnchor="middle" fill="#94A3B8" fontSize="9">DOOR</text>

        {/* Central Corridor Zone */}
        <g className="cursor-pointer" onClick={() => onZoneClick('CORRIDOR')}>
          <rect x="290" y="40" width="220" height="220" fill="#1E293B" fillOpacity="0.4" stroke="#64748B" strokeDasharray="4 4" rx="4" />
          <text x="400" y="155" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="bold">CENTRAL CORRIDOR</text>
        </g>

        {/* Staircase (Fire Exit) */}
        <g className="cursor-pointer" onClick={() => onZoneClick('STAIRCASE')}>
          <rect x="70" y="190" width="200" height="80" rx="6" fill="#1E293B" stroke="#EF4444" strokeWidth="1" />
          <text x="170" y="235" textAnchor="middle" fill="#FCA5A5" fontSize="12" fontWeight="bold">STAIRCASE (FIRE EXIT)</text>
        </g>

        {/* Lift Lobby */}
        <g className="cursor-pointer" onClick={() => onZoneClick('LIFT_LOBBY')}>
          <rect x="530" y="190" width="200" height="80" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
          <text x="630" y="235" textAnchor="middle" fill="#BAE6FD" fontSize="12" fontWeight="bold">ELEVATOR LOBBY</text>
        </g>

        {/* Flat 3 */}
        <rect x="70" y="290" width="200" height="90" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
        <text x="170" y="345" textAnchor="middle" fill="#CBD5E1" fontSize="14" fontWeight="600">Flat 03</text>

        {/* Utility / Common Shaft */}
        <g className="cursor-pointer" onClick={() => onZoneClick('COMMON_AREA')}>
          <rect x="290" y="280" width="220" height="100" rx="6" fill="#1E293B" stroke="#EAB308" strokeDasharray="3 3" />
          <text x="400" y="335" textAnchor="middle" fill="#FDE047" fontSize="11" fontWeight="bold">UTILITY & RISER SHAFT</text>
        </g>

        {/* Flat 4 */}
        <rect x="530" y="290" width="200" height="90" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
        <text x="630" y="345" textAnchor="middle" fill="#CBD5E1" fontSize="14" fontWeight="600">Flat 04</text>

        {/* Render Complaint Markers with Non-Overlapping Offsets */}
        {(Object.keys(complaintsByZone) as LocationZone[]).map(zone => {
          const list = complaintsByZone[zone];
          const center = zoneCenters[zone];

          return list.map((c, index) => {
            const offsetX = ((index % 3) - 1) * 22;
            const offsetY = Math.floor(index / 3) * 20;
            const posX = center.x + offsetX;
            const posY = center.y + offsetY;
            const pinColor = getPinColor(c.status);

            return (
              <g
                key={c.complaintId}
                transform={`translate(${posX}, ${posY})`}
                className="cursor-pointer group"
                onClick={() => onSelectComplaint(c)}
              >
                {/* Pulsing ring for urgent items */}
                {(c.priority === 'urgent' || c.priority === 'high') && (
                  <circle cx="0" cy="0" r="14" fill={pinColor} fillOpacity="0.3" className="animate-ping" />
                )}
                <circle cx="0" cy="0" r="10" fill={pinColor} stroke="#FFFFFF" strokeWidth="2" />
                <text x="0" y="3.5" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">!</text>

                {/* Tooltip on hover */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                  <rect x="-60" y="-36" width="120" height="24" rx="4" fill="#020617" stroke="#475569" />
                  <text x="0" y="-20" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="500">
                    {c.complaintId} • {c.category.slice(0, 10)}
                  </text>
                </g>
              </g>
            );
          });
        })}
      </svg>
    </div>
  );
};
```

---

## 6. Page-by-Page UI/UX Specifications

### 15 Core Application Pages

1. **`/` Landing Page:** Value proposition, society statistics, platform feature tour, emergency statement, direct buttons for `"Demo Resident Login"` and `"Demo Admin Login"`.
2. **`/login` Authentication Portal:** One-click role switchers for judges (`resident@demo.com` and `admin@demo.com`) to expedite testing.
3. **`/register` Resident Registration:** Collects Name, Phone, Tower selection (A/B/C/D), Flat number (`A-203`), and assigns default `resident` role.
4. **`/dashboard` Resident Dashboard:** Summary metric cards (`My Complaints`, `Active`, `Resolved`), button for `Report an Issue`, personal ticket list with status badges, and latest announcements.
5. **`/map` Society Interactive Campus:** Top-level vector canvas displaying Buildings A, B, C, D, roads, parking, and amenities. Hovering reveals active counts; clicking opens the building inspection drawer.
6. **`/map/building/:buildingId` Building Inspector:** Displays building details, 5 floor buttons with individual issue counts, and a direct `+ Report in this Building` CTA.
7. **`/map/floor/:floorId` Floor Schematic View:** Micro-zone schematic featuring non-overlapping markers, category/status filters, empty-state placeholder (*"No issues reported on this floor. Everything looks good!"*), and quick reporting button.
8. **`/report` Complaint Submission Portal:** Pre-selects building/floor from map context, validates character counts (Title: 5–80, Description: 20–500), handles image attachments ($\le 2\text{ MB}$), displays emergency banners for safety categories, and triggers the duplicate warning modal.
9. **`/complaint/:id` Complaint Detail & Stepper:** Comprehensive complaint tracking page with a vertical chronological audit stepper, actor chips, status chips, technician remarks, and resolution notes.
10. **`/feed` Community Feed:** Public verified issues feed displaying category badges, photos, and voting buttons (`"Issue Still Exists"`, `"Issue Resolved"`). Also displays admin announcements.
11. **`/notifications` Notification Tray:** Chronological in-app notifications with unread indicators, direct links to complaints, and `"Mark all as read"` button.
12. **`/profile` Resident Profile:** View and edit personal contact preferences; shows verified society flat details.
13. **`/admin` Admin Control Hub:** High-level operational metrics (`Total`, `Pending`, `Approved`, `In Progress`, `Resolved`, `High Priority`), Recharts visual graphs, and `"Needs Attention"` triage queue.
14. **`/admin/complaints` Master Operations Table:** Comprehensive administrative table supporting search by ID or title, multi-filtering (building, floor, category, priority, status), sorting, and pagination.
15. **`/admin/review/:id` Triage & Dispatch Desk:** Detailed review portal featuring full issue details, photo viewer, duplicate cross-references, resident confirmation tallies, and action panels for approving, rejecting, assigning teams, setting ETAs, or resolving.

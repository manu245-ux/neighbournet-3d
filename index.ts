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

// 2. Building Record
export interface BuildingRecord {
  buildingId: string;
  buildingName: string;
  totalFloors: number;
  location: { 
    x: number; 
    y: number; 
    width: number; 
    height: number;
  };
}

// 3. Floor Record
export interface FloorRecord {
  floorId: string;
  buildingId: string;
  floorName: string;
  floorNumber: number;
}

// 4. Complaint Record
export interface ComplaintRecord {
  complaintId: string; // e.g. "NN-2026-0001"
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

// 10. Atomic Counter
export interface CountersRecord {
  complaints: {
    lastNumber: number;
    year: number;
  };
}

// Category Configuration Definition
export interface CategoryConfig {
  category: ComplaintCategory;
  suggestedTeamId: string;
  defaultPriority: PriorityLevel;
  isEmergency: boolean;
}

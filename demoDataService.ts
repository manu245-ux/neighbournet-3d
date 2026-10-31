import { 
  ComplaintRecord, 
  TimelineEntry, 
  InAppNotification, 
  UserRecord, 
  MaintenanceTeam, 
  CommunityAnnouncement,
  ComplaintStatus,
  PriorityLevel,
  ResidentConfirmation
} from '../types';
import { eventEmitter } from './eventEmitter';

const STORAGE_KEYS = {
  COMPLAINTS: 'NN_COMPLAINTS_v1',
  TIMELINE: 'NN_TIMELINE_v1',
  NOTIFICATIONS: 'NN_NOTIFICATIONS_v1',
  USERS: 'NN_USERS_v1',
  TEAMS: 'NN_TEAMS_v1',
  ANNOUNCEMENTS: 'NN_ANNOUNCEMENTS_v1',
  CONFIRMATIONS: 'NN_CONFIRMATIONS_v1',
  COUNTER: 'NN_COUNTER_v1',
  CURRENT_USER: 'NN_CURRENT_USER_v1'
};

const DEFAULT_USERS: UserRecord[] = [
  {
    userId: 'resident-demo-uid',
    name: 'Kavita Sharma',
    email: 'resident@demo.com',
    phone: '+91 98201 22334',
    role: 'resident',
    building: 'Building A',
    apartmentNumber: 'A-203',
    createdAt: '2026-10-25T10:00:00Z'
  },
  {
    userId: 'admin-demo-uid',
    name: 'Major Vikram Rathore (Retd.)',
    email: 'admin@demo.com',
    phone: '+91 98111 99887',
    role: 'admin',
    building: 'Clubhouse Office',
    apartmentNumber: 'Admin-01',
    createdAt: '2026-10-20T10:00:00Z'
  }
];

const DEFAULT_TEAMS: MaintenanceTeam[] = [
  { teamId: 'team-plumbing', name: 'Plumbing & Water Works', categoriesHandled: ['Water Leakage', 'Water Supply Problem'] },
  { teamId: 'team-electrical', name: 'Electrical & Power Grid', categoriesHandled: ['Electricity Failure'] },
  { teamId: 'team-lift', name: 'Otis Lift Maintenance AMC', categoriesHandled: ['Lift Malfunction'] },
  { teamId: 'team-cleaning', name: 'Sanitation & Janitorial Staff', categoriesHandled: ['Garbage and Sanitation'] },
  { teamId: 'team-security', name: 'Security & Vigilance Taskforce', categoriesHandled: ['Security Concern', 'Theft or Suspicious Activity', 'Fire or Safety Hazard'] },
  { teamId: 'team-general', name: 'General Civil Works Team', categoriesHandled: ['Road Damage', 'Stray Animals', 'Other Maintenance Issue'] }
];

const DEFAULT_ANNOUNCEMENTS: CommunityAnnouncement[] = [
  {
    announcementId: 'ann-01',
    title: 'Mandatory DG Power Backup Testing',
    message: 'Diesel Generator sync testing scheduled for this Sunday from 2:00 PM to 4:00 PM. Expect brief 2-minute switchover flickers.',
    createdBy: 'Facility Management Committee',
    createdAt: '2026-10-29T10:00:00Z'
  },
  {
    announcementId: 'ann-02',
    title: 'Overhead Tank Chlorination',
    message: 'Water supply to Towers A and B will be throttled between 1:00 PM and 3:30 PM on Thursday for biochemical cleaning.',
    createdBy: 'Health & Sanitation Desk',
    createdAt: '2026-10-28T08:30:00Z'
  }
];

const DEFAULT_COMPLAINTS: ComplaintRecord[] = [
  {
    complaintId: 'NN-2026-0001',
    title: 'Severe overhead pipeline leakage near lift shaft',
    category: 'Water Leakage',
    description: 'Continuous water drip from the secondary ceiling pipe right outside Flat 202 and the lift entrance. Water is pooling rapidly.',
    buildingId: 'bldg-a',
    floorId: 'bldg-a-f2',
    exactLocation: 'Opposite Elevator Door, 2nd Floor',
    locationZone: 'LIFT_LOBBY',
    reporterId: 'resident-demo-uid',
    suggestedPriority: 'high',
    priority: 'high',
    status: 'IN_PROGRESS',
    visibility: 'public',
    assignedTeamId: 'team-plumbing',
    assignedTo: 'Ramesh (Master Plumber)',
    expectedResolutionAt: '2026-10-31T18:00:00Z',
    createdAt: '2026-10-30T09:15:00Z',
    updatedAt: '2026-10-30T11:00:00Z',
    possibleDuplicateOf: [],
    confirmationCounts: { stillExists: 3, resolved: 0 }
  },
  {
    complaintId: 'NN-2026-0002',
    title: 'Corridor tube light flickering and sparking',
    category: 'Electricity Failure',
    description: 'The main LED ballast in the hallway between flat 203 and 204 emits a buzzing sound and periodic sparks.',
    buildingId: 'bldg-a',
    floorId: 'bldg-a-f2',
    exactLocation: 'Mid-Corridor Ceiling Junction',
    locationZone: 'CORRIDOR',
    reporterId: 'resident-demo-uid',
    suggestedPriority: 'medium',
    priority: 'high',
    status: 'APPROVED',
    visibility: 'public',
    assignedTeamId: 'team-electrical',
    createdAt: '2026-10-30T10:30:00Z',
    updatedAt: '2026-10-30T11:15:00Z',
    possibleDuplicateOf: [],
    confirmationCounts: { stillExists: 1, resolved: 0 }
  },
  {
    complaintId: 'NN-2026-0003',
    title: 'Tower B Elevator jerking and halting between floors',
    category: 'Lift Malfunction',
    description: 'Passenger elevator stops abruptly between 3rd and 4th floors with loud grinding mechanical noises.',
    buildingId: 'bldg-b',
    floorId: 'bldg-b-f3',
    exactLocation: 'Passenger Lift No. 1',
    locationZone: 'LIFT_LOBBY',
    reporterId: 'user-mock-2',
    suggestedPriority: 'high',
    priority: 'urgent',
    status: 'ASSIGNED',
    visibility: 'public',
    assignedTeamId: 'team-lift',
    createdAt: '2026-10-30T08:00:00Z',
    updatedAt: '2026-10-30T09:30:00Z',
    possibleDuplicateOf: [],
    confirmationCounts: { stillExists: 5, resolved: 0 }
  },
  {
    complaintId: 'NN-2026-0004',
    title: 'Refuse and garbage sacks piled in emergency staircase',
    category: 'Garbage and Sanitation',
    description: 'Cardboard boxes and decomposed wet waste dumped directly on fire egress stairs, blocking descent.',
    buildingId: 'bldg-c',
    floorId: 'bldg-c-f1',
    exactLocation: 'Stairwell Landing between 1st & Ground',
    locationZone: 'STAIRCASE',
    reporterId: 'user-mock-3',
    suggestedPriority: 'low',
    priority: 'medium',
    status: 'PENDING_VERIFICATION',
    visibility: 'public',
    createdAt: '2026-10-30T12:00:00Z',
    updatedAt: '2026-10-30T12:00:00Z',
    possibleDuplicateOf: [],
    confirmationCounts: { stillExists: 0, resolved: 0 }
  },
  {
    complaintId: 'NN-2026-0005',
    title: 'Suspicious trespasser inspecting door locks at night',
    category: 'Theft or Suspicious Activity',
    description: 'Unidentified individual in dark hoodie caught checking door handles on the 4th floor around 2:30 AM.',
    buildingId: 'bldg-d',
    floorId: 'bldg-d-f4',
    exactLocation: 'Outer Doorway Flats 401-402',
    locationZone: 'FLAT_DOOR_AREA',
    reporterId: 'user-mock-4',
    suggestedPriority: 'high',
    priority: 'urgent',
    status: 'PENDING_VERIFICATION',
    visibility: 'private',
    createdAt: '2026-10-30T03:15:00Z',
    updatedAt: '2026-10-30T03:15:00Z',
    possibleDuplicateOf: [],
    confirmationCounts: { stillExists: 0, resolved: 0 }
  },
  {
    complaintId: 'NN-2026-0006',
    title: 'Damaged asphalt pothole at vehicle exit curve',
    category: 'Road Damage',
    description: 'Deep tire rut exposing sharp gravel bed right before Gate 2 exit boom barrier.',
    buildingId: 'bldg-a',
    floorId: 'bldg-a-f0',
    exactLocation: 'Perimeter Road near Security Cabin',
    locationZone: 'COMMON_AREA',
    reporterId: 'resident-demo-uid',
    suggestedPriority: 'low',
    priority: 'low',
    status: 'RESOLVED',
    visibility: 'public',
    assignedTeamId: 'team-general',
    resolutionNote: 'Pothole filled with cold-mix asphalt and compacted by municipal team.',
    resolvedAt: '2026-10-29T16:00:00Z',
    createdAt: '2026-10-28T10:00:00Z',
    updatedAt: '2026-10-29T16:00:00Z',
    possibleDuplicateOf: [],
    confirmationCounts: { stillExists: 0, resolved: 4 }
  },
  {
    complaintId: 'NN-2026-0007',
    title: 'Aggressive stray dog pack near children playground',
    category: 'Stray Animals',
    description: 'Three aggressive canines have taken shelter beneath the slide, barking at toddlers.',
    buildingId: 'bldg-b',
    floorId: 'bldg-b-f0',
    exactLocation: 'Central Garden Play Swing Area',
    locationZone: 'COMMON_AREA',
    reporterId: 'user-mock-5',
    suggestedPriority: 'high',
    priority: 'high',
    status: 'IN_PROGRESS',
    visibility: 'public',
    assignedTeamId: 'team-general',
    assignedTo: 'Municipal Animal Control Unit',
    expectedResolutionAt: '2026-10-31T17:00:00Z',
    createdAt: '2026-10-30T07:45:00Z',
    updatedAt: '2026-10-30T08:30:00Z',
    possibleDuplicateOf: [],
    confirmationCounts: { stillExists: 2, resolved: 0 }
  },
  {
    complaintId: 'NN-2026-0008',
    title: 'Expired fire extinguisher pressure gauge in red zone',
    category: 'Fire or Safety Hazard',
    description: 'Dry powder extinguisher inspection cylinder shows zero bar pressure on Ground Floor lobby.',
    buildingId: 'bldg-c',
    floorId: 'bldg-c-f0',
    exactLocation: 'Main Lobby Fire Extinguisher Bracket',
    locationZone: 'COMMON_AREA',
    reporterId: 'user-mock-2',
    suggestedPriority: 'high',
    priority: 'urgent',
    status: 'REJECTED',
    visibility: 'public',
    rejectionReason: 'Duplicate of NN-2026-0000; replacement units ordered and being mounted today.',
    createdAt: '2026-10-27T14:00:00Z',
    updatedAt: '2026-10-27T15:00:00Z',
    possibleDuplicateOf: ['NN-2026-0000'],
    confirmationCounts: { stillExists: 0, resolved: 0 }
  }
];

const DEFAULT_TIMELINES: TimelineEntry[] = [
  {
    timelineId: 'tm-01',
    complaintId: 'NN-2026-0001',
    action: 'SUBMITTED',
    previousStatus: 'PENDING_VERIFICATION',
    newStatus: 'PENDING_VERIFICATION',
    updatedBy: 'Kavita Sharma',
    updatedByRole: 'resident',
    remarks: 'Complaint lodged via Resident Portal',
    timestamp: '2026-10-30T09:15:00Z'
  },
  {
    timelineId: 'tm-02',
    complaintId: 'NN-2026-0001',
    action: 'APPROVED',
    previousStatus: 'PENDING_VERIFICATION',
    newStatus: 'APPROVED',
    updatedBy: 'Major Vikram Rathore (Retd.)',
    updatedByRole: 'admin',
    remarks: 'Water leakage confirmed by security guard.',
    timestamp: '2026-10-30T09:45:00Z'
  },
  {
    timelineId: 'tm-03',
    complaintId: 'NN-2026-0001',
    action: 'ASSIGNED',
    previousStatus: 'APPROVED',
    newStatus: 'ASSIGNED',
    updatedBy: 'Major Vikram Rathore (Retd.)',
    updatedByRole: 'admin',
    remarks: 'Assigned to Plumbing & Water Works (Ramesh - Plumber)',
    timestamp: '2026-10-30T10:00:00Z'
  },
  {
    timelineId: 'tm-04',
    complaintId: 'NN-2026-0001',
    action: 'IN_PROGRESS',
    previousStatus: 'ASSIGNED',
    newStatus: 'IN_PROGRESS',
    updatedBy: 'Major Vikram Rathore (Retd.)',
    updatedByRole: 'admin',
    remarks: 'Technician on-site isolating water supply valve to replace gasket.',
    timestamp: '2026-10-30T11:00:00Z'
  }
];

const DEFAULT_NOTIFICATIONS: InAppNotification[] = [
  {
    notificationId: 'notif-01',
    userId: 'resident-demo-uid',
    complaintId: 'NN-2026-0001',
    title: 'Work In Progress',
    message: 'Your complaint NN-2026-0001 is now In Progress with Plumbing Team.',
    readStatus: false,
    createdAt: '2026-10-30T11:00:00Z'
  },
  {
    notificationId: 'notif-02',
    userId: 'resident-demo-uid',
    complaintId: 'NN-2026-0002',
    title: 'Complaint Approved',
    message: 'Your complaint NN-2026-0002 has been approved by society admin.',
    readStatus: true,
    createdAt: '2026-10-30T11:15:00Z'
  }
];

class DemoDataService {
  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (!localStorage.getItem(STORAGE_KEYS.COMPLAINTS)) {
      this.resetDemoData();
    }
  }

  resetDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(DEFAULT_COMPLAINTS));
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(DEFAULT_TIMELINES));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(DEFAULT_TEAMS));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(DEFAULT_ANNOUNCEMENTS));
    localStorage.setItem(STORAGE_KEYS.CONFIRMATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.COUNTER, JSON.stringify({ lastNumber: 8, year: 2026 }));
    
    // Default current user is Resident
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
    
    eventEmitter.emit('COMPLAINTS_CHANGED');
    eventEmitter.emit('NOTIFICATIONS_CHANGED');
    eventEmitter.emit('AUTH_CHANGED');
  }

  // --- Auth & Users ---
  getCurrentUser(): UserRecord {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return DEFAULT_USERS[0];
  }

  setCurrentUser(user: UserRecord): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    eventEmitter.emit('AUTH_CHANGED', user);
  }

  getAllUsers(): UserRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : DEFAULT_USERS;
  }

  // --- Complaints ---
  getAllComplaints(): ComplaintRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    return raw ? JSON.parse(raw) : [];
  }

  getComplaintById(id: string): ComplaintRecord | null {
    const list = this.getAllComplaints();
    return list.find(c => c.complaintId === id) || null;
  }

  createComplaint(
    payload: Omit<ComplaintRecord, 'complaintId' | 'status' | 'createdAt' | 'updatedAt' | 'confirmationCounts'>
  ): ComplaintRecord {
    const list = this.getAllComplaints();
    const currentYear = new Date().getFullYear();

    // Atomic Counter
    const counterRaw = localStorage.getItem(STORAGE_KEYS.COUNTER);
    let counter = counterRaw ? JSON.parse(counterRaw) : { lastNumber: 8, year: currentYear };
    if (counter.year !== currentYear) {
      counter = { lastNumber: 0, year: currentYear };
    }
    counter.lastNumber += 1;
    localStorage.setItem(STORAGE_KEYS.COUNTER, JSON.stringify(counter));

    const newId = `NN-${currentYear}-${String(counter.lastNumber).padStart(4, '0')}`;
    const now = new Date().toISOString();

    const newRecord: ComplaintRecord = {
      ...payload,
      complaintId: newId,
      status: 'PENDING_VERIFICATION',
      createdAt: now,
      updatedAt: now,
      confirmationCounts: { stillExists: 0, resolved: 0 }
    };

    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(list));

    // Create Initial Timeline
    this.addTimelineEntry({
      timelineId: `tm-${Date.now()}`,
      complaintId: newId,
      action: 'SUBMITTED',
      previousStatus: 'PENDING_VERIFICATION',
      newStatus: 'PENDING_VERIFICATION',
      updatedBy: 'Resident',
      updatedByRole: 'resident',
      remarks: 'Complaint registered via Resident portal',
      timestamp: now
    });

    // Notify Resident
    this.addNotification({
      notificationId: `notif-${Date.now()}`,
      userId: payload.reporterId,
      complaintId: newId,
      title: 'Complaint Registered',
      message: `Your complaint ${newId} has been successfully logged and is pending admin verification.`,
      readStatus: false,
      createdAt: now
    });

    eventEmitter.emit('COMPLAINTS_CHANGED');
    eventEmitter.emit('NOTIFICATIONS_CHANGED');
    return newRecord;
  }

  updateComplaintStatus(
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
  ): void {
    const list = this.getAllComplaints();
    const index = list.findIndex(c => c.complaintId === complaintId);
    if (index === -1) return;

    const current = list[index];
    const prevStatus = current.status;
    const now = new Date().toISOString();

    const updated: ComplaintRecord = {
      ...current,
      status: newStatus,
      updatedAt: now
    };

    if (details.priority) updated.priority = details.priority;
    if (details.visibility) updated.visibility = details.visibility;
    if (details.teamId) updated.assignedTeamId = details.teamId;
    if (details.staffName) updated.assignedTo = details.staffName;
    if (details.eta) updated.expectedResolutionAt = details.eta;
    if (details.resolutionNote) {
      updated.resolutionNote = details.resolutionNote;
      updated.resolvedAt = now;
    }
    if (newStatus === 'REJECTED' && details.remarks) {
      updated.rejectionReason = details.remarks;
    }

    list[index] = updated;
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(list));

    // Append Timeline
    this.addTimelineEntry({
      timelineId: `tm-${Date.now()}`,
      complaintId,
      action: newStatus,
      previousStatus: prevStatus,
      newStatus,
      updatedBy: actor.name,
      updatedByRole: actor.role,
      remarks: details.remarks || details.resolutionNote || `Status updated to ${newStatus}`,
      timestamp: now
    });

    // Notify Reporter
    this.addNotification({
      notificationId: `notif-${Date.now()}`,
      userId: current.reporterId,
      complaintId,
      title: `Status: ${newStatus.replace('_', ' ')}`,
      message: `Complaint ${complaintId} status changed to ${newStatus.replace('_', ' ')}.`,
      readStatus: false,
      createdAt: now
    });

    eventEmitter.emit('COMPLAINTS_CHANGED');
    eventEmitter.emit('NOTIFICATIONS_CHANGED');
  }

  // --- Timelines ---
  getTimelineForComplaint(complaintId: string): TimelineEntry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TIMELINE);
    const list: TimelineEntry[] = raw ? JSON.parse(raw) : [];
    return list
      .filter(t => t.complaintId === complaintId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  private addTimelineEntry(entry: TimelineEntry): void {
    const raw = localStorage.getItem(STORAGE_KEYS.TIMELINE);
    const list: TimelineEntry[] = raw ? JSON.parse(raw) : [];
    list.push(entry);
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(list));
  }

  // --- Notifications ---
  getNotifications(userId: string): InAppNotification[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list: InAppNotification[] = raw ? JSON.parse(raw) : [];
    return list
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  markNotificationAsRead(notificationId: string): void {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list: InAppNotification[] = raw ? JSON.parse(raw) : [];
    const item = list.find(n => n.notificationId === notificationId);
    if (item) {
      item.readStatus = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
      eventEmitter.emit('NOTIFICATIONS_CHANGED');
    }
  }

  markAllNotificationsRead(userId: string): void {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list: InAppNotification[] = raw ? JSON.parse(raw) : [];
    list.forEach(n => {
      if (n.userId === userId) n.readStatus = true;
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    eventEmitter.emit('NOTIFICATIONS_CHANGED');
  }

  private addNotification(notif: InAppNotification): void {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list: InAppNotification[] = raw ? JSON.parse(raw) : [];
    list.unshift(notif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  }

  // --- Confirmations (Feed Voting) ---
  addConfirmation(complaintId: string, userId: string, type: 'STILL_EXISTS' | 'RESOLVED'): boolean {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIRMATIONS);
    const list: ResidentConfirmation[] = raw ? JSON.parse(raw) : [];

    // Check if user already confirmed
    const existing = list.find(c => c.complaintId === complaintId && c.userId === userId);
    if (existing) return false;

    list.push({
      confirmationId: `conf-${Date.now()}`,
      complaintId,
      userId,
      type,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.CONFIRMATIONS, JSON.stringify(list));

    // Update aggregate count on complaint
    const complaints = this.getAllComplaints();
    const comp = complaints.find(c => c.complaintId === complaintId);
    if (comp) {
      if (type === 'STILL_EXISTS') comp.confirmationCounts.stillExists += 1;
      if (type === 'RESOLVED') comp.confirmationCounts.resolved += 1;
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
      eventEmitter.emit('COMPLAINTS_CHANGED');
    }
    return true;
  }

  // --- Teams & Announcements ---
  getTeams(): MaintenanceTeam[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TEAMS);
    return raw ? JSON.parse(raw) : DEFAULT_TEAMS;
  }

  getAnnouncements(): CommunityAnnouncement[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return raw ? JSON.parse(raw) : DEFAULT_ANNOUNCEMENTS;
  }
}

export const demoDataService = new DemoDataService();

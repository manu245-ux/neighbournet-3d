import { 
  ComplaintRecord, 
  TimelineEntry, 
  ComplaintStatus, 
  PriorityLevel, 
  MaintenanceTeam, 
  CommunityAnnouncement 
} from '../types';
import { supabase, isSupabaseConfigured } from './supabase';
import { demoDataService } from './demoDataService';
import { eventEmitter } from './eventEmitter';

const USE_SUPABASE = isSupabaseConfigured && (import.meta.env.VITE_DATABASE_MODE === 'supabase' || !import.meta.env.VITE_DATABASE_MODE);

export const complaintService = {
  async getComplaints(): Promise<ComplaintRecord[]> {
    if (USE_SUPABASE && supabase) {
      try {
        const { data, error } = await supabase
          .from('complaints')
          .select('*')
          .order('createdAt', { ascending: false });

        if (!error && data && data.length > 0) {
          return data as ComplaintRecord[];
        }
      } catch (err) {
        console.warn('Supabase query error, using local fallback:', err);
      }
    }
    return demoDataService.getAllComplaints();
  },

  async getComplaintById(id: string): Promise<ComplaintRecord | null> {
    if (USE_SUPABASE && supabase) {
      try {
        const { data, error } = await supabase
          .from('complaints')
          .select('*')
          .eq('complaintId', id)
          .single();

        if (!error && data) {
          return data as ComplaintRecord;
        }
      } catch (err) {
        console.warn('Supabase getComplaintById error:', err);
      }
    }
    return demoDataService.getComplaintById(id);
  },

  async getTimeline(complaintId: string): Promise<TimelineEntry[]> {
    if (USE_SUPABASE && supabase) {
      try {
        const { data, error } = await supabase
          .from('complaint_timelines')
          .select('*')
          .eq('complaintId', complaintId)
          .order('timestamp', { ascending: true });

        if (!error && data && data.length > 0) {
          return data as TimelineEntry[];
        }
      } catch (err) {
        console.warn('Supabase getTimeline error:', err);
      }
    }
    return demoDataService.getTimelineForComplaint(complaintId);
  },

  async createComplaint(
    payload: Omit<ComplaintRecord, 'complaintId' | 'status' | 'createdAt' | 'updatedAt' | 'confirmationCounts'>
  ): Promise<ComplaintRecord> {
    if (USE_SUPABASE && supabase) {
      try {
        const currentYear = new Date().getFullYear();

        // 1. Fetch & increment atomic counter from Supabase
        const { data: counterData } = await supabase
          .from('counters')
          .select('lastNumber, year')
          .eq('name', 'complaints')
          .single();

        let nextNumber = 9;
        if (counterData) {
          nextNumber = counterData.lastNumber + 1;
          await supabase
            .from('counters')
            .update({ lastNumber: nextNumber, year: currentYear })
            .eq('name', 'complaints');
        }

        const newId = `NN-${currentYear}-${String(nextNumber).padStart(4, '0')}`;
        const now = new Date().toISOString();

        const newRecord: ComplaintRecord = {
          ...payload,
          complaintId: newId,
          status: 'PENDING_VERIFICATION',
          createdAt: now,
          updatedAt: now,
          confirmationCounts: { stillExists: 0, resolved: 0 },
          possibleDuplicateOf: payload.possibleDuplicateOf || []
        };

        // Insert into Supabase
        const { error: insertErr } = await supabase.from('complaints').insert([newRecord]);
        if (insertErr) {
          console.error('Supabase complaint insert failed:', insertErr);
          throw insertErr;
        }

        // Insert first timeline entry
        await supabase.from('complaint_timelines').insert([{
          timelineId: `tm-${Date.now()}`,
          complaintId: newId,
          action: 'SUBMITTED',
          previousStatus: 'PENDING_VERIFICATION',
          newStatus: 'PENDING_VERIFICATION',
          updatedBy: 'Resident',
          updatedByRole: 'resident',
          remarks: 'Complaint lodged via Resident Portal',
          timestamp: now
        }]);

        // Mirror to local memory as well
        demoDataService.createComplaint(payload);

        return newRecord;
      } catch (err) {
        console.warn('Supabase insert failed, committing locally:', err);
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
    if (USE_SUPABASE && supabase) {
      try {
        const now = new Date().toISOString();
        const updatePayload: any = {
          status: newStatus,
          updatedAt: now
        };

        if (details.priority) updatePayload.priority = details.priority;
        if (details.visibility) updatePayload.visibility = details.visibility;
        if (details.teamId) updatePayload.assignedTeamId = details.teamId;
        if (details.staffName) updatePayload.assignedTo = details.staffName;
        if (details.eta) updatePayload.expectedResolutionAt = details.eta;
        if (details.resolutionNote) {
          updatePayload.resolutionNote = details.resolutionNote;
          updatePayload.resolvedAt = now;
        }
        if (newStatus === 'REJECTED' && details.remarks) {
          updatePayload.rejectionReason = details.remarks;
        }

        await supabase
          .from('complaints')
          .update(updatePayload)
          .eq('complaintId', complaintId);

        await supabase
          .from('complaint_timelines')
          .insert([{
            timelineId: `tm-${Date.now()}`,
            complaintId,
            action: newStatus,
            previousStatus: 'ACTIVE',
            newStatus,
            updatedBy: actor.name,
            updatedByRole: actor.role,
            remarks: details.remarks || details.resolutionNote || `Status updated to ${newStatus}`,
            timestamp: now
          }]);
      } catch (err) {
        console.warn('Supabase updateStatus failed:', err);
      }
    }

    demoDataService.updateComplaintStatus(complaintId, newStatus, actor, details);
  },

  subscribeToComplaints(callback: (complaints: ComplaintRecord[]) => void): () => void {
    if (USE_SUPABASE && supabase) {
      // 1. Initial fetch from Supabase
      this.getComplaints().then(list => callback(list));

      // 2. Real-time WebSocket channel subscription
      const channel = supabase
        .channel('public:complaints')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'complaints' },
          async () => {
            const fresh = await this.getComplaints();
            callback(fresh);
          }
        )
        .subscribe();

      return () => {
        if (supabase) {
          supabase.removeChannel(channel);
        }
      };
    }

    const handleUpdate = () => callback(demoDataService.getAllComplaints());
    eventEmitter.on('COMPLAINTS_CHANGED', handleUpdate);
    callback(demoDataService.getAllComplaints());
    return () => eventEmitter.off('COMPLAINTS_CHANGED', handleUpdate);
  },

  addConfirmation(complaintId: string, userId: string, type: 'STILL_EXISTS' | 'RESOLVED'): boolean {
    return demoDataService.addConfirmation(complaintId, userId, type);
  },

  getTeams(): MaintenanceTeam[] {
    return demoDataService.getTeams();
  },

  getAnnouncements(): CommunityAnnouncement[] {
    return demoDataService.getAnnouncements();
  },

  resetDemoData(): void {
    demoDataService.resetDemoData();
  }
};

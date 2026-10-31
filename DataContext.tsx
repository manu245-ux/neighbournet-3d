import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  ComplaintRecord, 
  InAppNotification, 
  MaintenanceTeam, 
  CommunityAnnouncement,
  ComplaintStatus,
  PriorityLevel
} from '../types';
import { complaintService } from '../services/complaintService';
import { demoDataService } from '../services/demoDataService';
import { eventEmitter } from '../services/eventEmitter';
import { useAuth } from './AuthContext';

interface DataContextType {
  complaints: ComplaintRecord[];
  notifications: InAppNotification[];
  unreadNotificationCount: number;
  teams: MaintenanceTeam[];
  announcements: CommunityAnnouncement[];
  createComplaint: (payload: Omit<ComplaintRecord, 'complaintId' | 'status' | 'createdAt' | 'updatedAt' | 'confirmationCounts'>) => Promise<ComplaintRecord>;
  updateStatus: (
    complaintId: string, 
    newStatus: ComplaintStatus, 
    details: { 
      remarks?: string; 
      teamId?: string; 
      staffName?: string; 
      eta?: string; 
      resolutionNote?: string; 
      priority?: PriorityLevel;
      visibility?: 'public' | 'private';
    }
  ) => Promise<void>;
  addConfirmation: (complaintId: string, type: 'STILL_EXISTS' | 'RESOLVED') => boolean;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
  const [announcements, setAnnouncements] = useState<CommunityAnnouncement[]>([]);

  // Load complaints via subscription
  useEffect(() => {
    const unsubscribe = complaintService.subscribeToComplaints((list) => {
      setComplaints([...list]);
    });
    setTeams(complaintService.getTeams());
    setAnnouncements(complaintService.getAnnouncements());
    return () => unsubscribe();
  }, []);

  // Notifications listener
  useEffect(() => {
    const refreshNotifications = () => {
      if (currentUser?.userId) {
        const notifs = demoDataService.getNotifications(currentUser.userId);
        setNotifications([...notifs]);
      }
    };

    refreshNotifications();
    eventEmitter.on('NOTIFICATIONS_CHANGED', refreshNotifications);
    return () => eventEmitter.off('NOTIFICATIONS_CHANGED', refreshNotifications);
  }, [currentUser]);

  const unreadNotificationCount = notifications.filter(n => !n.readStatus).length;

  const createComplaint = async (
    payload: Omit<ComplaintRecord, 'complaintId' | 'status' | 'createdAt' | 'updatedAt' | 'confirmationCounts'>
  ) => {
    return await complaintService.createComplaint(payload);
  };

  const updateStatus = async (
    complaintId: string, 
    newStatus: ComplaintStatus, 
    details: { 
      remarks?: string; 
      teamId?: string; 
      staffName?: string; 
      eta?: string; 
      resolutionNote?: string; 
      priority?: PriorityLevel;
      visibility?: 'public' | 'private';
    }
  ) => {
    await complaintService.updateStatus(
      complaintId,
      newStatus,
      { name: currentUser.name, role: currentUser.role },
      details
    );
  };

  const addConfirmation = (complaintId: string, type: 'STILL_EXISTS' | 'RESOLVED') => {
    return complaintService.addConfirmation(complaintId, currentUser.userId, type);
  };

  const markNotificationRead = (notificationId: string) => {
    demoDataService.markNotificationAsRead(notificationId);
  };

  const markAllNotificationsRead = () => {
    demoDataService.markAllNotificationsRead(currentUser.userId);
  };

  const resetDemoData = () => {
    complaintService.resetDemoData();
  };

  return (
    <DataContext.Provider
      value={{
        complaints,
        notifications,
        unreadNotificationCount,
        teams,
        announcements,
        createComplaint,
        updateStatus,
        addConfirmation,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

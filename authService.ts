import { UserRecord } from '../types';
import { demoDataService } from './demoDataService';
import { eventEmitter } from './eventEmitter';

export const authService = {
  getCurrentUser(): UserRecord {
    return demoDataService.getCurrentUser();
  },

  async login(email: string): Promise<UserRecord> {
    const users = demoDataService.getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('User not found. Use one of the Demo presets or register.');
    }
    demoDataService.setCurrentUser(user);
    return user;
  },

  loginAsResidentDemo(): UserRecord {
    const users = demoDataService.getAllUsers();
    const resident = users.find(u => u.role === 'resident') || users[0];
    demoDataService.setCurrentUser(resident);
    return resident;
  },

  loginAsAdminDemo(): UserRecord {
    const users = demoDataService.getAllUsers();
    const admin = users.find(u => u.role === 'admin') || users[1];
    demoDataService.setCurrentUser(admin);
    return admin;
  },

  async registerResident(data: {
    name: string;
    email: string;
    phone: string;
    building: string;
    apartmentNumber: string;
  }): Promise<UserRecord> {
    const newUser: UserRecord = {
      userId: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'resident',
      building: data.building,
      apartmentNumber: data.apartmentNumber,
      createdAt: new Date().toISOString()
    };

    demoDataService.setCurrentUser(newUser);
    return newUser;
  },

  async logout(): Promise<void> {
    // Revert to demo resident on logout
    const resident = this.loginAsResidentDemo();
    eventEmitter.emit('AUTH_CHANGED', resident);
  },

  subscribeToAuth(callback: (user: UserRecord) => void): () => void {
    const handleAuth = (user?: UserRecord) => {
      callback(user || demoDataService.getCurrentUser());
    };
    eventEmitter.on('AUTH_CHANGED', handleAuth);
    callback(demoDataService.getCurrentUser());
    return () => eventEmitter.off('AUTH_CHANGED', handleAuth);
  }
};

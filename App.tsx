import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LandingPage, LoginPage, NotFoundPage } from './pages/PlaceholderPages';
import { SocietyMapView } from './pages/SocietyMapView';
import { FloorIssueView } from './pages/FloorIssueView';
import { ReportComplaintPage } from './pages/ReportComplaintPage';
import { ComplaintDetailPage } from './pages/ComplaintDetailPage';
import { ResidentDashboard } from './pages/ResidentDashboard';
import { CommunityFeedPage } from './pages/CommunityFeedPage';
import { NotificationCenterPage } from './pages/NotificationCenterPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminComplaintTable } from './pages/AdminComplaintTable';
import { AdminComplaintReview } from './pages/AdminComplaintReview';

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/map" element={<SocietyMapView />} />
                <Route path="/map/floor/:floorId" element={<FloorIssueView />} />
                <Route path="/report" element={<ReportComplaintPage />} />
                <Route path="/complaint/:id" element={<ComplaintDetailPage />} />
                
                {/* Fallbacks for routes mapped in subsequent steps */}
                <Route path="/dashboard" element={<ResidentDashboard />} />
                <Route path="/feed" element={<CommunityFeedPage />} />
                <Route path="/notifications" element={<NotificationCenterPage />} />
                {/* Protected Admin Console Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/complaints"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminComplaintTable />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/review/:id"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminComplaintReview />
                    </ProtectedRoute>
                  }
                />
                
                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

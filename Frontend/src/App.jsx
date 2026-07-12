import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet';

// Context
import { AuthProvider } from './context/AuthContext';
import { MockStateProvider } from './context/MockStateContext';
import ProtectedRoute, { RoleProtectedRoute } from './components/auth/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/Landing/LandingPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import ManagerDashboard from './pages/Dashboard/ManagerDashboard';
import HeadDashboard from './pages/Dashboard/HeadDashboard';
import EmployeeDashboard from './pages/Dashboard/EmployeeDashboard';
import DashboardRouter from './pages/Dashboard/DashboardRouter';
import Departments from './pages/Departments/Departments';
import Employees from './pages/Employees/Employees';
import Categories from './pages/Categories/Categories';
import AssetList from './pages/Assets/AssetList';
import AssetRegistration from './pages/Assets/AssetRegistration';
import AssetDetails from './pages/Assets/AssetDetails';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';

// New Extension Pages
import AllocationDashboard from './pages/Allocation/AllocationDashboard';
import AllocationDetails from './pages/Allocation/AllocationDetails';
import TransfersPage from './pages/Transfers/TransfersPage';
import ReturnsPage from './pages/Returns/ReturnsPage';
import BookingsPage from './pages/Bookings/BookingsPage';
import MaintenancePage from './pages/Maintenance/MaintenancePage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import ActivityPage from './pages/Activity/ActivityPage';
import AuditPage from './pages/Audit/AuditPage';
import ReportsPage from './pages/Reports/ReportsPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import TimelinePage from './pages/Timeline/TimelinePage';
import HealthPage from './pages/Health/HealthPage';
import QrPage from './pages/Qr/QrPage';

// Version 4 Innovation Pages
import InnovationHub from './pages/Innovation/InnovationHub';
import HealthCenter from './pages/Innovation/HealthCenter';
import AssetCare from './pages/Innovation/AssetCare';
import DigitalTwin from './pages/Innovation/DigitalTwin';
import RecommendationsV4 from './pages/Innovation/RecommendationsV4';
import IdleAssetsV4 from './pages/Innovation/IdleAssetsV4';
import CostSavingV4 from './pages/Innovation/CostSavingV4';
import Sustainability from './pages/Innovation/Sustainability';
import WarrantyV4 from './pages/Innovation/WarrantyV4';
import AssetPassport from './pages/Innovation/AssetPassport';
import ExecutiveDashboard from './pages/Innovation/ExecutiveDashboard';
import FutureInsights from './pages/Innovation/FutureInsights';

// Global V4 launcher widget
import { InnovationLauncher } from './components/ui/innovation/InnovationComponents';

// Setup React Query client
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MockStateProvider>
          <BrowserRouter>
          {/* SEO Helmet Defaults */}
          <Helmet>
            <title>AssetFlow - Enterprise Asset & Resource Management System</title>
            <meta name="description" content="Manage hardware lifecycle, assignments, departments, and operations securely in AssetFlow ERP." />
          </Helmet>

          {/* Toast feedback system */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#0b0f19',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '12px',
                borderRadius: '12px'
              }
            }}
          />

          <Routes>
            {/* Public Layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<LandingPage />} />
            </Route>

            {/* Auth Layout */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Dashboard Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardRouter />} />
              <Route path="admin" element={<RoleProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></RoleProtectedRoute>} />
              <Route path="manager" element={<RoleProtectedRoute allowedRoles={['Asset Manager']}><ManagerDashboard /></RoleProtectedRoute>} />
              <Route path="head" element={<RoleProtectedRoute allowedRoles={['Department Head']}><HeadDashboard /></RoleProtectedRoute>} />
              <Route path="employee" element={<RoleProtectedRoute allowedRoles={['Employee']}><EmployeeDashboard /></RoleProtectedRoute>} />
              <Route path="departments" element={<RoleProtectedRoute allowedRoles={['Admin']}><Departments /></RoleProtectedRoute>} />
              <Route path="employees" element={<RoleProtectedRoute allowedRoles={['Admin']}><Employees /></RoleProtectedRoute>} />
              <Route path="categories" element={<RoleProtectedRoute allowedRoles={['Admin', 'Asset Manager']}><Categories /></RoleProtectedRoute>} />
              <Route path="assets" element={<AssetList />} />
              <Route path="assets/new" element={<RoleProtectedRoute allowedRoles={['Admin', 'Asset Manager']}><AssetRegistration /></RoleProtectedRoute>} />
              <Route path="assets/:id" element={<AssetDetails />} />
              <Route path="profile" element={<Profile />} />
              
              {/* Extensions */}
              <Route path="allocation" element={<AllocationDashboard />} />
              <Route path="allocation/:id" element={<AllocationDetails />} />
              <Route path="transfers" element={<TransfersPage />} />
              <Route path="returns" element={<ReturnsPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="maintenance" element={<MaintenancePage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="activity" element={<ActivityPage />} />
              <Route path="audit" element={<AuditPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="timeline" element={<TimelinePage />} />
              <Route path="health" element={<HealthPage />} />
              <Route path="recommendations" element={<RecommendationsV4 />} />
              <Route path="qr" element={<QrPage />} />
              <Route path="idle-assets" element={<IdleAssetsV4 />} />
              <Route path="warranty" element={<WarrantyV4 />} />
              <Route path="cost-saving" element={<CostSavingV4 />} />

              {/* Version 4 Innovation Routes */}
              <Route path="innovation" element={<InnovationHub />} />
              <Route path="health-center" element={<HealthCenter />} />
              <Route path="asset-care" element={<AssetCare />} />
              <Route path="digital-twin" element={<DigitalTwin />} />
              <Route path="sustainability" element={<Sustainability />} />
              <Route path="asset-passport" element={<AssetPassport />} />
              <Route path="executive-dashboard" element={<ExecutiveDashboard />} />
              <Route path="future-insights" element={<FutureInsights />} />
            </Route>

            {/* Fallback 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <InnovationLauncher />
        </BrowserRouter>
        </MockStateProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet';

// Context
import { MockStateProvider } from './context/MockStateContext';

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
import Departments from './pages/Departments/Departments';
import Employees from './pages/Employees/Employees';
import Categories from './pages/Categories/Categories';
import AssetList from './pages/Assets/AssetList';
import AssetRegistration from './pages/Assets/AssetRegistration';
import AssetDetails from './pages/Assets/AssetDetails';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';

// Setup React Query client
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="departments" element={<Departments />} />
              <Route path="employees" element={<Employees />} />
              <Route path="categories" element={<Categories />} />
              <Route path="assets" element={<AssetList />} />
              <Route path="assets/new" element={<AssetRegistration />} />
              <Route path="assets/:id" element={<AssetDetails />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Fallback 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MockStateProvider>
    </QueryClientProvider>
  );
}

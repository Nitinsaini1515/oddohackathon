import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/ui/sidebar/Sidebar';
import Navbar from '../components/ui/navbar/Navbar';
import Breadcrumbs from '../components/ui/common/Breadcrumbs';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Toggle sidebar helper
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#060816]">
      {/* Collapsible Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Navbar */}
        <Navbar onMenuToggle={handleSidebarToggle} sidebarOpen={sidebarOpen} />

        {/* Dynamic Inner Page */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scrollbar bg-gradient-radial from-[#060816] to-[#0a0d1f]">
          {/* Breadcrumbs for visual hierarchy */}
          <Breadcrumbs className="mb-5" />

          {/* Render children views */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

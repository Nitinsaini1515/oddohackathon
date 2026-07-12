import React from 'react';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#060816] text-white flex flex-col">
      {/* Wrapper to allow seamless outlets */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

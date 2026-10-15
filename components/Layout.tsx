import React from 'react';
import Sidebar from '../components/Sidebar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default Layout;

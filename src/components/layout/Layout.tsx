
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DashboardStats from '@/components/dashboard/DashboardStats';
import AttendanceSheet from '@/components/teacher/AttendanceSheet';
import AttendanceReport from '@/components/student/AttendanceReport';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (user?.role === 'admin') {
          return <AdminDashboard />;
        }
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Welcome, {user?.name} / স্বাগতম, {user?.name}
            </h2>
            <DashboardStats />
          </div>
        );
      
      case 'mark-attendance':
        return <AttendanceSheet />;
      
      case 'my-attendance':
        return <AttendanceReport />;
      
      case 'attendance-summary':
        return <AttendanceReport />;
      
      case 'students':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Students Management</h2>
            <p className="text-gray-600">Student management features will be implemented here.</p>
          </div>
        );
      
      case 'teachers':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Teachers Management</h2>
            <p className="text-gray-600">Teacher management features will be implemented here.</p>
          </div>
        );
      
      case 'classes':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Classes Management</h2>
            <p className="text-gray-600">Class management features will be implemented here.</p>
          </div>
        );
      
      case 'my-classes':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Classes / আমার ক্লাস</h2>
            <p className="text-gray-600">Your class information will be displayed here.</p>
          </div>
        );
      
      case 'attendance':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Attendance Management</h2>
            <p className="text-gray-600">Comprehensive attendance management features will be implemented here.</p>
          </div>
        );
      
      case 'reports':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Reports / রিপোর্ট</h2>
            <p className="text-gray-600">Detailed reports and analytics will be available here.</p>
          </div>
        );
      
      case 'attendance-reports':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Attendance Reports</h2>
            <p className="text-gray-600">Teacher attendance reports will be displayed here.</p>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Notifications / বিজ্ঞপ্তি</h2>
            <p className="text-gray-600">Notification management features will be implemented here.</p>
          </div>
        );
      
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Settings / সেটিংস</h2>
            <p className="text-gray-600">System settings and configuration options will be available here.</p>
          </div>
        );
      
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Welcome, {user?.name} / স্বাগতম, {user?.name}
            </h2>
            <DashboardStats />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Layout;

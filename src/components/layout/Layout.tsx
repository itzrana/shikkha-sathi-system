
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DashboardStats from '@/components/dashboard/DashboardStats';
import AttendanceSheet from '@/components/teacher/AttendanceSheet';
import AttendanceReport from '@/components/student/AttendanceReport';
import AdminDashboard from '@/components/admin/AdminDashboard';
import StudentManagement from '@/components/admin/StudentManagement';
import TeacherManagement from '@/components/admin/TeacherManagement';
import ClassManagement from '@/components/admin/ClassManagement';
import AttendanceManagement from '@/components/admin/AttendanceManagement';

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
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
              <h2 className="text-3xl font-bold mb-2">
                Welcome, {user?.name} / স্বাগতম, {user?.name}
              </h2>
              <p className="text-blue-100 text-lg">
                Have a great day managing your attendance!
              </p>
            </div>
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
        return <StudentManagement />;
      
      case 'teachers':
        return <TeacherManagement />;
      
      case 'classes':
        return <ClassManagement />;
      
      case 'attendance':
        return <AttendanceManagement />;
      
      case 'my-classes':
        return (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">My Classes / আমার ক্লাস</h2>
            <p className="text-gray-600 text-lg">Your class information will be displayed here.</p>
          </div>
        );
      
      case 'reports':
        return (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Reports / রিপোর্ট</h2>
            <p className="text-gray-600 text-lg">Detailed reports and analytics will be available here.</p>
          </div>
        );
      
      case 'attendance-reports':
        return (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Attendance Reports</h2>
            <p className="text-gray-600 text-lg">Teacher attendance reports will be displayed here.</p>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Notifications / বিজ্ঞপ্তি</h2>
            <p className="text-gray-600 text-lg">Notification management features will be implemented here.</p>
          </div>
        );
      
      case 'settings':
        return (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Settings / সেটিংস</h2>
            <p className="text-gray-600 text-lg">System settings and configuration options will be available here.</p>
          </div>
        );
      
      default:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
              <h2 className="text-3xl font-bold mb-2">
                Welcome, {user?.name} / স্বাগতম, {user?.name}
              </h2>
              <p className="text-blue-100 text-lg">
                Have a great day managing your attendance!
              </p>
            </div>
            <DashboardStats />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Layout;


import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DashboardStats from '@/components/dashboard/DashboardStats';
import AttendanceSheet from '@/components/teacher/AttendanceSheet';
import AttendanceReport from '@/components/student/AttendanceReport';
import AttendanceSummary from '@/components/student/AttendanceSummary';
import AdminDashboard from '@/components/admin/AdminDashboard';
import StudentManagement from '@/components/admin/StudentManagement';
import TeacherManagement from '@/components/admin/TeacherManagement';
import ClassManagement from '@/components/admin/ClassManagement';
import AttendanceManagement from '@/components/admin/AttendanceManagement';
import RegistrationRequests from '@/components/admin/RegistrationRequests';
import NotificationManagement from '@/components/admin/NotificationManagement';
import ReportsPage from '@/components/admin/ReportsPage';
import SettingsPage from '@/components/admin/SettingsPage';

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
                স্বাগতম, {user?.name} / Welcome, {user?.name}
              </h2>
              <p className="text-blue-100 text-lg">
                {user?.role === 'teacher' 
                  ? 'আজকের ক্লাস এবং উপস্থিতি ব্যবস্থাপনা করুন!'
                  : 'আপনার উপস্থিতি এবং একাডেমিক অগ্রগতি দেখুন!'
                }
              </p>
            </div>
            <DashboardStats />
          </div>
        );
      
      case 'registration-requests':
        return <RegistrationRequests />;
      
      case 'mark-attendance':
        return <AttendanceSheet />;
      
      case 'my-attendance':
        return <AttendanceReport />;
      
      case 'attendance-summary':
        return <AttendanceSummary />;
      
      case 'students':
        return <StudentManagement />;
      
      case 'teachers':
        return <TeacherManagement />;
      
      case 'classes':
        return <ClassManagement />;
      
      case 'attendance':
        return <AttendanceManagement />;
      
      case 'notifications':
        return <NotificationManagement />;
      
      case 'reports':
        return <ReportsPage />;
      
      case 'settings':
        return <SettingsPage />;
      
      case 'my-classes':
        return (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">আমার ক্লাসগুলি / My Classes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">ক্লাস ৬ / Class 6</h3>
                <p className="text-blue-600">শিক্ষার্থী: ৩৫ জন</p>
                <p className="text-blue-600">বিষয়: গণিত</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <h3 className="text-xl font-semibold text-green-800 mb-2">ক্লাস ৭ / Class 7</h3>
                <p className="text-green-600">শিক্ষার্থী: ৪০ জন</p>
                <p className="text-green-600">বিষয়: গণিত</p>
              </div>
            </div>
          </div>
        );
      
      case 'attendance-reports':
        return (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">উপস্থিতি রিপোর্ট / Attendance Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">আজকের উপস্থিতি</h3>
                <p className="text-purple-600">মোট: ৭৫ জন</p>
                <p className="text-purple-600">উপস্থিত: ৭২ জন</p>
                <p className="text-purple-600">অনুপস্থিত: ৩ জন</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">সাপ্তাহিক গড়</h3>
                <p className="text-orange-600">উপস্থিতির হার: ৯৬%</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
              <h2 className="text-3xl font-bold mb-2">
                স্বাগতম, {user?.name} / Welcome, {user?.name}
              </h2>
              <p className="text-blue-100 text-lg">
                আপনার দৈনন্দিন কার্যক্রম পরিচালনা করুন!
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

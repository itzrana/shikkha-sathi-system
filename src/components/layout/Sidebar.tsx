
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  BookOpen, 
  UserCheck,
  FileText,
  Bell,
  UserPlus
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard / ড্যাশবোর্ড', icon: Home },
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...commonItems,
          { id: 'registration-requests', label: 'Registration Requests / নিবন্ধন আবেদন', icon: UserPlus },
          { id: 'students', label: 'Students / শিক্ষার্থী', icon: Users },
          { id: 'teachers', label: 'Teachers / শিক্ষক', icon: UserCheck },
          { id: 'classes', label: 'Classes / ক্লাস', icon: BookOpen },
          { id: 'attendance', label: 'Attendance / উপস্থিতি', icon: Calendar },
          { id: 'reports', label: 'Reports / রিপোর্ট', icon: BarChart3 },
          { id: 'notifications', label: 'Notifications / বিজ্ঞপ্তি', icon: Bell },
          { id: 'settings', label: 'Settings / সেটিংস', icon: Settings },
        ];
      
      case 'teacher':
        return [
          ...commonItems,
          { id: 'my-classes', label: 'My Classes / আমার ক্লাস', icon: BookOpen },
          { id: 'mark-attendance', label: 'Mark Attendance / উপস্থিতি নেওয়া', icon: Calendar },
          { id: 'attendance-reports', label: 'Attendance Reports / রিপোর্ট', icon: BarChart3 },
          { id: 'students', label: 'My Students / আমার শিক্ষার্থী', icon: Users },
        ];
      
      case 'student':
        return [
          ...commonItems,
          { id: 'my-attendance', label: 'My Attendance / আমার উপস্থিতি', icon: Calendar },
          { id: 'attendance-summary', label: 'Attendance Summary / সংক্ষিপ্ত রিপোর্ট', icon: BarChart3 },
          { id: 'notifications', label: 'Notifications / বিজ্ঞপ্তি', icon: Bell },
        ];
      
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-gradient-to-b from-gray-50 to-white shadow-xl border-r border-gray-200/50 min-h-screen">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Menu / মেনু</h2>
          <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start text-left h-12 font-medium transition-all duration-300 group',
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm'
              )}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                activeTab === item.id ? "text-white" : "text-gray-600 group-hover:text-blue-600"
              )} />
              <span className="truncate">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;


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
  Bell
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
    <div className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Menu / মেনু</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start text-left',
                activeTab === item.id && 'bg-blue-600 text-white'
              )}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, CheckCircle, XCircle, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardStats: React.FC = () => {
  const { user } = useAuth();

  const getStatsForRole = () => {
    switch (user?.role) {
      case 'admin':
        return [
          {
            title: 'Total Students / মোট শিক্ষার্থী',
            value: '1,234',
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
            iconBg: 'bg-blue-100',
            change: '+12%'
          },
          {
            title: 'Total Teachers / মোট শিক্ষক',
            value: '56',
            icon: Users,
            color: 'text-emerald-600',
            bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            iconBg: 'bg-emerald-100',
            change: '+3%'
          },
          {
            title: 'Classes Today / আজকের ক্লাস',
            value: '32',
            icon: Calendar,
            color: 'text-purple-600',
            bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
            iconBg: 'bg-purple-100',
            change: '+5%'
          },
          {
            title: 'Present Today / আজ উপস্থিত',
            value: '1,089',
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
            iconBg: 'bg-green-100',
            change: '+8%'
          }
        ];
      
      case 'teacher':
        return [
          {
            title: 'My Classes / আমার ক্লাস',
            value: '5',
            icon: Calendar,
            color: 'text-blue-600',
            bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
            iconBg: 'bg-blue-100',
            change: '+2%'
          },
          {
            title: 'Total Students / মোট শিক্ষার্থী',
            value: '150',
            icon: Users,
            color: 'text-emerald-600',
            bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            iconBg: 'bg-emerald-100',
            change: '+5%'
          },
          {
            title: 'Present Today / আজ উপস্থিত',
            value: '142',
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
            iconBg: 'bg-green-100',
            change: '+3%'
          },
          {
            title: 'Absent Today / আজ অনুপস্থিত',
            value: '8',
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-gradient-to-br from-red-500 to-red-600',
            iconBg: 'bg-red-100',
            change: '-2%'
          }
        ];
      
      case 'student':
        return [
          {
            title: 'Attendance Rate / উপস্থিতির হার',
            value: '94%',
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
            iconBg: 'bg-green-100',
            change: '+2%'
          },
          {
            title: 'Present Days / উপস্থিত দিন',
            value: '156',
            icon: CheckCircle,
            color: 'text-blue-600',
            bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
            iconBg: 'bg-blue-100',
            change: '+15'
          },
          {
            title: 'Absent Days / অনুপস্থিত দিন',
            value: '10',
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-gradient-to-br from-red-500 to-red-600',
            iconBg: 'bg-red-100',
            change: '-3'
          },
          {
            title: 'Late Days / দেরি দিন',
            value: '3',
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
            iconBg: 'bg-yellow-100',
            change: '-1'
          }
        ];
      
      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <div className="flex items-center space-x-2">
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    stat.change.startsWith('+') 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.iconBg} shadow-sm`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.bgColor}`}></div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;

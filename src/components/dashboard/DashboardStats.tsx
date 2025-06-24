
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, CheckCircle, XCircle } from 'lucide-react';
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
            color: 'text-blue-600'
          },
          {
            title: 'Total Teachers / মোট শিক্ষক',
            value: '56',
            icon: Users,
            color: 'text-green-600'
          },
          {
            title: 'Classes Today / আজকের ক্লাস',
            value: '32',
            icon: Calendar,
            color: 'text-purple-600'
          },
          {
            title: 'Present Today / আজ উপস্থিত',
            value: '1,089',
            icon: CheckCircle,
            color: 'text-green-600'
          }
        ];
      
      case 'teacher':
        return [
          {
            title: 'My Classes / আমার ক্লাস',
            value: '5',
            icon: Calendar,
            color: 'text-blue-600'
          },
          {
            title: 'Total Students / মোট শিক্ষার্থী',
            value: '150',
            icon: Users,
            color: 'text-green-600'
          },
          {
            title: 'Present Today / আজ উপস্থিত',
            value: '142',
            icon: CheckCircle,
            color: 'text-green-600'
          },
          {
            title: 'Absent Today / আজ অনুপস্থিত',
            value: '8',
            icon: XCircle,
            color: 'text-red-600'
          }
        ];
      
      case 'student':
        return [
          {
            title: 'Attendance Rate / উপস্থিতির হার',
            value: '94%',
            icon: CheckCircle,
            color: 'text-green-600'
          },
          {
            title: 'Present Days / উপস্থিত দিন',
            value: '156',
            icon: CheckCircle,
            color: 'text-blue-600'
          },
          {
            title: 'Absent Days / অনুপস্থিত দিন',
            value: '10',
            icon: XCircle,
            color: 'text-red-600'
          },
          {
            title: 'Late Days / দেরি দিন',
            value: '3',
            icon: Calendar,
            color: 'text-yellow-600'
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
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;

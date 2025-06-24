
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Download, 
  Search,
  Filter,
  TrendingUp,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data
  const todayStats = {
    totalStudents: 1234,
    totalTeachers: 56,
    classesToday: 32,
    presentToday: 1089,
    absentToday: 145,
    lateToday: 23,
    attendanceRate: 88.2
  };

  const weeklyData = [
    { day: 'Mon', present: 1120, absent: 114, late: 20 },
    { day: 'Tue', present: 1098, absent: 136, late: 18 },
    { day: 'Wed', present: 1156, absent: 78, late: 15 },
    { day: 'Thu', present: 1089, absent: 145, late: 23 },
    { day: 'Fri', present: 1201, absent: 33, late: 12 },
  ];

  const classAttendance = [
    { class: 'Class 6-A', totalStudents: 45, present: 42, absent: 3, rate: 93.3 },
    { class: 'Class 6-B', totalStudents: 43, present: 38, absent: 5, rate: 88.4 },
    { class: 'Class 7-A', totalStudents: 48, present: 45, absent: 3, rate: 93.8 },
    { class: 'Class 7-B', totalStudents: 46, present: 41, absent: 5, rate: 89.1 },
    { class: 'Class 8-A', totalStudents: 44, present: 40, absent: 4, rate: 90.9 },
  ];

  const recentAbsences = [
    { student: 'আহমেদ করিম', class: 'Class 6-A', date: '2024-06-24', reason: 'Sick' },
    { student: 'ফাতিমা খাতুন', class: 'Class 7-B', date: '2024-06-24', reason: 'Family emergency' },
    { student: 'রহিম উদ্দিন', class: 'Class 8-A', date: '2024-06-24', reason: 'Medical appointment' },
    { student: 'সালমা বেগম', class: 'Class 6-B', date: '2024-06-24', reason: 'Personal' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Dashboard / প্রশাসনিক ড্যাশবোর্ড</h2>
        <div className="flex space-x-4">
          <Input
            placeholder="Search students, teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Present Today</p>
                <p className="text-2xl font-bold text-green-600">{todayStats.presentToday}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Absent Today</p>
                <p className="text-2xl font-bold text-red-600">{todayStats.absentToday}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Late Today</p>
                <p className="text-2xl font-bold text-yellow-600">{todayStats.lateToday}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-blue-600">{todayStats.attendanceRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Attendance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Attendance Trend / সাপ্তাহিক উপস্থিতির ধারা</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#10B981" name="Present" />
              <Bar dataKey="absent" fill="#EF4444" name="Absent" />
              <Bar dataKey="late" fill="#F59E0B" name="Late" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Class-wise Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Class-wise Attendance / ক্লাসভিত্তিক উপস্থিতি</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classAttendance.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{item.class}</h4>
                    <p className="text-sm text-gray-600">
                      Present: {item.present}/{item.totalStudents}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{item.rate}%</p>
                    <Badge variant={item.rate >= 90 ? 'default' : 'destructive'}>
                      {item.rate >= 90 ? 'Good' : 'Needs Attention'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Absences / সাম্প্রতিক অনুপস্থিতি</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAbsences.map((absence, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{absence.student}</h4>
                    <p className="text-sm text-gray-600">{absence.class}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{absence.date}</p>
                    <Badge variant="outline">{absence.reason}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions / দ্রুত কার্যক্রম</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 text-left justify-start">
              <div>
                <div className="font-medium">Generate Report</div>
                <div className="text-sm opacity-70">Create attendance reports</div>
              </div>
            </Button>
            <Button variant="outline" className="h-20 text-left justify-start">
              <div>
                <div className="font-medium">Send Notifications</div>
                <div className="text-sm opacity-70">Notify parents about absences</div>
              </div>
            </Button>
            <Button variant="outline" className="h-20 text-left justify-start">
              <div>
                <div className="font-medium">Manage Classes</div>
                <div className="text-sm opacity-70">Add or edit class information</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

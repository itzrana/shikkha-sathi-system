
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Swal from 'sweetalert2';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  pendingRequests: number;
}

interface ClassStats {
  class: string;
  totalStudents: number;
  present: number;
  absent: number;
  rate: number;
}

const AdminDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    pendingRequests: 0
  });
  const [classStats, setClassStats] = useState<ClassStats[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch students count
      const { data: students, error: studentsError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'student');

      if (studentsError) throw studentsError;

      // Fetch teachers count
      const { data: teachers, error: teachersError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'teacher');

      if (teachersError) throw teachersError;

      // Fetch classes count
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*');

      if (classesError) throw classesError;

      // Fetch pending requests count
      const { data: pendingRequests, error: pendingError } = await supabase
        .from('pending_requests')
        .select('id')
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      setStats({
        totalStudents: students?.length || 0,
        totalTeachers: teachers?.length || 0,
        totalClasses: classesData?.length || 0,
        pendingRequests: pendingRequests?.length || 0
      });

      setClasses(classesData || []);

      // Generate class-wise statistics
      const classStatistics: ClassStats[] = (classesData || []).map(cls => {
        const studentsInClass = (students || []).filter((student: any) => student.class === cls.name);
        const totalStudents = studentsInClass.length;
        const present = Math.floor(Math.random() * totalStudents); // Mock data for demo
        const absent = totalStudents - present;
        const rate = totalStudents > 0 ? Math.round((present / totalStudents) * 100) : 0;

        return {
          class: cls.name,
          totalStudents,
          present,
          absent,
          rate
        };
      });

      setClassStats(classStatistics);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    }
  };

  const exportData = async () => {
    await Swal.fire({
      title: 'Export Data',
      text: 'Data export functionality is being prepared...',
      icon: 'info',
      confirmButtonText: 'OK'
    });
  };

  // Mock weekly data for the chart
  const weeklyData = [
    { day: 'Mon', present: Math.floor(stats.totalStudents * 0.9), absent: Math.floor(stats.totalStudents * 0.1), late: Math.floor(stats.totalStudents * 0.02) },
    { day: 'Tue', present: Math.floor(stats.totalStudents * 0.88), absent: Math.floor(stats.totalStudents * 0.12), late: Math.floor(stats.totalStudents * 0.015) },
    { day: 'Wed', present: Math.floor(stats.totalStudents * 0.93), absent: Math.floor(stats.totalStudents * 0.07), late: Math.floor(stats.totalStudents * 0.012) },
    { day: 'Thu', present: Math.floor(stats.totalStudents * 0.87), absent: Math.floor(stats.totalStudents * 0.13), late: Math.floor(stats.totalStudents * 0.018) },
    { day: 'Fri', present: Math.floor(stats.totalStudents * 0.95), absent: Math.floor(stats.totalStudents * 0.05), late: Math.floor(stats.totalStudents * 0.01) },
  ];

  const averageAttendanceRate = classStats.length > 0 
    ? Math.round(classStats.reduce((acc, curr) => acc + curr.rate, 0) / classStats.length)
    : 0;

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
          <Button variant="outline" onClick={exportData}>
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
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalTeachers}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalClasses}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
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

      {/* Class-wise Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Class-wise Attendance / ক্লাসভিত্তিক উপস্থিতি</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classStats.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{item.class}</h4>
                    <p className="text-sm text-gray-600">
                      Students: {item.totalStudents} | Present: {item.present}
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
              {classStats.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No class data available. Add classes to see statistics.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Statistics / সামগ্রিক পরিসংখ্যান</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Average Attendance Rate</h4>
                  <p className="text-sm text-gray-600">Across all classes</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{averageAttendanceRate}%</p>
                  <Badge variant={averageAttendanceRate >= 85 ? 'default' : 'destructive'}>
                    {averageAttendanceRate >= 85 ? 'Excellent' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Active Users</h4>
                  <p className="text-sm text-gray-600">Students + Teachers</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{stats.totalStudents + stats.totalTeachers}</p>
                </div>
              </div>
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
            <Button className="h-20 text-left justify-start" onClick={exportData}>
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

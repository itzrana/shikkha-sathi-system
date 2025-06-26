
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, FileText, TrendingUp, Users, Calendar } from 'lucide-react';

interface AttendanceData {
  class: string;
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

interface StudentData {
  id: string;
  name: string;
  class: string;
  total_days: number;
  present_days: number;
  absent_days: number;
  percentage: number;
}

const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('attendance');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchClasses();
    fetchReportData();
  }, [reportType, selectedClass, selectedPeriod]);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name');

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      if (reportType === 'attendance') {
        await fetchAttendanceReport();
      } else if (reportType === 'student') {
        await fetchStudentReport();
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast({
        title: "ত্রুটি / Error",
        description: "রিপোর্ট ডেটা লোড করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceReport = async () => {
    // Mock data - in real implementation, this would be calculated from actual attendance records
    const mockData: AttendanceData[] = [
      { class: 'Class 6-A', present: 42, absent: 3, total: 45, percentage: 93.3 },
      { class: 'Class 6-B', present: 38, absent: 5, total: 43, percentage: 88.4 },
      { class: 'Class 7-A', present: 45, absent: 3, total: 48, percentage: 93.8 },
      { class: 'Class 7-B', present: 41, absent: 5, total: 46, percentage: 89.1 },
      { class: 'Class 8-A', present: 40, absent: 4, total: 44, percentage: 90.9 },
    ];

    if (selectedClass !== 'all') {
      setAttendanceData(mockData.filter(item => item.class === selectedClass));
    } else {
      setAttendanceData(mockData);
    }
  };

  const fetchStudentReport = async () => {
    try {
      const { data: students, error } = await supabase
        .from('profiles')
        .select('id, name, class')
        .eq('role', 'student');

      if (error) throw error;

      // Mock attendance calculation for each student
      const studentReports: StudentData[] = (students || []).map(student => ({
        id: student.id,
        name: student.name,
        class: student.class || 'Unknown',
        total_days: 166,
        present_days: Math.floor(Math.random() * 50) + 140,
        absent_days: Math.floor(Math.random() * 26) + 1,
        percentage: Math.floor(Math.random() * 20) + 80,
      }));

      if (selectedClass !== 'all') {
        setStudentData(studentReports.filter(student => student.class === selectedClass));
      } else {
        setStudentData(studentReports);
      }
    } catch (error) {
      console.error('Error fetching student report:', error);
    }
  };

  const exportReport = () => {
    toast({
      title: "Export Started",
      description: "Report export functionality would be implemented here.",
    });
  };

  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports / রিপোর্ট</h2>
        <Button onClick={exportReport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Report Type / রিপোর্টের ধরন</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendance">Attendance Report / উপস্থিতির রিপোর্ট</SelectItem>
                  <SelectItem value="student">Student Report / শিক্ষার্থীর রিপোর্ট</SelectItem>
                  <SelectItem value="class">Class Report / ক্লাসের রিপোর্ট</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Class / ক্লাস</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes / সব ক্লাস</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.name}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Period / সময়কাল</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Current Month / চলতি মাস</SelectItem>
                  <SelectItem value="last-month">Last Month / গত মাস</SelectItem>
                  <SelectItem value="current-term">Current Term / চলতি টার্ম</SelectItem>
                  <SelectItem value="academic-year">Academic Year / শিক্ষাবর্ষ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Report */}
      {reportType === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Class-wise Attendance / ক্লাসভিত্তিক উপস্থিতি</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="class" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" fill="#10B981" name="Present" />
                  <Bar dataKey="absent" fill="#EF4444" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Distribution / উপস্থিতির বিতরণ</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ class: className, percentage }) => `${className}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Student Report */}
      {reportType === 'student' && (
        <Card>
          <CardHeader>
            <CardTitle>Student Attendance Report / শিক্ষার্থীর উপস্থিতির রিপোর্ট</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 text-left">Name / নাম</th>
                    <th className="border border-gray-300 p-2 text-left">Class / ক্লাস</th>
                    <th className="border border-gray-300 p-2 text-center">Total Days / মোট দিন</th>
                    <th className="border border-gray-300 p-2 text-center">Present / উপস্থিত</th>
                    <th className="border border-gray-300 p-2 text-center">Absent / অনুপস্থিত</th>
                    <th className="border border-gray-300 p-2 text-center">Percentage / শতকরা</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.map((student) => (
                    <tr key={student.id}>
                      <td className="border border-gray-300 p-2">{student.name}</td>
                      <td className="border border-gray-300 p-2">{student.class}</td>
                      <td className="border border-gray-300 p-2 text-center">{student.total_days}</td>
                      <td className="border border-gray-300 p-2 text-center">{student.present_days}</td>
                      <td className="border border-gray-300 p-2 text-center">{student.absent_days}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        <Badge variant={student.percentage >= 90 ? 'default' : student.percentage >= 75 ? 'secondary' : 'destructive'}>
                          {student.percentage}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{studentData.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold">{classes.length}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Attendance</p>
                <p className="text-2xl font-bold">
                  {attendanceData.length > 0 
                    ? Math.round(attendanceData.reduce((acc, curr) => acc + curr.percentage, 0) / attendanceData.length)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reports Generated</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;

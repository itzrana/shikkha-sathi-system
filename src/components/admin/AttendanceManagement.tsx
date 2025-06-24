
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, XCircle, Clock, Download, Search, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AttendanceRecord {
  id: string;
  studentName: string;
  className: string;
  subject: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  teacher: string;
}

const AttendanceManagement: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock attendance data
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: '1',
      studentName: 'আহমেদ করিম',
      className: 'Class 6-A',
      subject: 'Mathematics',
      date: '2024-06-24',
      status: 'present',
      teacher: 'রহিম আহমেদ'
    },
    {
      id: '2',
      studentName: 'ফাতিমা খাতুন',
      className: 'Class 6-A',
      subject: 'Mathematics',
      date: '2024-06-24',
      status: 'absent',
      teacher: 'রহিম আহমেদ'
    },
    {
      id: '3',
      studentName: 'রহিম উদ্দিন',
      className: 'Class 6-B',
      subject: 'English',
      date: '2024-06-24',
      status: 'late',
      teacher: 'সালমা খাতুন'
    },
    {
      id: '4',
      studentName: 'সালমা বেগম',
      className: 'Class 7-A',
      subject: 'Science',
      date: '2024-06-24',
      status: 'present',
      teacher: 'করিম উদ্দিন'
    }
  ]);

  const classes = ['all', 'Class 6-A', 'Class 6-B', 'Class 7-A', 'Class 7-B'];

  // Filter records based on selected filters
  const filteredRecords = attendanceRecords.filter(record => {
    const matchesClass = selectedClass === 'all' || record.className === selectedClass;
    const matchesDate = record.date === selectedDate;
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesClass && matchesDate && matchesSearch;
  });

  // Calculate statistics
  const totalRecords = filteredRecords.length;
  const presentCount = filteredRecords.filter(r => r.status === 'present').length;
  const absentCount = filteredRecords.filter(r => r.status === 'absent').length;
  const lateCount = filteredRecords.filter(r => r.status === 'late').length;

  // Chart data
  const chartData = [
    { name: 'Present', value: presentCount, color: '#10B981' },
    { name: 'Absent', value: absentCount, color: '#EF4444' },
    { name: 'Late', value: lateCount, color: '#F59E0B' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4" />;
      case 'absent': return <XCircle className="h-4 w-4" />;
      case 'late': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const exportData = () => {
    // In a real app, this would generate and download a CSV/PDF
    console.log('Exporting attendance data:', filteredRecords);
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Attendance Management / উপস্থিতি ব্যবস্থাপনা</h2>
        <Button onClick={exportData}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search / অনুসন্ধান</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search student or teacher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Class / ক্লাস</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls === 'all' ? 'All Classes' : cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date / তারিখ</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Actions</label>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Advanced Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold">{totalRecords}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Late</p>
                <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Overview / উপস্থিতির সংক্ষিপ্ত বিবরণ</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records / উপস্থিতির রেকর্ড</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student / শিক্ষার্থী</TableHead>
                <TableHead>Class / ক্লাস</TableHead>
                <TableHead>Subject / বিষয়</TableHead>
                <TableHead>Teacher / শিক্ষক</TableHead>
                <TableHead>Date / তারিখ</TableHead>
                <TableHead>Status / অবস্থা</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.studentName}</TableCell>
                  <TableCell>{record.className}</TableCell>
                  <TableCell>{record.subject}</TableCell>
                  <TableCell>{record.teacher}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(record.status)}>
                      {getStatusIcon(record.status)}
                      <span className="ml-1 capitalize">{record.status}</span>
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No attendance records found for the selected criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceManagement;

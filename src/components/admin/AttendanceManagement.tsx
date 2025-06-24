
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AttendanceRecord {
  id: string;
  studentName: string;
  class: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  subject: string;
  teacher: string;
  remarks?: string;
}

const AttendanceManagement: React.FC = () => {
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: '1',
      studentName: 'আহমেদ করিম',
      class: 'Class 6-A',
      date: '2024-06-24',
      status: 'present',
      subject: 'Mathematics',
      teacher: 'রহিম আহমেদ'
    },
    {
      id: '2',
      studentName: 'ফাতিমা খাতুন',
      class: 'Class 7-B',
      date: '2024-06-24',
      status: 'absent',
      subject: 'English',
      teacher: 'সালমা খাতুন',
      remarks: 'Sick'
    },
    {
      id: '3',
      studentName: 'রহিম উদ্দিন',
      class: 'Class 8-A',
      date: '2024-06-24',
      status: 'late',
      subject: 'Science',
      teacher: 'করিম উদ্দিন',
      remarks: 'Traffic'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const classes = ['Class 6-A', 'Class 6-B', 'Class 7-A', 'Class 7-B', 'Class 8-A', 'Class 8-B'];
  const statuses = ['present', 'absent', 'late'];

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || record.class === selectedClass;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    const matchesDate = record.date === selectedDate;
    return matchesSearch && matchesClass && matchesStatus && matchesDate;
  });

  // Statistics
  const todayStats = {
    totalRecords: filteredRecords.length,
    present: filteredRecords.filter(r => r.status === 'present').length,
    absent: filteredRecords.filter(r => r.status === 'absent').length,
    late: filteredRecords.filter(r => r.status === 'late').length
  };

  const attendanceRate = todayStats.totalRecords > 0 
    ? ((todayStats.present + todayStats.late) / todayStats.totalRecords * 100).toFixed(1)
    : '0';

  // Chart data
  const chartData = classes.map(className => {
    const classRecords = filteredRecords.filter(r => r.class === className);
    return {
      class: className,
      present: classRecords.filter(r => r.status === 'present').length,
      absent: classRecords.filter(r => r.status === 'absent').length,
      late: classRecords.filter(r => r.status === 'late').length
    };
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      present: 'default',
      absent: 'destructive',
      late: 'secondary'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Attendance Management / উপস্থিতি ব্যবস্থাপনা</h2>
        <div className="flex space-x-4">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">{todayStats.present}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-600">{todayStats.absent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Late</p>
                <p className="text-2xl font-bold text-yellow-600">{todayStats.late}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">{todayStats.totalRecords}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Rate</p>
                <p className="text-2xl font-bold text-purple-600">{attendanceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button>
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Class-wise Attendance / ক্লাসভিত্তিক উপস্থিতি</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#10B981" name="Present" />
              <Bar dataKey="absent" fill="#EF4444" name="Absent" />
              <Bar dataKey="late" fill="#F59E0B" name="Late" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Attendance Records / উপস্থিতির রেকর্ড ({filteredRecords.length} records)
          </CardTitle>
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
                <TableHead>Remarks / মন্তব্য</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.studentName}</TableCell>
                  <TableCell>{record.class}</TableCell>
                  <TableCell>{record.subject}</TableCell>
                  <TableCell>{record.teacher}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(record.status)}
                      {getStatusBadge(record.status)}
                    </div>
                  </TableCell>
                  <TableCell>{record.remarks || '-'}</TableCell>
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

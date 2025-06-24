
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Clock, Save, Calendar, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  roll: string;
  status: 'present' | 'absent' | 'late' | null;
  remarks?: string;
}

const AttendanceSheet: React.FC = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'আহমেদ করিম', roll: '01', status: null },
    { id: '2', name: 'ফাতিমা খাতুন', roll: '02', status: null },
    { id: '3', name: 'রহিম উদ্দিন', roll: '03', status: null },
    { id: '4', name: 'সালমা বেগম', roll: '04', status: null },
    { id: '5', name: 'করিম হোসেন', roll: '05', status: null },
    { id: '6', name: 'নাসির আহমেদ', roll: '06', status: null },
    { id: '7', name: 'রাহেলা খাতুন', roll: '07', status: null },
    { id: '8', name: 'মাহবুব আলম', roll: '08', status: null }
  ]);

  const classes = ['Class 6-A', 'Class 6-B', 'Class 7-A', 'Class 7-B'];
  const subjects = ['Mathematics', 'English', 'Bangla', 'Science', 'Social Studies'];

  const updateStudentStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setStudents(students.map(student => 
      student.id === studentId ? { ...student, status } : student
    ));
  };

  const updateStudentRemarks = (studentId: string, remarks: string) => {
    setStudents(students.map(student => 
      student.id === studentId ? { ...student, remarks } : student
    ));
  };

  const markAllPresent = () => {
    setStudents(students.map(student => ({ ...student, status: 'present' as const })));
  };

  const markAllAbsent = () => {
    setStudents(students.map(student => ({ ...student, status: 'absent' as const })));
  };

  const saveAttendance = () => {
    if (!selectedClass || !selectedSubject) {
      toast({
        title: "Error",
        description: "Please select class and subject",
        variant: "destructive"
      });
      return;
    }

    const unmarkedStudents = students.filter(s => !s.status);
    if (unmarkedStudents.length > 0) {
      toast({
        title: "Warning",
        description: `${unmarkedStudents.length} students are not marked`,
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save to a backend
    console.log('Saving attendance:', {
      class: selectedClass,
      subject: selectedSubject,
      date: attendanceDate,
      attendance: students.map(s => ({
        studentId: s.id,
        status: s.status,
        remarks: s.remarks
      }))
    });

    toast({
      title: "Success",
      description: "Attendance saved successfully",
    });
  };

  const getAttendanceStats = () => {
    const present = students.filter(s => s.status === 'present').length;
    const absent = students.filter(s => s.status === 'absent').length;
    const late = students.filter(s => s.status === 'late').length;
    const total = students.length;
    
    return { present, absent, late, total };
  };

  const stats = getAttendanceStats();

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'late':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <div className="h-5 w-5 border rounded-full border-gray-300" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mark Attendance / উপস্থিতি নেওয়া</h2>
        <div className="flex space-x-4">
          <Button onClick={markAllPresent} variant="outline">
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark All Present
          </Button>
          <Button onClick={markAllAbsent} variant="outline">
            <XCircle className="mr-2 h-4 w-4" />
            Mark All Absent
          </Button>
          <Button onClick={saveAttendance}>
            <Save className="mr-2 h-4 w-4" />
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Class and Subject Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Class / ক্লাস</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subject / বিষয়</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date / তারিখ</label>
              <Input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
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
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
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
                <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Student Attendance / শিক্ষার্থীদের উপস্থিতি
            {selectedClass && ` - ${selectedClass}`}
            {selectedSubject && ` - ${selectedSubject}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll / রোল</TableHead>
                <TableHead>Name / নাম</TableHead>
                <TableHead>Status / অবস্থা</TableHead>
                <TableHead>Actions / কার্যক্রম</TableHead>
                <TableHead>Remarks / মন্তব্য</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.roll}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(student.status)}
                      {student.status && (
                        <Badge 
                          variant={
                            student.status === 'present' ? 'default' : 
                            student.status === 'absent' ? 'destructive' : 'secondary'
                          }
                        >
                          {student.status}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant={student.status === 'present' ? 'default' : 'outline'}
                        onClick={() => updateStudentStatus(student.id, 'present')}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={student.status === 'absent' ? 'destructive' : 'outline'}
                        onClick={() => updateStudentStatus(student.id, 'absent')}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={student.status === 'late' ? 'secondary' : 'outline'}
                        onClick={() => updateStudentStatus(student.id, 'late')}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Add remarks..."
                      value={student.remarks || ''}
                      onChange={(e) => updateStudentRemarks(student.id, e.target.value)}
                      className="w-48"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceSheet;

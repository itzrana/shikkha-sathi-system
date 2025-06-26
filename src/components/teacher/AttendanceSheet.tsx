
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Clock, Save, Calendar, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  name: string;
  status: 'present' | 'absent' | 'late' | null;
}

const AttendanceSheet: React.FC = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass, attendanceDate]);

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

  const fetchStudents = async () => {
    try {
      const { data: studentsData, error: studentsError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .eq('class', selectedClass)
        .order('name');

      if (studentsError) throw studentsError;

      // Fetch existing attendance for this date and class
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', attendanceDate)
        .in('student_id', studentsData?.map(s => s.id) || []);

      if (attendanceError) throw attendanceError;

      // Merge student data with attendance status
      const studentsWithAttendance = studentsData?.map(student => {
        const attendance = attendanceData?.find(a => a.student_id === student.id);
        return {
          id: student.id,
          name: student.name,
          status: attendance?.status as 'present' | 'absent' | 'late' | null || null
        };
      }) || [];

      setStudents(studentsWithAttendance);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    }
  };

  const updateStudentStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setStudents(students.map(student => 
      student.id === studentId ? { ...student, status } : student
    ));
  };

  const markAllPresent = () => {
    setStudents(students.map(student => ({ ...student, status: 'present' as const })));
  };

  const markAllAbsent = () => {
    setStudents(students.map(student => ({ ...student, status: 'absent' as const })));
  };

  const saveAttendance = async () => {
    if (!selectedClass) {
      toast({
        title: "Error",
        description: "Please select a class",
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

    setLoading(true);
    try {
      const classData = classes.find(c => c.name === selectedClass);
      if (!classData) {
        throw new Error('Class not found');
      }

      // Delete existing attendance records for this date and class
      await supabase
        .from('attendance')
        .delete()
        .eq('date', attendanceDate)
        .eq('class_id', classData.id);

      // Insert new attendance records
      const attendanceRecords = students.map(student => ({
        student_id: student.id,
        class_id: classData.id,
        date: attendanceDate,
        status: student.status
      }));

      const { error } = await supabase
        .from('attendance')
        .insert(attendanceRecords);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Attendance saved successfully",
      });
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast({
        title: "Error",
        description: "Failed to save attendance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          <Button onClick={saveAttendance} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Save Attendance'}
          </Button>
        </div>
      </div>

      {/* Class Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Class / ক্লাস</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.name}>{cls.name}</SelectItem>
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
      {selectedClass && (
        <Card>
          <CardHeader>
            <CardTitle>
              Student Attendance / শিক্ষার্থীদের উপস্থিতি - {selectedClass}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name / নাম</TableHead>
                  <TableHead>Status / অবস্থা</TableHead>
                  <TableHead>Actions / কার্যক্রম</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendanceSheet;

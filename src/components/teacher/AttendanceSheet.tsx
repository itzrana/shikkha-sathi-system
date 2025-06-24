
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, Save, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  status?: 'present' | 'absent' | 'late';
}

const AttendanceSheet: React.FC = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data - in real app, this would come from API
  const classes = [
    { id: '1', name: 'Class 6 - A', grade: '6', section: 'A' },
    { id: '2', name: 'Class 7 - B', grade: '7', section: 'B' },
    { id: '3', name: 'Class 8 - A', grade: '8', section: 'A' },
  ];

  const subjects = [
    { id: '1', name: 'Mathematics / গণিত', code: 'MATH' },
    { id: '2', name: 'English / ইংরেজি', code: 'ENG' },
    { id: '3', name: 'Science / বিজ্ঞান', code: 'SCI' },
    { id: '4', name: 'Bengali / বাংলা', code: 'BAN' },
  ];

  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'আহমেদ করিম', rollNumber: '001' },
    { id: '2', name: 'ফাতিমা খাতুন', rollNumber: '002' },
    { id: '3', name: 'রহিম উদ্দিন', rollNumber: '003' },
    { id: '4', name: 'সালমা বেগম', rollNumber: '004' },
    { id: '5', name: 'নাসির আহমেদ', rollNumber: '005' },
    { id: '6', name: 'রুমানা আক্তার', rollNumber: '006' },
    { id: '7', name: 'তানভীর হাসান', rollNumber: '007' },
    { id: '8', name: 'সুমাইয়া খান', rollNumber: '008' },
  ]);

  const updateAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents(prev => 
      prev.map(student => ({ ...student, status: 'present' as const }))
    );
    toast({
      title: "All students marked present",
      description: "সকল শিক্ষার্থীকে উপস্থিত হিসেবে চিহ্নিত করা হয়েছে।",
    });
  };

  const saveAttendance = () => {
    if (!selectedClass || !selectedSubject) {
      toast({
        title: "Please select class and subject",
        description: "ক্লাস এবং বিষয় নির্বাচন করুন।",
        variant: "destructive",
      });
      return;
    }

    const attendanceData = students.map(student => ({
      studentId: student.id,
      classId: selectedClass,
      subjectId: selectedSubject,
      date: attendanceDate,
      status: student.status || 'absent',
    }));

    console.log('Saving attendance:', attendanceData);
    
    toast({
      title: "Attendance saved successfully!",
      description: "উপস্থিতি সফলভাবে সংরক্ষিত হয়েছে।",
    });
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.includes(searchTerm)
  );

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4" />;
      case 'absent': return <XCircle className="h-4 w-4" />;
      case 'late': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance / উপস্থিতি নেওয়া</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="class">Select Class / ক্লাস নির্বাচন করুন</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Select Subject / বিষয় নির্বাচন করুন</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Date / তারিখ</Label>
              <Input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students / শিক্ষার্থী খুঁজুন"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <div className="space-x-2">
              <Button variant="outline" onClick={markAllPresent}>
                Mark All Present
              </Button>
              <Button onClick={saveAttendance}>
                <Save className="mr-2 h-4 w-4" />
                Save Attendance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && selectedSubject && (
        <Card>
          <CardHeader>
            <CardTitle>Student List / শিক্ষার্থী তালিকা</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredStudents.map(student => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="font-medium">{student.name}</div>
                    <Badge variant="outline">Roll: {student.rollNumber}</Badge>
                    {student.status && (
                      <Badge className={getStatusColor(student.status)}>
                        {getStatusIcon(student.status)}
                        <span className="ml-1 capitalize">{student.status}</span>
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={student.status === 'present' ? 'default' : 'outline'}
                      onClick={() => updateAttendance(student.id, 'present')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === 'late' ? 'default' : 'outline'}
                      onClick={() => updateAttendance(student.id, 'late')}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Late
                    </Button>
                    <Button
                      size="sm"
                      variant={student.status === 'absent' ? 'destructive' : 'outline'}
                      onClick={() => updateAttendance(student.id, 'absent')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Absent
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendanceSheet;

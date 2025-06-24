
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Search, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  class: string;
  roll: string;
  fatherName: string;
  motherName: string;
  address: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
}

const StudentManagement: React.FC = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'আহমেদ করিম',
      email: 'ahmed@school.edu.bd',
      phone: '+880123456789',
      class: 'Class 6-A',
      roll: '01',
      fatherName: 'মোহাম্মদ করিম',
      motherName: 'ফাতিমা বেগম',
      address: 'ঢাকা, বাংলাদেশ',
      enrollmentDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'ফাতিমা খাতুন',
      email: 'fatima@school.edu.bd',
      phone: '+880123456790',
      class: 'Class 7-B',
      roll: '05',
      fatherName: 'আব্দুল রহমান',
      motherName: 'সালমা খাতুন',
      address: 'চট্টগ্রাম, বাংলাদেশ',
      enrollmentDate: '2024-01-15',
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      class: '',
      roll: '',
      fatherName: '',
      motherName: '',
      address: ''
    }
  });

  const classes = ['Class 6-A', 'Class 6-B', 'Class 7-A', 'Class 7-B', 'Class 8-A', 'Class 8-B'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.roll.includes(searchTerm);
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const onSubmit = (data: any) => {
    const newStudent: Student = {
      id: (students.length + 1).toString(),
      ...data,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'active' as const
    };

    setStudents([...students, newStudent]);
    form.reset();
    setIsAddingStudent(false);
    
    toast({
      title: "Success",
      description: "Student added successfully",
    });
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    toast({
      title: "Success",
      description: "Student deleted successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Management / শিক্ষার্থী ব্যবস্থাপনা</h2>
        <div className="flex space-x-4">
          <Sheet open={isAddingStudent} onOpenChange={setIsAddingStudent}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[600px] sm:w-[600px]">
              <SheetHeader>
                <SheetTitle>Add New Student / নতুন শিক্ষার্থী যোগ করুন</SheetTitle>
              </SheetHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name / নাম</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter student name" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="student@school.edu.bd" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone / ফোন</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+880123456789" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class / ক্লাস</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classes.map((cls) => (
                              <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="roll"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roll Number / রোল নম্বর</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="01" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father's Name / পিতার নাম</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter father's name" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="motherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother's Name / মাতার নাম</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter mother's name" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address / ঠিকানা</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter address" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">Add Student</Button>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students List / শিক্ষার্থীদের তালিকা ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name / নাম</TableHead>
                <TableHead>Class / ক্লাস</TableHead>
                <TableHead>Roll</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.roll}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteStudent(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

export default StudentManagement;

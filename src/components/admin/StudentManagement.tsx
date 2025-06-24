
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
import { Plus, Edit, Trash2, Users, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  email: string;
  roll: string;
  class: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  status: 'active' | 'inactive';
}

const StudentManagement: React.FC = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'আহমেদ করিম',
      email: 'ahmed.karim@student.com',
      roll: '01',
      class: 'Class 6-A',
      phone: '01712345678',
      guardianName: 'করিম উদ্দিন',
      guardianPhone: '01798765432',
      address: 'ঢাকা, বাংলাদেশ',
      status: 'active'
    },
    {
      id: '2',
      name: 'ফাতিমা খাতুন',
      email: 'fatima.khatun@student.com',
      roll: '02',
      class: 'Class 6-A',
      phone: '01723456789',
      guardianName: 'আব্দুল খালেক',
      guardianPhone: '01787654321',
      address: 'চট্টগ্রাম, বাংলাদেশ',
      status: 'active'
    }
  ]);

  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      roll: '',
      class: '',
      phone: '',
      guardianName: '',
      guardianPhone: '',
      address: ''
    }
  });

  const classes = ['Class 6-A', 'Class 6-B', 'Class 7-A', 'Class 7-B', 'Class 8-A'];

  const onSubmit = (data: any) => {
    if (editingStudent) {
      setStudents(students.map(s => 
        s.id === editingStudent.id 
          ? { ...editingStudent, ...data }
          : s
      ));
      setEditingStudent(null);
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
    } else {
      const newStudent: Student = {
        id: (students.length + 1).toString(),
        ...data,
        status: 'active' as const
      };
      setStudents([...students, newStudent]);
      toast({
        title: "Success",
        description: "Student added successfully",
      });
    }
    
    form.reset();
    setIsAddingStudent(false);
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    toast({
      title: "Success",
      description: "Student deleted successfully",
    });
  };

  const startEdit = (student: Student) => {
    setEditingStudent(student);
    form.reset(student);
    setIsAddingStudent(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Management / শিক্ষার্থী ব্যবস্থাপনা</h2>
        <Sheet open={isAddingStudent} onOpenChange={setIsAddingStudent}>
          <SheetTrigger asChild>
            <Button onClick={() => {
              setEditingStudent(null);
              form.reset();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[500px] sm:w-[500px]">
            <SheetHeader>
              <SheetTitle>
                {editingStudent ? 'Edit Student / শিক্ষার্থী সম্পাদনা' : 'Add New Student / নতুন শিক্ষার্থী যোগ করুন'}
              </SheetTitle>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name / পূর্ণ নাম</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="আহমেদ করিম" required />
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
                      <FormLabel>Email / ইমেইল</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="student@example.com" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone / ফোন</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="01712345678" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guardianName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guardian Name / অভিভাবকের নাম</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="করিম উদ্দিন" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guardianPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guardian Phone / অভিভাবকের ফোন</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="01798765432" required />
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
                        <Input {...field} placeholder="ঢাকা, বাংলাদেশ" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </Button>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Student Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-green-600">
                  {students.filter(s => s.status === 'active').length}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students List / শিক্ষার্থীদের তালিকা</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name / নাম</TableHead>
                <TableHead>Roll / রোল</TableHead>
                <TableHead>Class / ক্লাস</TableHead>
                <TableHead>Guardian / অভিভাবক</TableHead>
                <TableHead>Phone / ফোন</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.roll}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.guardianName}</TableCell>
                  <TableCell>{student.guardianPhone}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(student)}>
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

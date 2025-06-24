
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

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  classes: string[];
  employeeId: string;
  joinDate: string;
  qualification: string;
  address: string;
  status: 'active' | 'inactive';
}

const TeacherManagement: React.FC = () => {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: '1',
      name: 'রহিম আহমেদ',
      email: 'rahim@school.edu.bd',
      phone: '+880123456789',
      subject: 'Mathematics',
      classes: ['Class 6-A', 'Class 7-A'],
      employeeId: 'T001',
      joinDate: '2023-01-15',
      qualification: 'MSc in Mathematics',
      address: 'ঢাকা, বাংলাদেশ',
      status: 'active'
    },
    {
      id: '2',
      name: 'সালমা খাতুন',
      email: 'salma@school.edu.bd',
      phone: '+880123456790',
      subject: 'English',
      classes: ['Class 6-B', 'Class 7-B'],
      employeeId: 'T002',
      joinDate: '2023-02-01',
      qualification: 'MA in English Literature',
      address: 'চট্টগ্রাম, বাংলাদেশ',
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      employeeId: '',
      qualification: '',
      address: ''
    }
  });

  const subjects = ['Mathematics', 'English', 'Bangla', 'Science', 'Social Studies', 'ICT'];
  const availableClasses = ['Class 6-A', 'Class 6-B', 'Class 7-A', 'Class 7-B', 'Class 8-A', 'Class 8-B'];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.employeeId.includes(searchTerm);
    const matchesSubject = selectedSubject === 'all' || teacher.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const onSubmit = (data: any) => {
    const newTeacher: Teacher = {
      id: (teachers.length + 1).toString(),
      ...data,
      classes: [], // Will be assigned later
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active' as const
    };

    setTeachers([...teachers, newTeacher]);
    form.reset();
    setIsAddingTeacher(false);
    
    toast({
      title: "Success",
      description: "Teacher added successfully",
    });
  };

  const deleteTeacher = (id: string) => {
    setTeachers(teachers.filter(t => t.id !== id));
    toast({
      title: "Success",
      description: "Teacher deleted successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Teacher Management / শিক্ষক ব্যবস্থাপনা</h2>
        <div className="flex space-x-4">
          <Sheet open={isAddingTeacher} onOpenChange={setIsAddingTeacher}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Teacher
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[600px] sm:w-[600px]">
              <SheetHeader>
                <SheetTitle>Add New Teacher / নতুন শিক্ষক যোগ করুন</SheetTitle>
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
                          <Input {...field} placeholder="Enter teacher name" required />
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
                          <Input {...field} type="email" placeholder="teacher@school.edu.bd" required />
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
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject / বিষয়</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID / কর্মচারী আইডি</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="T001" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="qualification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qualification / শিক্ষাগত যোগ্যতা</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="MSc in Mathematics" required />
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

                  <Button type="submit" className="w-full">Add Teacher</Button>
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
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
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

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Teachers List / শিক্ষকদের তালিকা ({filteredTeachers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name / নাম</TableHead>
                <TableHead>Subject / বিষয়</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>{teacher.employeeId}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes.map((cls) => (
                        <Badge key={cls} variant="outline" className="text-xs">
                          {cls}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                      {teacher.status}
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
                        onClick={() => deleteTeacher(teacher.id)}
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

export default TeacherManagement;

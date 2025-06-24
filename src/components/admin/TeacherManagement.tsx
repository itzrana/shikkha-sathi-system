
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
import { Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  experience: string;
  address: string;
  status: 'active' | 'inactive';
}

const TeacherManagement: React.FC = () => {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: '1',
      name: 'রহিম আহমেদ',
      email: 'rahim.ahmed@school.com',
      phone: '01712345678',
      subject: 'Mathematics',
      qualification: 'M.Sc in Mathematics',
      experience: '8 years',
      address: 'ঢাকা, বাংলাদেশ',
      status: 'active'
    },
    {
      id: '2',
      name: 'সালমা খাতুন',
      email: 'salma.khatun@school.com',
      phone: '01723456789',
      subject: 'English',
      qualification: 'M.A in English',
      experience: '5 years',
      address: 'চট্টগ্রাম, বাংলাদেশ',
      status: 'active'
    }
  ]);

  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      qualification: '',
      experience: '',
      address: ''
    }
  });

  const subjects = ['Mathematics', 'English', 'Bangla', 'Science', 'Social Studies', 'ICT', 'Physical Education'];

  const onSubmit = (data: any) => {
    if (editingTeacher) {
      setTeachers(teachers.map(t => 
        t.id === editingTeacher.id 
          ? { ...editingTeacher, ...data }
          : t
      ));
      setEditingTeacher(null);
      toast({
        title: "Success",
        description: "Teacher updated successfully",
      });
    } else {
      const newTeacher: Teacher = {
        id: (teachers.length + 1).toString(),
        ...data,
        status: 'active' as const
      };
      setTeachers([...teachers, newTeacher]);
      toast({
        title: "Success",
        description: "Teacher added successfully",
      });
    }
    
    form.reset();
    setIsAddingTeacher(false);
  };

  const deleteTeacher = (id: string) => {
    setTeachers(teachers.filter(t => t.id !== id));
    toast({
      title: "Success",
      description: "Teacher deleted successfully",
    });
  };

  const startEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    form.reset(teacher);
    setIsAddingTeacher(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Teacher Management / শিক্ষক ব্যবস্থাপনা</h2>
        <Sheet open={isAddingTeacher} onOpenChange={setIsAddingTeacher}>
          <SheetTrigger asChild>
            <Button onClick={() => {
              setEditingTeacher(null);
              form.reset();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Teacher
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[500px] sm:w-[500px]">
            <SheetHeader>
              <SheetTitle>
                {editingTeacher ? 'Edit Teacher / শিক্ষক সম্পাদনা' : 'Add New Teacher / নতুন শিক্ষক যোগ করুন'}
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
                        <Input {...field} placeholder="রহিম আহমেদ" required />
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
                        <Input {...field} type="email" placeholder="teacher@school.com" required />
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
                        <Input {...field} placeholder="01712345678" required />
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
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualification / যোগ্যতা</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="M.Sc in Mathematics" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience / অভিজ্ঞতা</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="5 years" required />
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
                  {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
                </Button>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Teacher Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-2xl font-bold">{teachers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Teachers</p>
                <p className="text-2xl font-bold text-green-600">
                  {teachers.filter(t => t.status === 'active').length}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Teachers List / শিক্ষকদের তালিকা</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name / নাম</TableHead>
                <TableHead>Subject / বিষয়</TableHead>
                <TableHead>Qualification / যোগ্যতা</TableHead>
                <TableHead>Experience / অভিজ্ঞতা</TableHead>
                <TableHead>Phone / ফোন</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>{teacher.qualification}</TableCell>
                  <TableCell>{teacher.experience}</TableCell>
                  <TableCell>{teacher.phone}</TableCell>
                  <TableCell>
                    <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(teacher)}>
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

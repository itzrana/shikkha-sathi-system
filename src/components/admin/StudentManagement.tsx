
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Edit, Trash2, Users, GraduationCap, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Swal from 'sweetalert2';

interface Student {
  id: string;
  name: string;
  email: string;
  class: string | null;
  created_at?: string;
}

interface ClassInfo {
  id: string;
  name: string;
}

const StudentManagement: React.FC = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      class: ''
    }
  });

  useEffect(() => {
    fetchStudents();
    fetchClasses();
    
    // Set up real-time subscription to automatically refresh when new students are added
    const channel = supabase
      .channel('students-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'profiles', filter: 'role=eq.student' },
        () => {
          console.log('New student added, refreshing list...');
          fetchStudents();
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: 'role=eq.student' },
        () => {
          console.log('Student updated, refreshing list...');
          fetchStudents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Students fetch error:', error);
        throw error;
      }
      
      const studentsData: Student[] = (data || []).map(profile => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        class: profile.class,
        created_at: profile.created_at || undefined
      }));
      
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    }
  };

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name');

      if (error) {
        console.error('Classes fetch error:', error);
        throw error;
      }
      
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch classes",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: any) => {
    if (!editingStudent) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          email: data.email,
          class: data.class,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingStudent.id);

      if (error) throw error;
      
      await Swal.fire({
        title: 'সফল!',
        text: 'শিক্ষার্থীর তথ্য সফলভাবে আপডেট হয়েছে।',
        icon: 'success',
        confirmButtonText: 'ঠিক আছে'
      });
      
      form.reset();
      setIsEditingStudent(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      await Swal.fire({
        title: 'ত্রুটি!',
        text: 'শিক্ষার্থীর তথ্য সংরক্ষণ করতে সমস্যা হয়েছে।',
        icon: 'error',
        confirmButtonText: 'ঠিক আছে'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'শিক্ষার্থী মুছুন',
      text: `${name} কে মুছে দিতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'হ্যাঁ, মুছুন',
      cancelButtonText: 'বাতিল'
    });

    if (!result.isConfirmed) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await Swal.fire({
        title: 'মুছে ফেলা হয়েছে!',
        text: 'শিক্ষার্থী সফলভাবে মুছে ফেলা হয়েছে।',
        icon: 'success',
        confirmButtonText: 'ঠিক আছে'
      });
      
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      await Swal.fire({
        title: 'ত্রুটি!',
        text: 'শিক্ষার্থী মুছতে সমস্যা হয়েছে।',
        icon: 'error',
        confirmButtonText: 'ঠিক আছে'
      });
    }
  };

  const startEdit = (student: Student) => {
    setEditingStudent(student);
    form.reset({
      name: student.name,
      email: student.email,
      class: student.class || ''
    });
    setIsEditingStudent(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Management / শিক্ষার্থী ব্যবস্থাপনা</h2>
        <Button onClick={fetchStudents} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh / রিফ্রেশ
        </Button>
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
                <p className="text-2xl font-bold text-green-600">{students.length}</p>
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
                <TableHead>Email / ইমেইল</TableHead>
                <TableHead>Class / ক্লাস</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.class || 'Not assigned'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(student)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteStudent(student.id, student.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {students.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No students found. Students will appear here automatically when approved.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Student Sheet */}
      <Sheet open={isEditingStudent} onOpenChange={setIsEditingStudent}>
        <SheetContent className="w-[500px] sm:w-[500px]">
          <SheetHeader>
            <SheetTitle>Edit Student / শিক্ষার্থী সম্পাদনা</SheetTitle>
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
                          <SelectItem key={cls.id} value={cls.name}>{cls.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Update Student'}
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default StudentManagement;

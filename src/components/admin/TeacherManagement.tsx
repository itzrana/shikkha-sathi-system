
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Edit, Trash2, Users, BookOpen, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Swal from 'sweetalert2';

interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  created_at?: string;
}

const TeacherManagement: React.FC = () => {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditingTeacher, setIsEditingTeacher] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      subject: ''
    }
  });

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
    
    // Set up real-time subscription to automatically refresh when new teachers are added
    const channel = supabase
      .channel('teachers-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'profiles', filter: 'role=eq.teacher' },
        () => {
          console.log('New teacher added, refreshing list...');
          fetchTeachers();
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: 'role=eq.teacher' },
        () => {
          console.log('Teacher updated, refreshing list...');
          fetchTeachers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch teachers",
        variant: "destructive",
      });
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('name')
        .order('name');

      if (error) throw error;
      setSubjects(data?.map(s => s.name) || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const onSubmit = async (data: any) => {
    if (!editingTeacher) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          email: data.email,
          subject: data.subject,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingTeacher.id);

      if (error) throw error;
      
      await Swal.fire({
        title: 'সফল!',
        text: 'শিক্ষকের তথ্য সফলভাবে আপডেট হয়েছে।',
        icon: 'success',
        confirmButtonText: 'ঠিক আছে'
      });
      
      form.reset();
      setIsEditingTeacher(false);
      setEditingTeacher(null);
      fetchTeachers();
    } catch (error) {
      console.error('Error saving teacher:', error);
      await Swal.fire({
        title: 'ত্রুটি!',
        text: 'শিক্ষকের তথ্য সংরক্ষণ করতে সমস্যা হয়েছে।',
        icon: 'error',
        confirmButtonText: 'ঠিক আছে'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTeacher = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'শিক্ষক মুছুন',
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
        text: 'শিক্ষক সফলভাবে মুছে ফেলা হয়েছে।',
        icon: 'success',
        confirmButtonText: 'ঠিক আছে'
      });
      
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      await Swal.fire({
        title: 'ত্রুটি!',
        text: 'শিক্ষক মুছতে সমস্যা হয়েছে।',
        icon: 'error',
        confirmButtonText: 'ঠিক আছে'
      });
    }
  };

  const startEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    form.reset({
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject
    });
    setIsEditingTeacher(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Teacher Management / শিক্ষক ব্যবস্থাপনা</h2>
        <Button onClick={fetchTeachers} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh / রিফ্রেশ
        </Button>
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
                <p className="text-2xl font-bold text-green-600">{teachers.length}</p>
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
                <TableHead>Email / ইমেইল</TableHead>
                <TableHead>Subject / বিষয়</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(teacher)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteTeacher(teacher.id, teacher.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {teachers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No teachers found. Teachers will appear here automatically when approved.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Teacher Sheet */}
      <Sheet open={isEditingTeacher} onOpenChange={setIsEditingTeacher}>
        <SheetContent className="w-[500px] sm:w-[500px]">
          <SheetHeader>
            <SheetTitle>Edit Teacher / শিক্ষক সম্পাদনা</SheetTitle>
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Update Teacher'}
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TeacherManagement;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Swal from 'sweetalert2';

interface ClassInfo {
  id: string;
  name: string;
  created_at?: string;
}

const ClassManagement: React.FC = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassInfo | null>(null);

  const form = useForm({
    defaultValues: {
      name: ''
    }
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });

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
    setLoading(true);
    try {
      if (editingClass) {
        const { error } = await supabase
          .from('classes')
          .update({ name: data.name })
          .eq('id', editingClass.id);

        if (error) throw error;
        
        await Swal.fire({
          title: 'সফল!',
          text: 'ক্লাস সফলভাবে আপডেট হয়েছে।',
          icon: 'success',
          confirmButtonText: 'ঠিক আছে'
        });
      } else {
        const { error } = await supabase
          .from('classes')
          .insert({ name: data.name });

        if (error) throw error;
        
        await Swal.fire({
          title: 'সফল!',
          text: 'নতুন ক্লাস সফলভাবে যোগ করা হয়েছে।',
          icon: 'success',
          confirmButtonText: 'ঠিক আছে'
        });
      }
      
      form.reset();
      setIsAddingClass(false);
      setEditingClass(null);
      fetchClasses();
    } catch (error) {
      console.error('Error saving class:', error);
      await Swal.fire({
        title: 'ত্রুটি!',
        text: 'ক্লাস সেভ করতে সমস্যা হয়েছে।',
        icon: 'error',
        confirmButtonText: 'ঠিক আছে'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteClass = async (id: string, className: string) => {
    const result = await Swal.fire({
      title: 'ক্লাস মুছে ফেলুন',
      text: `আপনি কি "${className}" ক্লাসটি মুছে ফেলতে চান?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'হ্যাঁ, মুছে ফেলুন',
      cancelButtonText: 'বাতিল'
    });

    if (!result.isConfirmed) return;

    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await Swal.fire({
        title: 'মুছে ফেলা হয়েছে!',
        text: 'ক্লাসটি সফলভাবে মুছে ফেলা হয়েছে।',
        icon: 'success',
        confirmButtonText: 'ঠিক আছে'
      });
      
      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
      await Swal.fire({
        title: 'ত্রুটি!',
        text: 'ক্লাস মুছতে সমস্যা হয়েছে।',
        icon: 'error',
        confirmButtonText: 'ঠিক আছে'
      });
    }
  };

  const startEdit = (classInfo: ClassInfo) => {
    setEditingClass(classInfo);
    form.reset({ name: classInfo.name });
    setIsAddingClass(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Class Management / ক্লাস ব্যবস্থাপনা</h2>
        <Sheet open={isAddingClass} onOpenChange={setIsAddingClass}>
          <SheetTrigger asChild>
            <Button onClick={() => {
              setEditingClass(null);
              form.reset();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[500px] sm:w-[500px]">
            <SheetHeader>
              <SheetTitle>
                {editingClass ? 'Edit Class / ক্লাস সম্পাদনা' : 'Add New Class / নতুন ক্লাস যোগ করুন'}
              </SheetTitle>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Name / ক্লাসের নাম</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Class 6-A" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Saving...' : (editingClass ? 'Update Class' : 'Add Class')}
                </Button>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Class Statistics */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Classes</p>
              <p className="text-2xl font-bold">{classes.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Classes List / ক্লাসের তালিকা</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name / ক্লাসের নাম</TableHead>
                <TableHead>Created Date / তৈরির তারিখ</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((classInfo) => (
                <TableRow key={classInfo.id}>
                  <TableCell className="font-medium">{classInfo.name}</TableCell>
                  <TableCell>
                    {classInfo.created_at ? new Date(classInfo.created_at).toLocaleDateString('bn-BD') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(classInfo)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteClass(classInfo.id, classInfo.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {classes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No classes found. Add your first class to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassManagement;

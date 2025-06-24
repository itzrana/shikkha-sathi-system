
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
import { Plus, Edit, Trash2, Users, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClassInfo {
  id: string;
  name: string;
  teacher: string;
  subject: string;
  room: string;
  schedule: string;
  studentCount: number;
  status: 'active' | 'inactive';
}

const ClassManagement: React.FC = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassInfo[]>([
    {
      id: '1',
      name: 'Class 6-A',
      teacher: 'রহিম আহমেদ',
      subject: 'Mathematics',
      room: 'Room 101',
      schedule: 'Mon-Fri, 9:00-10:00 AM',
      studentCount: 45,
      status: 'active'
    },
    {
      id: '2',
      name: 'Class 6-B',
      teacher: 'সালমা খাতুন',
      subject: 'English',
      room: 'Room 102',
      schedule: 'Mon-Fri, 10:00-11:00 AM',
      studentCount: 43,
      status: 'active'
    },
    {
      id: '3',
      name: 'Class 7-A',
      teacher: 'রহিম আহমেদ',
      subject: 'Mathematics',
      room: 'Room 201',
      schedule: 'Mon-Fri, 11:00-12:00 PM',
      studentCount: 48,
      status: 'active'
    }
  ]);

  const [isAddingClass, setIsAddingClass] = useState(false);

  const form = useForm({
    defaultValues: {
      name: '',
      teacher: '',
      subject: '',
      room: '',
      schedule: ''
    }
  });

  const teachers = ['রহিম আহমেদ', 'সালমা খাতুন', 'করিম উদ্দিন'];
  const subjects = ['Mathematics', 'English', 'Bangla', 'Science', 'Social Studies', 'ICT'];

  const onSubmit = (data: any) => {
    const newClass: ClassInfo = {
      id: (classes.length + 1).toString(),
      ...data,
      studentCount: 0,
      status: 'active' as const
    };

    setClasses([...classes, newClass]);
    form.reset();
    setIsAddingClass(false);
    
    toast({
      title: "Success",
      description: "Class added successfully",
    });
  };

  const deleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
    toast({
      title: "Success",
      description: "Class deleted successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Class Management / ক্লাস ব্যবস্থাপনা</h2>
        <Sheet open={isAddingClass} onOpenChange={setIsAddingClass}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[500px] sm:w-[500px]">
            <SheetHeader>
              <SheetTitle>Add New Class / নতুন ক্লাস যোগ করুন</SheetTitle>
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
                
                <FormField
                  control={form.control}
                  name="teacher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher / শিক্ষক</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room / কক্ষ</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Room 101" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="schedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schedule / সময়সূচী</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Mon-Fri, 9:00-10:00 AM" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">Add Class</Button>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Class Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{classes.reduce((sum, cls) => sum + cls.studentCount, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Classes</p>
                <p className="text-2xl font-bold">{classes.filter(c => c.status === 'active').length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

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
                <TableHead>Teacher / শিক্ষক</TableHead>
                <TableHead>Subject / বিষয়</TableHead>
                <TableHead>Room / কক্ষ</TableHead>
                <TableHead>Schedule / সময়সূচী</TableHead>
                <TableHead>Students / শিক্ষার্থী</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((classInfo) => (
                <TableRow key={classInfo.id}>
                  <TableCell className="font-medium">{classInfo.name}</TableCell>
                  <TableCell>{classInfo.teacher}</TableCell>
                  <TableCell>{classInfo.subject}</TableCell>
                  <TableCell>{classInfo.room}</TableCell>
                  <TableCell>{classInfo.schedule}</TableCell>
                  <TableCell>{classInfo.studentCount}</TableCell>
                  <TableCell>
                    <Badge variant={classInfo.status === 'active' ? 'default' : 'secondary'}>
                      {classInfo.status}
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
                        onClick={() => deleteClass(classInfo.id)}
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

export default ClassManagement;

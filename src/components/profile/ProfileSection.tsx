
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Phone, Calendar, BookOpen, GraduationCap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ClassInfo {
  id: string;
  name: string;
}

interface SubjectInfo {
  id: string;
  name: string;
}

const ProfileSection: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    class: user?.role === 'student' ? (user as any)?.class || '' : '',
    subject: user?.role === 'teacher' ? (user as any)?.subject || '' : '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        class: user.role === 'student' ? (user as any)?.class || '' : '',
        subject: user.role === 'teacher' ? (user as any)?.subject || '' : '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 'student') {
      fetchClasses();
    } else if (user?.role === 'teacher') {
      fetchSubjects();
    }
  }, [user?.role]);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Classes fetch error:', error);
        throw error;
      }
      
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: "ত্রুটি / Error",
        description: "ক্লাসের তালিকা লোড করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Subjects fetch error:', error);
        throw error;
      }
      
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: "ত্রুটি / Error",
        description: "বিষয়ের তালিকা লোড করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user?.id) {
        throw new Error('User not found');
      }

      const updateData: any = {
        name: formData.name,
        phone: formData.phone,
      };

      if (user.role === 'student' && formData.class) {
        updateData.class = formData.class;
      }

      if (user.role === 'teacher' && formData.subject) {
        updateData.subject = formData.subject;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      // Update local user state
      updateUser(updateData);

      toast({
        title: "সফল / Success",
        description: "আপনার প্রোফাইল সফলভাবে আপডেট হয়েছে।",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "ত্রুটি / Error",
        description: "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'প্রশাসক / Admin';
      case 'teacher': return 'শিক্ষক / Teacher';
      case 'student': return 'শিক্ষার্থী / Student';
      default: return role;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardContent className="p-8">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20 border-4 border-white/20">
              <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                {user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-blue-100 text-lg">{getRoleLabel(user.role)}</p>
              <p className="text-blue-200 text-sm mt-1">
                যোগদানের তারিখ: {new Date(user.createdAt).toLocaleDateString('bn-BD')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>প্রোফাইল তথ্য / Profile Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>নাম / Name *</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="আপনার পূর্ণ নাম"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>ইমেইল / Email</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  value={formData.email}
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">ইমেইল পরিবর্তন করা যাবে না</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>ফোন / Phone</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="আপনার ফোন নম্বর"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>ভূমিকা / Role</span>
                </Label>
                <Input
                  disabled
                  value={getRoleLabel(user.role)}
                  className="bg-gray-50"
                />
              </div>

              {/* Student-specific fields */}
              {user.role === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="class" className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>শ্রেণী / Class</span>
                  </Label>
                  <Select 
                    value={formData.class} 
                    onValueChange={(value) => setFormData({ ...formData, class: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="আপনার শ্রেণী নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.name}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Teacher-specific fields */}
              {user.role === 'teacher' && (
                <div className="space-y-2">
                  <Label htmlFor="subject" className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>বিষয় / Subject</span>
                  </Label>
                  <Select 
                    value={formData.subject} 
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="আপনার বিষয় নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.name}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    আপডেট করা হচ্ছে...
                  </>
                ) : (
                  'প্রোফাইল আপডেট করুন / Update Profile'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>অ্যাকাউন্ট তথ্য / Account Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">অ্যাকাউন্ট তৈরি / Account Created</p>
              <p className="font-semibold">{new Date(user.createdAt).toLocaleDateString('bn-BD')}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">শেষ আপডেট / Last Updated</p>
              <p className="font-semibold">{new Date(user.updatedAt).toLocaleDateString('bn-BD')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus } from 'lucide-react';

interface ClassInfo {
  id: string;
  name: string;
}

const CreateStudentForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    class: '',
  });
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingClasses, setFetchingClasses] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchClasses();
  }, []);

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
    } finally {
      setFetchingClasses(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the create_user edge function
      const { data, error } = await supabase.functions.invoke('create_user', {
        body: {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: 'student',
          class: formData.class
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to create user');
      }

      if (!data?.success) {
        console.error('User creation failed:', data);
        throw new Error(data?.error || 'Failed to create user');
      }

      toast({
        title: "সফল / Success",
        description: "শিক্ষার্থীর অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।",
      });

      setFormData({ name: '', email: '', password: '', class: '' });
    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: "ত্রুটি / Error",
        description: "শিক্ষার্থী তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-blue-600 flex items-center justify-center">
            <UserPlus className="mr-2 h-6 w-6" />
            শিক্ষার্থী তৈরি করুন / Create Student
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">নাম / Name *</Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="শিক্ষার্থীর পূর্ণ নাম লিখুন"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল / Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student.email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">পাসওয়ার্ড / Password *</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">শ্রেণী / Class *</Label>
              <Select 
                value={formData.class} 
                onValueChange={(value) => setFormData({ ...formData, class: value })}
                disabled={fetchingClasses}
              >
                <SelectTrigger>
                  <SelectValue placeholder={fetchingClasses ? "লোড হচ্ছে..." : "শ্রেণী নির্বাচন করুন"} />
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

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || fetchingClasses}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  তৈরি করা হচ্ছে...
                </>
              ) : (
                'শিক্ষার্থী তৈরি করুন / Create Student'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateStudentForm;
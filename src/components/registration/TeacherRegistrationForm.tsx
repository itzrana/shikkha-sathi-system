
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const TeacherRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const subjects = [
    'গণিত / Mathematics',
    'বাংলা / Bengali',
    'ইংরেজি / English',
    'বিজ্ঞান / Science',
    'সমাজ বিজ্ঞান / Social Studies',
    'ধর্ম / Religion',
    'শারীরিক শিক্ষা / Physical Education',
    'তথ্য ও যোগাযোগ প্রযুক্তি / ICT'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('pending_requests')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          role: 'teacher'
        });

      if (error) throw error;

      toast({
        title: "আবেদন জমা দেওয়া হয়েছে / Request Submitted",
        description: "আপনার আবেদন সফলভাবে জমা দেওয়া হয়েছে। অনুমোদনের জন্য অপেক্ষা করুন।",
      });

      setFormData({ name: '', email: '', subject: '' });
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "ত্রুটি / Error",
        description: "আবেদন জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-green-600">
          শিক্ষক নিবন্ধন / Teacher Registration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teacher-name">নাম / Name *</Label>
            <Input
              id="teacher-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="আপনার পূর্ণ নাম লিখুন"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher-email">ইমেইল / Email *</Label>
            <Input
              id="teacher-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">বিষয় / Subject *</Label>
            <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
              <SelectTrigger>
                <SelectValue placeholder="আপনার বিষয় নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                জমা দিচ্ছি...
              </>
            ) : (
              'আবেদন জমা দিন / Submit Request'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TeacherRegistrationForm;

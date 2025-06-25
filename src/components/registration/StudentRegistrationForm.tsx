
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const StudentRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    class: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const classes = [
    'Class 6-A', 'Class 6-B', 'Class 7-A', 'Class 7-B', 
    'Class 8-A', 'Class 8-B', 'Class 9-A', 'Class 9-B', 
    'Class 10-A', 'Class 10-B'
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
          class: formData.class,
          role: 'student'
        });

      if (error) throw error;

      toast({
        title: "আবেদন জমা দেওয়া হয়েছে / Request Submitted",
        description: "আপনার আবেদন সফলভাবে জমা দেওয়া হয়েছে। অনুমোদনের জন্য অপেক্ষা করুন।",
      });

      setFormData({ name: '', email: '', class: '' });
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
        <CardTitle className="text-center text-2xl font-bold text-blue-600">
          শিক্ষার্থী নিবন্ধন / Student Registration
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
              placeholder="আপনার পূর্ণ নাম লিখুন"
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
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">শ্রেণী / Class *</Label>
            <Select value={formData.class} onValueChange={(value) => setFormData({ ...formData, class: value })}>
              <SelectTrigger>
                <SelectValue placeholder="আপনার শ্রেণী নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
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

export default StudentRegistrationForm;

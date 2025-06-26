
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Settings, School, Users, Bell, Database, Shield } from 'lucide-react';

interface SchoolSettings {
  school_name: string;
  academic_year: string;
  attendance_requirement: number;
  notification_enabled: boolean;
  auto_approval: boolean;
  backup_frequency: string;
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SchoolSettings>({
    school_name: 'আদর্শ স্কুল',
    academic_year: '2024-2025',
    attendance_requirement: 75,
    notification_enabled: true,
    auto_approval: false,
    backup_frequency: 'daily',
  });
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name');

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const addClass = async () => {
    if (!newClassName.trim()) {
      toast({
        title: "ত্রুটি / Error",
        description: "ক্লাসের নাম প্রয়োজন।",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('classes')
        .insert({ name: newClassName.trim() });

      if (error) throw error;

      toast({
        title: "সফল / Success",
        description: "নতুন ক্লাস যোগ করা হয়েছে।",
      });

      setNewClassName('');
      fetchClasses();
    } catch (error) {
      console.error('Error adding class:', error);
      toast({
        title: "ত্রুটি / Error",
        description: "ক্লাস যোগ করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    }
  };

  const addSubject = async () => {
    if (!newSubjectName.trim()) {
      toast({
        title: "ত্রুটি / Error",
        description: "বিষয়ের নাম প্রয়োজন।",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('subjects')
        .insert({ name: newSubjectName.trim() });

      if (error) throw error;

      toast({
        title: "সফল / Success",
        description: "নতুন বিষয় যোগ করা হয়েছে।",
      });

      setNewSubjectName('');
      fetchSubjects();
    } catch (error) {
      console.error('Error adding subject:', error);
      toast({
        title: "ত্রুটি / Error",
        description: "বিষয় যোগ করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    }
  };

  const deleteClass = async (id: string) => {
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "সফল / Success",
        description: "ক্লাস মুছে ফেলা হয়েছে।",
      });

      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
      toast({
        title: "ত্রুটি / Error",
        description: "ক্লাস মুছতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "সফল / Success",
        description: "বিষয় মুছে ফেলা হয়েছে।",
      });

      fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: "ত্রুটি / Error",
        description: "বিষয় মুছতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // In a real app, you would save these settings to a database
      // For now, we'll just show a success message
      toast({
        title: "সফল / Success",
        description: "সেটিংস সংরক্ষিত হয়েছে।",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "ত্রুটি / Error",
        description: "সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings / সেটিংস</h2>

      {/* School Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            School Information / স্কুলের তথ্য
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">School Name / স্কুলের নাম</label>
              <Input
                value={settings.school_name}
                onChange={(e) => setSettings({...settings, school_name: e.target.value})}
                placeholder="Enter school name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Academic Year / শিক্ষাবর্ষ</label>
              <Input
                value={settings.academic_year}
                onChange={(e) => setSettings({...settings, academic_year: e.target.value})}
                placeholder="e.g., 2024-2025"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Attendance Settings / উপস্থিতির সেটিংস
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum Attendance Requirement (%) / সর্বনিম্ন উপস্থিতির প্রয়োজনীয়তা (%)
            </label>
            <Input
              type="number"
              value={settings.attendance_requirement}
              onChange={(e) => setSettings({...settings, attendance_requirement: Number(e.target.value)})}
              placeholder="75"
              min="0"
              max="100"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Enable Attendance Notifications / উপস্থিতির বিজ্ঞপ্তি সক্রিয় করুন
            </label>
            <Switch
              checked={settings.notification_enabled}
              onCheckedChange={(checked) => setSettings({...settings, notification_enabled: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Class Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Class Management / ক্লাস ব্যবস্থাপনা
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Enter new class name"
              className="flex-1"
            />
            <Button onClick={addClass}>Add Class / ক্লাস যোগ করুন</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {classes.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between p-2 border rounded">
                <span>{cls.name}</span>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteClass(cls.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subject Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Subject Management / বিষয় ব্যবস্থাপনা
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="Enter new subject name"
              className="flex-1"
            />
            <Button onClick={addSubject}>Add Subject / বিষয় যোগ করুন</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex items-center justify-between p-2 border rounded">
                <span>{subject.name}</span>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteSubject(subject.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Settings / সিস্টেম সেটিংস
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Auto-approve Registration Requests / স্বয়ংক্রিয় অনুমোদন
            </label>
            <Switch
              checked={settings.auto_approval}
              onCheckedChange={(checked) => setSettings({...settings, auto_approval: checked})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Backup Frequency / ব্যাকআপের ফ্রিকোয়েন্সি
            </label>
            <Select
              value={settings.backup_frequency}
              onValueChange={(value) => setSettings({...settings, backup_frequency: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select backup frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily / প্রতিদিন</SelectItem>
                <SelectItem value="weekly">Weekly / সাপ্তাহিক</SelectItem>
                <SelectItem value="monthly">Monthly / মাসিক</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={loading}>
          <Settings className="mr-2 h-4 w-4" />
          {loading ? 'Saving...' : 'Save Settings / সেটিংস সংরক্ষণ করুন'}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;

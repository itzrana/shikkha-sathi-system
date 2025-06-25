
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StudentRegistrationForm from '@/components/registration/StudentRegistrationForm';
import TeacherRegistrationForm from '@/components/registration/TeacherRegistrationForm';
import { GraduationCap, Users, School } from 'lucide-react';
import { Link } from 'react-router-dom';

const Registration: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <School className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">
              স্কুল নিবন্ধন সিস্টেম
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            School Registration System
          </p>
          <Link to="/">
            <Button variant="outline" className="mb-6">
              ← মূল পাতায় ফিরুন / Back to Home
            </Button>
          </Link>
        </div>

        {/* Registration Forms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              নিবন্ধনের জন্য আবেদন করুন / Apply for Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student" className="flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>শিক্ষার্থী / Student</span>
                </TabsTrigger>
                <TabsTrigger value="teacher" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>শিক্ষক / Teacher</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="student">
                <StudentRegistrationForm />
              </TabsContent>
              
              <TabsContent value="teacher">
                <TeacherRegistrationForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>নির্দেশনা / Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-blue-600">
                  শিক্ষার্থীদের জন্য / For Students
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• আপনার পূর্ণ নাম সঠিকভাবে লিখুন</li>
                  <li>• একটি বৈধ ইমেইল ঠিকানা দিন</li>
                  <li>• আপনার শ্রেণী নির্বাচন করুন</li>
                  <li>• অনুমোদনের জন্য অপেক্ষা করুন</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-green-600">
                  শিক্ষকদের জন্য / For Teachers
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• আপনার পূর্ণ নাম সঠিকভাবে লিখুন</li>
                  <li>• একটি বৈধ ইমেইল ঠিকানা দিন</li>
                  <li>• আপনার পাঠ্য বিষয় নির্বাচন করুন</li>
                  <li>• অনুমোদনের জন্য অপেক্ষা করুন</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Registration;

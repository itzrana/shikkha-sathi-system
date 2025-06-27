
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { School, Loader2, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Invalid email or password / ভুল ইমেইল বা পাসওয়ার্ড');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string, role: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      await login({ email: demoEmail, password: demoPassword });
    } catch (err: any) {
      console.error('Demo login error:', err);
      setError(`Demo ${role} login failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full shadow-lg">
              <School className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            স্কুল ব্যবস্থাপনা সিস্টেম
          </h1>
          <p className="text-gray-600">School Management System</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-gray-800">
              লগইন / Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  ইমেইল / Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  পাসওয়ার্ড / Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    লগইন করা হচ্ছে...
                  </>
                ) : (
                  'লগইন করুন / Login'
                )}
              </Button>
            </form>

            <div className="pt-4 border-t border-gray-200">
              <Link to="/register">
                <Button variant="outline" className="w-full h-12 mb-4">
                  <UserPlus className="mr-2 h-4 w-4" />
                  নিবন্ধনের জন্য আবেদন / Apply for Registration
                </Button>
              </Link>

              {/* Demo Login Buttons */}
              <div className="space-y-2">
                <p className="text-center text-sm text-gray-600 font-semibold">
                  ডেমো লগইন / Demo Login:
                </p>
                
                <Button 
                  variant="outline" 
                  className="w-full h-10 text-sm bg-red-50 hover:bg-red-100 border-red-200"
                  onClick={() => handleDemoLogin('juwelsr57@gmail.com', 'admin123', 'Admin')}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : null}
                  Admin Login (juwelsr57@gmail.com)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;

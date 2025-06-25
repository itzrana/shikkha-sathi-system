
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface PendingRequest {
  id: string;
  name: string;
  email: string;
  class?: string;
  subject?: string;
  role: 'student' | 'teacher';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const RegistrationRequests: React.FC = () => {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('pending_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter out admin roles and cast to our interface
      const filteredData = (data || [])
        .filter(request => request.role !== 'admin')
        .map(request => ({
          id: request.id,
          name: request.name,
          email: request.email,
          class: request.class,
          subject: request.subject,
          role: request.role as 'student' | 'teacher',
          status: request.status as 'pending' | 'approved' | 'rejected',
          created_at: request.created_at
        }));
      
      setRequests(filteredData);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "ত্রুটি / Error",
        description: "আবেদনগুলি লোড করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  };

  const approveRequest = async (request: PendingRequest) => {
    setProcessingIds(prev => new Set(prev).add(request.id));
    
    try {
      const password = generatePassword();
      
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: request.email,
        password: password,
        email_confirm: true,
        user_metadata: {
          name: request.name,
          role: request.role
        }
      });

      if (authError) throw authError;

      // Insert into profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: request.name,
          email: request.email,
          role: request.role,
          class: request.class,
          subject: request.subject
        });

      if (profileError) throw profileError;

      // Update request status
      const { error: updateError } = await supabase
        .from('pending_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      toast({
        title: "অনুমোদিত / Approved",
        description: `${request.name} এর আবেদন অনুমোদিত হয়েছে। পাসওয়ার্ড: ${password}`,
      });

      // Remove from pending list
      setRequests(prev => prev.filter(r => r.id !== request.id));
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "ত্রুটি / Error",
        description: "আবেদন অনুমোদন করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(request.id);
        return newSet;
      });
    }
  };

  const rejectRequest = async (requestId: string) => {
    setProcessingIds(prev => new Set(prev).add(requestId));
    
    try {
      const { error } = await supabase
        .from('pending_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "প্রত্যাখ্যাত / Rejected",
        description: "আবেদনটি প্রত্যাখ্যান করা হয়েছে।",
      });

      // Remove from pending list
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "ত্রুটি / Error",
        description: "আবেদন প্রত্যাখ্যান করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>নিবন্ধন আবেদনসমূহ / Registration Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            কোনো নতুন আবেদন নেই / No pending requests
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>নাম / Name</TableHead>
                <TableHead>ইমেইল / Email</TableHead>
                <TableHead>ভূমিকা / Role</TableHead>
                <TableHead>শ্রেণী/বিষয় / Class/Subject</TableHead>
                <TableHead>তারিখ / Date</TableHead>
                <TableHead>কার্যক্রম / Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>
                    <Badge variant={request.role === 'student' ? 'default' : 'secondary'}>
                      {request.role === 'student' ? 'শিক্ষার্থী' : 'শিক্ষক'}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.class || request.subject}</TableCell>
                  <TableCell>{new Date(request.created_at).toLocaleDateString('bn-BD')}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => approveRequest(request)}
                        disabled={processingIds.has(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processingIds.has(request.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            অনুমোদন
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejectRequest(request.id)}
                        disabled={processingIds.has(request.id)}
                      >
                        {processingIds.has(request.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            প্রত্যাখ্যান
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RegistrationRequests;

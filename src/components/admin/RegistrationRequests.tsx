
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

interface PendingRequest {
  id: string;
  name: string;
  email: string;
  class?: string | null;
  subject?: string | null;
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

      if (error) {
        console.error('Pending requests fetch error:', error);
        throw error;
      }
      
      const filteredData: PendingRequest[] = (data || [])
        .filter(request => request.role !== 'admin')
        .map(request => ({
          id: request.id,
          name: request.name,
          email: request.email,
          class: request.class,
          subject: request.subject,
          role: request.role as 'student' | 'teacher',
          status: request.status as 'pending' | 'approved' | 'rejected',
          created_at: request.created_at || new Date().toISOString()
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

  const approveRequest = async (request: PendingRequest) => {
    const result = await Swal.fire({
      title: 'আবেদন অনুমোদন করুন',
      text: `${request.name} এর আবেদন অনুমোদন করতে চান?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'হ্যাঁ, অনুমোদন করুন',
      cancelButtonText: 'বাতিল'
    });

    if (!result.isConfirmed) return;

    setProcessingIds(prev => new Set(prev).add(request.id));
    
    try {
      console.log('Starting approval process for:', request);

      // Generate a random user ID for the new user
      const userId = crypto.randomUUID();
      
      // Create profile directly without using admin API
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name: request.name,
          email: request.email,
          role: request.role,
          class: request.class,
          subject: request.subject,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }

      // Update request status
      const { error: updateError } = await supabase
        .from('pending_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (updateError) {
        console.error('Request update error:', updateError);
        throw updateError;
      }

      await Swal.fire({
        title: 'সফল!',
        text: `${request.name} এর আবেদন অনুমোদিত হয়েছে এবং তালিকায় যোগ করা হয়েছে।`,
        icon: 'success',
        confirmButtonText: 'ঠিক আছে'
      });

      // Remove from pending list
      setRequests(prev => prev.filter(r => r.id !== request.id));
      
    } catch (error) {
      console.error('Error approving request:', error);
      await Swal.fire({
        title: 'ত্রুটি!',
        text: 'আবেদন অনুমোদন করতে সমস্যা হয়েছে।',
        icon: 'error',
        confirmButtonText: 'ঠিক আছে'
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(request.id);
        return newSet;
      });
    }
  };


  const rejectRequest = async (requestId: string, requestName: string) => {
    const result = await Swal.fire({
      title: 'আবেদন প্রত্যাখ্যান করুন',
      text: `${requestName} এর আবেদন প্রত্যাখ্যান করতে চান?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'হ্যাঁ, প্রত্যাখ্যান করুন',
      cancelButtonText: 'বাতিল'
    });

    if (!result.isConfirmed) return;

    setProcessingIds(prev => new Set(prev).add(requestId));
    
    try {
      const { error } = await supabase
        .from('pending_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) {
        console.error('Request rejection error:', error);
        throw error;
      }

      await Swal.fire({
        title: 'প্রত্যাখ্যাত!',
        text: 'আবেদনটি প্রত্যাখ্যান করা হয়েছে।',
        icon: 'success',
        confirmButtonText: 'ঠিক আছে'
      });

      // Remove from pending list
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Error rejecting request:', error);
      await Swal.fire({
        title: 'ত্রুটি!',
        text: 'আবেদন প্রত্যাখ্যান করতে সমস্যা হয়েছে।',
        icon: 'error',
        confirmButtonText: 'ঠিক আছে'
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
                  <TableCell>{request.class || request.subject || 'N/A'}</TableCell>
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
                        onClick={() => rejectRequest(request.id, request.name)}
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


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Bell, Send, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  recipient_id: string | null;
  sender_id: string;
  read: boolean;
  created_at: string;
  recipient?: {
    name: string;
    email: string;
    role: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const NotificationManagement: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState('all');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          recipient:profiles!notifications_recipient_id_fkey(name, email, role)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Notifications fetch error:', error);
        throw error;
      }
      
      const notificationsData: Notification[] = (data || []).map((notification: any) => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        recipient_id: notification.recipient_id,
        sender_id: notification.sender_id,
        read: notification.read,
        created_at: notification.created_at,
        recipient: notification.recipient ? {
          name: notification.recipient.name,
          email: notification.recipient.email,
          role: notification.recipient.role
        } : undefined
      }));
      
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "ত্রুটি / Error",
        description: "বিজ্ঞপ্তি লোড করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .neq('role', 'admin');

      if (error) {
        console.error('Users fetch error:', error);
        throw error;
      }
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const sendNotification = async () => {
    if (!title || !message) {
      toast({
        title: "ত্রুটি / Error",
        description: "শিরোনাম এবং বার্তা প্রয়োজন।",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, we'll use a mock sender ID
      const mockSenderId = crypto.randomUUID();
      
      if (recipientType === 'all') {
        // Send to all users
        const notifications = users.map(user => ({
          title,
          message,
          recipient_id: user.id,
          sender_id: mockSenderId,
        }));

        const { error } = await supabase
          .from('notifications')
          .insert(notifications);

        if (error) throw error;
      } else if (recipientType === 'role') {
        // Send to specific role
        const roleUsers = users.filter(user => user.role === selectedRecipient);
        const notifications = roleUsers.map(user => ({
          title,
          message,
          recipient_id: user.id,
          sender_id: mockSenderId,
        }));

        const { error } = await supabase
          .from('notifications')
          .insert(notifications);

        if (error) throw error;
      } else {
        // Send to specific user
        const { error } = await supabase
          .from('notifications')
          .insert({
            title,
            message,
            recipient_id: selectedRecipient,
            sender_id: mockSenderId,
          });

        if (error) throw error;
      }

      toast({
        title: "সফল / Success",
        description: "বিজ্ঞপ্তি পাঠানো হয়েছে।",
      });

      setTitle('');
      setMessage('');
      setSelectedRecipient('');
      fetchNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "ত্রুটি / Error",
        description: "বিজ্ঞপ্তি পাঠাতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "সফল / Success",
        description: "বিজ্ঞপ্তি মুছে ফেলা হয়েছে।",
      });

      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "ত্রুটি / Error",
        description: "বিজ্ঞপ্তি মুছতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Notification Management / বিজ্ঞপ্তি ব্যবস্থাপনা</h2>

      {/* Send Notification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Notification / বিজ্ঞপ্তি পাঠান
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title / শিরোনাম</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message / বার্তা</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Send To / প্রাপক</label>
              <Select value={recipientType} onValueChange={setRecipientType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users / সবাই</SelectItem>
                  <SelectItem value="role">By Role / ভূমিকা অনুযায়ী</SelectItem>
                  <SelectItem value="individual">Individual / ব্যক্তিগত</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {recipientType === 'role' && (
              <div>
                <label className="block text-sm font-medium mb-2">Role / ভূমিকা</label>
                <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Students / শিক্ষার্থী</SelectItem>
                    <SelectItem value="teacher">Teachers / শিক্ষক</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {recipientType === 'individual' && (
              <div>
                <label className="block text-sm font-medium mb-2">User / ব্যবহারকারী</label>
                <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button onClick={sendNotification} disabled={loading}>
            <Send className="mr-2 h-4 w-4" />
            {loading ? 'Sending...' : 'Send Notification / পাঠান'}
          </Button>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Sent Notifications / পাঠানো বিজ্ঞপ্তি
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title / শিরোনাম</TableHead>
                <TableHead>Recipient / প্রাপক</TableHead>
                <TableHead>Date / তারিখ</TableHead>
                <TableHead>Status / অবস্থা</TableHead>
                <TableHead>Actions / কার্যক্রম</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell>
                    {notification.recipient_id && notification.recipient ? (
                      <div>
                        <div>{notification.recipient.name}</div>
                        <div className="text-sm text-gray-500">{notification.recipient.email}</div>
                      </div>
                    ) : (
                      'All Users'
                    )}
                  </TableCell>
                  <TableCell>{new Date(notification.created_at).toLocaleDateString('bn-BD')}</TableCell>
                  <TableCell>
                    <Badge variant={notification.read ? 'default' : 'secondary'}>
                      {notification.read ? 'Read / পড়া হয়েছে' : 'Unread / অপঠিত'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {notifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No notifications sent yet. Send your first notification to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationManagement;

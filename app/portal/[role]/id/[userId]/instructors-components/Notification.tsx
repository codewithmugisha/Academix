'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Bell, Clock, User, UserCheck, BookOpen } from 'lucide-react'; // Added UserCheck for instructors

// Sample notification data for Academix - tailored for students and instructors
// Replace with your actual data source (e.g., API fetch with role-based filtering)
interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  avatar?: string;
  userName?: string;
  role?: 'student' | 'instructor'; // Added role for context
  link?: string;
}

const sampleNotifications: Notification[] = [
  // Student-focused
  {
    id: '1',
    title: 'New assignment from Prof. Smith',
    description: 'You have a new assignment in Introduction to Algorithms. Due in 3 days.',
    type: 'info',
    timestamp: '2 minutes ago',
    read: false,
    avatar: '/avatars/prof-smith.jpg',
    userName: 'Prof. John Smith',
    role: 'instructor',
  },
  {
    id: '2',
    title: 'Assignment submitted successfully',
    description: 'Your submission for Data Structures #12345 has been received and graded.',
    type: 'success',
    timestamp: '1 hour ago',
    read: true,
    link: '/courses/data-structures/assignments/12345',
  },
  {
    id: '3',
    title: 'Tuition payment due',
    description: 'Your semester tuition is due in 3 days. Please update your payment method.',
    type: 'warning',
    timestamp: '1 day ago',
    read: false,
  },
  // Instructor-focused
  {
    id: '4',
    title: 'New course enrollment',
    description: 'Student Jane Doe has enrolled in your Machine Learning course.',
    type: 'info',
    timestamp: '2 hours ago',
    read: false,
    avatar: '/avatars/student-jane.jpg',
    userName: 'Jane Doe',
    role: 'student',
    link: '/courses/machine-learning/students',
  },
  {
    id: '5',
    title: 'Grade review request',
    description: 'A student has requested a review for their midterm exam in Calculus.',
    type: 'warning',
    timestamp: '1 day ago',
    read: true,
    link: '/courses/calculus/grades/review',
  },
  {
    id: '6',
    title: 'New course material available',
    description: 'Updated lecture notes for Machine Learning are now available in the course portal.',
    type: 'info',
    timestamp: '2 days ago',
    read: true,
  },
];

const getBadgeVariant = (type: Notification['type']) => {
  switch (type) {
    case 'success': return 'default' as const;
    case 'warning': return 'secondary' as const;
    case 'error': return 'destructive' as const;
    default: return 'outline' as const;
  }
};

const getFallbackIcon = (role?: Notification['role']) => {
  if (role === 'instructor') return <UserCheck className="h-4 w-4" />;
  if (role === 'student') return <User className="h-4 w-4" />;
  return <BookOpen className="h-4 w-4" />;
};

export default function NotificationsPage() {
  const [notifications] = useState<Notification[]>(sampleNotifications);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="w-full">
          <CardHeader className="flex flex-col items-start gap-2 pb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle className="text-xl">Academix Notifications</CardTitle>
              <Badge
                variant="destructive"
                className="ml-auto"
              >
                {notifications.filter(n => !n.read).length}
              </Badge>
            </div>
            <CardDescription>Stay updated with your academic activity as a student or instructor</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-4 hover:bg-accent transition-colors">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={notification.avatar} />
                      <AvatarFallback>
                        {getFallbackIcon(notification.role)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 ml-2">
                          <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                            {notification.type}
                          </Badge>
                          {notification.role && (
                            <Badge variant="outline" className="text-xs">
                              {notification.role}
                            </Badge>
                          )}
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {notification.timestamp}
                          </div>
                        </div>
                      </div>
                      {notification.link && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 mt-2 text-primary"
                          asChild
                        >
                          <a href={notification.link}>View details</a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {notifications.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
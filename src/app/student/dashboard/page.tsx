'use client';

import { useUser, useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { StudentProfile } from '@/lib/types';
import { Application } from '@/lib/types';
import { ArrowRight, FileText, UserCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentDashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const studentProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'studentProfiles', user.uid);
  }, [firestore, user]);

  const { data: studentProfile, isLoading: isProfileLoading } = useDoc<StudentProfile>(studentProfileRef);

  const applicationsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'applications'), where('studentId', '==', user.uid));
  }, [firestore, user]);

  const { data: applications, isLoading: areApplicationsLoading } = useCollection<Application>(applicationsQuery);

  const isLoading = isUserLoading || isProfileLoading || areApplicationsLoading;

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="grid gap-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {studentProfile?.fullName || 'Student'}!</h1>
          <p className="text-muted-foreground">Here is your dashboard.</p>
        </div>
        <Button asChild>
          <Link href="/student/profile">Edit Profile <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <UserCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentProfile?.profileCompletionPercentage || 0}%</div>
            <Progress value={studentProfile?.profileCompletionPercentage || 0} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications?.length || 0}</div>
            <p className="text-xs text-muted-foreground">You have applied to {applications?.length || 0} jobs.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>Track the status of your job applications.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications && applications.length > 0 ? (
                applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">Job Title Placeholder</TableCell>
                    <TableCell>Company Placeholder</TableCell>
                    <TableCell>{app.appliedAt ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={app.status === 'shortlisted' || app.status === 'hired' ? 'default' : 'secondary'}>
                        {app.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">You haven&apos;t applied to any jobs yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
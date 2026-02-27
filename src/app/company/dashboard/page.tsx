'use client';

import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Job, Application } from '@/lib/types';
import { Briefcase, PlusCircle, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function JobRow({ job }: { job: Job & { id: string } }) {
    const firestore = useFirestore();

    const applicationsQuery = useMemoFirebase(() => {
        return query(collection(firestore, 'applications'), where('jobId', '==', job.id));
    }, [firestore, job.id]);

    const { data: applications, isLoading: areApplicationsLoading } = useCollection<Application>(applicationsQuery);

    return (
        <TableRow>
            <TableCell className="font-medium">{job.title}</TableCell>
            <TableCell><Badge variant={job.status === 'open' ? 'default' : 'secondary'}>{job.status}</Badge></TableCell>
            <TableCell>{job.createdAt ? new Date(job.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</TableCell>
            <TableCell className="text-center">
                {areApplicationsLoading ? <Skeleton className="h-5 w-5 rounded-full" /> : applications?.length ?? 0}
            </TableCell>
            <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/jobs/${job.slug}`}>View Job</Link>
                </Button>
            </TableCell>
        </TableRow>
    );
}

export default function CompanyDashboardPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const jobsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, 'jobs'), where('companyId', '==', user.uid));
    }, [firestore, user]);

    const { data: jobs, isLoading: areJobsLoading } = useCollection<Job>(jobsQuery);

    const applicationsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, 'applications'), where('companyId', '==', user.uid));
    }, [firestore, user]);

    const { data: applications, isLoading: areApplicationsLoading } = useCollection<Application>(applicationsQuery);

    const isLoading = isUserLoading || areJobsLoading || areApplicationsLoading;

    if (isLoading) {
        return (
          <div className="container py-10">
            <div className="grid gap-8">
              <Skeleton className="h-10 w-64" />
              <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
              <Skeleton className="h-64" />
            </div>
          </div>
        );
    }

    return (
      <div className="container py-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold">Company Dashboard</h1>
            <Button asChild size="lg">
                <Link href="/company/post-job"><PlusCircle /> Post a New Job</Link>
            </Button>
          </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{jobs?.filter(j => j.status === 'open').length || 0}</div>
                    <p className="text-xs text-muted-foreground">Total of {jobs?.length || 0} jobs posted.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{applications?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">Across all your job postings.</p>
                </CardContent>
            </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>My Job Postings</CardTitle>
            <CardDescription>Manage your job listings and view applicants.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Posted On</TableHead>
                  <TableHead className="text-center">Applicants</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs && jobs.length > 0 ? (
                  jobs.map((job) => <JobRow key={job.id} job={job as Job & {id: string}} />)
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      You haven&apos;t posted any jobs yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

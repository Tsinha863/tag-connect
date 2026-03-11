'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useDoc, useCollection, useFirestore, useMemoFirebase, FirestorePermissionError, errorEmitter } from '@/firebase';
import { collection, doc, query, where, updateDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { Job, Application, StudentProfile, Placement } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';


function ApplicantRow({ application }: { application: Application & { id: string } }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = React.useState(false);

    const studentProfileRef = useMemoFirebase(() => {
        if (!application) return null;
        return doc(firestore, 'studentProfiles', application.studentId);
    }, [firestore, application.studentId]);
    
    const { data: studentProfile, isLoading } = useDoc<StudentProfile>(studentProfileRef);
    
    const handleStatusChange = async (status: 'shortlisted' | 'rejected' | 'hired') => {
        setIsUpdating(true);
        const appRef = doc(firestore, 'applications', application.id);
        const updatedData = { status };

        updateDoc(appRef, updatedData)
            .then(() => {
                toast({ title: 'Status Updated', description: `Applicant marked as ${status}.` });

                if (status === 'hired') {
                    const jobRef = doc(firestore, 'jobs', application.jobId);
                    
                    // This must be awaited as we need the job data
                    getDoc(jobRef).then(jobSnap => {
                        if (jobSnap.exists() && studentProfile) {
                            const job = jobSnap.data() as Job;
                            const salary = job.salaryMax || job.salaryMin || 0;
                            // Assuming 8.33% commission as a default, can be edited by admin
                            const commissionPercent = 8.33; 
                            const commissionAmount = salary * (commissionPercent / 100);
                            const placementId = uuidv4();

                            const placementData: Omit<Placement, 'joiningDate' | 'createdAt'> & { joiningDate: any, createdAt: any } = {
                                id: placementId,
                                studentId: application.studentId,
                                companyId: application.companyId,
                                jobId: application.jobId,
                                studentName: application.studentName,
                                companyName: job.companyName,
                                jobTitle: job.title,
                                salary: salary,
                                commissionPercent: commissionPercent,
                                commissionAmount: commissionAmount,
                                joiningDate: serverTimestamp(), // Placeholder, admin can update
                                createdAt: serverTimestamp(),
                                status: 'pending_invoice',
                            };
                            const placementRef = doc(firestore, 'placements', placementId);
                            
                            // Non-blocking write for the new placement
                            setDoc(placementRef, placementData).catch(error => {
                                const permissionError = new FirestorePermissionError({
                                    path: placementRef.path,
                                    operation: 'create',
                                    requestResourceData: placementData,
                                });
                                errorEmitter.emit('permission-error', permissionError);
                                toast({ variant: 'destructive', title: 'Hiring Error', description: 'Could not create placement record.' });
                            });
                        }
                    });
                }
            })
            .catch(error => {
                const permissionError = new FirestorePermissionError({
                    path: appRef.path,
                    operation: 'update',
                    requestResourceData: updatedData,
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not update status. Check permissions.' });
            })
            .finally(() => {
                setIsUpdating(false);
            });
    }

    if (isLoading) {
        return <TableRow><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>;
    }
    
    return (
        <TableRow>
            <TableCell className="font-medium">
                {application.studentName}
            </TableCell>
            <TableCell>
                {application.appliedAt ? new Date(application.appliedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
            </TableCell>
            <TableCell>
                <Badge 
                  variant={
                    application.status === 'hired' ? 'default' : 
                    application.status === 'shortlisted' ? 'default' :
                    application.status === 'rejected' ? 'destructive' :
                    'secondary'
                  }
                  className={
                    application.status === 'shortlisted' ? 'bg-blue-500 hover:bg-blue-600' : ''
                  }
                >
                  {application.status}
                </Badge>
            </TableCell>
            <TableCell>
                {studentProfile?.cvUrl ? (
                    <Button variant="link" asChild className="p-0 h-auto">
                        <a href={studentProfile.cvUrl} target="_blank" rel="noopener noreferrer">View CV</a>
                    </Button>
                ) : (
                    <span className="text-muted-foreground text-sm">No CV</span>
                )}
            </TableCell>
            <TableCell className="text-right">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isUpdating}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStatusChange('shortlisted')}>Shortlist</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange('rejected')}>Reject</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange('hired')}>Mark as Hired</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}


export default function JobApplicantsPage() {
    const params = useParams();
    const jobId = params.jobId as string;
    const firestore = useFirestore();

    const jobRef = useMemoFirebase(() => {
        if (!jobId) return null;
        return doc(firestore, 'jobs', jobId);
    }, [firestore, jobId]);
    const { data: job, isLoading: isJobLoading } = useDoc<Job>(jobRef);

    const applicationsQuery = useMemoFirebase(() => {
        if (!jobId) return null;
        return query(collection(firestore, 'applications'), where('jobId', '==', jobId));
    }, [firestore, jobId]);

    const { data: applications, isLoading: areApplicationsLoading } = useCollection<Application>(applicationsQuery);

    const isLoading = isJobLoading || areApplicationsLoading;
    
    if (isLoading) {
        return (
            <div className="container py-10">
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-8" />
                <Card>
                    <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
                    <CardContent><Skeleton className="h-48 w-full" /></CardContent>
                </Card>
            </div>
        )
    }
    
    return (
        <div className="container py-10">
             <div className="mb-8">
                <Link href="/company/dashboard" className="text-sm text-primary hover:underline">&larr; Back to Dashboard</Link>
                <h1 className="text-3xl font-bold mt-2">{job?.title || 'Job'} Applicants</h1>
                <p className="text-muted-foreground">{job?.location}</p>
             </div>
             
             <Card>
                 <CardHeader>
                     <CardTitle>Received Applications</CardTitle>
                     <CardDescription>
                         {applications?.length ?? 0} people have applied for this job.
                     </CardDescription>
                 </CardHeader>
                 <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Applied On</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>CV</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications && applications.length > 0 ? (
                                applications.map(app => <ApplicantRow key={app.id} application={app as Application & {id: string}} />)
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">No one has applied yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                     </Table>
                 </CardContent>
             </Card>
        </div>
    )
}

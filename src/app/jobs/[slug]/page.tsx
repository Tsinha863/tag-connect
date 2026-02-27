'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, where, limit, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { Job } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Building, Calendar, CircleDollarSign, GraduationCap, Lightbulb, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';

export default function JobDetailsPage() {
    const { slug } = useParams();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [isApplying, setIsApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    const jobQuery = useMemoFirebase(() => {
        if (!slug) return null;
        return query(collection(firestore, 'jobs'), where('slug', '==', slug), limit(1));
    }, [firestore, slug]);

    const { data: jobs, isLoading: isJobLoading } = useCollection<Job>(jobQuery);
    const job = jobs?.[0];

    const applicationQuery = useMemoFirebase(() => {
        if (!user || !job) return null;
        return query(collection(firestore, 'applications'), where('studentId', '==', user.uid), where('jobId', '==', job.id), limit(1));
    }, [firestore, user, job]);

    const {data: applications, isLoading: isApplicationLoading } = useCollection(applicationQuery);

    useEffect(() => {
        if (applications && applications.length > 0) {
            setHasApplied(true);
        }
    }, [applications]);

    const handleApply = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (!job) return;

        // A temp fix to get role from user object if it exists. 
        // In a real app, this should be handled more robustly via custom claims or a profile fetch.
        const userRole = (user as any).role;
        if (userRole !== 'student') {
            toast({ variant: 'destructive', title: 'Cannot Apply', description: 'Only students can apply for jobs.' });
            return;
        }

        setIsApplying(true);

        const applicationId = uuidv4();
        const applicationData = {
            id: applicationId,
            jobId: job.id,
            jobTitle: job.title,
            studentId: user.uid,
            studentName: user.displayName || 'N/A',
            companyId: job.companyId,
            companyName: job.companyName,
            status: 'applied',
            appliedAt: serverTimestamp(),
        };

        const applicationRef = doc(firestore, 'applications', applicationId);

        setDoc(applicationRef, applicationData)
            .then(() => {
                toast({ title: 'Application Sent!', description: 'Your application has been submitted.' });
                setHasApplied(true);
            })
            .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: applicationRef.path,
                    operation: 'create',
                    requestResourceData: applicationData,
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not submit application.' });
            })
            .finally(() => {
                setIsApplying(false);
            });
    };
    
    const isLoading = isJobLoading || isUserLoading || isApplicationLoading;

    if (isLoading) {
        return (
            <div className="container py-10">
                <Card>
                    <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="container py-10 text-center">
                <h2 className="text-2xl font-bold">Job not found</h2>
                <p className="text-muted-foreground">The job you are looking for might have been removed or the link is incorrect.</p>
                <Button asChild className="mt-4"><Link href="/jobs">Go to Jobs</Link></Button>
            </div>
        );
    }

    return (
        <div className="bg-muted/40">
            <div className="container py-10">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                            <div className="flex-1">
                                <Badge variant="outline" className="mb-2">{job.jobType}</Badge>
                                <CardTitle className="text-3xl">{job.title}</CardTitle>
                                <CardDescription className="mt-2 text-base">
                                    {job.location}
                                </CardDescription>
                            </div>
                            <div className="flex-shrink-0">
                                {user?.role === 'student' && (
                                    <Button onClick={handleApply} disabled={isApplying || hasApplied} size="lg">
                                        {isApplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {hasApplied ? 'Applied' : 'Apply Now'}
                                    </Button>
                                )}
                                {(user?.role === 'company' && user.uid === job.companyId) && (
                                     <Button asChild size="lg">
                                        <Link href={`/company/dashboard`}>Manage Job</Link>
                                    </Button>
                                )}
                                 {!user && (
                                     <Button asChild size="lg">
                                        <Link href="/login">Log in to Apply</Link>
                                    </Button>
                                 )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <h3 className="font-bold text-xl">Job Description</h3>
                            <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                            
                            <h3 className="font-bold text-xl">Skills Required</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.skillsRequired.map(skill => <Badge key={skill}>{skill}</Badge>)}
                            </div>
                        </div>
                        <div className="space-y-6">
                             <Card className="bg-muted/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">Job Overview</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    {job.salaryMin && job.salaryMax && (
                                        <div className="flex items-center">
                                            <CircleDollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                                            <span>₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()} per year</span>
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <span>{job.jobType}</span>
                                    </div>
                                     <div className="flex items-center">
                                        <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <span>{job.educationRequired}</span>
                                    </div>
                                     <div className="flex items-center">
                                        <Lightbulb className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <span>{job.experienceRequired} years experience</span>
                                    </div>
                                     <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <span>Posted on {job.createdAt ? new Date(job.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </CardContent>
                             </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

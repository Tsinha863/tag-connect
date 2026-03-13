'use client';

import { useUser, FirestorePermissionError, errorEmitter, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { getUserRole } from '@/firebase/auth';
import { doc, setDoc, serverTimestamp, query, collection, where, limit, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { Job, StudentProfile } from '@/lib/types';
import Link from 'next/link';

export function JobApplyButton({ job }: { job: Job & { id: string } }) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [isApplying, setIsApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isRoleLoading, setIsRoleLoading] = useState(true);

    const applicationQuery = useMemoFirebase(() => {
        if (!user || !job) return null;
        return query(collection(firestore, 'applications'), where('studentId', '==', user.uid), where('jobId', '==', job.id), limit(1));
    }, [firestore, user, job]);

    const { data: applications, isLoading: isApplicationLoading } = useCollection(applicationQuery);

    useEffect(() => {
        if (applications && applications.length > 0) {
            setHasApplied(true);
        }
    }, [applications]);

    useEffect(() => {
        if (user && firestore) {
            setIsRoleLoading(true);
            getUserRole(firestore, user.uid).then(role => {
                setUserRole(role);
                setIsRoleLoading(false);
            });
        } else if (!isUserLoading) {
            // If there's no user and we are not loading one, role loading is finished.
            setIsRoleLoading(false);
        }
    }, [user, firestore, isUserLoading]);

    const handleApply = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (!job) return;

        if (userRole !== 'student') {
            toast({ variant: 'destructive', title: 'Cannot Apply', description: 'Only students can apply for jobs.' });
            return;
        }

        setIsApplying(true);

        // Fetch student profile to get CV url
        const studentProfileRef = doc(firestore, 'studentProfiles', user.uid);
        const studentProfileSnap = await getDoc(studentProfileRef);

        if (!studentProfileSnap.exists()) {
            toast({ variant: 'destructive', title: 'Profile Not Found', description: 'Please complete your student profile before applying.' });
            setIsApplying(false);
            router.push('/student/profile');
            return;
        }

        const studentProfile = studentProfileSnap.data() as StudentProfile;

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
            cvUrl: studentProfile.cvUrl || '',
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

    if (isUserLoading || isApplicationLoading || isRoleLoading) {
        return <Button disabled size="lg"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking status...</Button>
    }
    
    if (user && userRole === 'student') {
        return (
            <Button onClick={handleApply} disabled={isApplying || hasApplied} size="lg">
                {isApplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {hasApplied ? 'Applied' : 'Apply Now'}
            </Button>
        );
    }
    
    if (user && userRole === 'company' && user?.uid === job.companyId) {
        return (
             <Button asChild size="lg">
                <Link href={`/company/dashboard`}>Manage Job</Link>
            </Button>
        );
    }

    if (!user) {
        return (
             <Button asChild size="lg">
                <Link href="/login">Log in to Apply</Link>
            </Button>
         );
    }

    // Default case for other roles or if user is logged in but not a student
    return null;
}

    
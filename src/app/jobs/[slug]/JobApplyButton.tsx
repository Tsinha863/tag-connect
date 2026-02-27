'use client';

import { useUser, FirestorePermissionError, errorEmitter, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp, query, collection, where, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { Job } from '@/lib/types';
import Link from 'next/link';

export function JobApplyButton({ job }: { job: Job & { id: string } }) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [isApplying, setIsApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

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

    const handleApply = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (!job) return;

        const userRole = await getUserRole(firestore, user.uid);
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

    const getUserRole = async (firestore: any, uid: string) => {
      const userDoc = await doc(firestore, 'users', uid).get();
      if (userDoc.exists()) {
        return userDoc.data().role;
      }
      return null;
    }

    if (isUserLoading || isApplicationLoading) {
        return <Button disabled size="lg"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking status...</Button>
    }
    
    const userRole = user ? (user as any).role : null;

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

    // Default case for other roles or if user is logged in but not student/owner
    return null;
}

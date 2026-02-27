'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc } from 'firebase/firestore';
import type { StudentProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminStudentsPage() {
    const firestore = useFirestore();
    const studentsQuery = useMemoFirebase(() => collection(firestore, 'studentProfiles'), [firestore]);
    const { data: students, isLoading } = useCollection<StudentProfile>(studentsQuery);
    const { toast } = useToast();

    const handleVerify = async (studentId: string, isVerified: boolean) => {
        const studentRef = doc(firestore, 'studentProfiles', studentId);
        try {
            await updateDoc(studentRef, { verified: !isVerified });
            toast({
                title: `Student ${isVerified ? 'Un-verified' : 'Verified'}`,
                description: `The student profile has been updated.`,
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not update student status.',
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Students</CardTitle>
                <CardDescription>
                    Here you can view, verify, and manage all student accounts.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Education</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students?.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.fullName}</TableCell>
                                    <TableCell>{student.email || 'N/A'}</TableCell>
                                    <TableCell>{student.education}</TableCell>
                                    <TableCell>
                                        <Badge variant={student.verified ? 'default' : 'secondary'}>
                                            {student.verified ? 'Verified' : 'Unverified'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleVerify(student.id, student.verified)}
                                        >
                                            {student.verified ? 'Un-verify' : 'Verify'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

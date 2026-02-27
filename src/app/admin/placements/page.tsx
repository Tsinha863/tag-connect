'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Placement } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPlacementsPage() {
  const firestore = useFirestore();
  const placementsQuery = useMemoFirebase(() => collection(firestore, 'placements'), [firestore]);
  const { data: placements, isLoading } = useCollection<Placement>(placementsQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Placements</CardTitle>
        <CardDescription>
          Here you can view all successful placements and track commissions.
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
                <TableHead>Job Title</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Placed On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placements?.map((placement) => (
                <TableRow key={placement.id}>
                  <TableCell>{placement.jobTitle}</TableCell>
                  <TableCell>{placement.studentName}</TableCell>
                  <TableCell>{placement.companyName}</TableCell>
                  <TableCell>₹{placement.salary?.toLocaleString()}</TableCell>
                  <TableCell>₹{placement.commissionAmount?.toLocaleString()} ({placement.commissionPercent}%)</TableCell>
                  <TableCell>{placement.createdAt ? new Date(placement.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

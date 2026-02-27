'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc } from 'firebase/firestore';
import type { Placement } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminPlacementsPage() {
  const firestore = useFirestore();
  const placementsQuery = useMemoFirebase(
    () => collection(firestore, 'placements'),
    [firestore]
  );
  const { data: placements, isLoading } = useCollection<Placement>(
    placementsQuery
  );
  const { toast } = useToast();

  const handleStatusChange = async (
    placementId: string,
    status: 'pending_invoice' | 'invoiced' | 'paid'
  ) => {
    const placementRef = doc(firestore, 'placements', placementId);
    try {
      await updateDoc(placementRef, { status });
      toast({
        title: 'Status Updated',
        description: `Placement status changed to "${status}".`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not update placement status.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Placements</CardTitle>
        <CardDescription>
          Here you can view all successful placements and their financial status.
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
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Placed On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placements?.map((placement) => (
                <TableRow key={placement.id}>
                  <TableCell>{placement.jobTitle}</TableCell>
                  <TableCell>{placement.studentName}</TableCell>
                  <TableCell>{placement.companyName}</TableCell>
                  <TableCell>
                    ₹{placement.commissionAmount?.toLocaleString()} (
                    {placement.commissionPercent}%)
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        placement.status === 'paid'
                          ? 'default'
                          : placement.status === 'invoiced'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {placement.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {placement.createdAt
                      ? new Date(
                          placement.createdAt.seconds * 1000
                        ).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(placement.id, 'pending_invoice')
                          }
                        >
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(placement.id, 'invoiced')
                          }
                        >
                          Mark as Invoiced
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(placement.id, 'paid')}
                        >
                          Mark as Paid
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

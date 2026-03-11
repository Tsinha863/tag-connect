'use client';

import { useFirestore, useCollection, useMemoFirebase, FirestorePermissionError, errorEmitter } from '@/firebase';
import { collection, doc, updateDoc } from 'firebase/firestore';
import type { Placement } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

function PlacementsTable({
  placements,
  onGenerateInvoice,
}: {
  placements: Placement[];
  onGenerateInvoice?: (placementId: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Job Title</TableHead>
          <TableHead>Commission</TableHead>
          <TableHead>Joining Date</TableHead>
          {onGenerateInvoice && <TableHead>Action</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {placements.length > 0 ? (
          placements.map((placement) => (
            <TableRow key={placement.id}>
              <TableCell>{placement.studentName}</TableCell>
              <TableCell>{placement.companyName}</TableCell>
              <TableCell>{placement.jobTitle}</TableCell>
              <TableCell>
                ₹{placement.commissionAmount?.toLocaleString()}
              </TableCell>
              <TableCell>
                {placement.joiningDate
                  ? new Date(
                      placement.joiningDate.seconds * 1000
                    ).toLocaleDateString()
                  : 'N/A'}
              </TableCell>
              {onGenerateInvoice && (
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => onGenerateInvoice(placement.id)}
                  >
                    Generate Invoice
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={onGenerateInvoice ? 6 : 5} className="h-24 text-center">
              No placements in this category.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default function AdminInvoicesPage() {
  const firestore = useFirestore();
  const placementsQuery = useMemoFirebase(
    () => collection(firestore, 'placements'),
    [firestore]
  );
  const { data: placements, isLoading } =
    useCollection<Placement>(placementsQuery);
  const { toast } = useToast();

  const handleGenerateInvoice = (placementId: string) => {
    const placementRef = doc(firestore, 'placements', placementId);
    const updatedData = { status: 'invoiced' };

    toast({
      title: 'Invoice Generation in Progress...',
      description: 'Updating the placement status.',
    });

    updateDoc(placementRef, updatedData)
      .then(() => {
        toast({
          title: 'Invoice Generated',
          description: 'The placement status has been updated to "invoiced".',
        });
      })
      .catch((error: any) => {
        const permissionError = new FirestorePermissionError({
          path: placementRef.path,
          operation: 'update',
          requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not update placement status.',
        });
      });
  };

  const pendingInvoices =
    placements?.filter((p) => p.status === 'pending_invoice') || [];
  const invoicedPlacements =
    placements?.filter((p) => p.status === 'invoiced') || [];
  const paidPlacements = placements?.filter((p) => p.status === 'paid') || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices &amp; Commissions</CardTitle>
        <CardDescription>
          Manage placement invoices and track paid commissions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Invoice ({pendingInvoices.length})
            </TabsTrigger>
            <TabsTrigger value="invoiced">
              Invoiced ({invoicedPlacements.length})
            </TabsTrigger>
            <TabsTrigger value="paid">Paid ({paidPlacements.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="mt-4">
            <PlacementsTable
              placements={pendingInvoices}
              onGenerateInvoice={handleGenerateInvoice}
            />
          </TabsContent>
          <TabsContent value="invoiced" className="mt-4">
            <PlacementsTable placements={invoicedPlacements} />
          </TabsContent>
          <TabsContent value="paid" className="mt-4">
            <PlacementsTable placements={paidPlacements} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

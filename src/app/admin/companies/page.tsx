'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc } from 'firebase/firestore';
import type { CompanyProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function AdminCompaniesPage() {
  const firestore = useFirestore();
  const companiesQuery = useMemoFirebase(() => collection(firestore, 'companyProfiles'), [firestore]);
  const { data: companies, isLoading } = useCollection<CompanyProfile>(companiesQuery);
  const { toast } = useToast();

  const handleVerify = async (companyId: string, isVerified: boolean) => {
    const companyRef = doc(firestore, 'companyProfiles', companyId);
    try {
      await updateDoc(companyRef, { verified: !isVerified });
      toast({
        title: `Company ${isVerified ? 'Un-approved' : 'Approved'}`,
        description: `The company profile has been updated.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not update company status.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Companies</CardTitle>
        <CardDescription>
          Here you can approve, view, and manage all company accounts.
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
                <TableHead>Company Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies?.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.companyName}</TableCell>
                  <TableCell>{company.email || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {company.companyProofUrl ? (
                        <Button variant="link" size="sm" asChild className="p-0 h-auto">
                          <Link href={company.companyProofUrl} target="_blank" rel="noopener noreferrer">Company</Link>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                      {company.personalIdUrl ? (
                        <Button variant="link" size="sm" asChild className="p-0 h-auto">
                          <Link href={company.personalIdUrl} target="_blank" rel="noopener noreferrer">Personal ID</Link>
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={company.verified ? 'default' : 'secondary'}>
                      {company.verified ? 'Approved' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerify(company.id, company.verified)}
                    >
                      {company.verified ? 'Un-approve' : 'Approve'}
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

    
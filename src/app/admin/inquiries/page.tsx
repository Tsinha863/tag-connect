'use client';

import { useFirestore, useCollection, useMemoFirebase, FirestorePermissionError, errorEmitter } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import type { Inquiry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminInquiriesPage() {
  const firestore = useFirestore();
  const inquiriesQuery = useMemoFirebase(() => collection(firestore, 'inquiries'), [firestore]);
  const { data: inquiries, isLoading } = useCollection<Inquiry>(inquiriesQuery);
  const { toast } = useToast();

  const handleDelete = (inquiryId: string) => {
    const inquiryRef = doc(firestore, 'inquiries', inquiryId);
    
    toast({
        title: `Deletion in Progress`,
        description: `The message is being removed.`,
    });

    deleteDoc(inquiryRef)
      .then(() => {
        toast({
          title: `Inquiry Deleted`,
          description: `The message has been removed.`,
        });
      })
      .catch((error: any) => {
        const permissionError = new FirestorePermissionError({
          path: inquiryRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not delete inquiry.',
        });
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Form Inquiries</CardTitle>
        <CardDescription>
          Messages submitted through the website contact form.
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
                <TableHead>Name</TableHead>
                <TableHead>Email & Phone</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries && inquiries.length > 0 ? inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>{inquiry.name}</TableCell>
                  <TableCell>
                    <div>{inquiry.email}</div>
                    <div className="text-xs text-muted-foreground">{inquiry.phone}</div>
                    </TableCell>
                  <TableCell>{inquiry.subject}</TableCell>
                  <TableCell className="max-w-xs truncate">{inquiry.message}</TableCell>
                  <TableCell>{inquiry.createdAt ? new Date(inquiry.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell className="text-right">
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this inquiry.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(inquiry.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">No inquiries yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

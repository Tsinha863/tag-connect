
'use client';

import { useUser, useDoc, useFirestore, useMemoFirebase, FirestorePermissionError, errorEmitter } from '@/firebase';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { CompanyProfile } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const profileSchema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  industry: z.string().min(1, 'Industry is required.'),
  location: z.string().min(1, 'Location is required.'),
  description: z.string().min(1, 'Description is required.'),
  personalIdType: z.enum(['Aadhar', 'PAN', 'Voter ID']),
  personalIdNumber: z.string().min(1, 'ID number is required.'),
  companyProof: z.any().optional(),
  personalId: z.any().optional(),
});

export default function CompanyProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const companyProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'companyProfiles', user.uid);
  }, [firestore, user]);

  const { data: companyProfile, isLoading: isProfileLoading } = useDoc<CompanyProfile>(companyProfileRef);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      companyName: '',
      industry: '',
      location: '',
      description: '',
      personalIdType: 'Aadhar',
      personalIdNumber: '',
    },
  });

  useEffect(() => {
    if (companyProfile) {
      form.reset({
        companyName: companyProfile.companyName,
        industry: companyProfile.industry,
        location: companyProfile.location,
        description: companyProfile.description,
        personalIdType: companyProfile.personalIdType || 'Aadhar',
        personalIdNumber: companyProfile.personalIdNumber,
      });
    }
  }, [companyProfile, form]);
  
  const uploadFile = async (file: File, path: string) => {
    const storage = getStorage();
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user || !companyProfileRef) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to update your profile.' });
      return;
    }

    setIsUploading(true);
    toast({ title: 'Updating Profile...', description: 'Please wait while we save your changes.' });

    try {
      let { companyProofUrl, personalIdUrl } = companyProfile || {};

      const companyProofFile = values.companyProof?.[0];
      const personalIdFile = values.personalId?.[0];

      if (companyProofFile) {
        toast({ title: 'Uploading Company Document...' });
        companyProofUrl = await uploadFile(companyProofFile, `company-verification/${user.uid}/company-proof`);
      }
      
      if (personalIdFile) {
        toast({ title: 'Uploading Personal ID...' });
        personalIdUrl = await uploadFile(personalIdFile, `company-verification/${user.uid}/personal-id`);
      }

      const updatedProfileData = {
        companyName: values.companyName,
        industry: values.industry,
        location: values.location,
        description: values.description,
        personalIdType: values.personalIdType,
        personalIdNumber: values.personalIdNumber,
        companyProofUrl,
        personalIdUrl,
        updatedAt: serverTimestamp(),
      };

      updateDoc(companyProfileRef, updatedProfileData)
        .then(() => {
          toast({ title: 'Profile Updated', description: 'Your profile has been saved successfully.' });
          router.push('/company/dashboard');
        })
        .catch(error => {
          const permissionError = new FirestorePermissionError({
            path: companyProfileRef.path,
            operation: 'update',
            requestResourceData: updatedProfileData,
          });
          errorEmitter.emit('permission-error', permissionError);
          toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'Could not save your profile. Please check your permissions.',
          });
        })
        .finally(() => {
          setIsUploading(false);
        });

    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'An unexpected error occurred during file upload.',
      });
      setIsUploading(false);
    }
  };

  if (isProfileLoading) {
    return <div className="container py-10"><Card><CardHeader><CardTitle>Loading Profile...</CardTitle></CardHeader><CardContent><Skeleton className="h-96" /></CardContent></Card></div>;
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>
            Keep your company profile updated. Verification documents are required for admin approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField control={form.control} name="companyName" render={({ field }) => (
                  <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="industry" render={({ field }) => (
                  <FormItem><FormLabel>Industry</FormLabel><FormControl><Input placeholder="e.g., Technology" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Delhi, India" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Company Description</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                
                <div className="md:col-span-2 border-t pt-8 space-y-8">
                    <FormField control={form.control} name="personalIdType" render={({ field }) => (
                        <FormItem><FormLabel>Personal ID Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Aadhar">Aadhar Card</SelectItem>
                                    <SelectItem value="PAN">PAN Card</SelectItem>
                                    <SelectItem value="Voter ID">Voter ID</SelectItem>
                                </SelectContent>
                            </Select>
                        <FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="personalIdNumber" render={({ field }) => (
                        <FormItem><FormLabel>Personal ID Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="companyProof" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Proof Document (PDF)</FormLabel>
                            <FormControl><Input type="file" accept=".pdf" {...form.register('companyProof')} /></FormControl>
                            <FormDescription>
                                {companyProfile?.companyProofUrl ? (
                                    <Link href={companyProfile.companyProofUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                        View current company document
                                    </Link>
                                ) : "No company proof uploaded yet."}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="personalId" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Personal ID Document (PDF)</FormLabel>
                            <FormControl><Input type="file" accept=".pdf" {...form.register('personalId')} /></FormControl>
                            <FormDescription>
                                {companyProfile?.personalIdUrl ? (
                                    <Link href={companyProfile.personalIdUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                        View current personal ID
                                    </Link>
                                ) : "No personal ID uploaded yet."}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
              </div>
              <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
                {form.formState.isSubmitting || isUploading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

    
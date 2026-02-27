'use client';

import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { StudentProfile } from '@/lib/types';
import { useEffect } from 'react';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  education: z.string().min(1, 'Education is required.'),
  stream: z.string().min(1, 'Stream or field of study is required.'),
  skills: z.string().min(1, 'Please list at least one skill.'),
  experienceYears: z.coerce.number().min(0, 'Experience must be a positive number.'),
  city: z.string().min(1, 'City is required.'),
  state: z.string().min(1, 'State is required.'),
  jobType: z.enum(['Full-time', 'Part-time', 'Internship']),
  expectedSalary: z.coerce.number().min(0, 'Expected salary must be a positive number.').optional(),
  cv: z.any().optional(),
});

export default function StudentProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const studentProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'studentProfiles', user.uid);
  }, [firestore, user]);

  const { data: studentProfile, isLoading: isProfileLoading } = useDoc<StudentProfile>(studentProfileRef);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
        fullName: '',
        education: '',
        stream: '',
        skills: '',
        experienceYears: 0,
        city: '',
        state: '',
        jobType: 'Full-time',
        expectedSalary: 0,
    },
  });

  useEffect(() => {
    if (studentProfile) {
      form.reset({
        fullName: studentProfile.fullName,
        education: studentProfile.education,
        stream: studentProfile.stream,
        skills: studentProfile.skills?.join(', '),
        experienceYears: studentProfile.experienceYears,
        city: studentProfile.city,
        state: studentProfile.state,
        jobType: studentProfile.jobType as 'Full-time' | 'Part-time' | 'Internship',
        expectedSalary: studentProfile.expectedSalary,
      });
    }
  }, [studentProfile, form]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user || !studentProfileRef) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to update your profile.' });
        return;
    }

    try {
      let cvUrl = studentProfile?.cvUrl || '';
      const cvFile = values.cv?.[0];
      
      if (cvFile) {
        if (cvFile.type !== 'application/pdf') {
          toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload a PDF file for your CV.' });
          return;
        }
        toast({ title: 'Uploading CV...', description: 'Please wait.' });
        const storage = getStorage();
        const cvStorageRef = ref(storage, `cvs/${user.uid}/resume.pdf`);
        const uploadResult = await uploadBytes(cvStorageRef, cvFile);
        cvUrl = await getDownloadURL(uploadResult.ref);
      }
      
      const skillsArray = values.skills.split(',').map(skill => skill.trim()).filter(Boolean);

      const filledFields = Object.values(values).filter(v => {
        if (typeof v === 'string') return v.trim() !== '';
        if (typeof v === 'number') return v !== 0;
        return v !== undefined && v !== null;
      }).length;
      
      const completionPercentage = Math.round(
          ((filledFields + (cvUrl ? 1 : 0) -1 /*-1 for cv field itself*/) / (Object.keys(values).length )) * 100
      );
      
      const updatedProfileData = {
        ...studentProfile, // carry over existing data
        fullName: values.fullName,
        education: values.education,
        stream: values.stream,
        skills: skillsArray,
        experienceYears: values.experienceYears,
        city: values.city,
        state: values.state,
        jobType: values.jobType,
        expectedSalary: values.expectedSalary,
        cvUrl: cvUrl,
        profileCompletionPercentage: completionPercentage > 100 ? 100 : completionPercentage,
        updatedAt: serverTimestamp(),
      };

      setDocumentNonBlocking(studentProfileRef, updatedProfileData, { merge: true });

      toast({ title: 'Profile Updated', description: 'Your profile has been saved successfully.' });
      router.push('/student/dashboard');

    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };
  
  if(isProfileLoading) {
    return <div className="container py-10"><Card><CardHeader><CardTitle>Loading Profile...</CardTitle></CardHeader><CardContent><Skeleton className="h-96" /></CardContent></Card></div>
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Keep your profile updated to attract the best opportunities.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="education" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Highest Education</FormLabel>
                            <FormControl><Input placeholder="e.g., Bachelor's in Technology" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="stream" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Stream / Field of Study</FormLabel>
                            <FormControl><Input placeholder="e.g., Computer Science" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="experienceYears" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Years of Experience</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="jobType" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Preferred Job Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Full-time">Full-time</SelectItem>
                                    <SelectItem value="Part-time">Part-time</SelectItem>
                                    <SelectItem value="Internship">Internship</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="expectedSalary" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Expected Annual Salary (₹)</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 500000" {...field} /></FormControl>
                            <FormDescription>Leave 0 if not applicable.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="skills" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Skills</FormLabel>
                            <FormControl><Textarea placeholder="e.g., React, Node.js, Project Management" {...field} /></FormControl>
                            <FormDescription>Enter your skills, separated by commas.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="cv" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Upload CV (PDF only)</FormLabel>
                            <FormControl><Input type="file" accept=".pdf" {...form.register('cv')} /></FormControl>
                            <FormDescription>
                                {studentProfile?.cvUrl ? (
                                    <Link href={studentProfile.cvUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                        View current CV
                                    </Link>
                                ) : "No CV uploaded yet."}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

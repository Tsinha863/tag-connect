'use client';

import { useUser, useFirestore, FirestorePermissionError, errorEmitter } from '@/firebase';
import { collection, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  skillsRequired: z.string().min(1, 'Please list at least one skill.'),
  educationRequired: z.string().min(1, 'Education requirement is required.'),
  experienceRequired: z.coerce.number().min(0, 'Experience must be a positive number.'),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  location: z.string().min(1, 'Location is required.'),
  jobType: z.enum(['Full-time', 'Part-time', 'Internship']),
});

function createSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
}

export default function PostJobPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof jobSchema>>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            title: '',
            description: '',
            skillsRequired: '',
            educationRequired: '',
            experienceRequired: 0,
            location: '',
            jobType: 'Full-time',
        },
    });

    const onSubmit = (values: z.infer<typeof jobSchema>) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in as a company to post a job.' });
            return;
        }

        const jobId = uuidv4();
        const slug = createSlug(`${values.title} ${values.location}`);
        const skillsArray = values.skillsRequired.split(',').map(skill => skill.trim()).filter(Boolean);
        
        const newJobData = {
            id: jobId,
            companyId: user.uid,
            title: values.title,
            slug: `${slug}-${jobId.substring(0, 6)}`,
            description: values.description,
            skillsRequired: skillsArray,
            educationRequired: values.educationRequired,
            experienceRequired: values.experienceRequired,
            salaryMin: values.salaryMin || null,
            salaryMax: values.salaryMax || null,
            location: values.location,
            jobType: values.jobType,
            status: 'open',
            searchKeywords: [values.title, values.location, ...skillsArray].map(k => k.toLowerCase()),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const jobRef = doc(firestore, 'jobs', jobId);
        
        setDoc(jobRef, newJobData)
          .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
              path: jobRef.path,
              operation: 'create',
              requestResourceData: newJobData,
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not post job. Check permissions.' });
          });

        toast({ title: 'Job Posted', description: 'Your job listing is now being created.' });
        router.push('/company/dashboard');
    };

    return (
        <div className="container py-10">
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
            <CardTitle>Post a New Job</CardTitle>
            <CardDescription>Fill out the details below to find your next great hire.</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input placeholder="e.g., Senior Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Job Description</FormLabel><FormControl><Textarea rows={6} placeholder="Describe the role, responsibilities, and qualifications." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="location" render={({ field }) => (
                            <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Delhi, India" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="jobType" render={({ field }) => (
                            <FormItem><FormLabel>Job Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Full-time">Full-time</SelectItem><SelectItem value="Part-time">Part-time</SelectItem><SelectItem value="Internship">Internship</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="educationRequired" render={({ field }) => (
                            <FormItem><FormLabel>Education Required</FormLabel><FormControl><Input placeholder="e.g., Bachelor's Degree" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="experienceRequired" render={({ field }) => (
                            <FormItem><FormLabel>Years of Experience Required</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="salaryMin" render={({ field }) => (
                            <FormItem><FormLabel>Minimum Annual Salary (₹)</FormLabel><FormControl><Input type="number" placeholder="e.g., 800000" {...field} /></FormControl><FormDescription>Optional</FormDescription><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="salaryMax" render={({ field }) => (
                            <FormItem><FormLabel>Maximum Annual Salary (₹)</FormLabel><FormControl><Input type="number" placeholder="e.g., 1200000" {...field} /></FormControl><FormDescription>Optional</FormDescription><FormMessage /></FormItem>
                        )} />
                    </div>
                     <FormField control={form.control} name="skillsRequired" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Skills Required</FormLabel>
                            <FormControl><Textarea placeholder="e.g., React, Node.js, Project Management" {...field} /></FormControl>
                            <FormDescription>Enter required skills, separated by commas.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Posting Job...' : 'Post Job'}
                    </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
        </div>
    );
}

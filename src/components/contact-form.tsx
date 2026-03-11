'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, FirestorePermissionError, errorEmitter } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const inquirySchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(1, 'Phone number is required.'),
  subject: z.string().min(1, 'Subject is required.'),
  message: z.string().min(1, 'Message is required.'),
});

export function ContactForm() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof inquirySchema>>({
        resolver: zodResolver(inquirySchema),
        defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
    });

    const onSubmit = async (values: z.infer<typeof inquirySchema>) => {
        const inquiryRef = collection(firestore, 'inquiries');
        const inquiryData = {
            ...values,
            createdAt: serverTimestamp(),
        };

        try {
            await addDoc(inquiryRef, inquiryData);
            toast({
                title: 'Inquiry Sent!',
                description: 'Thank you for your message. We will get back to you shortly.',
            });
            form.reset();
        } catch (error) {
             const permissionError = new FirestorePermissionError({
                path: 'inquiries',
                operation: 'create',
                requestResourceData: inquiryData,
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not send your message. Please try again.',
            });
        }
    };

    return (
        <Card className="max-w-4xl mx-auto shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Contact Us</CardTitle>
              <CardDescription>Have a question or need a custom staffing solution? Get in touch with us.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormControl><Input type="email" placeholder="Your Email" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormControl><Input placeholder="Phone Number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem><FormControl><Input placeholder="Subject" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormControl><Textarea placeholder="Your Message" rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="md:col-span-2 flex justify-center">
                    <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
    );
}

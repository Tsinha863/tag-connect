
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { signUpWithEmail, signInWithGoogle, getUserRole } from '@/firebase/auth';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
    role: z.enum(['student', 'company'], {
        required_error: "You need to select a role.",
    }),
    fullName: z.string().min(1, { message: 'Full name is required.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});


export default function SignupPage() {
    const router = useRouter();
    const { toast } = useToast();
    const auth = useAuth();
    const firestore = useFirestore();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: 'student',
            fullName: '',
            email: '',
            password: '',
        },
    });

    const handleRedirect = async (userId: string) => {
        const role = await getUserRole(firestore, userId);
        if (role === 'admin') {
            router.push('/admin/dashboard');
        } else if (role === 'student') {
            router.push('/student/dashboard');
        } else if (role === 'company') {
            router.push('/company/dashboard');
        } else {
            router.push('/');
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userCredential = await signUpWithEmail(auth, firestore, values);
            await handleRedirect(userCredential.user.uid);
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Sign Up Failed',
            description: error.message,
          });
        }
    };

    const handleGoogleSignIn = async () => {
        try {
          const userCredential = await signInWithGoogle(auth, firestore);
          // With Google Sign-In, the role is defaulted. User might need to change it later.
          // For now, redirect based on the default role created.
          await handleRedirect(userCredential.user.uid);
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Google Sign-In Failed',
            description: error.message,
          });
        }
    };


    return (
        <div className="w-full min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
        <Card className="mx-auto max-w-sm w-full">
            <CardHeader className="text-center">
            <Logo className="mb-4 justify-center" />
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Create an account to get started.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <FormLabel>I am a...</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-2 gap-4"
                                        >
                                            <FormItem>
                                                <FormControl>
                                                    <RadioGroupItem value="student" id="student" className="peer sr-only" />
                                                </FormControl>
                                                <Label
                                                    htmlFor="student"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    Student / Worker
                                                </Label>
                                            </FormItem>
                                            <FormItem>
                                                <FormControl>
                                                    <RadioGroupItem value="company" id="company" className="peer sr-only" />
                                                </FormControl>
                                                <Label
                                                    htmlFor="company"
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    Company
                                                </Label>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="m@example.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Creating Account...' : 'Create an account'}
                        </Button>
                    </form>
                </Form>
                 <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>
                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={form.formState.isSubmitting}>
                    Sign up with Google
                </Button>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="underline">
                    Log in
                    </Link>
                </div>
            </CardContent>
        </Card>
        </div>
    );
}

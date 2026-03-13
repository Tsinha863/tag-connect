'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { getUserRole } from '@/firebase/auth';

const plans = [
  {
    name: 'Free',
    id: 'free',
    price: '₹0',
    priceDescription: 'For companies just getting started',
    features: [
      'Post up to 1 job',
      '50 applicant views per month',
      'Basic company profile',
      'Email support',
    ],
    isPrimary: false,
  },
  {
    name: 'Basic',
    id: 'basic',
    price: '₹5,000',
    priceDescription: 'For growing companies',
    features: [
      'Post up to 10 jobs',
      '500 applicant views per month',
      'Enhanced company profile',
      'Up to 5 featured jobs',
      'Priority email support',
    ],
    isPrimary: true,
  },
  {
    name: 'Premium',
    id: 'premium',
    price: '₹15,000',
    priceDescription: 'For large-scale hiring',
    features: [
      'Unlimited job posts',
      'Unlimited applicant views',
      'Custom branded company profile',
      'Unlimited featured jobs',
      'Dedicated phone & email support',
    ],
    isPrimary: false,
  },
];

export default function PricingPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleChoosePlan = async (planId: 'free' | 'basic' | 'premium') => {
    setIsLoading(planId);

    if (isUserLoading) {
      toast({ variant: 'destructive', title: 'Please wait', description: 'User data is still loading.' });
      setIsLoading(null);
      return;
    }

    if (!user) {
      router.push('/login?redirect=/pricing');
      return;
    }

    const role = await getUserRole(firestore, user.uid);
    if (role !== 'company') {
      toast({
        variant: 'destructive',
        title: 'Action Not Allowed',
        description: 'Only company accounts can select a subscription plan.',
      });
      setIsLoading(null);
      return;
    }

    const companyProfileRef = doc(firestore, 'companyProfiles', user.uid);
    const updatedData = { subscriptionPlan: planId, subscriptionStatus: 'active' };

    toast({ title: 'Updating Plan...' });

    updateDoc(companyProfileRef, updatedData)
      .then(() => {
        toast({ title: 'Plan Updated!', description: `You are now on the ${planId} plan.` });
        router.push('/company/dashboard');
      })
      .catch((error) => {
        console.error('Error updating plan:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not update your plan.' });
      })
      .finally(() => {
        setIsLoading(null);
      });
  };

  return (
    <div className="container py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Find the perfect plan for your business</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start for free, then upgrade as you grow. All plans include access to our network of skilled and unskilled talent.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {plans.map((plan) => (
          <Card key={plan.name} className={cn('flex flex-col', plan.isPrimary && 'border-primary border-2 shadow-primary/20 -mt-4')}>
            <CardHeader className="flex-grow-0">
              {plan.isPrimary && (
                <div className="text-center mb-2">
                  <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase">Most Popular</span>
                </div>
              )}
              <CardTitle className="text-center text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-center">{plan.priceDescription}</CardDescription>
            </CardHeader>
            <CardContent className="text-center flex-grow">
              <p className="text-5xl font-bold mb-2">{plan.price}<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
              <ul className="mt-6 space-y-4 text-left">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.isPrimary ? 'default' : 'outline'}
                onClick={() => handleChoosePlan(plan.id as 'free' | 'basic' | 'premium')}
                disabled={isLoading === plan.id || isUserLoading}
              >
                {isLoading === plan.id ? 'Processing...' : 'Choose Plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

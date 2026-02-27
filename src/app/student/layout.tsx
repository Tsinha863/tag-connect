'use client';

import { useUser, useFirestore } from '@/firebase';
import { getUserRole } from '@/firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    const verifyRole = async () => {
      const role = await getUserRole(firestore, user.uid);
      if (role !== 'student') {
        // Redirect to a relevant page or show an unauthorized message
        router.replace('/'); 
      } else {
        setIsVerifying(false);
      }
    };

    verifyRole();

  }, [user, isUserLoading, firestore, router]);

  if (isVerifying || isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  isDark?: boolean;
};

export function Logo({ className, isDark = false }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Briefcase className={cn("h-7 w-7", isDark ? 'text-primary-foreground' : 'text-primary')} />
      <span className={cn("text-xl font-bold", isDark ? 'text-primary-foreground' : 'text-foreground')}>TAG Connect</span>
    </Link>
  );
}

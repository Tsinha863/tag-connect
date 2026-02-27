import { cn } from '@/lib/utils';

export function NewtonCradleLoader({ className }: { className?: string }) {
  return (
    <div className={cn("newtons-cradle", className)}>
      <div className="newtons-cradle__dot"></div>
      <div className="newtons-cradle__dot"></div>
      <div className="newtons-cradle__dot"></div>
      <div className="newtons-cradle__dot"></div>
    </div>
  );
}

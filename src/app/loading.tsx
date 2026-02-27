import { NewtonCradleLoader } from '@/components/loader';

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <NewtonCradleLoader />
    </div>
  );
}

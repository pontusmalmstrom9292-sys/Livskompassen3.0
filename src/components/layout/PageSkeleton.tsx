import { Skeleton } from '@/design-system';

export function PageSkeleton() {
  return (
    <div
      className="flex min-h-[80vh] w-full flex-col space-y-6 p-4 sm:p-6 md:p-8"
      aria-busy="true"
      aria-label="Laddar sida"
    >
      <div className="mb-2 flex w-full items-center justify-between">
        <Skeleton variant="line" className="h-10 w-1/3" />
        <Skeleton variant="circle" className="hidden sm:block" />
      </div>
      <Skeleton variant="block" className="h-48 sm:h-64" />
      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton variant="block" className="h-32" />
        <Skeleton variant="block" className="h-32" />
        <Skeleton variant="block" className="h-32" />
        <Skeleton variant="block" className="h-32" />
      </div>
    </div>
  );
}

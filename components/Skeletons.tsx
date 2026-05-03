'use client';

// Skeleton component for product cards
export function ProductCardSkeleton() {
  return (
    <div className="glass-card flex h-full flex-col overflow-hidden rounded-[2rem] animate-pulse">
      <div className="h-72 w-full bg-slate-200 dark:bg-slate-800 rounded-[2rem]" />
      <div className="p-5 space-y-3 flex-1">
        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid gap-12 lg:grid-cols-2 animate-pulse">
      <div className="space-y-4">
        <div className="h-[500px] w-full bg-slate-200 dark:bg-slate-800 rounded-[2rem]" />
        <div className="grid grid-cols-4 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="space-y-6 pt-4">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="h-8 w-28 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="h-4 w-4/6 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
        <div className="h-14 w-full bg-slate-200 dark:bg-slate-700 rounded-2xl" />
      </div>
    </div>
  );
}

export function BrandCardSkeleton() {
  return (
    <div className="glass-card rounded-[2rem] overflow-hidden animate-pulse">
      <div className="h-56 bg-slate-200 dark:bg-slate-800" />
      <div className="p-6 space-y-3">
        <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 border border-black/5 dark:border-white/10 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex-shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-36 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-2.5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>
        </div>
      </td>
      <td className="px-5 py-4 hidden sm:table-cell"><div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" /></td>
      <td className="px-5 py-4 hidden md:table-cell"><div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" /></td>
      <td className="px-5 py-4"><div className="h-3.5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" /></td>
      <td className="px-5 py-4"><div className="h-6 w-20 ml-auto bg-slate-200 dark:bg-slate-700 rounded-lg" /></td>
    </tr>
  );
}

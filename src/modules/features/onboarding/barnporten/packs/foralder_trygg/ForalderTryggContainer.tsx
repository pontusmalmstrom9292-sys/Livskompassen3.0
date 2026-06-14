import React, { Suspense, lazy } from 'react';

// Lazy loading of the dashboard component to utilize Suspense
const ForalderTryggDashboard = lazy(() => 
  import('./components/ForalderTryggDashboard').then(m => ({ default: m.ForalderTryggDashboard }))
);

const DashboardSkeleton = () => (
  <div className="flex flex-col gap-6 p-4 md:p-6 font-sans animate-pulse">
    <div className="flex flex-col gap-2 mb-2">
      <div className="h-8 bg-surface-2 rounded-md w-48"></div>
      <div className="h-4 bg-surface-2 rounded-md w-96 max-w-full"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col bg-surface-2 border border-border rounded-2xl p-5 h-[340px]">
          <div className="flex justify-between mb-4">
            <div>
              <div className="h-3 bg-surface-3 rounded w-16 mb-2"></div>
              <div className="h-5 bg-surface-3 rounded w-32"></div>
            </div>
            <div className="h-6 w-6 bg-surface-3 rounded-full"></div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-4 bg-surface-3 rounded w-full"></div>
            <div className="h-4 bg-surface-3 rounded w-5/6"></div>
            <div className="h-4 bg-surface-3 rounded w-4/6"></div>
          </div>
          <div className="mt-auto h-20 bg-surface-3 rounded-xl"></div>
        </div>
      ))}
    </div>
  </div>
);

export interface ForalderTryggContainerProps {
  childId?: string;
  contextData?: any;
}

export const ForalderTryggContainer: React.FC<ForalderTryggContainerProps> = ({ 
  childId, 
  contextData 
}) => {
  return (
    <div className="foralder-trygg-container w-full h-full relative">
      <Suspense fallback={<DashboardSkeleton />}>
        {/* Render the dashboard and pass down necessary child data props from routing */}
        <ForalderTryggDashboard 
          childId={childId} 
          contextData={contextData} 
        />
      </Suspense>
    </div>
  );
};

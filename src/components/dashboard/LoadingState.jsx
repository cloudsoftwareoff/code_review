export function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-20">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600"></div>
        <p className="mt-4 text-lg text-gray-600 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );
}
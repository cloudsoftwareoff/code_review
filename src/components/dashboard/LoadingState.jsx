export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center pt-20">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 shadow-lg"></div>
        <p className="mt-4 text-lg text-gray-300 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );
}

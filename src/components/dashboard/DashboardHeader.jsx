export function DashboardHeader({ syncStatus, onSync, onLogout }) {
  return (
    <div className="dashboard-header flex justify-between items-center mb-10">
      <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Code Assistant</h1>
      <div className="flex items-center space-x-4">
        {syncStatus.lastSynced && (
          <span className="text-sm text-gray-500">
            Last synced: {syncStatus.lastSynced}
          </span>
        )}
        <button
          onClick={onSync}
          disabled={syncStatus.syncing}
          className="flex items-center bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white py-2 px-4 rounded-lg transition-colors shadow-sm font-semibold"
        >
          {syncStatus.syncing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Syncing...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
              Sync
            </>
          )}
        </button>
        <button
          onClick={onLogout}
          className="flex items-center bg-red-600 hover:bg-red-700 text-white py-2 px-5 rounded-lg transition-colors shadow-sm font-semibold"
        >
          <svg
            className="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Log Out
        </button>
      </div>
    </div>
  );
}
export function ErrorState({ error, onRetry, onSignInAgain }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center pt-20">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8 max-w-lg w-full">
        <div className="bg-red-900/30 border-l-4 border-red-500 text-red-200 p-4 mb-6 rounded-lg backdrop-blur-sm">
          <p className="font-medium">
            {error.includes('token') || error.includes('Authentication')
              ? 'Authentication error: Please sign in again.'
              : error.includes('duplicate key')
              ? 'Database error: User already exists. Try signing in again.'
              : error.includes('uuid')
              ? 'Database error: Invalid ID format. Try again or contact support.'
              : error}
          </p>
          {(error.includes('token') || error.includes('Authentication')) && (
            <p className="mt-2 text-sm text-red-300">
              Your session may have expired.{' '}
              <a
                href="mailto:support@example.com"
                className="underline hover:text-red-200 transition-colors"
              >
                Contact support
              </a>{' '}
              if this persists.
            </p>
          )}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onRetry}
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
          >
            Retry
          </button>
          <button
            onClick={onSignInAgain}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
          >
            Sign In Again
          </button>
        </div>
      </div>
    </div>
  );
}
export function ErrorState({ error, onRetry, onSignInAgain }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-20">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full">
        <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-4 mb-6 rounded-lg">
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
            <p className="mt-2 text-sm">
              Your session may have expired.{' '}
              <a
                href="mailto:support@example.com"
                className="underline hover:text-red-800"
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
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-lg transition-colors shadow-sm font-semibold"
          >
            Retry
          </button>
          <button
            onClick={onSignInAgain}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors shadow-sm font-semibold"
          >
            Sign In Again
          </button>
        </div>
      </div>
    </div>
  );
}
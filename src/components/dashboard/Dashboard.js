import  UserProfile  from '../UserProfile';
import RepoList from '../RepoList';
import { DashboardHeader } from './DashboardHeader';
import { ErrorState } from './ErrorState';
import { LoadingState } from './LoadingState';
import { useDashboard } from './useDashboard';

export function Dashboard() {
  const {
    user,
    repos,
    loading,
    error,
    syncStatus,
    fetchUserAndRepos,
    handleLogout,
    handleRetry,
    handleSignInAgain
  } = useDashboard();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState 
        error={error} 
        onRetry={handleRetry} 
        onSignInAgain={handleSignInAgain} 
      />
    );
  }

  return (
    <div className="dashboard-container min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader 
          syncStatus={syncStatus} 
          onSync={fetchUserAndRepos} 
          onLogout={handleLogout} 
        />
        {user && <UserProfile user={user} />}
        {repos && <RepoList repos={repos} accessToken={localStorage.getItem('github_access_token')} />}
      </div>
    </div>
  );
}
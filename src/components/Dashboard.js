import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RepoList from './RepoList';
import UserProfile from './UserProfile';
import { auth, db } from '../lib/firebaseClient';
import { GithubAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncStatus, setSyncStatus] = useState({ syncing: false, lastSynced: null });
  const navigate = useNavigate();

  // Function to fetch GitHub user and repos
  const fetchUserAndRepos = async () => {
    try {
      setLoading(true);
      setError(null);
      setSyncStatus({ syncing: true, lastSynced: syncStatus.lastSynced });

      // Get the GitHub access token from localStorage
      const accessToken = localStorage.getItem('github_access_token');
      
      if (!accessToken) {
        throw new Error('No GitHub token available. Please sign in again.');
      }

      // Fetch user data
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (userResponse.status === 401) {
        await signOut(auth);
        navigate('/', { replace: true });
        throw new Error('Session expired. Please sign in again.');
      }

      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user data: ${userResponse.statusText}`);
      }

      const userData = await userResponse.json();
      setUser(userData);

      // Store user data in Firestore
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, {
          uid: auth.currentUser.uid,
          github_user_id: userData.id,
          username: userData.login,
          avatar_url: userData.avatar_url,
          name: userData.name || null,
          bio: userData.bio || null,
          last_login: new Date().toISOString(),
        }, { merge: true });
      }

      // Fetch repositories
      const reposResponse = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (reposResponse.status === 401) {
        await signOut(auth);
        navigate('/', { replace: true });
        throw new Error('Session expired. Please sign in again.');
      }

      if (!reposResponse.ok) {
        throw new Error(`Failed to fetch repositories: ${reposResponse.statusText}`);
      }

      const reposData = await reposResponse.json();
      
      // Add owner information to each repo for display
      const reposWithOwner = reposData.map(repo => ({
        ...repo,
        owner: {
          login: userData.login,
          avatar_url: userData.avatar_url
        }
      }));
      
      setRepos(reposWithOwner);

      // Store repositories in Firestore
      if (auth.currentUser) {
        const batch = [];
        for (const repo of reposData) {
          const repoRef = doc(db, 'repositories', `${userData.id}_${repo.id}`);
          batch.push(setDoc(repoRef, {
            id: `${userData.id}_${repo.id}`,
            github_id: repo.id,
            owner_uid: auth.currentUser.uid,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description || null,
            html_url: repo.html_url,
            stargazers_count: repo.stargazers_count,
            watchers_count: repo.watchers_count,
            language: repo.language || null,
            fork: repo.fork,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            last_synced: new Date().toISOString(),
          }, { merge: true }));
        }
        await Promise.all(batch);
      }

      const now = new Date();
      setSyncStatus({ 
        syncing: false, 
        lastSynced: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      setError(error.message);
      setSyncStatus({ syncing: false, lastSynced: syncStatus.lastSynced });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        navigate('/', { replace: true });
        return;
      }

      try {
        // Check if we have a GitHub token in localStorage
        const accessToken = localStorage.getItem('github_access_token');
        if (!accessToken) {
          throw new Error('No GitHub access token found. Please sign in again.');
        }
        
        // Try to load data from Firestore first (if available)
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          // User exists in Firestore, get their GitHub ID
          const userData = userDoc.data();
          
          // Load user data
          setUser({
            login: userData.username,
            avatar_url: userData.avatar_url,
            name: userData.name,
            bio: userData.bio,
            id: userData.github_user_id
          });
          
          // Load repositories from Firestore
          const reposQuery = query(
            collection(db, 'repositories'),
            where('owner_uid', '==', firebaseUser.uid)
          );
          
          const reposSnapshot = await getDocs(reposQuery);
          const reposData = [];
          
          reposSnapshot.forEach(doc => {
            const repoData = doc.data();
            reposData.push({
              ...repoData,
              id: repoData.github_id,
              owner: {
                login: userData.username,
                avatar_url: userData.avatar_url
              }
            });
          });
          
          if (reposData.length > 0) {
            setRepos(reposData);
            setLoading(false);
            
            // Still fetch fresh data in the background
            fetchUserAndRepos();
          } else {
            // No cached repos, fetch fresh data
            await fetchUserAndRepos();
          }
        } else {
          // No user in Firestore, fetch everything fresh
          await fetchUserAndRepos();
        }
      } catch (error) {
        console.error('Auth state error:', error);
        setError(error.message);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      setError(null);
      // Clear GitHub token from localStorage
      localStorage.removeItem('github_access_token');
      await signOut(auth);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to log out. Please try again.');
    }
  };

  const handleRetry = async () => {
    try {
      await fetchUserAndRepos();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignInAgain = async () => {
    localStorage.removeItem('github_access_token');
    await signOut(auth);
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-20">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
              onClick={handleRetry}
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-lg transition-colors shadow-sm font-semibold"
            >
              Retry
            </button>
            <button
              onClick={handleSignInAgain}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors shadow-sm font-semibold"
            >
              Sign In Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="dashboard-header flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">GitHub Repository Manager</h1>
          <div className="flex items-center space-x-4">
            {syncStatus.lastSynced && (
              <span className="text-sm text-gray-500">
                Last synced: {syncStatus.lastSynced}
              </span>
            )}
            <button
              onClick={fetchUserAndRepos}
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
              onClick={handleLogout}
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
        {user && <UserProfile user={user} />}
        {repos && <RepoList repos={repos} accessToken={localStorage.getItem('github_access_token')} />}
      </div>
    </div>
  );
}

export default Dashboard;
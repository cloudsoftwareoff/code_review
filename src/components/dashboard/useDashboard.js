import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../lib/firebaseClient';
import { signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

export function useDashboard() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncStatus, setSyncStatus] = useState({ syncing: false, lastSynced: null });
  const navigate = useNavigate();

  const fetchUserAndRepos = async () => {
    try {
      setLoading(true);
      setError(null);
      setSyncStatus(prev => ({ ...prev, syncing: true }));

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
        await handleLogout();
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
        await handleLogout();
        throw new Error('Session expired. Please sign in again.');
      }

      if (!reposResponse.ok) {
        throw new Error(`Failed to fetch repositories: ${reposResponse.statusText}`);
      }

      const reposData = await reposResponse.json();
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

      setSyncStatus({ 
        syncing: false, 
        lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      setError(error.message);
      setSyncStatus(prev => ({ ...prev, syncing: false }));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setError(null);
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        navigate('/', { replace: true });
        return;
      }

      try {
        const accessToken = localStorage.getItem('github_access_token');
        if (!accessToken) {
          throw new Error('No GitHub access token found. Please sign in again.');
        }
        
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            login: userData.username,
            avatar_url: userData.avatar_url,
            name: userData.name,
            bio: userData.bio,
            id: userData.github_user_id
          });
          
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
            fetchUserAndRepos();
          } else {
            await fetchUserAndRepos();
          }
        } else {
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

  return {
    user,
    repos,
    loading,
    error,
    syncStatus,
    fetchUserAndRepos,
    handleLogout,
    handleRetry,
    handleSignInAgain
  };
}
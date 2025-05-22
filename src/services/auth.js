import { auth } from '../lib/firebaseClient';
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';

export const handleGitHubLogin = async ({ navigate, setError, setLoading }) => {
  try {
    setLoading(true);
    setError(null);

    const provider = new GithubAuthProvider();
    provider.addScope('read:user');
    provider.addScope('user:email');
    provider.addScope('repo');

    const result = await signInWithPopup(auth, provider);
    console.log('Firebase user authenticated:', result.user.uid);

    const credential = GithubAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    localStorage.setItem('github_access_token', accessToken);
    console.log('GitHub access token stored in localStorage');

    navigate('/dashboard');
  } catch (error) {
    console.error('GitHub login error:', error);
    setError(error.message || 'Failed to sign in with GitHub');
    throw error;
  } finally {
    setLoading(false);
  }
};
import { auth, db } from '../../lib/firebaseClient';
import { doc, setDoc } from 'firebase/firestore';

export const fetchPullRequests = async (
  repo,
  accessToken,
  setPullRequests,
  setLoading,
  setError,
  navigate,
  setContext
) => {
  const user = auth.currentUser;
  if (!user) {
    setError('User not authenticated');
    setLoading(false);
    navigate('/');
    return;
  }

  const repoId = String(repo.github_id || repo.id);
  if (!repoId) {
    setError('Invalid repository ID');
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    setError(null);

    // Update context for chatbot
    setContext({
      repo: {
        name: repo.name,
        language: repo.language,
        full_name: repo.full_name,
        owner: repo.owner.login,
      },
      file: null,
    });

    // Store repo in Firestore
    const repoRef = doc(db, 'repositories', repoId);
    await setDoc(
      repoRef,
      {
        id: repoId,
        github_id: Number(repoId),
        owner_uid: user.uid,
        full_name: repo.full_name,
        name: repo.name || repo.full_name.split('/')[1],
        private: repo.private || false,
        updated_at: new Date().toISOString(),
      },
      { merge: true }
    );

    // Fetch pull requests
    const response = await fetch(`https://api.github.com/repos/${repo.full_name}/pulls?state=open`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
        throw new Error('Authentication error. Please sign in again.');
      }
      if (response.status === 404) {
        throw new Error(`Repository ${repo.full_name} not found or inaccessible`);
      }
      throw new Error(`Failed to fetch pull requests: ${response.statusText}`);
    }

    const data = await response.json();
    setPullRequests(data);

    if (data.length > 0) {
      const batch = [];
      for (const pr of data) {
        const prRef = doc(db, 'pull_requests', `${repoId}_${pr.id}`);
        batch.push(
          setDoc(
            prRef,
            {
              id: `${repoId}_${pr.id}`,
              repo_id: repoId,
              pr_id: pr.id,
              number: pr.number,
              title: pr.title,
              html_url: pr.html_url,
              user: {
                login: pr.user.login,
                avatar_url: pr.user.avatar_url,
                html_url: pr.user.html_url,
              },
              state: pr.state,
              created_at: pr.created_at,
              updated_at: pr.updated_at,
              body: pr.body || '',
              last_synced: new Date().toISOString(),
            },
            { merge: true }
          )
        );
      }
      await Promise.all(batch);
    }
  } catch (err) {
    console.error('Error fetching pull requests:', err);
    setError(err.message);
    if (err.message.includes('Authentication') || err.message.includes('not found')) {
      navigate('/');
    }
  } finally {
    setLoading(false);
  }
};
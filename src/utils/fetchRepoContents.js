import { db } from '../lib/firebaseClient';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const fetchRepoContents = async (repo, path = '', accessToken, setRepoContents) => {
  if (!accessToken) {
    throw new Error('No GitHub access token provided');
  }

  const auth = getAuth();
  const user = auth.currentUser;
  console.log('Current Firebase user:', user ? user.uid : 'None');

  const contentId = `${repo.id}_${path || 'root'}`;
  const contentRef = doc(db, 'repo_contents', contentId);

  // Attempt Firestore cache if authenticated
  if (user) {
    try {
      const contentDoc = await getDoc(contentRef);
      if (contentDoc.exists()) {
        console.log('Retrieved contents from Firestore cache');
        setRepoContents(contentDoc.data().contents);
        return;
      }
    } catch (error) {
      console.warn('Firestore read error:', error.message);
      // Continue to GitHub API if Firestore fails
    }
  } else {
    console.warn('No authenticated user; skipping Firestore cache');
  }

  // Fetch from GitHub API
  try {
    const url = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/${path}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
        throw new Error('GitHub authentication error. Please sign in again.');
      }
      if (response.status === 404) {
        throw new Error(`Repository ${repo.full_name} not found or inaccessible`);
      }
      throw new Error(`Failed to fetch repo contents: ${response.statusText}`);
    }

    const data = await response.json();
    const contents = Array.isArray(data) ? data : [data];
    setRepoContents(contents);

    // Cache in Firestore if authenticated
    if (user) {
      try {
        await setDoc(contentRef, {
          id: contentId,
          repo_id: repo.id,
          path,
          contents,
          last_synced: new Date().toISOString(),
        });
        console.log('Cached contents in Firestore');
      } catch (error) {
        console.warn('Firestore write error:', error.message);
        // Don't throw; contents are already set
      }
    }
  } catch (error) {
    console.error('Error fetching repo contents:', error.message);
    setRepoContents([]);
    throw error;
  }
};
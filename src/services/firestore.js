import { db, auth } from '../lib/firebaseClient';
import { doc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

export const storeUserData = async (firebaseUser, userData) => {
  if (!firebaseUser) {
    console.warn('No authenticated Firebase user for storing user data');
    return;
  }
  try {
    const userRef = doc(db, 'users', firebaseUser.uid);
    console.log('Storing user data for UID:', firebaseUser.uid);
    await setDoc(userRef, {
      uid: firebaseUser.uid,
      github_user_id: userData.id,
      username: userData.login,
      avatar_url: userData.avatar_url,
      name: userData.name || null,
      bio: userData.bio || null,
      last_login: new Date().toISOString(),
    }, { merge: true });
    console.log('User data stored successfully');
  } catch (error) {
    console.error('Error storing user data:', error.message);
    throw error;
  }
};

export const storeRepositories = async (firebaseUser, userData, reposData) => {
  if (!firebaseUser) {
    console.warn('No authenticated Firebase user for storing repositories');
    return;
  }
  try {
    const batch = [];
    for (const repo of reposData) {
      const repoRef = doc(db, 'repositories', `${userData.id}_${repo.id}`);
      batch.push(setDoc(repoRef, {
        id: `${userData.id}_${repo.id}`,
        github_id: repo.id,
        owner_uid: firebaseUser.uid,
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
    console.log('Storing repositories for user:', userData.login);
    await Promise.all(batch);
    console.log('Repositories stored successfully');
  } catch (error) {
    console.error('Error storing repositories:', error.message);
    throw error;
  }
};

export const fetchCachedUserAndRepos = async (firebaseUser) => {
  if (!firebaseUser) {
    console.warn('No authenticated Firebase user for fetching cached data');
    return { userData: null, reposData: [] };
  }
  try {
    console.log('Fetching cached data for UID:', firebaseUser.uid);
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.log('No cached user data found');
      return { userData: null, reposData: [] };
    }

    const userData = userDoc.data();
    const formattedUserData = {
      login: userData.username,
      avatar_url: userData.avatar_url,
      name: userData.name,
      bio: userData.bio,
      id: userData.github_user_id,
    };

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
          avatar_url: userData.avatar_url,
        },
      });
    });

    console.log('Fetched cached user and repos:', { user: userData.username, repoCount: reposData.length });
    return { userData: formattedUserData, reposData };
  } catch (error) {
    console.error('Error fetching cached user and repos:', error.message);
    throw error;
  }
};
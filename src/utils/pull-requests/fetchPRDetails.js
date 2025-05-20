import { auth, db } from '../../lib/firebaseClient';
import { doc, setDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || 'fallback-key');

export const fetchPRDetails = async (
  pr,
  repo,
  accessToken,
  expandedPR,
  setExpandedPR,
  setPullRequests,
  navigate
) => {
  if (expandedPR === pr.number) {
    setExpandedPR(null);
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    setExpandedPR(null);
    navigate('/');
    throw new Error('User not authenticated');
  }

  try {
    setExpandedPR(pr.number);

    const repoId = String(repo.github_id || repo.id);
    if (!repoId) {
      throw new Error('Invalid repository ID');
    }

    // Fetch reviews from Firestore
    let storedReviews = [];
    try {
      const reviewsQuery = query(
        collection(db, 'pull_request_reviews'),
        where('pr_id', '==', `${repoId}_${pr.id}`)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      storedReviews = reviewsSnapshot.docs.map((doc) => doc.data());
    } catch (err) {
      console.error('Error fetching reviews from Firestore:', err);
      throw new Error(`Failed to fetch reviews: ${err.message}`);
    }

    // Fetch diff from Firestore
    let storedDiff = null;
    try {
      const diffRef = doc(db, 'pull_requests', `${repoId}_${pr.id}`, 'diffs', 'latest');
      const diffDoc = await getDoc(diffRef);
      if (diffDoc.exists()) {
        storedDiff = diffDoc.data().content;
      }
    } catch (err) {
      console.error('Error fetching diff from Firestore:', err);
      throw new Error(`Failed to fetch diff: ${err.message}`);
    }

    // Fetch AI analysis from Firestore
    let storedAnalysis = null;
    try {
      const analysisRef = doc(db, 'pull_requests', `${repoId}_${pr.id}`, 'ai_analysis', 'latest');
      const analysisDoc = await getDoc(analysisRef);
      if (analysisDoc.exists()) {
        storedAnalysis = analysisDoc.data().content;
      }
    } catch (err) {
      console.error('Error fetching AI analysis from Firestore:', err);
      throw new Error(`Failed to fetch AI analysis: ${err.message}`);
    }

    let reviewsData = storedReviews;
    let diffData = storedDiff;
    let analysisData = storedAnalysis;

    if (storedReviews.length === 0 || !storedDiff || !storedAnalysis) {
      if (storedReviews.length === 0) {
        const reviewsResponse = await fetch(
          `https://api.github.com/repos/${repo.full_name}/pulls/${pr.number}/reviews`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );

        if (!reviewsResponse.ok) {
          if (reviewsResponse.status === 401 || reviewsResponse.status === 403) {
            window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
            throw new Error('Authentication error. Please sign in again.');
          }
          if (reviewsResponse.status === 404) {
            throw new Error(`Pull request #${pr.number} not found in ${repo.full_name}`);
          }
          throw new Error(`Failed to fetch reviews: ${reviewsResponse.statusText}`);
        }

        reviewsData = await reviewsResponse.json();

        const batch = [];
        for (const review of reviewsData) {
          const reviewRef = doc(db, 'pull_request_reviews', `${repoId}_${pr.id}_${review.id}`);
          batch.push(
            setDoc(
              reviewRef,
              {
                id: `${repoId}_${pr.id}_${review.id}`,
                pr_id: `${repoId}_${pr.id}`,
                review_id: review.id,
                user: {
                  login: review.user.login,
                  avatar_url: review.user.avatar_url,
                },
                state: review.state,
                body: review.body || '',
                submitted_at: review.submitted_at,
                commit_id: review.commit_id,
                last_synced: new Date().toISOString(),
              },
              { merge: true }
            )
          );
        }
        await Promise.all(batch);
      }

      if (!storedDiff) {
        const diffResponse = await fetch(
          `https://api.github.com/repos/${repo.full_name}/pulls/${pr.number}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.github.diff',
            },
          }
        );

        if (!diffResponse.ok) {
          if (diffResponse.status === 401 || diffResponse.status === 403) {
            window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
            throw new Error('Authentication error. Please sign in again.');
          }
          if (diffResponse.status === 404) {
            throw new Error(`Pull request #${pr.number} not found in ${repo.full_name}`);
          }
          throw new Error(`Failed to fetch diff: ${diffResponse.statusText}`);
        }

        diffData = await diffResponse.text();

        const maxDiffSize = 1000000;
        const truncatedDiff = diffData.length > maxDiffSize ? diffData.slice(0, maxDiffSize) + '\n... (truncated)' : diffData;
        const diffRef = doc(db, 'pull_requests', `${repoId}_${pr.id}`, 'diffs', 'latest');
        await setDoc(
          diffRef,
          {
            id: 'latest',
            pr_id: `${repoId}_${pr.id}`,
            content: truncatedDiff,
            last_synced: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      if (!storedAnalysis && diffData) {
        try {
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
          const prompt = `Analyze this GitHub pull request diff for potential bugs, code quality issues, and improvement suggestions. Provide very short recommendations in one paragraph:\n\n${diffData.slice(0, 4000)}`;
          const result = await model.generateContent(prompt);
          const response = await result.response;
          analysisData = await response.text();

          const analysisRef = doc(db, 'pull_requests', `${repoId}_${pr.id}`, 'ai_analysis', 'latest');
          await setDoc(
            analysisRef,
            {
              id: 'latest',
              pr_id: `${repoId}_${pr.id}`,
              content: analysisData,
              last_synced: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (err) {
          console.error('Error fetching AI analysis from Gemini AI:', err);
          analysisData = 'Failed to generate AI analysis: ' + err.message;
        }
      }
    }

    setPullRequests((prevPRs) =>
      prevPRs.map((p) => (p.id === pr.id ? { ...p, reviews: reviewsData, diff: diffData, aiAnalysis: analysisData } : p))
    );
  } catch (err) {
    console.error('Error fetching PR details:', err);
    setExpandedPR(null);
    if (err.message.includes('Authentication') || err.message.includes('not found')) {
      navigate('/');
    }
    throw err;
  }
};
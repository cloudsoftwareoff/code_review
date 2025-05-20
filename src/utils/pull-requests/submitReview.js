import { auth, db } from '../../lib/firebaseClient';
import { doc, setDoc } from 'firebase/firestore';

export const submitReview = async (
  pr,
  repo,
  accessToken,
  reviewComment,
  reviewAction,
  setPullRequests,
  setReviewComment,
  setReviewAction,
  setSubmittingReview,
  setReviewSubmitError,
  navigate
) => {
  try {
    setSubmittingReview(true);
    setReviewSubmitError(null);

    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const prResponse = await fetch(
      `https://api.github.com/repos/${repo.full_name}/pulls/${pr.number}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!prResponse.ok) {
      if (prResponse.status === 404) {
        throw new Error(`Pull request #${pr.number} not found in ${repo.full_name}`);
      }
      if (prResponse.status === 401 || prResponse.status === 403) {
        window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
        throw new Error('Authentication error. Please sign in again.');
      }
      throw new Error(`Failed to validate PR: ${prResponse.statusText}`);
    }

    const response = await fetch(
      `https://api.github.com/repos/${repo.full_name}/pulls/${pr.number}/reviews`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: reviewComment,
          event: reviewAction,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 404) {
        throw new Error(`Pull request #${pr.number} not found in ${repo.full_name}`);
      }
      if (response.status === 401 || response.status === 403) {
        window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
        throw new Error('Authentication error. Please sign in again.');
      }
      throw new Error(`Failed to submit review: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();

    const repoId = String(repo.github_id || repo.id);
    if (!repoId) {
      throw new Error('Invalid repository ID');
    }

    const reviewRef = doc(db, 'pull_request_reviews', `${repoId}_${pr.id}_${data.id}`);
    await setDoc(
      reviewRef,
      {
        id: `${repoId}_${pr.id}_${data.id}`,
        pr_id: `${repoId}_${pr.id}`,
        review_id: data.id,
        user: {
          login: data.user.login,
          avatar_url: data.user.avatar_url,
        },
        state: data.state,
        body: data.body || '',
        submitted_at: data.submitted_at,
        commit_id: data.commit_id,
        last_synced: new Date().toISOString(),
      },
      { merge: true }
    );

    setPullRequests((prevPRs) =>
      prevPRs.map((p) =>
        p.id === pr.id
          ? {
              ...p,
              reviews: [...(p.reviews || []), data],
            }
          : p
      )
    );

    setReviewComment('');
    setReviewAction('COMMENT');
  } catch (err) {
    console.error('Error submitting review:', err);
    setReviewSubmitError(err.message);
    if (err.message.includes('Authentication') || err.message.includes('not found')) {
      navigate('/');
    }
  } finally {
    setSubmittingReview(false);
  }
};
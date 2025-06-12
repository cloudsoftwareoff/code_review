import { useState } from 'react';
import { submitReview } from '../../utils/pull-requests/submitReview';

function ReviewForm({ pr, repo, accessToken, setPullRequests, navigate }) {
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAction, setReviewAction] = useState('COMMENT');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitError, setReviewSubmitError] = useState(null);

  const handleSubmit = async () => {
    await submitReview(
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
    );
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-700 dark:border-gray-700">
      <h5 className="text-sm font-semibold text-gray-300 dark:text-gray-300 mb-2">Submit a review:</h5>
      <div className="space-y-3">
        <textarea
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-700 text-gray-100 placeholder-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-600"
          placeholder="Write your review comment here..."
          rows={3}
        />

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={reviewAction}
            onChange={(e) => setReviewAction(e.target.value)}
            className="p-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-700 text-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="COMMENT">Comment only</option>
            <option value="APPROVE">Approve</option>
            <option value="REQUEST_CHANGES">Request changes</option>
          </select>

          <button
            onClick={handleSubmit}
            disabled={submittingReview || !reviewComment.trim()}
            className="ml-auto bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white px-4 py-2 rounded-lg transition-colors dark:bg-violet-600 dark:hover:bg-violet-700 dark:disabled:bg-violet-400"
          >
            {submittingReview ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>

        {reviewSubmitError && (
          <p className="text-sm text-red-400 dark:text-red-400">Error: {reviewSubmitError}</p>
        )}
      </div>
    </div>
  );
}
export default ReviewForm;
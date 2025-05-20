import { useEffect } from 'react';
import Prism from 'prismjs';
import DiffViewer from './DiffViewer';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import { fetchPRDetails } from '../../utils/pull-requests/fetchPRDetails';

function PullRequestItem({ pr, repo, accessToken, expandedPR, setExpandedPR, navigate, setPullRequests }) {
  useEffect(() => {
    if (expandedPR === pr.number) {
      Prism.highlightAll();
    }
  }, [expandedPR, pr.number]);

  const handleNavigateToReview = () => {
    navigate(`/review/${repo.full_name}/${pr.number}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => fetchPRDetails(pr, repo, accessToken, expandedPR, setExpandedPR, setPullRequests, navigate)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={pr.user.avatar_url}
              alt={`${pr.user.login}'s avatar`}
              className="w-8 h-8 rounded-full mr-3"
            />
            <div>
              <h4 className="font-medium text-violet-800">
                PR #{pr.number}: {pr.title}
              </h4>
              <p className="text-sm text-gray-600">
                Opened by <span className="font-medium">{pr.user.login}</span> on{' '}
                {formatDate(pr.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              {pr.state}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNavigateToReview();
              }}
              className="text-sm text-violet-600 hover:text-violet-800"
            >
              Review
            </button>
          </div>
        </div>
      </div>

      {expandedPR === pr.number && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {pr.body && (
            <div className="mb-4 p-3 bg-white rounded border border-gray-200">
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Description:</h5>
              <p className="text-sm text-gray-600 whitespace-pre-line">{pr.body}</p>
            </div>
          )}

          {pr.diff && <DiffViewer diff={pr.diff} />}

          {pr.aiAnalysis && (
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-700 mb-2">AI Analysis:</h5>
              <div className="bg-white rounded border border-gray-200 p-3 overflow-auto max-h-96">
                <p className="text-sm text-gray-600 whitespace-pre-line">{pr.aiAnalysis}</p>
              </div>
            </div>
          )}

          <ReviewList reviews={pr.reviews} />

          <ReviewForm
            pr={pr}
            repo={repo}
            accessToken={accessToken}
            setPullRequests={setPullRequests}
            navigate={navigate}
          />

          <div className="mt-4 text-center">
            <a
              href={pr.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-violet-600 hover:text-violet-800"
            >
              View on GitHub →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default PullRequestItem;
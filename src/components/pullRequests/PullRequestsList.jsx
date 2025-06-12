import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCodeReviewContext } from '../../App';
import PullRequestItem from './PullRequestItem';
import { fetchPullRequests } from '../../utils/pull-requests/fetchPullRequests';
import 'prismjs/themes/prism-dark.css'; // Updated to dark theme for PrismJS
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';

export default function PullRequestsList({ repo, accessToken }) {
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPR, setExpandedPR] = useState(null);
  const navigate = useNavigate();
  const { setContext } = useCodeReviewContext();

  useEffect(() => {
    if (!repo || !accessToken) {
      setError('Missing repository or access token');
      setLoading(false);
      return;
    }

    fetchPullRequests(repo, accessToken, setPullRequests, setLoading, setError, navigate, setContext);
  }, [repo, accessToken, navigate, setContext]);

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-400 dark:border-violet-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900 border border-red-700 rounded-lg dark:bg-red-900 dark:border-red-700">
        <p className="text-red-300 dark:text-red-300">Error: {error}</p>
        <button
          className="mt-2 text-sm text-violet-400 hover:text-violet-300 dark:text-violet-400 dark:hover:text-violet-300"
          onClick={() => setError(null)}
        >
          Try again
        </button>
      </div>
    );
  }

  if (pullRequests.length === 0) {
    return (
      <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg text-center dark:bg-gray-800 dark:border-gray-700">
        <p className="text-gray-400 dark:text-gray-400">No open pull requests found for this repository</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-violet-400 dark:text-violet-400">Pull Requests ({pullRequests.length})</h3>
      <div className="space-y-4">
        {pullRequests.map((pr) => (
          <PullRequestItem
            key={pr.id}
            pr={pr}
            repo={repo}
            accessToken={accessToken}
            expandedPR={expandedPR}
            setExpandedPR={setExpandedPR}
            navigate={navigate}
            setPullRequests={setPullRequests}
          />
        ))}
      </div>
    </div>
  );
}

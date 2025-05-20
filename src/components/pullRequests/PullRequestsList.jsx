import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCodeReviewContext } from '../../App';
import PullRequestItem from './PullRequestItem';
import { fetchPullRequests } from '../../utils/pull-requests/fetchPullRequests';
import 'prismjs/themes/prism.css';
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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
        <button
          className="mt-2 text-sm text-violet-600 hover:text-violet-800"
          onClick={() => setError(null)}
        >
          Try again
        </button>
      </div>
    );
  }

  if (pullRequests.length === 0) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <p className="text-gray-500">No open pull requests found for this repository</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-violet-800">Pull Requests ({pullRequests.length})</h3>
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
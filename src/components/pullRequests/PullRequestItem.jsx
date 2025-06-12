import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import DiffViewer from './DiffViewer';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import { fetchPRDetails } from '../../utils/pull-requests/fetchPRDetails';
import ReactMarkdown from 'react-markdown';
import 'prismjs/themes/prism-dark.css'; // Updated to dark theme
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import remarkGfm from 'remark-gfm';

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

  const CodeBlock = ({ language, value }) => {
    const codeRef = useRef(null);

    useEffect(() => {
      if (codeRef.current) {
        Prism.highlightElement(codeRef.current);
      }
    }, [value]);

    return (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto dark:bg-gray-900 dark:text-gray-100">
        <code ref={codeRef} className={`language-${language || 'javascript'}`}>
          {value}
        </code>
      </pre>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
      <div
        className="p-4 cursor-pointer hover:bg-gray-700 dark:hover:bg-gray-700"
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
              <h4 className="font-medium text-violet-400 dark:text-violet-400">
                PR #{pr.number}: {pr.title}
              </h4>
              <p className="text-sm text-gray-400 dark:text-gray-400">
                Opened by <span className="font-medium">{pr.user.login}</span> on{' '}
                {formatDate(pr.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-900 text-yellow-300 text-xs px-2 py-1 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
              {pr.state}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNavigateToReview();
              }}
              className="text-sm text-violet-400 hover:text-violet-300 dark:text-violet-400 dark:hover:text-violet-300"
            >
              Review
            </button>
          </div>
        </div>
      </div>

      {expandedPR === pr.number && (
        <div className="p-4 border-t border-gray-700 bg-gray-700 dark:border-gray-700 dark:bg-gray-700">
          {pr.body && (
            <div className="mb-4 p-3 bg-gray-800 rounded border border-gray-700 dark:bg-gray-800 dark:border-gray-700">
              <h5 className="text-sm font-semibold text-gray-300 mb-2 dark:text-gray-300">Description:</h5>
              <p className="text-sm text-gray-400 whitespace-pre-line dark:text-gray-400">{pr.body}</p>
            </div>
          )}

          {pr.diff ? (<DiffViewer diff={pr.diff} />) : (<p className="text-gray-400 dark:text-gray-400">Loading...</p>)}

          {pr.aiAnalysis && (
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-300 mb-2 dark:text-gray-300">AI Analysis:</h5>
              <div className="bg-gray-800 rounded border border-gray-700 p-3 overflow-auto max-h-96 dark:bg-gray-800 dark:border-gray-700">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                      ) : (
                        <code className="bg-gray-700 text-violet-300 px-1 rounded dark:bg-gray-700 dark:text-violet-300" {...props}>
                          {children}
                        </code>
                      );
                    },
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-violet-400 mt-6 mb-4 dark:text-violet-400">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-semibold text-violet-400 mt-5 mb-3 dark:text-violet-400">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-medium text-violet-300 mt-4 mb-2 dark:text-violet-300">{children}</h3>,
                    p: ({ children }) => <p className="text-gray-300 mb-4 dark:text-gray-300">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-4 dark:text-gray-300">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-4 dark:text-gray-300">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-violet-500 pl-4 italic text-gray-400 mb-4 dark:border-violet-500 dark:text-gray-400">{children}</blockquote>
                    ),
                    table: ({ children }) => <table className="table-auto border-collapse border border-gray-600 mb-4 dark:border-gray-600">{children}</table>,
                    thead: ({ children }) => <thead className="bg-gray-700 dark:bg-gray-700">{children}</thead>,
                    th: ({ children }) => <th className="border border-gray-600 px-4 py-2 text-left dark:border-gray-600">{children}</th>,
                    td: ({ children }) => <td className="border border-gray-600 px-4 py-2 dark:border-gray-600">{children}</td>,
                  }}
                >
                  {pr.aiAnalysis}
                </ReactMarkdown>
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
              className="text-sm text-violet-400 hover:text-violet-300 dark:text-violet-400 dark:hover:text-violet-300"
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
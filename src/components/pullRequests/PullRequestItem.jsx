import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import DiffViewer from './DiffViewer';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import { fetchPRDetails } from '../../utils/pull-requests/fetchPRDetails';
import ReactMarkdown from 'react-markdown';
import 'prismjs/themes/prism.css';
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
      <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
        <code ref={codeRef} className={`language-${language || 'javascript'}`}>
          {value}
        </code>
      </pre>
    );
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

          {pr.diff ? (<DiffViewer diff={pr.diff} />):(<p>Loading...</p>)}

          {pr.aiAnalysis && (
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-700 mb-2">AI Analysis:</h5>
              <div className="bg-white rounded border border-gray-200 p-3 overflow-auto max-h-96">
                
                       <ReactMarkdown
                                      remarkPlugins={[remarkGfm]}
                                      components={{
                                        code({ node, inline, className, children, ...props }) {
                                          const match = /language-(\w+)/.exec(className || '');
                                          return !inline && match ? (
                                            <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                                          ) : (
                                            <code className="bg-gray-200 text-violet-800 px-1 rounded" {...props}>
                                              {children}
                                            </code>
                                          );
                                        },
                                        h1: ({ children }) => <h1 className="text-2xl font-bold text-violet-900 mt-6 mb-4">{children}</h1>,
                                        h2: ({ children }) => <h2 className="text-xl font-semibold text-violet-800 mt-5 mb-3">{children}</h2>,
                                        h3: ({ children }) => <h3 className="text-lg font-medium text-violet-700 mt-4 mb-2">{children}</h3>,
                                        p: ({ children }) => <p className="text-gray-700 mb-4">{children}</p>,
                                        ul: ({ children }) => <ul className="list-disc list-inside text-gray-700 mb-4">{children}</ul>,
                                        ol: ({ children }) => <ol className="list-decimal list-inside text-gray-700 mb-4">{children}</ol>,
                                        li: ({ children }) => <li className="mb-1">{children}</li>,
                                        blockquote: ({ children }) => (
                                          <blockquote className="border-l-4 border-violet-500 pl-4 italic text-gray-600 mb-4">{children}</blockquote>
                                        ),
                                        table: ({ children }) => <table className="table-auto border-collapse border border-gray-300 mb-4">{children}</table>,
                                        thead: ({ children }) => <thead className="bg-gray-200">{children}</thead>,
                                        th: ({ children }) => <th className="border border-gray-300 px-4 py-2 text-left">{children}</th>,
                                        td: ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
                                      }}
                                    >
                                      {pr.aiAnalysis}
                                    </ReactMarkdown>
                
                {/* <p className="text-sm text-gray-600 whitespace-pre-line">{pr.aiAnalysis}</p> */}
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
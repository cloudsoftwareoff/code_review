import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import Prism from 'prismjs';
import 'prismjs/themes/prism-dark.css'; // Updated to dark theme
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import remarkGfm from 'remark-gfm';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

function FileViewer({ file, repo, accessToken, onBack }) {
  const [fileContent, setFileContent] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [error, setError] = useState(null);
  const [typingProgress, setTypingProgress] = useState(0);
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    fetchFileContent();
  }, [file]);

  // typewriter effect
  useEffect(() => {
    if (recommendations && !isTypingComplete) {
      const speed = 30;
      let position = 0;
      
      const type = () => {
        if (position < recommendations.length) {
          position += 5; 
          setTypingProgress(position);
        } else {
          setIsTypingComplete(true);
          clearInterval(typingIntervalRef.current);
        }
      };

      typingIntervalRef.current = setInterval(type, speed);

      return () => clearInterval(typingIntervalRef.current);
    }
  }, [recommendations, isTypingComplete]);

  // Validate file prop
  if (!file || !file.name || !file.path) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden p-6 dark:bg-gray-800">
        <div className="bg-red-900 border-l-4 border-red-700 text-red-300 p-4 mb-4 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-300">
          <p>Error: Invalid file data. Please try selecting the file again.</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center text-violet-400 hover:text-violet-300 font-medium dark:text-violet-400 dark:hover:text-violet-300"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Contents
        </button>
      </div>
    );
  }

  // Fetch file content : GitHub API
  const fetchFileContent = async () => {
    try {
      setLoadingContent(true);
      setError(null);
      if (file.type !== 'file') {
        throw new Error('Selected item is not a file');
      }
      const response = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/${file.path}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3.raw',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch file content: ${response.statusText}`);
      }

      const content = await response.text();
      if (!content) {
        setError('File is empty or not a text file');
      }
      setFileContent(content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingContent(false);
    }
  };

  // Fetch AI recommendations : Gemini API
  const fetchAIRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      setError(null);
      setIsTypingComplete(false);
      setTypingProgress(0);

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        Analyze the following code from a file named "${file.name}" in a ${repo.language} repository. 
        Provide a recommendations to improve the code, in short paragraph including:
        - Code quality improvements
        - Performance optimizations
        - Best practices
        - Security considerations
        - Any other relevant suggestions
        Ensure the recommendations are actionable, formatted in Markdown, and include code snippets where applicable.

        Code:
        \`\`\`
        ${fileContent.slice(0, 4000)}
        \`\`\`
      `;

      const result = await model.generateContent(prompt);
      const recommendationsText = await result.response.text();
      setRecommendations(recommendationsText);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Skip animation
  const handleSkipAnimation = () => {
    if (recommendations && !isTypingComplete) {
      clearInterval(typingIntervalRef.current);
      setIsTypingComplete(true);
    }
  };

  // code block 
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

  const getDisplayableRecommendations = () => {
    if (!recommendations) return '';
    if (isTypingComplete) return recommendations;
    return recommendations.slice(0, typingProgress);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden p-6 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="flex items-center text-violet-400 hover:text-violet-300 font-medium mr-4 transition-colors dark:text-violet-400 dark:hover:text-violet-300"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Contents
          </button>
          <h3 className="text-lg font-semibold text-violet-400 dark:text-violet-400">{file.name}</h3>
        </div>
        <button
          onClick={fetchAIRecommendations}
          disabled={loadingRecommendations || !fileContent}
          className="flex items-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm py-2 px-4 rounded-lg transition-colors dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-400"
        >
          {loadingRecommendations ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Generating...
            </>
          ) : (
            'Get AI Recommendations'
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900 border-l-4 border-red-700 text-red-300 p-4 mb-6 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-300">
          <p>{error}</p>
        </div>
      )}

      {recommendations && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-md font-medium text-gray-300 dark:text-gray-300">AI Recommendations</h4>
            {!isTypingComplete && (
              <button 
                onClick={handleSkipAnimation}
                className="text-sm text-violet-400 hover:text-violet-300 dark:text-violet-400 dark:hover:text-violet-300"
              >
                Skip animation
              </button>
            )}
          </div>
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 shadow-sm prose prose-violet max-w-none dark:bg-gray-700 dark:border-gray-600">
            {isTypingComplete ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                    ) : (
                      <code className="bg-gray-800 text-violet-300 px-1 rounded dark:bg-gray-800 dark:text-violet-300" {...props}>
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
                {recommendations}
              </ReactMarkdown>
            ) : (
              <div className="typing-animation-container">
                {getDisplayableRecommendations()}
                <span className="typing-cursor">|</span>
              </div>
            )}
          </div>
        </div>
      )}

      {loadingContent ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-400 dark:border-violet-400"></div>
        </div>
      ) : (
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-300 mb-2 dark:text-gray-300">File Content</h4>
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-100 dark:bg-gray-900 dark:text-gray-100">
            <code>{fileContent || 'No content available'}</code>
          </pre>
        </div>
      )}

      <style jsx>{`
        .typing-animation-container {
          white-space: pre-wrap;
          font-family: inherit;
          color: #d1d5db; /* gray-300 */
        }
        .typing-cursor {
          display: inline-block;
          width: 2px;
          background-color: #a78bfa; /* violet-400 */
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
export default FileViewer;
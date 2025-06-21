import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import Prism from 'prismjs';
import 'prismjs/themes/prism-dark.css'; 
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-bash';
import remarkGfm from 'remark-gfm';
import { getUIColors,getFileTypeInfo } from '../utils/repoUtils';
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

function FileViewer({ file, repo, accessToken, onBack }) {
  const [fileContent, setFileContent] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [error, setError] = useState(null);
  const [typingProgress, setTypingProgress] = useState(0);
  const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'raw'
  const [copied, setCopied] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const typingIntervalRef = useRef(null);
  const colors = getUIColors();

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

  // Get file language for syntax highlighting
  const getFileLanguage = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap = {
      'js': 'javascript',
      'jsx': 'jsx',
      'ts': 'typescript',
      'tsx': 'tsx',
      'py': 'python',
      'css': 'css',
      'html': 'html',
      'json': 'json',
      'md': 'markdown',
      'sh': 'bash',
      'yml': 'yaml',
      'yaml': 'yaml',
      'xml': 'xml',
      'sql': 'sql',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'cs': 'csharp',
      'swift': 'swift',
      'kt': 'kotlin'
    };
    return languageMap[ext] || 'text';
  };

  // Validate file prop
  if (!file || !file.name || !file.path) {
    return (
      <div className={`${colors.background.card} rounded-lg shadow-lg overflow-hidden p-6`}>
        <div className={`${colors.status.error} p-4 mb-4 rounded-lg border-l-4 border-red-500`}>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="font-medium">Error: Invalid file data. Please try selecting the file again.</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className={`${colors.interactive.ghost} flex items-center font-medium rounded-lg px-3 py-2`}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  // Copy content to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fileContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Skip animation
  const handleSkipAnimation = () => {
    if (recommendations && !isTypingComplete) {
      clearInterval(typingIntervalRef.current);
      setIsTypingComplete(true);
    }
  };

  // Enhanced code block component
  const CodeBlock = ({ language, value }) => {
    const codeRef = useRef(null);

    useEffect(() => {
      if (codeRef.current) {
        Prism.highlightElement(codeRef.current);
      }
    }, [value]);

    return (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-700">
        <code ref={codeRef} className={`language-${language || 'javascript'}`}>
          {value}
        </code>
      </pre>
    );
  };

  // Enhanced file content display
  const FileContentDisplay = () => {
    const language = getFileLanguage(file.name);
    const fileInfo = getFileTypeInfo(file.name);
    const lines = fileContent.split('\n');
    const isCodeFile = ['javascript', 'typescript', 'python', 'css', 'html', 'json', 'jsx', 'tsx'].includes(language);

    if (viewMode === 'raw') {
      return (
        <div className="relative">
          <pre className={`${colors.background.secondary} border border-gray-300 dark:border-gray-600 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap`}>
            <code className={colors.text.primary}>{fileContent || 'No content available'}</code>
          </pre>
        </div>
      );
    }

    return (
      <div className="relative">
        {isCodeFile ? (
          <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
            {/* Code header */}
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${fileInfo.color}`}>{fileInfo.icon}</span>
                <span className="text-gray-300 text-sm font-medium">{file.name}</span>
                <span className="text-gray-500 text-xs bg-gray-700 px-2 py-1 rounded">{language}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setLineNumbers(!lineNumbers)}
                  className="text-gray-400 hover:text-gray-300 text-xs px-2 py-1 rounded hover:bg-gray-700"
                >
                  {lineNumbers ? 'Hide' : 'Show'} Lines
                </button>
                <button
                  onClick={copyToClipboard}
                  className="text-gray-400 hover:text-gray-300 text-xs px-2 py-1 rounded hover:bg-gray-700 flex items-center"
                >
                  {copied ? (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Code content */}
            <div className="overflow-x-auto">
              <pre className="text-sm">
                <code 
                  className={`language-${language}`}
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(fileContent, Prism.languages[language] || Prism.languages.text, language)
                  }}
                  style={{
                    display: 'table',
                    width: '100%',
                    lineHeight: '1.5',
                    fontSize: '13px',
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                  }}
                />
              </pre>
              
              {lineNumbers && (
                <div 
                  className="absolute left-0 top-0 bg-gray-800 border-r border-gray-700 text-gray-500 text-xs text-right select-none pointer-events-none"
                  style={{
                    width: '3rem',
                    paddingTop: '2.5rem', // Account for header
                    lineHeight: '1.5',
                    fontSize: '13px',
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                  }}
                >
                  {lines.map((_, index) => (
                    <div key={index} className="px-2">
                      {index + 1}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Non-code files
          <div className={`${colors.background.secondary} border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden`}>
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${fileInfo.color}`}>{fileInfo.icon}</span>
                <span className={`${colors.text.primary} text-sm font-medium`}>{file.name}</span>
              </div>
              <button
                onClick={copyToClipboard}
                className={`${colors.interactive.ghost} text-xs px-2 py-1 rounded flex items-center`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <pre className={`${colors.text.primary} text-sm font-mono whitespace-pre-wrap`}>
                {fileContent || 'No content available'}
              </pre>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getDisplayableRecommendations = () => {
    if (!recommendations) return '';
    if (isTypingComplete) return recommendations;
    return recommendations.slice(0, typingProgress);
  };

  return (
    <div className={`${colors.background.card} rounded-lg shadow-lg overflow-hidden`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className={`${colors.interactive.ghost} flex items-center font-medium rounded-lg px-3 py-2 mr-4`}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div>
              <h3 className="text-lg font-semibold text-violet-600 dark:text-violet-400">{file.name}</h3>
              <p className={`${colors.text.secondary} text-sm`}>
                {fileContent.split('\n').length} lines • {Math.round(fileContent.length / 1024)}KB
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* View toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  viewMode === 'preview' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm' 
                    : colors.text.secondary
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  viewMode === 'raw' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm' 
                    : colors.text.secondary
                }`}
              >
                Raw
              </button>
            </div>
            
            <button
              onClick={fetchAIRecommendations}
              disabled={loadingRecommendations || !fileContent}
              className={`${colors.interactive.primary} flex items-center text-sm py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loadingRecommendations ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Get AI Recommendations
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className={`${colors.status.error} p-4 mb-6 rounded-lg border-l-4 border-red-500`}>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        {recommendations && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium text-violet-600 dark:text-violet-400 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Recommendations
              </h4>
              {!isTypingComplete && (
                <button 
                  onClick={handleSkipAnimation}
                  className="text-sm text-violet-500 hover:text-violet-400 dark:text-violet-400 dark:hover:text-violet-300"
                >
                  Skip animation
                </button>
              )}
            </div>
            <div className={`${colors.background.secondary} p-6 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm prose prose-violet max-w-none`}>
              {isTypingComplete ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                      ) : (
                        <code className="bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 px-1 rounded text-sm" {...props}>
                          {children}
                        </code>
                      );
                    },
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-violet-600 dark:text-violet-400 mt-6 mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-semibold text-violet-600 dark:text-violet-400 mt-5 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-medium text-violet-500 dark:text-violet-300 mt-4 mb-2">{children}</h3>,
                    p: ({ children }) => <p className={`${colors.text.primary} mb-4 leading-relaxed`}>{children}</p>,
                    ul: ({ children }) => <ul className={`list-disc list-inside ${colors.text.primary} mb-4 space-y-1`}>{children}</ul>,
                    ol: ({ children }) => <ol className={`list-decimal list-inside ${colors.text.primary} mb-4 space-y-1`}>{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-violet-500 dark:border-violet-400 pl-4 italic text-gray-600 dark:text-gray-400 mb-4 bg-violet-50 dark:bg-violet-900/20 py-2 rounded-r">{children}</blockquote>
                    ),
                  }}
                >
                  {recommendations}
                </ReactMarkdown>
              ) : (
                <div className="typing-animation-container">
                  <span className={colors.text.primary}>{getDisplayableRecommendations()}</span>
                  <span className="typing-cursor">|</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* File Content */}
        {loadingContent ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500 dark:border-violet-400 mx-auto mb-4"></div>
              <p className={colors.text.secondary}>Loading file content...</p>
            </div>
          </div>
        ) : (
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              File Content
            </h4>
            <FileContentDisplay />
          </div>
        )}
      </div>

      <style jsx>{`
        .typing-animation-container {
          white-space: pre-wrap;
          font-family: inherit;
        }
        .typing-cursor {
          display: inline-block;
          width: 2px;
          background-color: #a78bfa;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
        .line-numbers {
          padding-left: 3.5rem;
        }
      `}</style>
    </div>
  );
}

export default FileViewer;
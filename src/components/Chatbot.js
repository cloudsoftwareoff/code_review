import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useCodeReviewContext } from '../App';
import { fetchChatResponse, RenderCodeBlock } from '../utils/chatbotUtils';

function Chatbot({ isOpen, onClose }) {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatError, setChatError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { context } = useCodeReviewContext();
  const chatContainerRef = useRef(null);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userInput = chatInput;
    setChatInput('');
    setIsLoading(true);
    setChatHistory(prev => [...prev, { user: userInput, ai: '' }]);
    
    try {
      await fetchChatResponse(userInput, context, setChatError, setChatHistory);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Code Assistant</h3>
              <p className="text-violet-100 text-sm">
                {context?.repo ? (
                  <span className="flex items-center space-x-2">
                    <span>{context.repo.name}</span>
                    {context.repo.language && (
                      <>
                        <span>•</span>
                        <span>{context.repo.language}</span>
                      </>
                    )}
                  </span>
                ) : (
                  'No repository selected'
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
            aria-label="Close Chatbot"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Display */}
        {chatError && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start space-x-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Error occurred</p>
              <p className="text-sm mt-1">{chatError}</p>
            </div>
          </div>
        )}

        {/* Chat History */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
          style={{ scrollBehavior: 'smooth' }}
        >
          {chatHistory.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Start a conversation</h4>
              <p className="text-gray-500 max-w-sm mx-auto">
                Ask me anything about your code, get reviews, explanations, or suggestions for improvements.
              </p>
            </div>
          )}

          {chatHistory.map((entry, index) => (
            <div key={index} className="space-y-4">
              {/* User Message */}
              {entry.user && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-gradient-to-r from-violet-600 to-purple-600 text-white p-4 rounded-2xl rounded-br-md shadow-lg">
                    <p className="text-sm leading-relaxed">{entry.user}</p>
                  </div>
                </div>
              )}

              {/* AI Response */}
              {entry.ai && (
                <div className="flex justify-start">
                  <div className="max-w-[90%] bg-gray-50 border border-gray-100 p-4 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="prose prose-sm prose-violet max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <div className="my-4">
                                <RenderCodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                              </div>
                            ) : (
                              <code className="bg-violet-100 text-violet-800 px-2 py-1 rounded text-sm font-mono" {...props}>
                                {children}
                              </code>
                            );
                          },
                          h1: ({ children }) => <h1 className="text-xl font-bold text-gray-900 mt-6 mb-3 first:mt-0">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg font-semibold text-gray-800 mt-5 mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-base font-medium text-gray-700 mt-4 mb-2">{children}</h3>,
                          p: ({ children }) => <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside text-gray-700 mb-3 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside text-gray-700 mb-3 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-violet-300 bg-violet-50 pl-4 py-2 italic text-gray-600 mb-3 rounded-r-lg">{children}</blockquote>
                          ),
                          table: ({ children }) => (
                            <div className="overflow-x-auto mb-4">
                              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">{children}</table>
                            </div>
                          ),
                          thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
                          th: ({ children }) => <th className="border-b border-gray-200 px-4 py-2 text-left font-medium text-gray-900">{children}</th>,
                          td: ({ children }) => <td className="border-b border-gray-100 px-4 py-2 text-gray-700">{children}</td>,
                        }}
                      >
                        {entry.ai}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-gray-500 text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <form onSubmit={handleChatSubmit} className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about code review, explanations, improvements..."
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none bg-white transition-all duration-200"
                rows="2"
                aria-label="Chat input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSubmit(e);
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">Press Enter to send, Shift+Enter for new line</p>
            </div>
            <button
              type="submit"
              className={`p-3 rounded-xl transition-all duration-200 ${
                chatInput.trim() && !isLoading
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!chatInput.trim() || isLoading}
              aria-label="Send chat message"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
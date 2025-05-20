import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import remarkGfm from 'remark-gfm';
import { useCodeReviewContext } from '../App';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

function Chatbot({ isOpen, onClose }) {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typedResponse, setTypedResponse] = useState('');
  const [chatError, setChatError] = useState(null);
  const typingTimerRef = useRef(null);
  const { context } = useCodeReviewContext();
  const chatContainerRef = useRef(null);

  // Fetch AI chat response
  const fetchChatResponse = async () => {
    try {
      console.log("context ",context);
      setChatError(null);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        Respond to the following user query in the context of code review${
          context?.repo ? ` for a ${context.repo.language} repository named "${context.repo.name}"` : ''
        }. 
        Provide a clear, actionable answer formatted in Markdown, including code snippets where applicable.
        Query: ${chatInput}
        ${
          context?.file?.content && context?.file?.name
            ? `Reference file "${context.file.name}": \`\`\`\n${context.file.content.slice(0, 2000)}\n\`\`\``
            : ''
        }
      `;

      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();
      
      // Add to chat history but don't display immediately
      const newHistory = [...chatHistory, { user: chatInput, ai: responseText }];
      setChatHistory(newHistory);
      
      // Start typewriter effect
      setIsTyping(true);
      setTypedResponse('');
      
      return responseText;
    } catch (err) {
      setChatError(err.message);
      return null;
    }
  };

  // Improved typewriter effect for chat response
  useEffect(() => {
    if (chatHistory.length > 0 && isTyping) {
      const latestResponse = chatHistory[chatHistory.length - 1].ai;
      let charIndex = 0;
      const typingSpeed = 30; // ms per character
      
      // Clear any existing interval
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
      
      typingTimerRef.current = setInterval(() => {
        if (charIndex < latestResponse.length) {
          setTypedResponse(prevTyped => latestResponse.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typingTimerRef.current);
          setIsTyping(false);
        }
      }, typingSpeed);
      
      // Auto-scroll to bottom when new content is added
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
      
      return () => {
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
        }
      };
    }
  }, [chatHistory, isTyping]);

  // Skip chat animation
  const handleSkipAnimation = () => {
    if (isTyping && chatHistory.length > 0) {
      // Clear the typing animation
      clearInterval(typingTimerRef.current);
      // Set the full response immediately
      setTypedResponse(chatHistory[chatHistory.length - 1].ai);
      setIsTyping(false);
    }
  };

  // Handle chat submission
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    // Add user message immediately
    setChatHistory(prev => [...prev, { user: chatInput, ai: '' }]);
    const userInput = chatInput;
    setChatInput(''); // Clear input field immediately
    
    // Fetch response after adding user message
    await fetchChatResponse();
  };

  // Auto scroll on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, typedResponse]);

  // Code block renderer with proper syntax highlighting
  const CodeBlock = ({ language, value }) => {
    const codeRef = useRef(null);

    useEffect(() => {
      if (codeRef.current) {
        Prism.highlightElement(codeRef.current);
      }
    }, [value]); // Re-run when code value changes

    return (
      <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
        <code ref={codeRef} className={`language-${language || 'javascript'}`}>
          {value}
        </code>
      </pre>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg p-6 h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-violet-800 dark:text-violet-200">AI Code Review Assistant</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close Chatbot"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {chatError && (
          <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-4 mb-4 rounded-lg">
            <p>{chatError}</p>
          </div>
        )}
        
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mb-4 pr-2 space-y-4"
        >
          {chatHistory.map((entry, index) => (
            <div key={index} className="mb-4">
              {entry.user && (
                <>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">You:</div>
                  <p className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                    {entry.user}
                  </p>
                </>
              )}
              
              {/* Only show AI response section if we have a user message */}
              {entry.user && (
                <>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-2">AI:</div>
                  <div
                    className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg prose prose-violet dark:prose-invert max-w-none cursor-pointer"
                    onClick={handleSkipAnimation}
                    title="Click to skip animation"
                  >
                    {index === chatHistory.length - 1 && isTyping ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                            ) : (
                              <code className="bg-gray-200 dark:bg-gray-700 text-violet-800 dark:text-violet-200 px-1 rounded" {...props}>
                                {children}
                              </code>
                            );
                          },
                          h1: ({ children }) => <h1 className="text-2xl font-bold text-violet-900 dark:text-violet-100 mt-6 mb-4">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-xl font-semibold text-violet-800 dark:text-violet-200 mt-5 mb-3">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-lg font-medium text-violet-700 dark:text-violet-300 mt-4 mb-2">{children}</h3>,
                          p: ({ children }) => <p className="text-gray-700 dark:text-gray-300 mb-4">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-violet-500 dark:border-violet-400 pl-4 italic text-gray-600 dark:text-gray-400 mb-4">{children}</blockquote>
                          ),
                          table: ({ children }) => <table className="table-auto border-collapse border border-gray-300 dark:border-gray-600 mb-4">{children}</table>,
                          thead: ({ children }) => <thead className="bg-gray-200 dark:bg-gray-700">{children}</thead>,
                          th: ({ children }) => <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">{children}</th>,
                          td: ({ children }) => <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{children}</td>,
                        }}
                      >
                        {typedResponse}
                      </ReactMarkdown>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                            ) : (
                              <code className="bg-gray-200 dark:bg-gray-700 text-violet-800 dark:text-violet-200 px-1 rounded" {...props}>
                                {children}
                              </code>
                            );
                          },
                          h1: ({ children }) => <h1 className="text-2xl font-bold text-violet-900 dark:text-violet-100 mt-6 mb-4">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-xl font-semibold text-violet-800 dark:text-violet-200 mt-5 mb-3">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-lg font-medium text-violet-700 dark:text-violet-300 mt-4 mb-2">{children}</h3>,
                          p: ({ children }) => <p className="text-gray-700 dark:text-gray-300 mb-4">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-violet-500 dark:border-violet-400 pl-4 italic text-gray-600 dark:text-gray-400 mb-4">{children}</blockquote>
                          ),
                          table: ({ children }) => <table className="table-auto border-collapse border border-gray-300 dark:border-gray-600 mb-4">{children}</table>,
                          thead: ({ children }) => <thead className="bg-gray-200 dark:bg-gray-700">{children}</thead>,
                          th: ({ children }) => <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">{children}</th>,
                          td: ({ children }) => <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{children}</td>,
                        }}
                      >
                        {entry.ai}
                      </ReactMarkdown>
                    )}
                    
                    {index === chatHistory.length - 1 && isTyping && (
                      <div className="flex mt-2">
                        <span className="text-sm text-gray-500">
                          Typing
                          <span className="animate-pulse">...</span>
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        <form onSubmit={handleChatSubmit} className="flex items-center mt-auto">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask about code review..."
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-gray-200"
            disabled={isTyping}
            aria-label="Chat input"
          />
          <button
            type="submit"
            className={`ml-2 ${
              isTyping ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white p-2 rounded-lg transition-colors`}
            disabled={isTyping || !chatInput.trim()}
            aria-label="Send chat message"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;
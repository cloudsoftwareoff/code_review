import { GoogleGenerativeAI } from '@google/generative-ai';
import { useEffect, useRef } from 'react';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const fetchChatResponse = async (chatInput, context, setChatError, setChatHistory) => {
  try {
    console.log('Chatbot context:', context);
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
          ? `Reference file "${context.file.name}": \`\`\`\n${context.file.content.slice(0, 1500)}\n\`\`\``
          : ''
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    setChatHistory(prev => [...prev, { user: chatInput, ai: responseText }]);
  } catch (err) {
    console.error('Chatbot error:', err);
    setChatError(err.message);
  }
};

export const RenderCodeBlock = ({ language, value }) => {
  import('prismjs/themes/prism.css');
  import('prismjs/components/prism-javascript');
  import('prismjs/components/prism-python');
  const Prism = require('prismjs');

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
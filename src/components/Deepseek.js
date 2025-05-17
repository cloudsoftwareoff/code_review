import React, { useState } from 'react';
import axios from 'axios';

function DeepSeekAI() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-V3";
  const API_KEY = "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"; 

  const query = async () => {
    setIsLoading(true);
    try {
      const result = await axios.post(
        API_URL,
        { inputs: input },
        {
          headers: { Authorization: `Bearer ${API_KEY}` },
        }
      );
      setResponse(JSON.stringify(result.data));
    } catch (error) {
      setResponse("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>DeepSeek-V3 in React</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask DeepSeek-V3 something..."
      />
      <button onClick={query} disabled={isLoading}>
        {isLoading ? "Processing..." : "Ask AI"}
      </button>
      <div>
        <h3>Response:</h3>
        <pre>{response}</pre>
      </div>
    </div>
  );
}

export default DeepSeekAI;
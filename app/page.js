"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Loader2, AlertCircle } from 'lucide-react';

export default function ChatbotUI() {
  // State management
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Your deployed API URL
  const API_URL = '/api/chat';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to API
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage })
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      
      // Add AI response to chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer || 'No response received' 
      }]);
    } catch (err) {
      setError(err.message);
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: `Error: ${err.message}. The API may be waking up (takes 30-60 seconds on first request).` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  // Format message content (preserve line breaks)
  const formatMessage = (content) => {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-purple-900/30 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-700 flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-6 rounded-t-2xl">
          <h1 className="text-3xl font-bold text-white">
            Prolog Debugging Assistant
          </h1>
          <p className="text-purple-100 text-sm mt-2">
            Ask about frontend, backend, or fullstack development errors
          </p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-purple-300 mt-20">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No messages yet. Ask about an error!</p>
              <div className="mt-8 space-y-2 text-sm">
                <p className="font-semibold text-purple-200">Try asking:</p>
                <p>&quot;Cannot read property of undefined&quot;</p>
                <p>&quot;CORS error in my API&quot;</p>
                <p>&quot;React state not updating&quot;</p>

              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white'
                    : msg.role === 'error'
                    ? 'bg-red-900/50 text-red-200 border border-red-700'
                    : 'bg-purple-800/50 text-purple-100 border border-purple-700'
                }`}
              >
                <div className="text-sm font-semibold mb-1 opacity-75">
                  {msg.role === 'user' ? 'You' : msg.role === 'error' ? 'Error' : 'Assistant'}
                </div>
                <div className="text-sm whitespace-pre-wrap font-mono">
                  {formatMessage(msg.content)}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-purple-800/50 border border-purple-700 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span className="text-sm text-purple-300">Thinking... (first request may take 60 seconds)</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-purple-700">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm">
              <strong>Connection Issue:</strong> {error}
            </div>
          )}
          
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress} // fixed
              placeholder="Describe your error or paste error message..."
              rows={2}
              className="flex-1 bg-purple-900/50 text-purple-100 border border-purple-700 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-400"
            />

            <div className="flex flex-col gap-2">
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-purple-600 to-violet-600 text-white p-3 rounded-xl hover:from-purple-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
              <button
                onClick={clearChat}
                className="bg-purple-800/50 border border-purple-700 text-purple-300 p-3 rounded-xl hover:bg-purple-700/50 transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <p className="text-purple-400 text-xs mt-3 text-center">
            Tip: Paste the exact error message only (no code needed). The Prolog assistant is trained on common errors.
          </p>
        </div>
      </div>
    </div>
  );
}
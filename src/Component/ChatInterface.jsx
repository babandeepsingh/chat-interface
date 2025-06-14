import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import './ChatInterface.css';


const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const simulateBotResponse = (userMessage) => {
    const responses = [
      {
        content: "Here's a sample SQL query to get user data:\n\n```sql\nSELECT * FROM users WHERE created_at > '2024-01-01';\n```\n\nThis query will retrieve all users created after January 1st, 2024.",
        sqlQuery: "SELECT * FROM users WHERE created_at > '2024-01-01';"
      },
      {
        content: "I can help you with database operations. Here's how to create a new table:\n\n```sql\nCREATE TABLE products (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  price DECIMAL(10,2),\n  created_at TIMESTAMP DEFAULT NOW()\n);\n```",
        sqlQuery: "CREATE TABLE products (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  price DECIMAL(10,2),\n  created_at TIMESTAMP DEFAULT NOW()\n);"
      },
      {
        content: "To update records efficiently, you can use:\n\n```sql\nUPDATE orders \nSET status = 'completed' \nWHERE order_date < NOW() - INTERVAL '30 days';\n```\n\nThis will mark old orders as completed.",
        sqlQuery: "UPDATE orders SET status = 'completed' WHERE order_date < NOW() - INTERVAL '30 days';"
      }
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: Date.now().toString() + '_bot',
      type: 'bot',
      content: randomResponse.content,
      timestamp: new Date(),
      sqlQuery: randomResponse.sqlQuery
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const botResponse = simulateBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('SQL query copied to clipboard!');
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h1>AI SQL Assistant</h1>
        <p>Ask me anything about SQL queries and database operations</p>
      </div>

      <div className="messages-container">
        <div className="messages-list" ref={messagesContainerRef}>
          {messages.length === 0 && !isLoading && (
            <div className="empty-state">
              <div className="empty-icon">📨</div>
              <h3>Start a conversation</h3>
              <p>Ask me about SQL queries, database design, or any data-related questions.</p>
            </div>
          )}
          
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              onCopyQuery={copyToClipboard}
            />
          ))}
          
          {isLoading && (
            <div className="loading-message">
              <div className="loading-avatar">🤖</div>
              <div className="loading-content">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="input-area">
        <div className="input-container">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about SQL queries, database design, or data operations..."
            disabled={isLoading}
            rows={3}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="send-button"
          >
            Send
          </button>
        </div>
        <p className="input-hint">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;

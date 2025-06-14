import React from 'react';
import './ChatMessage.css';

// interface Message {
//   id: string;
//   type: 'user' | 'bot';
//   content: string;
//   timestamp: Date;
//   sqlQuery?: string;
// }

// interface ChatMessageProps {
//   message: Message;
//   onCopyQuery: (query: string) => void;
// }

const ChatMessage = ({ message, onCopyQuery }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const parseContent = (content) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).split('\n');
        const language = lines[0].trim();
        const code = lines.slice(1).join('\n');
        
        return (
          <div key={index} className="code-block">
            {language && (
              <div className="code-header">
                {language}
              </div>
            )}
            <pre className="code-content">
              <code>{code}</code>
            </pre>
          </div>
        );
      } else {
        return (
          <div key={index} className="text-content">
            {part.split('\n').map((line, lineIndex) => (
              <React.Fragment key={lineIndex}>
                {line}
                {lineIndex < part.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        );
      }
    });
  };

  return (
    <div className={`chat-message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}>
      <div className="message-avatar">
        {message.type === 'user' ? '👤' : '🤖'}
      </div>

      <div className="message-content">
        <div className="message-bubble">
          <div className="message-text">
            {parseContent(message.content)}
          </div>
        </div>

        {message.type === 'bot' && message.sqlQuery && (
          <div className="copy-button-container">
            <button
              onClick={() => onCopyQuery(message.sqlQuery)}
              className="copy-button"
            >
              📋 Copy SQL Query
            </button>
          </div>
        )}

        <div className="message-timestamp">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

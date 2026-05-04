import React from 'react';
import './ChatMessages.css';

const ChatMessages = ({ messages, isLoading, onPlayResponse }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="chat-messages empty">
        <div className="welcome-message">
          <h3>👋 Welcome to AI Voice Chat!</h3>
          <p>Start a conversation by:</p>
          <ul>
            <li>🎤 Recording a voice message</li>
            <li>⌨️ Typing a text message</li>
          </ul>
          <p className="tip">💡 Tip: Enable auto-play in settings to hear AI responses automatically!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-messages">
      {messages.map((message, index) => (
        <div
          key={message.id || index}
          className={`message ${message.type} ${message.isProcessing ? 'processing' : ''} fade-in-up`}
        >
          <div className="message-content">
            <div className="message-header">
              <span className="message-sender">
                {message.type === 'user' ? '👤 You' : '🤖 AI Assistant'}
              </span>
              <span className="message-time">
                {formatTime(message.timestamp)}
              </span>
              {message.isVoice && <span className="voice-indicator">🎵</span>}
            </div>
            
            <div className="message-text">
              {message.isProcessing ? (
                <div className="processing-indicator">
                  <div className="typing-indicator">
                    <span>●</span>
                    <span>●</span>
                    <span>●</span>
                  </div>
                  <span>{message.content}</span>
                </div>
              ) : (
                message.content
              )}
            </div>

            {message.type === 'assistant' && !message.isProcessing && (
              <div className="message-actions">
                <button
                  className="play-button"
                  onClick={() => onPlayResponse(message)}
                  title="Play as speech"
                >
                  🔊
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="message assistant fade-in-up">
          <div className="message-content">
            <div className="message-header">
              <span className="message-sender">🤖 AI Assistant</span>
              <span className="message-time">...</span>
            </div>
            <div className="message-text">
              <div className="typing-indicator">
                <span>●</span>
                <span>●</span>
                <span>●</span>
              </div>
              <span>Thinking...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;

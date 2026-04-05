/**
 * Trainer Chat Component
 * Modal chat interface for interacting with the AI personal trainer
 * Displays message history and allows new queries
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../services/aiService';
import { chatService } from '../services/chatService';
import './TrainerChat.css';

export default function TrainerChat({ avatar, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoadError, setInitialLoadError] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    if (user) {
      const loadHistory = async () => {
        try {
          const history = await chatService.getChatHistory(user.uid);
          setMessages(history);
          setInitialLoadError(false);
        } catch (err) {
          console.error('Failed to load chat history:', err);
          setInitialLoadError(true);
          setMessages([]);
        }
      };
      loadHistory();
    }
  }, [user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const copyToClipboard = (text, messageId) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);
    setLoading(true);

    try {
      // Save user message to Firestore
      await chatService.saveMessage(user.uid, {
        text: userMessage,
        sender: 'user'
      });

      // Add user message to local state
      setMessages(prev => [...prev, {
        text: userMessage,
        sender: 'user',
        timestamp: new Date()
      }]);

      // Get AI response
      const aiResponse = await aiService.sendMessage(userMessage, messages);

      // Save AI response to Firestore
      await chatService.saveMessage(user.uid, {
        text: aiResponse,
        sender: 'assistant'
      });

      // Add AI response to local state
      setMessages(prev => [...prev, {
        text: aiResponse,
        sender: 'assistant',
        timestamp: new Date()
      }]);

      setLoading(false);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to get response. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="trainer-chat-overlay" onClick={onClose}>
      <div className="trainer-chat-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="chat-header">
          <span className="chat-avatar">{avatar}</span>
          <h2>Your Trainer</h2>
          <button
            className="chat-close"
            onClick={onClose}
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        {/* Messages Container */}
        <div className="chat-messages">
          {messages.length === 0 && !initialLoadError && (
            <div className="chat-welcome">
              <p>👋 Hi! I'm your personal trainer. Ask me anything about fitness, nutrition, supplements, or healthy living!</p>
            </div>
          )}

          {initialLoadError && messages.length === 0 && (
            <div className="chat-welcome">
              <p>👋 Hi! I'm your personal trainer. Let's start fresh!</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.sender}`}
            >
              {msg.sender === 'assistant' && (
                <span className="msg-avatar">{avatar}</span>
              )}
              <div className="msg-wrapper">
                <div className="msg-content">
                  {msg.text}
                </div>
                <span className="msg-timestamp">
                  {formatTimestamp(msg.timestamp)}
                </span>
                {msg.sender === 'assistant' && (
                  <div className="msg-actions">
                    <button
                      className={`copy-btn ${copiedMessageId === idx ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(msg.text, idx)}
                      title="Copy response"
                    >
                      {copiedMessageId === idx ? '✓ Copied' : '📋 Copy'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message assistant loading">
              <span className="msg-avatar">{avatar}</span>
              <div className="msg-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="chat-error">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask your trainer..."
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

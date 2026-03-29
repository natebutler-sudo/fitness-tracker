/**
 * useTrainerChat Hook
 * Custom hook for managing chat state and interactions with AI trainer
 */

import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../services/aiService';
import { chatService } from '../services/chatService';

export const useTrainerChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load chat history from Firestore
   */
  const loadChatHistory = useCallback(async () => {
    if (!user) return;
    try {
      const history = await chatService.getChatHistory(user.uid);
      setMessages(history);
      setError(null);
    } catch (err) {
      console.error('Error loading chat history:', err);
      setError('Failed to load chat history');
    }
  }, [user]);

  /**
   * Send a message and get AI response
   * @param {string} userMessage - The user's message text
   */
  const sendMessage = useCallback(
    async (userMessage) => {
      if (!user || !userMessage.trim()) return;

      setLoading(true);
      setError(null);

      try {
        // Save user message
        await chatService.saveMessage(user.uid, {
          text: userMessage,
          sender: 'user'
        });

        // Add to local state
        setMessages(prev => [...prev, {
          text: userMessage,
          sender: 'user',
          timestamp: new Date()
        }]);

        // Get AI response
        const aiResponse = await aiService.sendMessage(userMessage, messages);

        // Save AI response
        await chatService.saveMessage(user.uid, {
          text: aiResponse,
          sender: 'assistant'
        });

        // Add to local state
        setMessages(prev => [...prev, {
          text: aiResponse,
          sender: 'assistant',
          timestamp: new Date()
        }]);

        return aiResponse;
      } catch (err) {
        console.error('Error sending message:', err);
        setError(err.message || 'Failed to send message');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, messages]
  );

  /**
   * Clear all chat history
   */
  const clearChat = useCallback(async () => {
    if (!user) return;
    try {
      await chatService.clearChatHistory(user.uid);
      setMessages([]);
      setError(null);
    } catch (err) {
      console.error('Error clearing chat:', err);
      setError('Failed to clear chat');
      throw err;
    }
  }, [user]);

  /**
   * Delete a specific message
   * @param {string} messageId - ID of message to delete
   */
  const deleteMessage = useCallback(
    async (messageId) => {
      if (!user) return;
      try {
        await chatService.deleteMessage(user.uid, messageId);
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
      } catch (err) {
        console.error('Error deleting message:', err);
        setError('Failed to delete message');
        throw err;
      }
    },
    [user]
  );

  return {
    messages,
    loading,
    error,
    loadChatHistory,
    sendMessage,
    clearChat,
    deleteMessage
  };
};

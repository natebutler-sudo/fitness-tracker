/**
 * Chat Service for Firestore Integration
 * Manages chat history persistence for trainer conversations
 */

import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  writeBatch,
  serverTimestamp,
  doc,
  deleteDoc
} from 'firebase/firestore';

export const chatService = {
  /**
   * Save a single message to Firestore
   * @param {string} userId - User's UID
   * @param {Object} messageData - { text, sender, timestamp }
   * @returns {Promise<string>} - Document ID of saved message
   */
  async saveMessage(userId, { text, sender, timestamp }) {
    try {
      const chatsRef = collection(db, 'users', userId, 'chats');
      const docRef = await addDoc(chatsRef, {
        text,
        sender, // 'user' or 'assistant'
        timestamp: timestamp || serverTimestamp(),
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving chat message:', error);
      throw new Error('Failed to save message to chat history');
    }
  },

  /**
   * Retrieve all messages for a user, sorted by timestamp
   * @param {string} userId - User's UID
   * @returns {Promise<Array>} - Array of message objects
   */
  async getChatHistory(userId) {
    try {
      const chatsRef = collection(db, 'users', userId, 'chats');
      const q = query(chatsRef, orderBy('timestamp', 'asc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to JS Date if present
        timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp)
      }));
    } catch (error) {
      console.error('Error retrieving chat history:', error);
      // Return empty array on error to allow chat to continue
      return [];
    }
  },

  /**
   * Clear all chat history for a user
   * @param {string} userId - User's UID
   * @returns {Promise<void>}
   */
  async clearChatHistory(userId) {
    try {
      const chatsRef = collection(db, 'users', userId, 'chats');
      const snapshot = await getDocs(chatsRef);
      const batch = writeBatch(db);

      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw new Error('Failed to clear chat history');
    }
  },

  /**
   * Delete a specific message by ID
   * @param {string} userId - User's UID
   * @param {string} messageId - Message document ID
   * @returns {Promise<void>}
   */
  async deleteMessage(userId, messageId) {
    try {
      const messageRef = doc(db, 'users', userId, 'chats', messageId);
      await deleteDoc(messageRef);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw new Error('Failed to delete message');
    }
  }
};

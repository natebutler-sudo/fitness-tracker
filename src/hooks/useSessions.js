// Custom hook for managing workout sessions
import { useState, useCallback } from 'react';
import {
  createSession,
  getUserSessions,
  getSessionsByDateRange,
  getSessionsByType,
  updateSession,
  deleteSession,
  getTodaySessions,
} from '../services/sessionService';

export const useSessions = (userId) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all sessions
  const loadSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserSessions(userId);
      setSessions(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load sessions by date range
  const loadSessionsByDateRange = useCallback(async (startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSessionsByDateRange(userId, startDate, endDate);
      setSessions(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load sessions by type
  const loadSessionsByType = useCallback(async (workoutType) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSessionsByType(userId, workoutType);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load today's sessions
  const loadTodaySessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTodaySessions(userId);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Create new session
  const addSession = useCallback(
    async (sessionData) => {
      try {
        setLoading(true);
        setError(null);
        const newSession = await createSession(userId, sessionData);
        setSessions(prev => [newSession, ...prev]);
        return newSession;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // Update session
  const editSession = useCallback(
    async (sessionId, updates) => {
      try {
        setLoading(true);
        setError(null);
        await updateSession(sessionId, updates);
        setSessions(prev =>
          prev.map(s => (s.id === sessionId ? { ...s, ...updates } : s))
        );
        return { id: sessionId, ...updates };
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete session
  const removeSession = useCallback(
    async (sessionId) => {
      try {
        setLoading(true);
        setError(null);
        await deleteSession(sessionId);
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        return true;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    sessions,
    loading,
    error,
    loadSessions,
    loadSessionsByDateRange,
    loadSessionsByType,
    loadTodaySessions,
    addSession,
    editSession,
    removeSession,
  };
};

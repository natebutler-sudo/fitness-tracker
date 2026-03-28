// Notification Center - Display user notifications
import React, { useState, useEffect } from 'react';
import './NotificationCenter.css';

function NotificationCenter() {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [visibleNotifs, setVisibleNotifs] = useState([]);

  useEffect(() => {
    // Show notifications that haven't been displayed yet
    const unshownNotifs = notifications.filter(n => !n.shown);
    unshownNotifs.forEach(notif => {
      const timer = setTimeout(() => {
        setVisibleNotifs(prev => [...prev, notif.id]);
      }, 100);
      return () => clearTimeout(timer);
    });

    // Mark as shown
    if (unshownNotifs.length > 0) {
      const updated = notifications.map(n => ({ ...n, shown: true }));
      setNotifications(updated);
      localStorage.setItem('notifications', JSON.stringify(updated));
    }
  }, [notifications]);

  const removeNotification = (id) => {
    setVisibleNotifs(prev => prev.filter(notifId => notifId !== id));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 300);
  };

  const addNotification = (notification) => {
    const id = Date.now();
    const newNotif = {
      id,
      ...notification,
      shown: false,
    };
    setNotifications(prev => [...prev, newNotif]);
  };

  return (
    <div className="notification-center">
      {notifications.map(notif =>
        visibleNotifs.includes(notif.id) ? (
          <div key={notif.id} className={`notification ${notif.type}`}>
            <div className="notification-content">
              <span className="notification-emoji">{notif.emoji}</span>
              <div className="notification-message">
                <p className="notification-title">{notif.title}</p>
                {notif.message && <p className="notification-text">{notif.message}</p>}
              </div>
            </div>
            <button
              className="notification-close"
              onClick={() => removeNotification(notif.id)}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        ) : null
      )}
    </div>
  );
}

// Export function to add notifications from anywhere
export const useNotifications = () => {
  const addNotification = (title, message, type = 'info', emoji = 'ℹ️') => {
    const event = new CustomEvent('addNotification', {
      detail: { title, message, type, emoji },
    });
    window.dispatchEvent(event);
  };

  return { addNotification };
};

export default NotificationCenter;

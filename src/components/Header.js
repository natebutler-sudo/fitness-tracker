// Header Component
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import './Header.css';

function Header({ activeTab, onTabChange }) {
  const { user, userProfile } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowMenu(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="App-header">
      <div className="header-content">
        <div className="header-title">
          <h1>Fitness Tracker</h1>
          <p>Track your workouts, build your routine, monitor progress</p>
        </div>

        {user && (
          <div className="header-user">
            <div className="user-info">
              <span className="user-name">{userProfile?.displayName || 'User'}</span>
              <span className="user-email">{user.email}</span>
            </div>
            <div className="user-menu">
              <button
                className="user-avatar"
                onClick={() => setShowMenu(!showMenu)}
                title="Account menu"
              >
                {userProfile?.displayName?.charAt(0).toUpperCase() || '?'}
              </button>

              {showMenu && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={() => setShowMenu(false)}>
                    Profile Settings
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {activeTab !== undefined && (
        <nav className="App-nav">
          <button
            className={`nav-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => onTabChange('schedule')}
          >
            📅 Weekly Schedule
          </button>
          <button
            className={`nav-btn ${activeTab === 'exercises' ? 'active' : ''}`}
            onClick={() => onTabChange('exercises')}
          >
            💪 Exercise Library
          </button>
        </nav>
      )}
    </header>
  );
}

export default Header;

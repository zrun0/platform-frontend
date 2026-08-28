import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { registerSubApps } from './qiankun/registerApps';
import styles from './App.module.css';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Register qiankun sub-apps on mount
    registerSubApps();

    // Handle browser history changes
    const onPopState = () => {
      const currentPath = window.location.pathname;
      navigate(currentPath);
    };

    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [navigate]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Check if current route is a sub-app route
  const isSubAppRoute = location.pathname.startsWith('/uc') || location.pathname.startsWith('/flow');

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <a href="/" className={styles.logo}>
          Platform Frontend
        </a>
        <nav className={styles.nav}>
          <a
            href="/uc"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate('/uc');
            }}
            className={location.pathname.startsWith('/uc') ? styles.active : ''}
          >
            UC
          </a>
          <a
            href="/flow"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate('/flow');
            }}
            className={location.pathname.startsWith('/flow') ? styles.active : ''}
          >
            Flow
          </a>
        </nav>
      </header>

      <div className={styles.content}>
        {isSubAppRoute ? (
          <div id="subapp-container" className={styles.subappContainer} />
        ) : (
          <div className={styles.welcome}>
            <h1>Welcome to Platform Frontend</h1>
            <p>Select a sub-application from the navigation above</p>
          </div>
        )}
      </div>
    </div>
  );
}

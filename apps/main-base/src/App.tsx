import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { subApps } from './wujie/subApps';
import SubAppContainer from './wujie/SubAppContainer';
import styles from './App.module.css';

function Welcome() {
  return (
    <div className={styles.welcome}>
      <h1>Welcome to Platform Frontend</h1>
      <p>Select a sub-application from the navigation above</p>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <a href="/" className={styles.logo}>
          Platform Frontend
        </a>
        <nav className={styles.nav}>
          {subApps.map((app) => (
            <a
              key={app.name}
              href={app.routePrefix}
              onClick={(e) => {
                e.preventDefault();
                navigate(app.routePrefix);
              }}
              className={location.pathname.startsWith(app.routePrefix) ? styles.active : ''}
            >
              {app.label}
            </a>
          ))}
        </nav>
      </header>

      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          {subApps.map((app) => (
            <Route
              key={app.name}
              path={`${app.routePrefix}/*`}
              element={
                <div className={styles.subappContainer}>
                  <SubAppContainer app={app} />
                </div>
              }
            />
          ))}
        </Routes>
      </div>
    </div>
  );
}

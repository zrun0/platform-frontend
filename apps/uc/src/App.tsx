import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useUserStore } from './stores/userStore';
import HomePage from './pages/HomePage';
import styles from './App.module.css';
import type { User } from 'shared-common';

// App component for UC sub-app
interface AppProps {
  basename?: string;
}

export default function App({ basename = '/' }: AppProps) {
  const { user, setUser } = useUserStore();

  const handleUpdateUser = () => {
    const newNames = ['Alice', 'Bob', 'Charlie'];
    const newRoles = ['Developer', 'Designer', 'Manager'];
    const randomName = newNames[Math.floor(Math.random() * newNames.length)];
    const randomRole = newRoles[Math.floor(Math.random() * newRoles.length)];
    setUser(randomName, randomRole);
  };

  return (
    <BrowserRouter basename={basename}>
      <div className={styles.container}>
        <h1 className={styles.title}>用户中心</h1>
        <p className={styles.subtitle}>User Center Sub-Application</p>

        <div className={styles.info}>
          <p><strong>User:</strong> {user.name}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        <button className={styles.button} onClick={handleUpdateUser}>
          Update User
        </button>

        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

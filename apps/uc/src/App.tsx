import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useUserStore } from './stores/userStore';
import HomePage from './pages/HomePage';
import styles from './App.module.css';

// App component for UC sub-app
export default function App() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  const handleUpdateUser = () => {
    const newNames = ['Alice', 'Bob', 'Charlie'];
    const newRoles = ['Developer', 'Designer', 'Manager'];
    const randomName = newNames[Math.floor(Math.random() * newNames.length)];
    const randomRole = newRoles[Math.floor(Math.random() * newRoles.length)];
    setUser(randomName, randomRole);
  };

  return (
    <BrowserRouter>
      <div className={styles.container}>
        <h1 className={styles.title}>用户中心</h1>
        <p className={styles.subtitle}>User Center Sub-Application</p>

        <div className={styles.info}>
          <p>
            <strong>User:</strong> {user.name}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
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

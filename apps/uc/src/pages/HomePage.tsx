import React from 'react';
import styles from './HomePage.module.css';

// HomePage component for UC sub-app
export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>用户中心</h1>
      <p className={styles.subtitle}>User Center Homepage</p>
    </div>
  );
}
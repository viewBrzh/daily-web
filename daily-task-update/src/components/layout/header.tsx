import React from "react";
import Link from "next/link";
import styles from "../../styles/layout/Header.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">Daily</Link>
      </div>
      <nav>
      </nav>
      <div className={styles.userInfo}>
        <span>Watayut Pankong (View)</span>
        <button className={styles.signOutBtn}>Sign Out</button>
      </div>
    </header>
  );
};

export default Header;

import React from "react";
import Link from "next/link";
import styles from "../styles/NavBar.module.css";

const NavBar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Daily</Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/my-tasks" className={styles.navLink}>My Project</Link>
        </li>
        <li>
          <Link href="/about" className={styles.navLink}>About</Link>
        </li>
        <li>
          <Link href="/contact" className={styles.navLink}>Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;

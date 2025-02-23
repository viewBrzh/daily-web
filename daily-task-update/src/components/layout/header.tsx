import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/layout/Header.module.css";
import BigUserProfileIcon from "../common/bigUserProfileIcon";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const fullName = localStorage.getItem("fullName");
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");

    window.location.href = "/login";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setAuthenticated(true);
    }
  }, []);

  // ✅ Instead of returning early, show loading conditionally
  if (authenticated === null) {
    return <p>Loading...</p>;
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/"><img src="/logo/logo-name.png" className={styles.logo}></img></Link>
      </div>
      <nav>
      </nav>
      <div className={styles.userInfo}>
        <span>{fullName}</span>
        <BigUserProfileIcon fullName={fullName ? fullName : ""}/>

        <button className={styles.signOutBtn} onClick={logout}>Sign Out</button>
      </div>
    </header>
  );
};

export default Header;

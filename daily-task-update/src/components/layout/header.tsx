import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/layout/Header.module.css";
import BigUserProfileIcon from "../common/bigUserProfileIcon";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [fullName, setFullName] = useState<string | null>(null);

  const logout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("fullName");
    }
  
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.ok) {
        router.push("/login");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };  

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("fullName");
      if (!token) {
        router.push("/login");
      } else {
        setAuthenticated(true);
        setFullName(name);
      }
    }
  }, []);

  if (authenticated === null) {
    return <p>Loading...</p>;
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/"><img src="/logo/logo-name.png" className={styles.logo} alt="Logo" /></Link>
      </div>
      <div className={styles.userInfo}>
        <span>{fullName}</span>
        <BigUserProfileIcon fullName={fullName ? fullName : ""} />
        <button className={styles.signOutBtn} onClick={logout}>Sign Out</button>
      </div>
    </header>
  );
};

export default Header;

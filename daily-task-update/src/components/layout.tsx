import React from "react";
import Header from "./header";
import styles from "../styles/Layout.module.css";
import NavBar from "./navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <NavBar />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default Layout;

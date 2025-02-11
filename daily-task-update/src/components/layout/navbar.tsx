import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/layout/NavBar.module.css";
import { faCircleQuestion, faFileContract, faFileLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavBar: React.FC = () => {
  const router = useRouter();
  
  const iconTabs = [faFileLines, faCircleQuestion, faFileContract]
  const tabs = ["My Project", "About", "Contact"];
  const hrefs = ["/my-tasks", "/about", "/contact"];

  return (
    <nav className={styles.navbar}>
      <ul>
        {tabs.map((tab, index) => (
          <li key={index}>
            <Link 
              href={hrefs[index]} 
              className={`${styles.navLink} ${router.pathname === hrefs[index] ? styles.active : ""}`}
            >
              <FontAwesomeIcon className={styles.icon} icon={iconTabs[index]} /> {tab}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;

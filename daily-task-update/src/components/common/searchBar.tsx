import React from 'react';
import styles from '@/styles/SearchBar.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
  payload: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

const SearchBar: React.FC<ModalProps> = ({ payload }) => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <FontAwesomeIcon className={styles.searchIcon} icon={faSearch} />
        <input
          className={styles.search}
          name={payload.label}
          placeholder={payload.placeholder}
          type="search"
          value={payload.value}
          onChange={payload.onChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;

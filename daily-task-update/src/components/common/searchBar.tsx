import React, { useState } from 'react';
import styles from '@/styles/SearchBar.module.css'
import IconSearch from '../icons/iconSearch';

interface ModalProps {
    payload: {
        label: string;
        placeholder: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        onSubmit: () => void;
    };
}

const SearchBar: React.FC<ModalProps> = ({ payload }) => {
    return (
    <div className={styles.searchContainer}>
        <input className={styles.search} name={payload.label} placeholder={payload.placeholder} type="search" />
        <IconSearch/>
    </div>
    );
};

export default SearchBar;

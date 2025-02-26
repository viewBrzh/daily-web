import React, { useState, useEffect } from "react";
import styles from "@/styles/modal/modal.module.css";
import { User } from "@/components/common/types";
import { fetchDropDownUser } from "@/pages/api/drop-down/dropDown";

interface UserDropdownProps {
  onSelectUser: (userId: number, userName: string) => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ onSelectUser }) => {
  const [newMember, setNewMember] = useState<{ name: string }>({ name: "" });
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (newMember.name.trim() === "") {
        setSuggestions([]);
        return;
      }
      try {
        const data = await fetchDropDownUser(newMember.name);
        setSuggestions(data);
      } catch (error) {
        console.error("Failed to fetch dropdown users:", error);
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [newMember.name]);

  const handleSelect = (name: string, userId: number) => {
    setNewMember({ name });
    onSelectUser(userId, name);  // Pass selected user to parent component
    setIsDropdownVisible(false);
  };

  const textHandler = (name: string) => {
    setNewMember({ ...newMember, name });
    setIsDropdownVisible(true);
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Name"
        value={newMember.name}
        onChange={(e) => textHandler(e.target.value)}
        className={styles.inputName}
      />
      {isDropdownVisible && (
        <ul className={styles.dropdown}>
          {suggestions.length > 0 ? (
            suggestions.map((user) => (
              <li
                key={user.user_id}
                onClick={() => handleSelect(user.full_name, user.user_id)}
                className={styles.dropdownItem}
              >
                {user.full_name}
              </li>
            ))
          ) : (
            <li className={styles.noResults}>No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default UserDropdown;

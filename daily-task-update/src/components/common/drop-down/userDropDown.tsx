import React, { useState, useEffect } from "react";
import styles from "@/styles/modal.module.css";
import { User } from "@/views/my-tasks/types";
import { fetchDropDownUser } from "@/pages/api/drop-down/dropDown";

interface UserDropdownProps {
  onSelectUser: (userId: number, userName: string) => void; // Callback to handle user selection
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
                key={user.userId}
                onClick={() => handleSelect(user.fullName, user.userId)}
                className={styles.dropdownItem}
              >
                {user.fullName}
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

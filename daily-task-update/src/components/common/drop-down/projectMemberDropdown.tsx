import React, { useState, useEffect } from "react";
import styles from "@/styles/modal/updateTask.module.css";
import { fetchDropDownUserProjectMember } from "@/pages/api/drop-down/dropDown";
import { User } from "../types";
import { getUser } from "@/pages/api/my-task/member";

interface UserDropdownProps {
  projectId: number;
  onSelectUser: (userId: number, name: string) => void;
  userId: number;
}

const initUser: User = {
  userId: 0,
  username: "",
  fullName: "",
  empId: ""
}

const ProjectMemberDropdown: React.FC<UserDropdownProps> = ({ userId, projectId, onSelectUser }) => {
  const [selectedUser, setSelectedUser] = useState<User>(initUser);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const user = await getUser(userId);
        setSelectedUser(user);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (!projectId) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        setIsLoading(true);
        const members = await fetchDropDownUserProjectMember(projectId);

        if (selectedUser && !members.some((m) => m.userId === selectedUser.userId)) {
          members.unshift(selectedUser);
        }

        setSuggestions(members);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [projectId, selectedUser]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selectedUser = suggestions.find((user) => user.userId === selectedId);
    if (selectedUser) {
      setSelectedUser(selectedUser);
      onSelectUser(selectedUser.userId, selectedUser.fullName);
    }
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <select
          className={styles.select}
          value={selectedUser?.userId || ""}
          onChange={handleSelect}
        >
          {suggestions.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.fullName}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default ProjectMemberDropdown;

import React from "react";

type StatusType = "in-progress" | "complete" | "pending";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span className={`status-badge status-${status}`}>
      {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </span>
  );
};

export default StatusBadge;

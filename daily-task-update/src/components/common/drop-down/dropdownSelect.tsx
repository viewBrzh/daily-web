import React from "react";

interface DropdownSelectProps {
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({ options, value, onChange, placeholder = "Select an option" }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                height: "70%",
                borderRadius: "4px",
                margin: 'auto',
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                cursor: "pointer",
                fontSize: "14px",
            }}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default DropdownSelect;

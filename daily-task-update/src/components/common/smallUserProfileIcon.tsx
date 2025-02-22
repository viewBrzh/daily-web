import React from 'react';

interface UserProfileIconProps {
  fullName: string;
}

// Function to get initials from full name
function getUserInitials(fullName: string): string {
    const names = fullName?.split(' ');
    const firstName = names[0] || '';
    const lastName = names[names.length - 2] || '';

    return (firstName[0] + (lastName[0] || '')).toUpperCase();
}

// Function to generate a background color based on the initials
function getBackgroundColor(initials: string): string {
    const colors: string[] = [
        "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFDD", "#A133FF", "#FFD700", "#FF6347", "#2E8B57", "#8A2BE2",
        "#20B2AA", "#FF4500", "#8B0000", "#008080", "#5F9EA0", "#D2691E", "#FF1493", "#C71585"
    ];

    // Get a unique index based on the first letter
    const letterIndex = initials.charCodeAt(0) % colors.length;

    return colors[letterIndex];
}

// UserProfileIcon component
const SmallUserProfileIcon: React.FC<UserProfileIconProps> = ({ fullName }) => {
    const initials = getUserInitials(fullName);
    const backgroundColor = getBackgroundColor(initials);

    const iconStyle: React.CSSProperties = {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'auto',
        backgroundColor: backgroundColor,
        color: 'white',
        fontWeight: 'bold',
        fontSize: '12px',
    };

    return (
        <div style={iconStyle}>
            {initials}
        </div>
    );
};

export default SmallUserProfileIcon;

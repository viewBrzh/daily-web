import React, { useState, useEffect } from 'react';
import styles from '@/styles/component/Calendar.module.css';  // Importing CSS Module
import Day from './day';

// Helper function to get days of the month
const getDaysInMonth = (month: number, year: number): number[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};

// Helper function to get the first day of the month
const getFirstDayOfMonth = (month: number, year: number): number => {
  return new Date(year, month, 1).getDay();
};

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const firstDayOfMonth = getFirstDayOfMonth(month, year);
  const daysInMonth = getDaysInMonth(month, year);

  // Handle previous and next month changes
  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={() => changeMonth(-1)} className={styles.prevMonth}>◀</button>
        <span className={styles.monthYear}>{`${currentDate.toLocaleString('en-US', { month: 'long' })}, ${year}`}</span>
        <button onClick={() => changeMonth(1)} className={styles.nextMonth}>▶</button>
      </div>
      <div className={styles.daysOfWeek}>
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>
      <div className={styles.days}>
        {/* Empty slots for the days before the start of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className={`${styles.day} ${styles.dayDisabled}`}></div>
        ))}
        
        {/* Days of the current month */}
        {daysInMonth.map(day => (
          <div
            key={day}
            className={styles.day}
            onClick={() => alert(`Selected date: ${day}/${month + 1}/${year}`)}
          >
            {day}
            
            <Day date={`${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;

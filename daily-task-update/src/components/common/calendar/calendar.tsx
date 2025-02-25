import React, { useState, useEffect } from 'react';
import styles from '@/styles/component/Calendar.module.css';  // Importing CSS Module
import Day from './day';
import { getCalendar } from '@/pages/api/my-task/calendar';
import { useRouter } from 'next/router';
import { CalendarItem } from '../types';
import EditCalendarModal from '../modal/my-task/editCalendarModal';

const calendarInit = [{
  id: 0,
  date: "",
  title: "",
  description: "",
  created_by: 0,
  location: "",
}];

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState("");
  const router = useRouter();
  const { projectId } = router.query;
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const firstDayOfMonth = getFirstDayOfMonth(month, year);
  const daysInMonth = getDaysInMonth(month, year);
  const [calendar, setCalendar] = useState<CalendarItem[]>(calendarInit);

  // Handle previous and next month changes
  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveModal = async () => {
    setIsModalOpen(false);

    const res = await getCalendar(projectId?.toString() || "", currentDate.getMonth() + 1);
    setCalendar(res);
  };

  const handleDayClick = (date: string) => {
    setModalDate(date)
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!router.isReady || !projectId) return;

    const fetchData = async () => {
      try {
        const res = await getCalendar(projectId?.toString() || "", currentDate.getMonth() + 1);
        setCalendar(res);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      }
    };

    fetchData();
  }, [router.isReady, currentDate, projectId]);

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
            onClick={() => handleDayClick(`${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`)}
          >
            {day}
            <Day calendar={calendar} date={`${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`} />
          </div>
        ))}
      </div>
      <EditCalendarModal date={modalDate} isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveModal} />
    </div>
  );
};

export default Calendar;

import styles from '@/styles/component/Calendar.module.css';
import { mockCalendarItems } from "@/components/mockupData";
import { CalendarItem } from "../types";
import { useEffect } from 'react';

interface DayProps {
    date: string;
}

const Day: React.FC<DayProps> = ({ date }) => {

    const itemsForDay = mockCalendarItems.filter((item) => item.date === date.toString());

    return (
        <>
            {itemsForDay.map((item: CalendarItem) => (
                <div key={item.id} className={styles.item}>
                    <div className={styles.title}>{item.title}</div>
                    <p>{item.description}</p>
                    <small>{item.writer}</small>
                </div>
            ))}
        </>
    );
};

export default Day;

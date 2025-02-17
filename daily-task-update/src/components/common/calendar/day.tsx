import styles from '@/styles/component/Calendar.module.css';
import { CalendarItem } from "../types";

interface DayProps {
    date: string;
    calendar: CalendarItem[];
}

const Day: React.FC<DayProps> = ({ date, calendar }) => {

    const normalizeDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-').map(Number);
        return `${year}-${month}-${day}`;
    };
    
    const itemsForDay = calendar.filter((item) => normalizeDate(item.date) === normalizeDate(date));    

    return (
        <>
            {itemsForDay.map((item: CalendarItem) => (
                <div key={item.id} className={styles.item}>
                    <div className={styles.title}>{item.title}</div>
                    <p>{item.description}</p>
                    <div>[{item.location}]</div>
                    <div className={styles.by}>{item.created_by}</div>
                </div>
            ))}
        </>
    );
};

export default Day;

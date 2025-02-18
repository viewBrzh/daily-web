import React, { useState, useEffect } from "react";
import styles from "@/styles/modal/modal.module.css";
import stylesCalendar from "@/styles/modal/CalendarEdit.module.css";
import { CalendarItem } from "../../types";
import { useRouter } from "next/router";
import { addCalendar, deleteCalendar, getCalendar, getCalendarByDate } from "@/pages/api/my-task/calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import AddCalendarModal from "./addCalendarModal";

interface EditCalendarModalProps {
    date: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

const calendarInit = [{
    id: 0,
    date: "",
    title: "",
    description: "",
    created_by: "",
    location: "",
}];

const EditCalendarModal: React.FC<EditCalendarModalProps> = ({ date, isOpen, onClose, onSave }) => {
    if (!isOpen) return null;

    const router = useRouter();
    const { projectId } = router.query;
    const [event, setEvent] = useState<CalendarItem[]>(calendarInit);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        if (!router.isReady || !projectId) return;

        const fetchData = async () => {
            try {
                const res = await getCalendarByDate(projectId, date);
                setEvent(res);
            } catch (error) {
                console.error('Error fetching calendar data:', error);
            }
        };

        fetchData();
    }, []);

    const dateStr = new Date(date);

    const formattedDate = dateStr.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const handleAddEvent = async (newEvent: any) => {
        try {
            await addCalendar(newEvent);

            const res = await getCalendarByDate(projectId, date);
            setEvent(res);
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    const deleteEvent = async (id: number) => {
        try {
            await deleteCalendar(id); // Wait for the delete request to complete
            const res = await getCalendarByDate(projectId, date); // Fetch updated list
            setEvent(res); // Update state with new list
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };


    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2 className={stylesCalendar.date}>{formattedDate}</h2>
                <div className={stylesCalendar.content}>
                    {event.length > 0 ? event.map((item: CalendarItem) => (
                        <div key={item.id} className={stylesCalendar.item}>
                            <div className={stylesCalendar.header}>
                                <div className={stylesCalendar.title}>{item.title}</div>
                                <button className={stylesCalendar.btnDelete} onClick={() => deleteEvent(item.id)}><FontAwesomeIcon icon={faXmark} /></button>
                            </div>
                            <p>{item.description}</p>
                            <div className={stylesCalendar.location}>[{item.location}]</div>
                            <div>{item.created_by}</div>
                        </div>
                    )) : <div className={stylesCalendar.noEvent}> No Event</div>}
                </div>
                <button className={stylesCalendar.btnAdd} onClick={() => setIsAddModalOpen(true)}><FontAwesomeIcon icon={faPlus} /></button>
                <div className={styles.formActions}>
                    <button className='btn' onClick={onSave}>Confirm</button>
                </div>
            </div>
            <AddCalendarModal
                date={date}
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddEvent}
                projectId={Number(projectId)}
                createdBy={1}
            />
        </div>
    );
};

export default EditCalendarModal;

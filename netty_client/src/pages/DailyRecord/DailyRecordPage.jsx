import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DailyRecordPage.css';
import RecordInput from '../../components/RecordInput/RecordInput';
import DailyRecordList from '../../components/DailyRecordList/DailyRecordList';
import ContributionGraph from '../../components/ContributionGraph/ContributionGraph';
import { useNotification } from '../../contexts/NotificationContext';

const DailyRecordPage = () => {
    const [date, setDate] = useState(new Date());
    const [records, setRecords] = useState([]);
    const [selectedDateRecords, setSelectedDateRecords] = useState([]);

    useEffect(() => {
        fetchRecords();
    }, []);

    useEffect(() => {
        filterRecordsByDate(date);
    }, [records, date]);

    const fetchRecords = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/records');
            const data = await response.json();
            setRecords(data);
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    const filterRecordsByDate = (selectedDate) => {
        const dateString = selectedDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
        const filtered = records.filter(record => {
            const recordDate = new Date(record.date).toLocaleDateString('en-CA');
            return recordDate === dateString;
        });
        setSelectedDateRecords(filtered);
    };

    const handleDateChange = (newDate) => {
        setDate(newDate);
    };

    const { showNotification } = useNotification();

    const handleRecordAdded = (newRecord) => {
        setRecords([...records, newRecord]);
        showNotification('기록이 추가되었습니다.', 'success');
    };

    const handleRecordDeleted = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/records/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setRecords(records.filter(record => record._id !== id));
                showNotification('기록이 삭제되었습니다.', 'success');
            } else {
                console.error('Failed to delete record');
                showNotification('기록 삭제 실패', 'error');
            }
        } catch (error) {
            console.error('Error deleting record:', error);
            showNotification('오류가 발생했습니다.', 'error');
        }
    };

    const handleRecordUpdated = async (id, newContent) => {
        try {
            const response = await fetch(`http://localhost:5000/api/records/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newContent }),
            });
            if (response.ok) {
                const updatedRecord = await response.json();
                setRecords(records.map(record =>
                    record._id === updatedRecord._id ? updatedRecord : record
                ));
                showNotification('기록이 수정되었습니다.', 'success');
            } else {
                console.error('Failed to update record');
                showNotification('기록 수정 실패', 'error');
            }
        } catch (error) {
            console.error('Error updating record:', error);
            showNotification('오류가 발생했습니다.', 'error');
        }
    };

    return (
        <div className="daily-record-page">
            <h1 className="daily-record-page__title">일상 기록</h1>

            <ContributionGraph records={records} />

            <div className="daily-record-page__content">
                <div className="daily-record-page__left">
                    <div className="daily-record-page__calendar-wrapper">
                        <Calendar
                            onChange={handleDateChange}
                            value={date}
                            calendarType="gregory"
                            formatDay={(locale, date) => date.getDate()}
                        />
                    </div>
                </div>
                <div className="daily-record-page__right">
                    <RecordInput onRecordCreated={handleRecordAdded} selectedDate={date} />
                    <DailyRecordList
                        date={date}
                        records={selectedDateRecords}
                        onDeleteRecord={handleRecordDeleted}
                        onUpdateRecord={handleRecordUpdated}
                    />
                </div>
            </div>
        </div>
    );
};

export default DailyRecordPage;

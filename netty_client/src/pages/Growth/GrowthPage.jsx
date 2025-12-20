import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './GrowthPage.css';
import RecordInput from '../../components/RecordInput/RecordInput';
import DailyRecordList from '../../components/DailyRecordList/DailyRecordList';
import ContributionGraph from '../../components/ContributionGraph/ContributionGraph';

const GrowthPage = () => {
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

    const handleRecordAdded = (newRecord) => {
        setRecords([...records, newRecord]);
    };

    const handleRecordDeleted = (id) => {
        setRecords(records.filter(record => record._id !== id));
    };

    const handleRecordUpdated = (updatedRecord) => {
        setRecords(records.map(record =>
            record._id === updatedRecord._id ? updatedRecord : record
        ));
    };

    return (
        <div className="growth-page">
            <h1 className="growth-page__title">성장 기록</h1>

            <ContributionGraph records={records} />

            <div className="growth-page__content">
                <div className="growth-page__left">
                    <div className="growth-page__calendar-wrapper">
                        <Calendar
                            onChange={handleDateChange}
                            value={date}
                            calendarType="gregory"
                            formatDay={(locale, date) => date.getDate()}
                        />
                    </div>
                </div>
                <div className="growth-page__right">
                    <RecordInput onRecordCreated={handleRecordAdded} selectedDate={date} />
                    <DailyRecordList
                        date={date}
                        records={selectedDateRecords}
                        onRecordDeleted={handleRecordDeleted}
                        onRecordUpdated={handleRecordUpdated}
                    />
                </div>
            </div>
        </div>
    );
};

export default GrowthPage;

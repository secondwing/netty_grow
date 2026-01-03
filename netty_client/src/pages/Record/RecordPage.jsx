import React, { useState } from 'react';
import DailyRecordPage from '../DailyRecord/DailyRecordPage';
import GrowthRecordPage from '../GrowthRecord/GrowthRecordPage';
import './RecordPage.css';

const RecordPage = () => {
    const [activeTab, setActiveTab] = useState('daily');

    return (
        <div className="record-page">
            <div className="record-page__header">
                <div className="record-page__tabs">
                    <button
                        className={`record-page__tab ${activeTab === 'daily' ? 'active' : ''}`}
                        onClick={() => setActiveTab('daily')}
                    >
                        일상 기록
                    </button>
                    <button
                        className={`record-page__tab ${activeTab === 'growth' ? 'active' : ''}`}
                        onClick={() => setActiveTab('growth')}
                    >
                        성장 기록
                    </button>
                </div>
            </div>

            <div className="record-page__content">
                {activeTab === 'daily' ? <DailyRecordPage /> : <GrowthRecordPage />}
            </div>
        </div>
    );
};

export default RecordPage;

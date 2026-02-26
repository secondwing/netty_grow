import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DailyRecordPage from '../DailyRecord/DailyRecordPage';
import GrowthRecordPage from '../GrowthRecord/GrowthRecordPage';
import { AuthContext } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import './RecordPage.css';

const RecordPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();

    const isDaily = location.state?.tab === 'daily';
    const [activeTab, setActiveTab] = useState(isDaily ? 'daily' : 'growth');

    useEffect(() => {
        if (location.state?.tab === 'daily') {
            setActiveTab('daily');
        } else if (location.state?.tab && ['plan', 'indicator', 'analysis', 'overview', 'result', 'reflection', 'intro'].includes(location.state.tab)) {
            setActiveTab('growth');
        }
    }, [location.state]);

    const handleTabChange = (tab) => {
        if (tab === 'daily' && !user) {
            if (window.confirm('로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?')) {
                navigate('/login');
            }
            return;
        }
        setActiveTab(tab);
    };

    return (
        <div className="record-page">
            <div className="record-page__header">
                <div className="record-page__tabs">
                    <button
                        className={`record-page__tab ${activeTab === 'daily' ? 'active' : ''}`}
                        onClick={() => handleTabChange('daily')}
                    >
                        일상 기록
                    </button>
                    <button
                        className={`record-page__tab ${activeTab === 'growth' ? 'active' : ''}`}
                        onClick={() => handleTabChange('growth')}
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

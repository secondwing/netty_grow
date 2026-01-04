import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useNotification } from '../../contexts/NotificationContext';
import YearlyPlan from '../../components/GrowthRecord/YearlyPlan';
import MonthlyIndicator from '../../components/GrowthRecord/MonthlyIndicator';
import MonthlyAnalysis from '../../components/GrowthRecord/MonthlyAnalysis';
import YearlyOverview from '../../components/GrowthRecord/YearlyOverview';
import GrowthResult from '../../components/GrowthRecord/GrowthResult';
import GrowthReflection from '../../components/GrowthRecord/GrowthReflection';
import GrowthReportDocument from '../../components/PDF/GrowthReportDocument';
import '../../components/GrowthRecord/GrowthRecord.css';

function GrowthRecordPage() {
    const [activeTab, setActiveTab] = useState('plan');
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [plan, setPlan] = useState(null);
    const [log, setLog] = useState(null);
    const [allMonthlyLogs, setAllMonthlyLogs] = useState([]);
    const [user, setUser] = useState(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        fetchPlan();
        fetchAllLogs();
        fetchUser();
    }, [year]);

    useEffect(() => {
        if (activeTab === 'indicator' || activeTab === 'analysis') {
            fetchLog();
        }
    }, [year, month, activeTab]);

    const fetchUser = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/me', {
                withCredentials: true
            });
            setUser(res.data);
        } catch (err) {
            console.error('Error fetching user:', err);
        }
    };

    const fetchPlan = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/growth/plan/${year}`, {
                withCredentials: true
            });
            setPlan(res.data);
        } catch (err) {
            console.error('Error fetching plan:', err);
            showNotification('성장 계획을 불러오는데 실패했습니다.', 'error');
        }
    };

    const fetchLog = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/growth/log/${year}/${month}`, {
                withCredentials: true
            });
            setLog(res.data);
        } catch (err) {
            console.error('Error fetching log:', err);
            showNotification('월간 기록을 불러오는데 실패했습니다.', 'error');
        }
    };

    const fetchAllLogs = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/growth/logs/${year}`, {
                withCredentials: true
            });
            setAllMonthlyLogs(res.data);
        } catch (err) {
            console.error('Error fetching all logs:', err);
        }
    };

    const handleUpdatePlan = async (data) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/growth/plan/${plan._id}`, data, {
                withCredentials: true
            });
            setPlan(res.data);
            showNotification('저장되었습니다.', 'success');
        } catch (err) {
            console.error('Error updating plan:', err);
            showNotification('저장에 실패했습니다.', 'error');
        }
    };

    const handleUpdateLog = async (data) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/growth/log/${log._id}`, data, {
                withCredentials: true
            });
            setLog(res.data);
            // Also update allMonthlyLogs to keep PDF data fresh
            fetchAllLogs();
            showNotification('저장되었습니다.', 'success');
        } catch (err) {
            console.error('Error updating log:', err);
            showNotification('저장에 실패했습니다.', 'error');
        }
    };

    const renderContent = () => {
        if (!plan) return <div>Loading...</div>;

        switch (activeTab) {
            case 'plan':
                return <YearlyPlan plan={plan} onUpdate={handleUpdatePlan} />;
            case 'indicator':
                return <MonthlyIndicator plan={plan} log={log} month={month} onUpdateLog={handleUpdateLog} />;
            case 'analysis':
                return <MonthlyAnalysis plan={plan} log={log} onUpdateLog={handleUpdateLog} />;
            case 'overview':
                return <YearlyOverview plan={plan} onUpdate={handleUpdatePlan} />;
            case 'result':
                return <GrowthResult plan={plan} onUpdate={handleUpdatePlan} />;
            case 'reflection':
                return <GrowthReflection plan={plan} onUpdate={handleUpdatePlan} />;
            default:
                return null;
        }
    };

    return (
        <div className="growth-record-page">
            <div className="growth-record__header">
                <h1 className="growth-record__title">성장 기록</h1>
                <div className="growth-record__controls">
                    {plan && (
                        <PDFDownloadLink
                            document={<GrowthReportDocument plan={plan} monthlyLogs={allMonthlyLogs} user={user} />}
                            fileName={`growth-record-${year}.pdf`}
                            style={{ textDecoration: 'none' }}
                        >
                            {({ blob, url, loading, error }) => (
                                <button className="growth-btn growth-btn--add" style={{ width: 'auto' }} disabled={loading}>
                                    {loading ? 'PDF 생성 중...' : '전체 리포트 다운로드'}
                                </button>
                            )}
                        </PDFDownloadLink>
                    )}

                    <select
                        className="growth-select"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                    >
                        <option value={2024}>2024년</option>
                        <option value={2025}>2025년</option>
                        <option value={2026}>2026년</option>
                    </select>
                    {(activeTab === 'indicator' || activeTab === 'analysis') && (
                        <select
                            className="growth-select"
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>{m}월</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <div className="growth-tabs">
                <button
                    className={`growth-tab ${activeTab === 'plan' ? 'active' : ''}`}
                    onClick={() => setActiveTab('plan')}
                >
                    성장 계획
                </button>
                <button
                    className={`growth-tab ${activeTab === 'indicator' ? 'active' : ''}`}
                    onClick={() => setActiveTab('indicator')}
                >
                    월 성장지표
                </button>
                <button
                    className={`growth-tab ${activeTab === 'analysis' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analysis')}
                >
                    월 성장분석
                </button>
                <button
                    className={`growth-tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    {year}년 한눈에 정리
                </button>
                <button
                    className={`growth-tab ${activeTab === 'result' ? 'active' : ''}`}
                    onClick={() => setActiveTab('result')}
                >
                    연 결과보고서
                </button>
                <button
                    className={`growth-tab ${activeTab === 'reflection' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reflection')}
                >
                    성장소감
                </button>
            </div>

            {renderContent()}
        </div>
    );
}

export default GrowthRecordPage;

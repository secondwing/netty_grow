import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { API_BASE_URL } from '../../config';
import { AuthContext } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import YearlyPlan from '../../components/GrowthRecord/YearlyPlan';
import MonthlyIndicator from '../../components/GrowthRecord/MonthlyIndicator';
import MonthlyAnalysis from '../../components/GrowthRecord/MonthlyAnalysis';
import YearlyOverview from '../../components/GrowthRecord/YearlyOverview';
import GrowthResult from '../../components/GrowthRecord/GrowthResult';
import GrowthReflection from '../../components/GrowthRecord/GrowthReflection';
import GrowthReportDocument from '../../components/PDF/GrowthReportDocument';
import ScrollToTopButton from '../../components/Common/ScrollToTopButton';
import KakaoFloatingButton from '../../components/Common/KakaoFloatingButton';
import FloatingUnicodePicker from '../../components/Common/FloatingUnicodePicker';
import GrowthIntro from '../../components/GrowthRecord/GrowthIntro';
import '../../components/GrowthRecord/GrowthRecord.css';

function GrowthRecordPage() {
    const [activeTab, setActiveTab] = useState('intro'); // Default to intro
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [plan, setPlan] = useState(null);
    const [log, setLog] = useState(null);
    const [allMonthlyLogs, setAllMonthlyLogs] = useState([]);

    // Use user from AuthContext instead of fetching locally
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();

    const navigate = useNavigate();

    // Removed fetchUser useEffect as it's handled in AuthContext

    useEffect(() => {
        if (user) {
            fetchPlan();
            fetchAllLogs();
        }
    }, [user, year]);

    useEffect(() => {
        if (activeTab === 'indicator' || activeTab === 'analysis') {
            if (user) {
                fetchLog();
            }
        }
    }, [year, month, activeTab, user]);

    // Removed fetchUser function

    const fetchPlan = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/growth/plan/${year}`, {
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
            const res = await axios.get(`${API_BASE_URL}/api/growth/log/${year}/${month}`, {
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
            const res = await axios.get(`${API_BASE_URL}/api/growth/logs/${year}`, {
                withCredentials: true
            });
            setAllMonthlyLogs(res.data);
        } catch (err) {
            console.error('Error fetching all logs:', err);
        }
    };

    const handleUpdatePlan = async (data) => {
        try {
            const res = await axios.put(`${API_BASE_URL}/api/growth/plan/${plan._id}`, data, {
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
            const res = await axios.put(`${API_BASE_URL}/api/growth/log/${log._id}`, data, {
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
        if (activeTab === 'intro') return <GrowthIntro />;

        // For other tabs, we need the plan loaded
        if (!plan) {
            if (!user) return <div className="growth-message">로그인이 필요한 메뉴입니다.</div>;
            return <div>Loading...</div>;
        }

        switch (activeTab) {
            case 'plan':
                return <YearlyPlan plan={plan} user={user} onUpdate={handleUpdatePlan} refreshPlan={fetchPlan} />;
            case 'indicator':
                const previousLog = allMonthlyLogs.find(l => l.year === year && l.month === month - 1);
                return <MonthlyIndicator
                    plan={plan}
                    log={log}
                    month={month}
                    previousLog={previousLog}
                    user={user}
                    onUpdateLog={handleUpdateLog}
                    refreshLog={fetchLog}
                />;
            case 'analysis':
                return <MonthlyAnalysis
                    plan={plan}
                    log={log}
                    user={user}
                    onUpdateLog={handleUpdateLog}
                    refreshLog={fetchLog}
                />;
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
                    className={`growth-tab ${activeTab === 'intro' ? 'active' : ''}`}
                    onClick={() => setActiveTab('intro')}
                >
                    나성장 소개
                </button>
                {['plan', 'indicator', 'analysis', 'result', 'reflection'].map(tab => (
                    <button
                        key={tab}
                        className={`growth-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => {
                            if (!user) {
                                if (window.confirm('로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?')) {
                                    navigate('/login');
                                }
                                return;
                            }
                            setActiveTab(tab);
                        }}
                    >
                        {tab === 'plan' && '성장 계획'}
                        {tab === 'indicator' && '월 성장일지'}
                        {tab === 'analysis' && '월 성장분석'}
                        {tab === 'result' && '연 성장결과'}
                        {tab === 'reflection' && '성장소감'}
                    </button>
                ))}
            </div>

            {/* Mobile Tab Select */}
            <div className="growth-tabs-mobile">
                <select
                    className="growth-select growth-tabs-mobile-select"
                    value={activeTab}
                    onChange={(e) => {
                        const tab = e.target.value;
                        if (tab !== 'intro' && !user) {
                            if (window.confirm('로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?')) {
                                navigate('/login');
                            }
                            // Reset select to intro ideally, but activeTab state won't change so it should stick
                            return;
                        }
                        setActiveTab(tab);
                    }}
                >
                    <option value="intro">나성장 소개</option>
                    <option value="plan">성장 계획</option>
                    <option value="indicator">월 성장일지</option>
                    <option value="analysis">월 성장분석</option>
                    <option value="result">연 성장결과</option>
                    <option value="reflection">성장소감</option>
                </select>
            </div>

            {renderContent()}
            {activeTab !== 'intro' && (
                <>
                    <KakaoFloatingButton />
                    <FloatingUnicodePicker />
                </>
            )}
            <ScrollToTopButton />
        </div>
    );
}

export default GrowthRecordPage;

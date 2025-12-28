import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNotification } from '../../contexts/NotificationContext';
import YearlyPlan from '../../components/GrowthRecord/YearlyPlan';
import MonthlyIndicator from '../../components/GrowthRecord/MonthlyIndicator';
import MonthlyAnalysis from '../../components/GrowthRecord/MonthlyAnalysis';
import GrowthResult from '../../components/GrowthRecord/GrowthResult';
import '../../components/GrowthRecord/GrowthRecord.css';

function GrowthRecordPage() {
    const [activeTab, setActiveTab] = useState('plan');
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [plan, setPlan] = useState(null);
    const [log, setLog] = useState(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        fetchPlan();
    }, [year]);

    useEffect(() => {
        if (activeTab === 'indicator' || activeTab === 'analysis') {
            fetchLog();
        }
    }, [year, month, activeTab]);

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
            showNotification('저장되었습니다.', 'success');
        } catch (err) {
            console.error('Error updating log:', err);
            showNotification('저장에 실패했습니다.', 'error');
        }
    };

    const handleDownloadPDF = async () => {
        const element = document.querySelector('.growth-record-page');
        if (!element) return;

        try {
            showNotification('PDF 생성 중입니다...', 'info');
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`growth-record-${year}-${activeTab}.pdf`);
            showNotification('PDF가 다운로드되었습니다.', 'success');
        } catch (err) {
            console.error('PDF generation error:', err);
            showNotification('PDF 생성에 실패했습니다.', 'error');
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'plan':
                return <YearlyPlan plan={plan} onUpdate={handleUpdatePlan} />;
            case 'indicator':
                return <MonthlyIndicator plan={plan} log={log} month={month} onUpdateLog={handleUpdateLog} />;
            case 'analysis':
                return <MonthlyAnalysis log={log} onUpdateLog={handleUpdateLog} />;
            case 'result':
                return <GrowthResult plan={plan} onUpdate={handleUpdatePlan} />;
            default:
                return null;
        }
    };

    return (
        <div className="growth-record-page">
            <div className="growth-record__header">
                <h1 className="growth-record__title">성장 기록</h1>
                <div className="growth-record__controls">
                    <button className="growth-btn growth-btn--add" onClick={handleDownloadPDF} style={{ width: 'auto' }}>
                        PDF 다운로드
                    </button>
                    <select
                        className="growth-select"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                    >
                        <option value={2024}>2024년</option>
                        <option value={2025}>2025년</option>
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
                    나의 성장계획
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
                    className={`growth-tab ${activeTab === 'result' ? 'active' : ''}`}
                    onClick={() => setActiveTab('result')}
                >
                    성장결과
                </button>
            </div>

            {renderContent()}
        </div>
    );
}

export default GrowthRecordPage;

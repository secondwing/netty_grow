import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import YearlyPlan from '../../components/GrowthRecord/YearlyPlan';
import MonthlyIndicator from '../../components/GrowthRecord/MonthlyIndicator';
import MonthlyAnalysis from '../../components/GrowthRecord/MonthlyAnalysis';
import { useNotification } from '../../contexts/NotificationContext';
import '../../components/GrowthRecord/GrowthRecord.css'; // Reuse styles

function AdminUserGrowthPage({ user: adminUser }) {
    const { userId } = useParams();
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('plan');
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [plan, setPlan] = useState(null);
    const [log, setLog] = useState(null);
    const [previousLog, setPreviousLog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [targetUserName, setTargetUserName] = useState('');

    useEffect(() => {
        fetchPlan();
        if (activeTab !== 'plan') {
            fetchLog();
            if (month > 1) {
                fetchPreviousLog();
            }
        }
    }, [userId, year, month, activeTab]);

    const fetchPlan = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/growth/admin/plan/${userId}/${year}`, {
                withCredentials: true
            });
            setPlan(response.data);
            // Assuming response might include user details or we fetch user separately?
            // The plan object itself usually has userId but maybe not name. 
            // We can fetch user name separately if needed, but let's stick to just the plan for now.
        } catch (error) {
            console.error('Failed to fetch plan:', error);
            showNotification('성장 계획을 불러오는데 실패했습니다.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchLog = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/growth/admin/log/${userId}/${year}/${month}`, {
                withCredentials: true
            });
            setLog(response.data);
        } catch (error) {
            console.error('Failed to fetch log:', error);
            // It might be 404 if not exists, handle gracefully
            setLog(null);
        }
    };

    const fetchPreviousLog = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/growth/admin/log/${userId}/${year}/${month - 1}`, {
                withCredentials: true
            });
            setPreviousLog(response.data);
        } catch (error) {
            console.error('Failed to fetch previous log:', error);
            setPreviousLog(null);
        }
    };

    // Handlers for updates - Admins might edit the content too? 
    // Usually Admins can edit content, or purely Read-Only content + Write Feedback.
    // Given the requirement "Admin gives feedback", editing content might be unintended.
    // However, existing YearlyPlan expects an onUpdate. 
    // If we want read-only content for Admin, we need to handle that in YearlyPlan.
    // Currently YearlyPlan allows editing if user passed in is admin? No, YearlyPlan doesn't check role for content editing, 
    // it checks role for FEEDBACK editing.
    // Wait -> YearlyPlan typically allows ANYONE who can render it to edit it (input fields).
    // If we want Admin to NOT edit the user's text, we need a readOnly prop in YearlyPlan.
    // For now, let's assume Admin CAN edit user's text (fixing typos etc) OR just leave it as is.
    // The prompt focused on FEEDBACK.

    const handleUpdatePlan = async (updatedPlan) => {
        // Admin updating user's plan via admin endpoint?
        // Reuse normal update endpoint? 
        // Normal update endpoint: PUT /plan/:id -> checks req.user.id vs plan.userId (usually).
        // Let's check server growth.js for PUT /plan/:id
        // It uses: { _id: req.params.id, userId: req.user.id }
        // SO ADMIN CANNOT UPDATE USER'S PLAN CONTENT via standard endpoint!
        // We either need an admin endpoint for content update, or just disable saving content.
        // For Feedback, we have separate endpoints which Admin DOES have access to.
        showNotification('관리자는 사용자의 내용을 직접 수정할 수 없습니다 (피드백만 가능)', 'info');
    };

    const handleUpdateLog = async (updatedLog) => {
        showNotification('관리자는 사용자의 내용을 직접 수정할 수 없습니다 (피드백만 가능)', 'info');
    };

    const renderContent = () => {
        if (loading) return <div>Loading...</div>;

        switch (activeTab) {
            case 'plan':
                return <YearlyPlan
                    plan={plan}
                    user={adminUser} // Admin user passed here, so 'role' is 'admin', allowing feedback editing
                    onUpdate={handleUpdatePlan}
                    refreshPlan={fetchPlan}
                    canAdminFeedback={true}
                    readOnly={true}
                />;
            case 'monthly-indicator':
                return <MonthlyIndicator
                    plan={plan}
                    log={log}
                    month={month}
                    previousLog={previousLog}
                    user={adminUser}
                    onUpdateLog={handleUpdateLog}
                    refreshLog={fetchLog}
                />;
            case 'monthly-analysis':
                return <MonthlyAnalysis
                    plan={plan}
                    log={log}
                    user={adminUser}
                    onUpdateLog={handleUpdateLog}
                    refreshLog={fetchLog}
                />;
            default:
                return null;
        }
    };

    return (
        <div className="growth-record-page admin-view">
            <div className="page-header">
                <h1>사용자 성장 기록 (관리자 모드)</h1>
            </div>

            <div className="growth-record-tabs">
                <button
                    className={`growth-tab ${activeTab === 'plan' ? 'active' : ''}`}
                    onClick={() => setActiveTab('plan')}
                >
                    연간 성장계획
                </button>
                <button
                    className={`growth-tab ${activeTab === 'monthly-indicator' ? 'active' : ''}`}
                    onClick={() => setActiveTab('monthly-indicator')}
                >
                    월간 성장지표
                </button>
                <button
                    className={`growth-tab ${activeTab === 'monthly-analysis' ? 'active' : ''}`}
                    onClick={() => setActiveTab('monthly-analysis')}
                >
                    월간 성장분석
                </button>
            </div>

            {activeTab !== 'plan' && (
                <div className="month-selector">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <button
                            key={m}
                            className={`month-btn ${month === m ? 'active' : ''}`}
                            onClick={() => setMonth(m)}
                        >
                            {m}월
                        </button>
                    ))}
                </div>
            )}

            <div className="growth-record-content">
                {renderContent()}
            </div>
        </div>
    );
}

export default AdminUserGrowthPage;

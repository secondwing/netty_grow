import React, { useState, useEffect } from 'react';
import LoadingButton from '../Common/LoadingButton';

function MonthlyIndicator({ plan, log, month, onUpdateLog }) {
    const [localLog, setLocalLog] = useState(log);

    useEffect(() => {
        setLocalLog(log);
    }, [log]);

    const handleLogChange = (activityId, value) => {
        if (!localLog) return;

        const newActivityLogs = [...(localLog.activityLogs || [])];
        const existingLogIndex = newActivityLogs.findIndex(l => l.activityId === activityId);

        if (existingLogIndex >= 0) {
            newActivityLogs[existingLogIndex].log = value;
        } else {
            newActivityLogs.push({ activityId, log: value });
        }

        setLocalLog({ ...localLog, activityLogs: newActivityLogs });
    };

    const getLogValue = (activityId) => {
        if (!localLog || !localLog.activityLogs) return '';
        const activityLog = localLog.activityLogs.find(l => l.activityId === activityId);
        return activityLog ? activityLog.log : '';
    };

    const handleDraftAI = async (activityId, activityContent) => {
        try {
            // Assuming we have access to userId from somewhere, or we can get it from plan.userId?
            // plan.userId is an ObjectId.
            // But wait, we need the current logged in user ID. 
            // The parent component (GrowthRecordPage) fetches plan, so it knows.
            // But MonthlyIndicator receives `plan`. `plan.userId` should be correct.

            const response = await fetch('http://localhost:5000/api/ai/draft/monthly-indicator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: plan.userId,
                    year: plan.year,
                    month: month,
                    activityContent: activityContent
                })
            });

            if (!response.ok) {
                throw new Error('AI drafting failed');
            }

            const data = await response.json();
            if (data.draft) {
                handleLogChange(activityId, data.draft);
            }
        } catch (error) {
            console.error('AI Draft Error:', error);
            alert('AI 초안 작성에 실패했습니다.');
        }
    };

    const handleSave = () => {
        onUpdateLog(localLog);
    };

    if (!plan || !localLog) return <div>Loading...</div>;

    return (
        <div className="growth-content">
            <div className="growth-section">
                <div className="growth-section__header">
                    <h2 className="growth-section__title">{month}월 성장지표</h2>
                    <button className="growth-btn growth-btn--save" onClick={handleSave}>
                        저장하기
                    </button>
                </div>

                <div className="growth-items">
                    {plan.items.map((item, itemIndex) => (
                        <div key={item._id || itemIndex} className="growth-item-card">
                            <div className="growth-item-header">
                                <div className="growth-item-header__info">
                                    <span className="growth-label">원하는 나:</span>
                                    <span className="growth-value">{item.desiredSelf}</span>
                                </div>
                                <div className="growth-item-header__info">
                                    <span className="growth-label">성장목표:</span>
                                    <span className="growth-value">{item.goal}</span>
                                </div>
                            </div>

                            <div className="growth-activities-log">
                                {item.activities.map((activity, activityIndex) => (
                                    <div key={activity._id || activityIndex} className="growth-activity-log-row">
                                        <div className="growth-activity-content">
                                            <span className="growth-activity-badge">활동 {activityIndex + 1}</span>
                                            <p>{activity.content}</p>
                                        </div>
                                        <div className="growth-log-input-wrapper">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <label style={{ margin: 0 }}>활동일지 (실천방안 및 소감)</label>
                                                <LoadingButton
                                                    className="growth-btn growth-btn--ai"
                                                    onClick={() => handleDraftAI(activity._id, activity.content)}
                                                    style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', background: '#e0e7ff', color: '#4f46e5' }}
                                                />
                                            </div>
                                            <textarea
                                                className="growth-textarea"
                                                value={getLogValue(activity._id)}
                                                onChange={(e) => handleLogChange(activity._id, e.target.value)}
                                                placeholder="이번 달 활동 내용을 기록해주세요"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MonthlyIndicator;

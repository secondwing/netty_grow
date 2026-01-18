import React, { useState, useEffect } from 'react';
import LoadingButton from '../Common/LoadingButton';
import AutoResizeTextarea from '../Common/AutoResizeTextarea';

function MonthlyIndicator({ plan, log, month, onUpdateLog }) {
    const [localLog, setLocalLog] = useState(log);

    useEffect(() => {
        setLocalLog(log);
    }, [log]);

    // Helper to get or create activity log object
    const getOrCreateActivityLog = (activityLogs, activityId) => {
        const index = activityLogs.findIndex(l => l.activityId === activityId);
        if (index >= 0) {
            return { logObj: activityLogs[index], index, isNew: false };
        }
        return { logObj: { activityId, actionPlans: [], reflections: [], status: 'neutral' }, index: -1, isNew: true };
    };

    const updateActivityLog = (activityId, updater) => {
        if (!localLog) return;
        const newActivityLogs = [...(localLog.activityLogs || [])];
        const { logObj, index, isNew } = getOrCreateActivityLog(newActivityLogs, activityId);

        const updatedLogObj = updater(logObj);

        if (isNew) {
            newActivityLogs.push(updatedLogObj);
        } else {
            newActivityLogs[index] = updatedLogObj;
        }

        setLocalLog({ ...localLog, activityLogs: newActivityLogs });
    };

    // --- Status Handlers ---
    const handleStatusChange = (activityId, status) => {
        updateActivityLog(activityId, (logObj) => ({ ...logObj, status }));
    };

    // --- Action Plan Handlers ---
    const handleAddActionPlan = (activityId) => {
        updateActivityLog(activityId, (logObj) => ({
            ...logObj,
            actionPlans: [...(logObj.actionPlans || []), '']
        }));
    };

    const handleActionPlanChange = (activityId, index, value) => {
        updateActivityLog(activityId, (logObj) => {
            const newPlans = [...(logObj.actionPlans || [])];
            newPlans[index] = value;
            return { ...logObj, actionPlans: newPlans };
        });
    };

    const handleRemoveActionPlan = (activityId, index) => {
        updateActivityLog(activityId, (logObj) => {
            const newPlans = [...(logObj.actionPlans || [])];
            newPlans.splice(index, 1);
            return { ...logObj, actionPlans: newPlans };
        });
    };

    // --- Reflection Handlers ---
    const handleAddReflection = (activityId) => {
        updateActivityLog(activityId, (logObj) => ({
            ...logObj,
            reflections: [...(logObj.reflections || []), '']
        }));
    };

    const handleReflectionChange = (activityId, index, value) => {
        updateActivityLog(activityId, (logObj) => {
            const newReflections = [...(logObj.reflections || [])];
            newReflections[index] = value;
            return { ...logObj, reflections: newReflections };
        });
    };

    const handleRemoveReflection = (activityId, index) => {
        updateActivityLog(activityId, (logObj) => {
            const newReflections = [...(logObj.reflections || [])];
            newReflections.splice(index, 1);
            return { ...logObj, reflections: newReflections };
        });
    };

    // --- Data Accessors (with Legacy Support) ---
    const getActivityLogData = (activityId) => {
        if (!localLog || !localLog.activityLogs) return { actionPlans: [], reflections: [], status: 'neutral' };
        const logObj = localLog.activityLogs.find(l => l.activityId === activityId);
        if (!logObj) return { actionPlans: [], reflections: [], status: 'neutral' };

        let { actionPlans, reflections, status, log: legacyLog } = logObj;

        // Legacy Support: If no structured data but legacy log exists, treat it as the first reflection
        if ((!reflections || reflections.length === 0) && legacyLog) {
            reflections = [legacyLog];
        }

        return {
            actionPlans: actionPlans || [],
            reflections: reflections || [],
            status: status || 'neutral'
        };
    };

    const handleSave = () => {
        onUpdateLog(localLog);
    };

    if (!plan || !localLog) return <div>Loading...</div>;

    return (
        <div className="growth-content">
            <div className="growth-section">
                <div className="growth-section__header">
                    <h2 className="growth-section__title">{month}월 성장일지</h2>
                    <button className="growth-btn growth-btn--save" onClick={handleSave}>
                        저장하기
                    </button>
                </div>

                <div className="growth-items growth-items--vertical">
                    {plan.items.map((item, itemIndex) => {
                        const isItemDeleted = item.isDeleted;
                        const itemDeletedAt = item.deletedAt ? new Date(item.deletedAt) : null;
                        const currentMonthEnd = new Date(plan.year, month, 0);

                        // Check if any activity in this item has a log (legacy or new)
                        const hasAnyActivityLog = item.activities.some(activity => {
                            const data = getActivityLogData(activity._id);
                            return data.actionPlans.length > 0 || data.reflections.length > 0;
                        });

                        let shouldShowItem = !isItemDeleted;

                        if (isItemDeleted) {
                            if (hasAnyActivityLog) {
                                shouldShowItem = true;
                            } else if (itemDeletedAt && itemDeletedAt > currentMonthEnd) {
                                shouldShowItem = true;
                            }
                        }

                        if (!shouldShowItem) return null;

                        return (
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
                                    {item.activities.map((activity, activityIndex) => {
                                        const isDeleted = activity.isDeleted;
                                        const deletedAt = activity.deletedAt ? new Date(activity.deletedAt) : null;
                                        const { actionPlans, reflections, status } = getActivityLogData(activity._id);
                                        const hasLog = actionPlans.length > 0 || reflections.length > 0;

                                        let shouldShow = !isDeleted;

                                        if (isDeleted) {
                                            if (hasLog) {
                                                shouldShow = true;
                                            } else if (deletedAt && deletedAt > currentMonthEnd) {
                                                shouldShow = true;
                                            }
                                        }

                                        if (!shouldShow) return null;

                                        return (
                                            <div key={activity._id || activityIndex} className="growth-activity-log-row">
                                                <div className="growth-activity-content">
                                                    <span className="growth-activity-badge">활동 {activityIndex + 1}</span>
                                                    <p>{activity.content}</p>
                                                </div>

                                                {/* Status Selector */}
                                                <div className="growth-log-section">
                                                    <div className="growth-status-selector">
                                                        <label className={`growth-status-label ${status === 'achieved' ? 'active' : ''}`}>
                                                            <input
                                                                type="radio"
                                                                name={`status-${activity._id}`}
                                                                value="achieved"
                                                                checked={status === 'achieved'}
                                                                onChange={() => handleStatusChange(activity._id, 'achieved')}
                                                            />
                                                            달성
                                                        </label>
                                                        <label className={`growth-status-label ${status === 'unachieved' ? 'active' : ''}`}>
                                                            <input
                                                                type="radio"
                                                                name={`status-${activity._id}`}
                                                                value="unachieved"
                                                                checked={status === 'unachieved'}
                                                                onChange={() => handleStatusChange(activity._id, 'unachieved')}
                                                            />
                                                            미달성
                                                        </label>
                                                        <label className={`growth-status-label ${status === 'neutral' ? 'active' : ''}`}>
                                                            <input
                                                                type="radio"
                                                                name={`status-${activity._id}`}
                                                                value="neutral"
                                                                checked={status === 'neutral'}
                                                                onChange={() => handleStatusChange(activity._id, 'neutral')}
                                                            />
                                                            진행중
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Action Plans */}
                                                <div className="growth-log-section">
                                                    <label className="growth-log-label">실천방안</label>
                                                    <div className="growth-log-list">
                                                        {actionPlans.map((plan, idx) => (
                                                            <div key={idx} className="growth-log-item">
                                                                <AutoResizeTextarea
                                                                    className="growth-textarea"
                                                                    value={plan}
                                                                    onChange={(e) => handleActionPlanChange(activity._id, idx, e.target.value)}
                                                                    placeholder="구체적인 실천 방안을 입력하세요"
                                                                    minHeight="60px"
                                                                />
                                                                <button
                                                                    className="growth-btn-icon"
                                                                    onClick={() => handleRemoveActionPlan(activity._id, idx)}
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            className="growth-btn growth-btn--add-sub"
                                                            onClick={() => handleAddActionPlan(activity._id)}
                                                        >
                                                            + 실천방안 추가
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Reflections */}
                                                <div className="growth-log-section">
                                                    <label className="growth-log-label">활동소감</label>
                                                    <div className="growth-log-list">
                                                        {reflections.map((reflection, idx) => (
                                                            <div key={idx} className="growth-log-item">
                                                                <AutoResizeTextarea
                                                                    className="growth-textarea"
                                                                    value={reflection}
                                                                    onChange={(e) => handleReflectionChange(activity._id, idx, e.target.value)}
                                                                    placeholder="활동 후 느낀 점이나 소감을 입력하세요"
                                                                    minHeight="60px"
                                                                />
                                                                <button
                                                                    className="growth-btn-icon"
                                                                    onClick={() => handleRemoveReflection(activity._id, idx)}
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            className="growth-btn growth-btn--add-sub"
                                                            onClick={() => handleAddReflection(activity._id)}
                                                        >
                                                            + 활동소감 추가
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default MonthlyIndicator;

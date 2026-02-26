import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';
import useHistory from '../../hooks/useHistory';
import LoadingButton from '../Common/LoadingButton';
import AutoResizeTextarea from '../Common/AutoResizeTextarea';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useNotification } from '../../contexts/NotificationContext';
import AdminFeedback from '../Common/AdminFeedback';
import UnicodePicker from './UnicodePicker';

function MonthlyIndicator({ plan, log, month, previousLog, user, onUpdateLog, refreshLog, canAdminFeedback = false, readOnly = false }) {
    const { showNotification } = useNotification();
    const { state: localLog, set: setLocalLog, undo, redo, canUndo, canRedo, clearHistory } = useHistory(log);
    const [lastSavedLog, setLastSavedLog] = useState(log);
    const localLogRef = useRef(log);
    const containerRef = useRef(null);

    useEffect(() => {
        localLogRef.current = localLog;
    }, [localLog]);

    // Initial load sync
    useEffect(() => {
        if (log) {
            setLocalLog(log);
            setLastSavedLog(log);
            clearHistory();
        }
    }, [log?._id, setLocalLog, clearHistory]);

    // Auto-save every 30 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (JSON.stringify(localLogRef.current) !== JSON.stringify(lastSavedLog)) {
                console.log("Auto-saving Monthly Indicator...");
                onUpdateLog(localLogRef.current);
                setLastSavedLog(localLogRef.current);
            }
        }, 30000);

        return () => clearInterval(intervalId);
    }, [lastSavedLog, onUpdateLog]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (containerRef.current && containerRef.current.contains(document.activeElement)) {
                if (e.ctrlKey && e.key === 'z') {
                    e.preventDefault();
                    if (e.shiftKey) {
                        redo();
                    } else {
                        undo();
                    }
                } else if (e.ctrlKey && e.key === 'y') {
                    e.preventDefault();
                    redo();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    // Helper to get or create activity log object
    const getOrCreateActivityLog = (activityLogs, activityId) => {
        const index = activityLogs.findIndex(l => l.activityId === activityId);
        if (index >= 0) {
            return { logObj: activityLogs[index], index, isNew: false };
        }
        return { logObj: { activityId, entries: [] }, index: -1, isNew: true };
    };

    const updateActivityLog = (activityId, updater, debounce = false) => {
        setLocalLog(prevLog => {
            if (!prevLog) return prevLog;
            const newActivityLogs = [...(prevLog.activityLogs || [])];
            const { logObj, index, isNew } = getOrCreateActivityLog(newActivityLogs, activityId);

            // We need to copy logObj before updating it if it exists
            const logObjCopy = isNew ? logObj : { ...logObj, entries: [...(logObj.entries || [])] };

            const updatedLogObj = updater(logObjCopy);

            if (isNew) {
                newActivityLogs.push(updatedLogObj);
            } else {
                newActivityLogs[index] = updatedLogObj;
            }

            return { ...prevLog, activityLogs: newActivityLogs };
        }, debounce);
    };

    const getEntriesWithLegacy = (logObj) => {
        if (logObj.entries && logObj.entries.length > 0) {
            return logObj.entries;
        }
        if (logObj.log) {
            return [{ title: '', actionPlan: '', reflection: logObj.log, status: 'neutral' }];
        }
        return [];
    };

    // --- Entry Handlers ---
    const handleAddEntry = (activityId) => {
        updateActivityLog(activityId, (logObj) => {
            const currentEntries = getEntriesWithLegacy(logObj);
            return {
                ...logObj,
                entries: [...currentEntries, { title: '', actionPlan: '', reflection: '', status: 'neutral' }],
                log: '' // Clear legacy log as we've migrated/touched entries
            };
        });
    };

    const handleEntryChange = (activityId, index, field, value) => {
        console.log("handleEntryChange", { activityId, index, field, value });
        updateActivityLog(activityId, (logObj) => {
            const newEntries = [...getEntriesWithLegacy(logObj)];
            console.log("currentEntries", newEntries);
            if (!newEntries[index]) {
                console.error("Entry not found at index", index);
                return logObj;
            }
            newEntries[index] = { ...newEntries[index], [field]: value };
            return { ...logObj, entries: newEntries, log: '' };
        }, true); // Debounce text
    };

    const handleRemoveEntry = (activityId, index) => {
        updateActivityLog(activityId, (logObj) => {
            const newEntries = [...getEntriesWithLegacy(logObj)];
            newEntries.splice(index, 1);
            return { ...logObj, entries: newEntries, log: '' };
        });
    };

    const toggleStatus = (activityId, index) => {
        updateActivityLog(activityId, (logObj) => {
            const newEntries = [...getEntriesWithLegacy(logObj)];
            if (!newEntries[index]) return logObj;

            const currentStatus = newEntries[index].status || 'neutral';
            let nextStatus = 'neutral';

            if (currentStatus === 'neutral') nextStatus = 'achieved';
            else if (currentStatus === 'achieved') nextStatus = 'unachieved';
            else nextStatus = 'neutral';

            newEntries[index] = { ...newEntries[index], status: nextStatus };
            return { ...logObj, entries: newEntries, log: '' };
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'achieved': return '✔';
            case 'unachieved': return '✕';
            default: return '−';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'achieved': return 'status-achieved';
            case 'unachieved': return 'status-unachieved';
            default: return 'status-neutral';
        }
    };

    // --- Data Accessors (with Legacy Support) ---
    const getActivityLogData = (activityId) => {
        if (!localLog || !localLog.activityLogs) return { entries: [] };
        const logObj = localLog.activityLogs.find(l => l.activityId === activityId);
        if (!logObj) return { entries: [] };

        let { entries, log: legacyLog } = logObj;

        // Legacy Support: If no entries but legacy log exists, create one entry
        if ((!entries || entries.length === 0) && legacyLog) {
            entries = [{ title: '', actionPlan: '', reflection: legacyLog, status: 'neutral' }];
        }

        return { entries: entries || [], adminFeedback: logObj.adminFeedback };
    };

    const handleSave = () => {
        onUpdateLog(localLog);
        setLastSavedLog(localLog);
    };

    const handleLoadPreviousLog = () => {
        if (!previousLog) {
            alert('불러올 이전 달의 기록이 없습니다.');
            return;
        }

        if (window.confirm(`${month - 1}월의 기록을 불러오시겠습니까? 현재 작성 중인 내용은 덮어씌워집니다.`)) {
            const newActivityLogs = previousLog.activityLogs.map(log => ({
                activityId: log.activityId,
                entries: log.entries.map(entry => ({
                    title: entry.title,
                    actionPlan: entry.actionPlan,
                    reflection: entry.reflection,
                    status: entry.status
                }))
            }));

            setLocalLog({
                ...localLog,
                activityLogs: newActivityLogs
            });
        }
    };

    const handleSaveFeedback = async (activityId, content) => {
        try {
            await axios.put(`${API_BASE_URL}/api/growth/log/${log._id}/feedback`,
                {
                    targetType: 'activity',
                    targetId: activityId,
                    feedback: { content, author: user.name || 'Admin' }
                },
                { withCredentials: true }
            );
            showNotification('피드백이 저장되었습니다.', 'success');
            refreshLog();
        } catch (error) {
            console.error('Error saving feedback:', error);
            showNotification('피드백 저장 실패', 'error');
        }
    };

    if (!plan || !localLog) return <div>Loading...</div>;

    return (
        <div className="growth-content" ref={containerRef}>
            <div className="growth-section">
                <div className="growth-section__header">
                    <h2 className="growth-section__title">{month}월 성장일지</h2>
                    <div className="growth-section__controls">
                        {!readOnly && (
                            <>
                                {month > 1 && (
                                    <button
                                        className="growth-btn growth-btn--secondary"
                                        onClick={handleLoadPreviousLog}
                                        style={{ marginRight: '0.5rem' }}
                                    >
                                        {month - 1}월 기록 불러오기
                                    </button>
                                )}
                                <button
                                    className="growth-btn-icon"
                                    onClick={undo}
                                    disabled={!canUndo}
                                    title="실행 취소 (Ctrl+Z)"
                                    style={{
                                        marginRight: '0.25rem',
                                        color: canUndo ? '#6b21a8' : '#808080',
                                        transition: 'color 0.2s'
                                    }}
                                >
                                    <RotateCcw size={20} strokeWidth={1.5} />
                                </button>
                                <button
                                    className="growth-btn-icon"
                                    onClick={redo}
                                    disabled={!canRedo}
                                    title="다시 실행 (Ctrl+Y)"
                                    style={{
                                        marginRight: '0.5rem',
                                        color: canRedo ? '#6b21a8' : '#808080',
                                        transition: 'color 0.2s'
                                    }}
                                >
                                    <RotateCw size={20} strokeWidth={1.5} />
                                </button>
                                <button className="growth-btn growth-btn--save" onClick={handleSave}>
                                    저장하기
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="growth-items growth-items--vertical">
                    {plan.items.map((item, itemIndex) => {
                        const isItemDeleted = item.isDeleted;
                        const itemDeletedAt = item.deletedAt ? new Date(item.deletedAt) : null;
                        const currentMonthEnd = new Date(plan.year, month, 0);

                        // Check if any activity in this item has a log
                        const hasAnyActivityLog = item.activities.some(activity => {
                            const data = getActivityLogData(activity._id);
                            return data.entries.length > 0;
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
                                    {(() => {
                                        let displayActivityIndex = 0;
                                        return item.activities.map((activity, activityIndex) => {
                                            const isDeleted = activity.isDeleted;
                                            const deletedAt = activity.deletedAt ? new Date(activity.deletedAt) : null;
                                            const { entries, adminFeedback } = getActivityLogData(activity._id);
                                            const hasLog = entries.length > 0;

                                            let shouldShow = !isDeleted;

                                            if (isDeleted) {
                                                if (hasLog) {
                                                    shouldShow = true;
                                                } else if (deletedAt && deletedAt > currentMonthEnd) {
                                                    shouldShow = true;
                                                }
                                            }

                                            if (!shouldShow) return null;

                                            displayActivityIndex++; // Increment only if it's going to be shown

                                            return (
                                                <div key={activity._id || activityIndex} className="growth-activity-log-row">
                                                    <div className="growth-activity-header-row">
                                                        <div className="growth-activity-content">
                                                            <span className="growth-activity-badge">활동 {displayActivityIndex}</span>
                                                            <p>{activity.content}</p>
                                                        </div>
                                                    </div>

                                                    <div className="growth-log-entries">
                                                        {entries.map((entry, idx) => (
                                                            <div key={idx} className="growth-log-entry-row">
                                                                <div className="growth-log-entry-header">
                                                                    <div className="growth-log-input-group growth-log-title-group">
                                                                        <input
                                                                            type="text"
                                                                            className="growth-input growth-log-title-input"
                                                                            value={entry.title || ''}
                                                                            onChange={(e) => handleEntryChange(activity._id, idx, 'title', e.target.value)}
                                                                            placeholder="제목을 입력하세요"
                                                                            disabled={readOnly}
                                                                        />
                                                                    </div>
                                                                    <div className="growth-log-status-group">
                                                                        <button
                                                                            className={`growth-status-toggle ${getStatusClass(entry.status)}`}
                                                                            onClick={() => !readOnly && toggleStatus(activity._id, idx)}
                                                                            title={readOnly ? "상태 (수정 불가)" : "클릭하여 상태 변경"}
                                                                            disabled={readOnly}
                                                                            style={readOnly ? { cursor: 'default', opacity: 1 } : {}}
                                                                        >
                                                                            {getStatusIcon(entry.status)}
                                                                        </button>
                                                                    </div>
                                                                    {!readOnly && (
                                                                        <button
                                                                            className="growth-btn-icon growth-btn-remove-entry"
                                                                            onClick={() => handleRemoveEntry(activity._id, idx)}
                                                                            title="삭제"
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <div className="growth-log-entry-body">
                                                                    <div className="growth-log-input-group">
                                                                        <label className="growth-log-label-small">실천방안</label>
                                                                        <AutoResizeTextarea
                                                                            className="growth-textarea"
                                                                            value={entry.actionPlan}
                                                                            onChange={(e) => handleEntryChange(activity._id, idx, 'actionPlan', e.target.value)}
                                                                            placeholder="실천방안"
                                                                            minHeight="60px"
                                                                            disabled={readOnly}
                                                                        />
                                                                    </div>
                                                                    <div className="growth-log-input-group">
                                                                        <label className="growth-log-label-small">활동소감</label>
                                                                        <AutoResizeTextarea
                                                                            className="growth-textarea"
                                                                            value={entry.reflection}
                                                                            onChange={(e) => handleEntryChange(activity._id, idx, 'reflection', e.target.value)}
                                                                            placeholder="계기 - 행동 - 결과 - 생각 - 감정 - 보완점 작성"
                                                                            minHeight="60px"
                                                                            disabled={readOnly}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {entries.length === 0 && (
                                                            <div className="growth-log-empty-state">
                                                                기록이 없습니다. [+ 기록 추가] 버튼을 눌러 작성해주세요.
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="growth-activity-actions">
                                                        {!readOnly && (
                                                            <button
                                                                className="growth-btn growth-btn--add-sub"
                                                                onClick={() => handleAddEntry(activity._id)}
                                                            >
                                                                + 기록 추가
                                                            </button>
                                                        )}
                                                    </div>
                                                    <AdminFeedback
                                                        feedback={adminFeedback}
                                                        onSave={(content) => handleSaveFeedback(activity._id, content)}
                                                        canEdit={canAdminFeedback}
                                                        label="활동 피드백"
                                                    />
                                                </div>
                                            );
                                        })
                                    })()}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {!readOnly && (
                <div style={{ position: 'fixed', bottom: '2rem', right: '92px', zIndex: 1000 }}>
                    <UnicodePicker onInsert={(char) => {
                        const copyToClipboard = (text) => {
                            if (navigator.clipboard && window.isSecureContext) {
                                return navigator.clipboard.writeText(text);
                            } else {
                                // Fallback for non-secure contexts (LAN)
                                let textArea = document.createElement("textarea");
                                textArea.value = text;
                                textArea.style.position = "fixed";
                                textArea.style.left = "-9999px";
                                textArea.style.top = "0";
                                document.body.appendChild(textArea);
                                textArea.focus();
                                textArea.select();
                                return new Promise((resolve, reject) => {
                                    try {
                                        const successful = document.execCommand('copy');
                                        document.body.removeChild(textArea);
                                        if (successful) resolve();
                                        else reject(new Error("Copy command failed"));
                                    } catch (err) {
                                        document.body.removeChild(textArea);
                                        reject(err);
                                    }
                                });
                            }
                        };

                        copyToClipboard(char)
                            .then(() => showNotification(`복사완료! 붙여넣기(Ctrl+V) 하세요`, 'success'))
                            .catch(err => {
                                console.error('Copy failed:', err);
                                showNotification('복사에 실패했습니다.', 'error');
                            });
                    }} />
                </div>
            )}
        </div>
    );
}

export default MonthlyIndicator;

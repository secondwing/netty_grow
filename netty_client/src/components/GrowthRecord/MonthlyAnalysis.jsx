import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';
import useHistory from '../../hooks/useHistory';
import AutoResizeTextarea from '../Common/AutoResizeTextarea';
import LoadingButton from '../Common/LoadingButton';

function MonthlyAnalysis({ plan, log, onUpdateLog }) {
    const { state: localLog, set: setLocalLog, undo, redo, canUndo, canRedo, clearHistory } = useHistory(log);
    const [lastSavedLog, setLastSavedLog] = useState(log);
    const localLogRef = useRef(log);
    const containerRef = useRef(null);

    useEffect(() => {
        localLogRef.current = localLog;
    }, [localLog]);

    // Initial load sync
    useEffect(() => {
        console.log("MonthlyAnalysis: log prop changed", log?._id);
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
                console.log("Auto-saving Monthly Analysis...");
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

    const handleAnalysisChange = (itemId, field, value) => {
        setLocalLog(prevLog => {
            if (!prevLog) return prevLog;
            const newItemAnalyses = [...(prevLog.itemAnalyses || [])];
            const existingAnalysisIndex = newItemAnalyses.findIndex(a => a.itemId === itemId);

            if (existingAnalysisIndex >= 0) {
                newItemAnalyses[existingAnalysisIndex] = { ...newItemAnalyses[existingAnalysisIndex], [field]: value };
            } else {
                const newAnalysis = { itemId, strength: '', weakness: '', supplement: '' };
                newAnalysis[field] = value;
                newItemAnalyses.push(newAnalysis);
            }
            return { ...prevLog, itemAnalyses: newItemAnalyses };
        }, true); // Debounce text
    };

    const getAnalysisValue = (itemId, field) => {
        if (!localLog || !localLog.itemAnalyses) return '';
        const analysis = localLog.itemAnalyses.find(a => a.itemId === itemId);
        return analysis ? analysis[field] : '';
    };

    const handleDraftAI = async (itemId, field, itemGoal) => {
        try {
            // Collect activity logs for this item
            // We need to find which activities belong to this item.
            // plan.items has activities.
            const item = plan.items.find(i => i._id === itemId);
            if (!item) return;

            const activityIds = item.activities.map(a => a._id);

            // Get logs from localLog that match these activityIds
            const relevantLogs = (localLog.activityLogs || [])
                .filter(l => activityIds.includes(l.activityId))
                .map(l => {
                    const activity = item.activities.find(a => a._id === l.activityId);

                    // Handle new entries structure
                    if (l.entries && l.entries.length > 0) {
                        return l.entries.map(e =>
                            `[${activity.content}] (Status: ${e.status}) Action: ${e.actionPlan}, Reflection: ${e.reflection}`
                        ).join('\n');
                    }

                    // Handle legacy log
                    return `[${activity.content}] ${l.log}`;
                });

            if (relevantLogs.length === 0) {
                alert('작성된 월간 활동 기록이 없어 AI 초안을 작성할 수 없습니다.');
                return;
            }

            const response = await fetch('http://localhost:5000/api/ai/draft/monthly-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: plan.userId,
                    year: plan.year,
                    month: log.month,
                    type: field,
                    itemGoal: itemGoal,
                    activityLogs: relevantLogs
                })
            });

            if (!response.ok) {
                throw new Error('AI drafting failed');
            }

            const data = await response.json();
            if (data.draft) {
                handleAnalysisChange(itemId, field, data.draft);
            }
        } catch (error) {
            console.error('AI Draft Error:', error);
            alert('AI 초안 작성에 실패했습니다.');
        }
    };

    const handleSave = () => {
        onUpdateLog(localLog);
        setLastSavedLog(localLog);
    };

    if (!plan || !localLog) return <div>Loading...</div>;

    return (
        <div className="growth-content" ref={containerRef}>
            <div className="growth-section">
                <div className="growth-section__header">
                    <h2 className="growth-section__title">월 성장분석</h2>
                    <div className="growth-section__controls">
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
                            <RotateCcw size={20} strokeWidth={2.5} />
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
                            <RotateCw size={20} strokeWidth={2.5} />
                        </button>
                        <button className="growth-btn growth-btn--save" onClick={handleSave}>
                            저장하기
                        </button>
                    </div>
                </div>

                <div className="growth-items growth-items--vertical">
                    {plan.items.map((item, itemIndex) => {
                        // Logic to determine if ITEM should be shown
                        // 1. Not deleted
                        // 2. Deleted, but deleted AFTER the end of this month (was active during this month)
                        // 3. Deleted, but has at least one analysis entry for this month

                        const isItemDeleted = item.isDeleted;
                        const itemDeletedAt = item.deletedAt ? new Date(item.deletedAt) : null;
                        const currentMonthEnd = new Date(plan.year, log.month, 0);

                        // Check if this item has any analysis
                        const hasAnalysis = ['strength', 'weakness', 'supplement'].some(field => getAnalysisValue(item._id, field) !== '');

                        let shouldShowItem = !isItemDeleted;

                        if (isItemDeleted) {
                            if (hasAnalysis) {
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

                                <div className="growth-analysis-grid">
                                    <div className="growth-analysis-item">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <label style={{ margin: 0 }}>행동결과 (강점)</label>
                                            <LoadingButton
                                                className="growth-btn growth-btn--ai"
                                                onClick={() => handleDraftAI(item._id, 'strength', item.goal)}
                                                style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', background: '#e0e7ff', color: '#4f46e5' }}
                                            />
                                        </div>
                                        <AutoResizeTextarea
                                            className="growth-textarea"
                                            value={getAnalysisValue(item._id, 'strength')}
                                            onChange={(e) => handleAnalysisChange(item._id, 'strength', e.target.value)}
                                            placeholder="잘한 점, 성과 등을 기록해주세요"
                                            minHeight="100px"
                                        />
                                    </div>
                                    <div className="growth-analysis-item">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <label style={{ margin: 0 }}>행동결과 (약점)</label>
                                            <LoadingButton
                                                className="growth-btn growth-btn--ai"
                                                onClick={() => handleDraftAI(item._id, 'weakness', item.goal)}
                                                style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', background: '#e0e7ff', color: '#4f46e5' }}
                                            />
                                        </div>
                                        <AutoResizeTextarea
                                            className="growth-textarea"
                                            value={getAnalysisValue(item._id, 'weakness')}
                                            onChange={(e) => handleAnalysisChange(item._id, 'weakness', e.target.value)}
                                            placeholder="아쉬운 점, 부족한 점을 기록해주세요"
                                            minHeight="100px"
                                        />
                                    </div>
                                    <div className="growth-analysis-item full-width">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <label style={{ margin: 0 }}>행동보완 (성장 환경조성)</label>
                                            <LoadingButton
                                                className="growth-btn growth-btn--ai"
                                                onClick={() => handleDraftAI(item._id, 'supplement', item.goal)}
                                                style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', background: '#e0e7ff', color: '#4f46e5' }}
                                            />
                                        </div>
                                        <AutoResizeTextarea
                                            className="growth-textarea"
                                            value={getAnalysisValue(item._id, 'supplement')}
                                            onChange={(e) => handleAnalysisChange(item._id, 'supplement', e.target.value)}
                                            placeholder="개선할 점, 앞으로의 계획을 기록해주세요"
                                            minHeight="100px"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default MonthlyAnalysis;

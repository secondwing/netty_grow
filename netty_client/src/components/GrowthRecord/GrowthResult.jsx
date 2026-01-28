import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';
import useHistory from '../../hooks/useHistory';
import LoadingButton from '../Common/LoadingButton';
import AutoResizeTextarea from '../Common/AutoResizeTextarea';

function GrowthResult({ plan, onUpdate }) {
    const { state: localPlan, set: setLocalPlan, undo, redo, canUndo, canRedo, clearHistory } = useHistory(plan);
    const [lastSavedPlan, setLastSavedPlan] = useState(plan);
    const localPlanRef = useRef(plan);
    const containerRef = useRef(null);

    useEffect(() => {
        localPlanRef.current = localPlan;
    }, [localPlan]);

    // Initial load sync
    useEffect(() => {
        if (plan) {
            setLocalPlan(plan);
            setLastSavedPlan(plan);
            clearHistory();
        }
    }, [plan?._id, setLocalPlan, clearHistory]);

    // Auto-save every 30 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (JSON.stringify(localPlanRef.current) !== JSON.stringify(lastSavedPlan)) {
                console.log("Auto-saving Growth Result...");
                onUpdate(localPlanRef.current);
                setLastSavedPlan(localPlanRef.current);
            }
        }, 30000);

        return () => clearInterval(intervalId);
    }, [lastSavedPlan, onUpdate]);

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

    const handleOutcomeChange = (itemIndex, value) => {
        setLocalPlan(prevPlan => {
            const newItems = [...prevPlan.items];
            newItems[itemIndex] = { ...newItems[itemIndex], outcome: value };
            return { ...prevPlan, items: newItems };
        }, true); // Debounce text
    };

    const handleDraftAI = async (itemIndex) => {
        try {
            const item = localPlan.items[itemIndex];
            // Collect all activity IDs and contents
            const activityIds = item.activities.map(a => a._id);
            const activityContent = item.activities.map(a => a.content).join(', ');

            const response = await fetch('http://localhost:5000/api/ai/draft/yearly-result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: plan.userId,
                    year: plan.year,
                    activityContent: activityContent,
                    activityIds: activityIds
                })
            });

            if (!response.ok) {
                throw new Error('AI drafting failed');
            }

            const data = await response.json();
            if (data.draft) {
                handleOutcomeChange(itemIndex, data.draft);
            }
        } catch (error) {
            console.error('AI Draft Error:', error);
            alert('AI 초안 작성에 실패했습니다.');
        }
    };

    const handleSave = () => {
        onUpdate(localPlan);
        setLastSavedPlan(localPlan);
    };

    if (!localPlan) return null;

    return (
        <div className="growth-content" ref={containerRef}>
            <div className="growth-section">
                <div className="growth-section__header">
                    <h2 className="growth-section__title">연 결과보고서</h2>
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
                    </div>
                </div>

                <div className="growth-items growth-items--vertical">
                    {localPlan.items.map((item, itemIndex) => {
                        // Soft Delete Logic for Items
                        if (item.isDeleted) {
                            // In Yearly Result, we might want to show deleted items if they have outcomes recorded?
                            // For consistency with Monthly Analysis, let's check if there's any outcome content.
                            const hasOutcome = item.activities.some(a => a.outcome && a.outcome.trim() !== '');
                            if (!hasOutcome) return null;
                        }

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

                                <div className="growth-activities-log" style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                                    {item.activities.map((activity, activityIndex) => {
                                        // Soft Delete Logic for Activities
                                        if (activity.isDeleted) return null;

                                        return (
                                            <div key={activity._id || activityIndex} className="growth-activity-log-row" style={{ flex: 1, width: 0 }}>
                                                <div className="growth-activity-content">
                                                    <span className="growth-activity-badge">활동 {activityIndex + 1}</span>
                                                    <p>{activity.content}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="growth-log-input-wrapper" style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <label style={{ margin: 0, fontWeight: 600, color: '#333' }}>성장 활동성과 (이뤄낸 일)</label>
                                        <LoadingButton
                                            className="growth-btn growth-btn--ai"
                                            onClick={() => handleDraftAI(itemIndex)}
                                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', background: '#e0e7ff', color: '#4f46e5' }}
                                        />
                                    </div>
                                    <AutoResizeTextarea
                                        className="growth-textarea"
                                        value={item.outcome || ''}
                                        onChange={(e) => handleOutcomeChange(itemIndex, e.target.value)}
                                        placeholder="1년 동안의 성과를 종합적으로 기록해주세요"
                                        minHeight="120px"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default GrowthResult;

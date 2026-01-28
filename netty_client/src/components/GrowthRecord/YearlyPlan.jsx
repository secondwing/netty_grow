import React, { useState, useEffect, useRef } from 'react';
import useHistory from '../../hooks/useHistory';

function YearlyPlan({ plan, onUpdate }) {
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
                console.log("Auto-saving Yearly Plan...");
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

    const handleItemChange = (index, field, value) => {
        setLocalPlan(prevPlan => {
            const newItems = [...prevPlan.items];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prevPlan, items: newItems };
        }, true); // Debounce text
    };

    const handleActivityChange = (itemIndex, activityIndex, value) => {
        setLocalPlan(prevPlan => {
            const newItems = [...prevPlan.items];
            newItems[itemIndex] = { ...newItems[itemIndex] };
            newItems[itemIndex].activities = [...newItems[itemIndex].activities];
            newItems[itemIndex].activities[activityIndex] = {
                ...newItems[itemIndex].activities[activityIndex],
                content: value
            };
            return { ...prevPlan, items: newItems };
        }, true); // Debounce text
    };

    const handleAddItem = () => {
        // Count only non-deleted items
        const activeItemsCount = localPlan.items.filter(item => !item.isDeleted).length;

        if (activeItemsCount >= 3) {
            alert('성장 목표는 최대 3개까지만 등록할 수 있습니다.');
            return;
        }
        const newItem = {
            desiredSelf: '',
            goal: '',
            motivation: '',
            activities: [{ content: '', outcome: '' }, { content: '', outcome: '' }, { content: '', outcome: '' }]
        };
        setLocalPlan({ ...localPlan, items: [...localPlan.items, newItem] });
    };

    const handleRemoveItem = (index) => {
        const newItems = [...localPlan.items];
        // Soft delete: set isDeleted to true
        newItems[index].isDeleted = true;
        newItems[index].deletedAt = new Date();
        setLocalPlan({ ...localPlan, items: newItems });
    };

    const handleAddActivity = (itemIndex) => {
        const newItems = [...localPlan.items];
        newItems[itemIndex].activities.push({ content: '', outcome: '' });
        setLocalPlan({ ...localPlan, items: newItems });
    };

    const handleRemoveActivity = (itemIndex, activityIndex) => {
        const newItems = [...localPlan.items];
        // Soft delete: set isDeleted to true
        newItems[itemIndex].activities[activityIndex].isDeleted = true;
        newItems[itemIndex].activities[activityIndex].deletedAt = new Date();
        setLocalPlan({ ...localPlan, items: newItems });
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
                    <h2 className="growth-section__title">나의 성장계획</h2>
                    <div className="growth-section__controls">
                        <button
                            className="growth-btn-icon"
                            onClick={undo}
                            disabled={!canUndo}
                            title="실행 취소 (Ctrl+Z)"
                            style={{ marginRight: '0.25rem', opacity: canUndo ? 1 : 0.3 }}
                        >
                            ↩️
                        </button>
                        <button
                            className="growth-btn-icon"
                            onClick={redo}
                            disabled={!canRedo}
                            title="다시 실행 (Ctrl+Y)"
                            style={{ marginRight: '0.5rem', opacity: canRedo ? 1 : 0.3 }}
                        >
                            ↪️
                        </button>
                        <button className="growth-btn growth-btn--save" onClick={handleSave}>
                            저장하기
                        </button>
                    </div>
                </div>

                <div className="growth-items">
                    {localPlan.items.map((item, itemIndex) => {
                        // Hide deleted items in Yearly Plan
                        if (item.isDeleted) return null;

                        // Calculate display index (1-based) excluding deleted items
                        const displayIndex = localPlan.items.slice(0, itemIndex).filter(i => !i.isDeleted).length + 1;

                        return (
                            <div key={item._id || itemIndex} className="growth-item-card">
                                <div className="growth-item-card__header">
                                    <h3>성장 목표 {displayIndex}</h3>
                                    <button
                                        className="growth-btn growth-btn--delete"
                                        onClick={() => handleRemoveItem(itemIndex)}
                                    >
                                        삭제
                                    </button>
                                </div>

                                <div className="growth-form-group">
                                    <label>원하는 나 (가치/방향)</label>
                                    <input
                                        type="text"
                                        className="growth-input"
                                        value={item.desiredSelf}
                                        onChange={(e) => handleItemChange(itemIndex, 'desiredSelf', e.target.value)}
                                        placeholder="예: 건강하고 활기찬 나"
                                    />
                                </div>

                                <div className="growth-form-group">
                                    <label>성장목표 (하고 싶은 일)</label>
                                    <input
                                        type="text"
                                        className="growth-input"
                                        value={item.goal}
                                        onChange={(e) => handleItemChange(itemIndex, 'goal', e.target.value)}
                                        placeholder="예: 체지방 15% 달성"
                                    />
                                </div>

                                <div className="growth-form-group">
                                    <label>성장활동 (필요한 일)</label>
                                    <div className="growth-activities-list">
                                        {item.activities.map((activity, activityIndex) => {
                                            // Hide deleted activities in Yearly Plan
                                            if (activity.isDeleted) return null;

                                            return (
                                                <div key={activity._id || activityIndex} className="growth-activity-row">
                                                    <input
                                                        type="text"
                                                        className="growth-input"
                                                        value={activity.content}
                                                        onChange={(e) => handleActivityChange(itemIndex, activityIndex, e.target.value)}
                                                        placeholder="구체적인 활동 내용"
                                                    />
                                                    <button
                                                        className="growth-btn-icon"
                                                        onClick={() => handleRemoveActivity(itemIndex, activityIndex)}
                                                        title="활동 삭제"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            );
                                        })}
                                        <button
                                            className="growth-btn growth-btn--add-sub"
                                            onClick={() => handleAddActivity(itemIndex)}
                                        >
                                            + 활동 추가
                                        </button>
                                    </div>
                                </div>

                                <div className="growth-form-group">
                                    <label>성장동기 (하고 싶은 이유)</label>
                                    <textarea
                                        className="growth-textarea"
                                        value={item.motivation}
                                        onChange={(e) => handleItemChange(itemIndex, 'motivation', e.target.value)}
                                        placeholder="이 목표를 달성하고 싶은 이유를 적어주세요"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="growth-actions">
                    {localPlan.items.filter(item => !item.isDeleted).length < 3 && (
                        <button className="growth-btn growth-btn--add" onClick={handleAddItem}>
                            + 성장 목표 추가
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default YearlyPlan;

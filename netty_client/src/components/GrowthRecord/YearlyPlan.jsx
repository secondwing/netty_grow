import React, { useState, useEffect } from 'react';

function YearlyPlan({ plan, onUpdate }) {
    const [localPlan, setLocalPlan] = useState(plan);

    useEffect(() => {
        setLocalPlan(plan);
    }, [plan]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...localPlan.items];
        newItems[index][field] = value;
        setLocalPlan({ ...localPlan, items: newItems });
    };

    const handleActivityChange = (itemIndex, activityIndex, value) => {
        const newItems = [...localPlan.items];
        newItems[itemIndex].activities[activityIndex].content = value;
        setLocalPlan({ ...localPlan, items: newItems });
    };

    const handleAddItem = () => {
        const newItem = {
            desiredSelf: '',
            goal: '',
            motivation: '',
            activities: [{ content: '', outcome: '' }, { content: '', outcome: '' }, { content: '', outcome: '' }]
        };
        setLocalPlan({ ...localPlan, items: [...localPlan.items, newItem] });
    };

    const handleRemoveItem = (index) => {
        const newItems = localPlan.items.filter((_, i) => i !== index);
        setLocalPlan({ ...localPlan, items: newItems });
    };

    const handleAddActivity = (itemIndex) => {
        const newItems = [...localPlan.items];
        newItems[itemIndex].activities.push({ content: '', outcome: '' });
        setLocalPlan({ ...localPlan, items: newItems });
    };

    const handleRemoveActivity = (itemIndex, activityIndex) => {
        const newItems = [...localPlan.items];
        newItems[itemIndex].activities = newItems[itemIndex].activities.filter((_, i) => i !== activityIndex);
        setLocalPlan({ ...localPlan, items: newItems });
    };

    const handleSave = () => {
        onUpdate(localPlan);
    };

    if (!localPlan) return null;

    return (
        <div className="growth-content">
            <div className="growth-section">
                <div className="growth-section__header">
                    <h2 className="growth-section__title">나의 성장계획</h2>
                    <button className="growth-btn growth-btn--save" onClick={handleSave}>
                        저장하기
                    </button>
                </div>

                <div className="growth-items">
                    {localPlan.items.map((item, itemIndex) => (
                        <div key={item._id || itemIndex} className="growth-item-card">
                            <div className="growth-item-card__header">
                                <h3>성장 목표 {itemIndex + 1}</h3>
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
                                    {item.activities.map((activity, activityIndex) => (
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
                                    ))}
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
                    ))}
                </div>

                <div className="growth-actions">
                    <button className="growth-btn growth-btn--add" onClick={handleAddItem}>
                        + 성장 목표 추가
                    </button>
                </div>
            </div>
        </div>
    );
}

export default YearlyPlan;

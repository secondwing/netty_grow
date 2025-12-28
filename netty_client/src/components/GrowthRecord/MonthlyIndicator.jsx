import React, { useState, useEffect } from 'react';
import './GrowthRecord.css';

function MonthlyIndicator({ plan, log, month, onUpdateLog }) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (log && log.tasks) {
            setTasks(log.tasks);
        } else if (plan && plan.goals) {
            // Auto-fill from yearly goals if log is empty
            const initialTasks = plan.goals.map(g => ({
                content: g.action || '',
                isCompleted: false,
                log: ''
            })).filter(t => t.content); // Only add if action exists
            setTasks(initialTasks);
        }
    }, [log, plan]);

    const handleTaskChange = (index, field, value) => {
        const newTasks = [...tasks];
        newTasks[index] = { ...newTasks[index], [field]: value };
        setTasks(newTasks);
    };

    const handleAddTask = () => {
        setTasks([...tasks, { content: '', isCompleted: false, log: '' }]);
    };

    const handleRemoveTask = (index) => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
    };

    const handleSave = () => {
        onUpdateLog({ tasks });
    };

    return (
        <div className="growth-section">
            <h2 className="growth-section__title">{month}월 성장지표</h2>
            <p className="growth-section__desc">성장계획에서 작성한 내용이 자동 기입됩니다. 수정 가능합니다.</p>

            <div className="growth-card">
                <div className="monthly-tasks">
                    {tasks.map((task, index) => (
                        <div key={index} className={`monthly-task-item ${task.isCompleted ? 'monthly-task-item--completed' : 'monthly-task-item--incomplete'}`}>
                            <div className="monthly-task-item__header">
                                <input
                                    type="checkbox"
                                    checked={task.isCompleted}
                                    onChange={(e) => handleTaskChange(index, 'isCompleted', e.target.checked)}
                                    className="monthly-task-checkbox"
                                />
                                <input
                                    type="text"
                                    className="growth-input monthly-task-content"
                                    placeholder="활동 내용 (예: 모임 가입하기)"
                                    value={task.content}
                                    onChange={(e) => handleTaskChange(index, 'content', e.target.value)}
                                />
                                <button className="growth-btn-icon" onClick={() => handleRemoveTask(index)}>×</button>
                            </div>
                            <textarea
                                className="growth-textarea monthly-task-log"
                                placeholder="활동 일지 (달성/미달성 사유 등)"
                                value={task.log}
                                onChange={(e) => handleTaskChange(index, 'log', e.target.value)}
                            />
                        </div>
                    ))}
                </div>
                <button className="growth-btn growth-btn--add" onClick={handleAddTask}>
                    + 활동 추가
                </button>
            </div>

            <button className="growth-btn growth-btn--save" onClick={handleSave}>
                저장하기
            </button>
        </div>
    );
}

export default MonthlyIndicator;

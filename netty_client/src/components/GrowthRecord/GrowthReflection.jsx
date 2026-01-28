import React, { useState, useEffect, useRef } from 'react';
import UnicodePicker from './UnicodePicker';
import { RotateCcw, RotateCw } from 'lucide-react';
import useHistory from '../../hooks/useHistory';

function GrowthReflection({ plan, onUpdate }) {
    const { state: localPlan, set: setLocalPlan, undo, redo, canUndo, canRedo, clearHistory } = useHistory(plan);
    const [lastSavedPlan, setLastSavedPlan] = useState(plan);
    const textareaRef = useRef(null);
    const localPlanRef = useRef(plan);
    const containerRef = useRef(null);

    // Sync localPlan to ref for auto-save interval
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
                console.log("Auto-saving Growth Reflection...");
                onUpdate(localPlanRef.current);
                // Note: We do NOT update lastSavedPlan here.
                // This ensures that if the user clicks "Save", we know it's a manual save.
                // Actually, for auto-save to not trigger repeatedly on the same change, we SHOULD update lastSavedPlan?
                // Wait, if we update lastSavedPlan, then we lose the "manual save point" concept?
                // The user asked for "Undo" (Ctrl+Z).
                // Auto-save is just background persistence.
                // If we don't update lastSavedPlan, the interval will fire every 30s for the SAME change.
                // That's inefficient but safe.
                // Better: Update lastSavedPlan to avoid redundant network calls.
                // But "Undo" is local history. It doesn't care about lastSavedPlan.
                // So updating lastSavedPlan is fine for efficiency.
                setLastSavedPlan(localPlanRef.current);
            }
        }, 30000);

        return () => clearInterval(intervalId);
    }, [lastSavedPlan, onUpdate]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Only trigger if focus is within this component
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

    const handleReflectionChange = (field, value) => {
        setLocalPlan(prevPlan => ({
            ...prevPlan,
            reflection: {
                ...prevPlan.reflection,
                [field]: value
            }
        }), true); // Debounce text inputs
    };

    const handleSave = () => {
        onUpdate(localPlan);
        setLastSavedPlan(localPlan);
    };

    const handleInsertChar = (char) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = localPlan.reflection?.detail || '';
            const newText = text.substring(0, start) + char + text.substring(end);

            handleReflectionChange('detail', newText);

            // Restore cursor position and focus
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + char.length, start + char.length);
            }, 0);
        }
    };

    if (!localPlan) return null;

    return (
        <div className="growth-content" ref={containerRef}>
            <div className="growth-section">
                <div className="growth-section__header">
                    <h2 className="growth-section__title">나의 성장소감</h2>
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

                <div className="growth-reflection-container">
                    <div className="growth-form-group">
                        <label>{localPlan.year}년 한 문장 요약</label>
                        <input
                            type="text"
                            className="growth-input growth-input--large"
                            value={localPlan.reflection?.summary || ''}
                            onChange={(e) => handleReflectionChange('summary', e.target.value)}
                            placeholder="올해를 한 문장으로 표현한다면?"
                        />
                    </div>

                    <div className="growth-form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ margin: 0 }}>본문</label>
                            <UnicodePicker onInsert={handleInsertChar} />
                        </div>
                        <textarea
                            ref={textareaRef}
                            className="growth-textarea"
                            value={localPlan.reflection?.detail || ''}
                            onChange={(e) => handleReflectionChange('detail', e.target.value)}
                            placeholder="성장 소감을 자유롭게 작성해주세요."
                            rows={20}
                            style={{
                                width: '100%',
                                lineHeight: '1.6',
                                fontSize: '1rem',
                                minHeight: '400px',
                                resize: 'vertical'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GrowthReflection;

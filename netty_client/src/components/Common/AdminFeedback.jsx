import React, { useState } from 'react';
import { MessageSquare, Edit2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import './AdminFeedback.css';

function AdminFeedback({ feedback, onSave, canEdit, label = "관리자 피드백" }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [isExpanded, setIsExpanded] = useState(!!feedback?.content);

    const handleEditClick = () => {
        setEditContent(feedback?.content || '');
        setIsEditing(true);
        setIsExpanded(true);
    };

    const handleSave = () => {
        onSave(editContent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };



    return (
        <div className={`admin-feedback ${isExpanded ? 'expanded' : ''}`}>
            <div className="admin-feedback__header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="admin-feedback__title">
                    <MessageSquare size={18} />
                    <span>{label}</span>
                    {feedback?.author && <span className="admin-feedback__author">- {feedback.author}</span>}
                </div>
                <div className="admin-feedback__actions" onClick={(e) => e.stopPropagation()}>
                    {canEdit && !isEditing && (
                        <button className="admin-feedback__btn" onClick={handleEditClick} title="피드백 작성/수정">
                            <Edit2 size={16} />
                        </button>
                    )}
                    {isExpanded ? <ChevronUp size={18} className="toggle-icon" /> : <ChevronDown size={18} className="toggle-icon" />}
                </div>
            </div>

            {isExpanded && (
                <div className="admin-feedback__body">
                    {isEditing ? (
                        <div className="admin-feedback__editor">
                            <textarea
                                className="admin-feedback__textarea"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                placeholder="피드백을 입력하세요..."
                            />
                            <div className="admin-feedback__editor-actions">
                                <button className="admin-feedback__btn--save" onClick={handleSave}>
                                    <Check size={16} /> 저장
                                </button>
                                <button className="admin-feedback__btn--cancel" onClick={handleCancel}>
                                    <X size={16} /> 취소
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="admin-feedback__content">
                            {feedback?.content ? (
                                <div className="admin-feedback__text">{feedback.content}</div>
                            ) : (
                                <div className="admin-feedback__empty">등록된 피드백이 없습니다.</div>
                            )}
                            {feedback?.updatedAt && (
                                <p className="admin-feedback__date">
                                    {new Date(feedback.updatedAt).toLocaleDateString()} 수정됨
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminFeedback;

import { useState } from 'react';
import './DailyRecordList.css';

function DailyRecordList({ date, records, onUpdateRecord, onDeleteRecord }) {
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const formattedDate = date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });

    const handleEditClick = (record) => {
        setEditingId(record._id);
        setEditContent(record.content);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditContent('');
    };

    const handleSaveEdit = async (recordId) => {
        if (!editContent.trim()) return;
        await onUpdateRecord(recordId, editContent);
        setEditingId(null);
        setEditContent('');
    };

    const handleDeleteClick = async (recordId) => {
        if (window.confirm('정말로 이 기록을 삭제하시겠습니까?')) {
            await onDeleteRecord(recordId);
        }
    };

    if (!records || records.length === 0) {
        return (
            <div className="daily-record-list daily-record-list--empty">
                <h3 className="daily-record-list__date">{formattedDate}</h3>
                <p>기록이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="daily-record-list">
            <h3 className="daily-record-list__date">{formattedDate} ({records.length})</h3>
            <div className="daily-record-list__items">
                {records.map((record) => (
                    <div key={record._id} className="daily-record-list__card">
                        <div className="daily-record-list__header">
                            <div className="daily-record-list__time">
                                {new Date(record.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="daily-record-list__actions">
                                {editingId === record._id ? (
                                    <>
                                        <button onClick={() => handleSaveEdit(record._id)} className="daily-record-list__action-btn daily-record-list__action-btn--save">저장</button>
                                        <button onClick={handleCancelEdit} className="daily-record-list__action-btn daily-record-list__action-btn--cancel">취소</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEditClick(record)} className="daily-record-list__action-btn daily-record-list__action-btn--edit">수정</button>
                                        <button onClick={() => handleDeleteClick(record._id)} className="daily-record-list__action-btn daily-record-list__action-btn--delete">삭제</button>
                                    </>
                                )}
                            </div>
                        </div>

                        {editingId === record._id ? (
                            <textarea
                                className="daily-record-list__edit-textarea"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                        ) : (
                            <p className="daily-record-list__content">{record.content}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DailyRecordList;

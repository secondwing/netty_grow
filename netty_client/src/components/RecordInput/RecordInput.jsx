import { useState } from 'react';
import './RecordInput.css';

function RecordInput({ onRecordCreated }) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:5000/api/records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    content,
                    date: new Date().toISOString() // Ensure date is sent if needed by backend, though backend defaults to now
                }),
            });

            if (response.ok) {
                const newRecord = await response.json();
                onRecordCreated(newRecord);
                setContent('');
            } else {
                console.error('Failed to create record');
            }
        } catch (error) {
            console.error('Error creating record:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="record-input">
            <h2 className="record-input__title">오늘의 기록</h2>
            <form className="record-input__form" onSubmit={handleSubmit}>
                <textarea
                    className="record-input__textarea"
                    placeholder="오늘 하루는 어땠나요? 자유롭게 기록해보세요."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isSubmitting}
                />
                <button
                    type="submit"
                    className="record-input__button"
                    disabled={isSubmitting || !content.trim()}
                >
                    {isSubmitting ? '저장 중...' : '기록하기'}
                </button>
            </form>
        </div>
    );
}

export default RecordInput;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

function PostForm({ onPostCreated, onPostUpdated, onCancel, editingPost }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (editingPost) {
            setTitle(editingPost.title);
            setContent(editingPost.content);
        }
    }, [editingPost]);

    const { showNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPost) {
                const res = await axios.put(`http://localhost:5000/api/posts/${editingPost._id}`,
                    { title, content },
                    { withCredentials: true }
                );
                onPostUpdated(res.data);
                showNotification('게시글이 수정되었습니다.', 'success');
            } else {
                const res = await axios.post('http://localhost:5000/api/posts',
                    { title, content },
                    { withCredentials: true }
                );
                onPostCreated(res.data);
                showNotification('게시글이 등록되었습니다.', 'success');
            }
        } catch (err) {
            console.error('Error saving post:', err);
            showNotification('저장 중 오류가 발생했습니다. 로그인이 필요할 수 있습니다.', 'error');
        }
    };

    return (
        <form className="post-form" onSubmit={handleSubmit}>
            <div className="post-form__group">
                <label className="post-form__label">제목</label>
                <input
                    type="text"
                    className="post-form__input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="제목을 입력하세요"
                />
            </div>
            <div className="post-form__group">
                <label className="post-form__label">내용</label>
                <textarea
                    className="post-form__textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder="내용을 입력하세요"
                />
            </div>
            <div className="post-form__actions">
                <button
                    type="button"
                    className="post-form__btn post-form__btn--cancel"
                    onClick={onCancel}
                >
                    취소
                </button>
                <button
                    type="submit"
                    className="post-form__btn post-form__btn--submit"
                >
                    {editingPost ? '수정하기' : '등록하기'}
                </button>
            </div>
        </form>
    );
}

export default PostForm;

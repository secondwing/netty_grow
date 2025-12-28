import React from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

function PostList({ posts, onEdit, onDelete }) {
    const { showNotification } = useNotification();

    const handleDelete = async (postId) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
                    withCredentials: true
                });
                onDelete(postId);
                showNotification('게시글이 삭제되었습니다.', 'success');
            } catch (err) {
                console.error('Error deleting post:', err);
                showNotification('삭제 권한이 없거나 오류가 발생했습니다.', 'error');
            }
        }
    };

    return (
        <div className="post-list">
            {posts.map(post => (
                <div key={post._id} className="post-item">
                    <div className="post-item__header">
                        <h3 className="post-item__title">{post.title}</h3>
                        <div className="post-item__meta">
                            <span>{post.author?.name || '익명'}</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="post-item__content">{post.content}</div>
                    <div className="post-item__actions">
                        <button
                            className="post-item__btn"
                            onClick={() => onEdit(post)}
                        >
                            수정
                        </button>
                        <button
                            className="post-item__btn post-item__btn--delete"
                            onClick={() => handleDelete(post._id)}
                        >
                            삭제
                        </button>
                    </div>
                </div>
            ))}
            {posts.length === 0 && (
                <div className="post-list__empty">
                    <p>아직 작성된 글이 없습니다.</p>
                </div>
            )}
        </div>
    );
}

export default PostList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostList from '../../components/Board/PostList';
import PostForm from '../../components/Board/PostForm';
import './BoardPage.css';

function BoardPage() {
    const [posts, setPosts] = useState([]);
    const [isWriting, setIsWriting] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/posts');
            setPosts(res.data);
        } catch (err) {
            console.error('Error fetching posts:', err);
        }
    };

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts]);
        setIsWriting(false);
    };

    const handlePostUpdated = (updatedPost) => {
        setPosts(posts.map(post => post._id === updatedPost._id ? updatedPost : post));
        setEditingPost(null);
        setIsWriting(false);
    };

    const handlePostDeleted = (postId) => {
        setPosts(posts.filter(post => post._id !== postId));
    };

    const handleEditClick = (post) => {
        setEditingPost(post);
        setIsWriting(true);
    };

    const handleCancelWrite = () => {
        setIsWriting(false);
        setEditingPost(null);
    };

    return (
        <div className="board-page">
            <div className="board__header">
                <div>
                    <h2 className="board__title">게시판</h2>
                    <p className="board__description">자유롭게 이야기를 나누어 보세요.</p>
                </div>
                {!isWriting && (
                    <button
                        className="board__write-btn"
                        onClick={() => setIsWriting(true)}
                    >
                        글쓰기
                    </button>
                )}
            </div>

            {isWriting ? (
                <PostForm
                    onPostCreated={handlePostCreated}
                    onPostUpdated={handlePostUpdated}
                    onCancel={handleCancelWrite}
                    editingPost={editingPost}
                />
            ) : (
                <PostList
                    posts={posts}
                    onEdit={handleEditClick}
                    onDelete={handlePostDeleted}
                />
            )}
        </div>
    );
}

export default BoardPage;

import React, { useState, useEffect } from 'react';
import './MyPage.css';

const MyPage = ({ currentUser }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        gender: '',
        birthDate: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (currentUser) {
            fetchUserInfo();
        }
    }, [currentUser]);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/auth/user/${currentUser}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }
            const data = await response.json();
            setUserInfo(data);
            setFormData({
                name: data.name,
                phone: data.phone,
                gender: data.gender,
                birthDate: data.birthDate ? data.birthDate.split('T')[0] : ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/auth/user/${currentUser}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedUser = await response.json();
            setUserInfo(updatedUser);
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: userInfo.name,
            phone: userInfo.phone,
            gender: userInfo.gender,
            birthDate: userInfo.birthDate ? userInfo.birthDate.split('T')[0] : ''
        });
    };

    if (loading) return <div className="my-page__loading">Loading...</div>;
    if (error) return <div className="my-page__error">Error: {error}</div>;

    return (
        <div className="my-page">
            <div className="my-page__container">
                <h2 className="my-page__title">마이 페이지</h2>

                <div className="my-page__card">
                    <div className="my-page__header">
                        <div className="my-page__avatar">
                            {userInfo?.name ? userInfo.name[0] : 'U'}
                        </div>
                        <div className="my-page__identity">
                            <h3 className="my-page__name">{userInfo?.name}</h3>
                            <span className="my-page__username">@{userInfo?.username}</span>
                        </div>
                    </div>

                    <div className="my-page__content">
                        {isEditing ? (
                            <form className="my-page__form" onSubmit={handleSubmit}>
                                <div className="my-page__field">
                                    <label>이름</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="my-page__input"
                                    />
                                </div>
                                <div className="my-page__field">
                                    <label>전화번호</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="my-page__input"
                                    />
                                </div>
                                <div className="my-page__field">
                                    <label>성별</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="my-page__input"
                                    >
                                        <option value="male">남성</option>
                                        <option value="female">여성</option>
                                    </select>
                                </div>
                                <div className="my-page__field">
                                    <label>생년월일</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="my-page__input"
                                    />
                                </div>

                                <div className="my-page__actions">
                                    <button type="button" className="my-page__button my-page__button--cancel" onClick={handleCancel}>
                                        취소
                                    </button>
                                    <button type="submit" className="my-page__button my-page__button--save">
                                        저장
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="my-page__info">
                                <div className="my-page__row">
                                    <span className="my-page__label">이름</span>
                                    <span className="my-page__value">{userInfo?.name}</span>
                                </div>
                                <div className="my-page__row">
                                    <span className="my-page__label">전화번호</span>
                                    <span className="my-page__value">{userInfo?.phone}</span>
                                </div>
                                <div className="my-page__row">
                                    <span className="my-page__label">성별</span>
                                    <span className="my-page__value">
                                        {userInfo?.gender === 'male' ? '남성' : '여성'}
                                    </span>
                                </div>
                                <div className="my-page__row">
                                    <span className="my-page__label">생년월일</span>
                                    <span className="my-page__value">
                                        {userInfo?.birthDate ? new Date(userInfo.birthDate).toLocaleDateString() : '-'}
                                    </span>
                                </div>

                                <button className="my-page__button my-page__button--edit" onClick={() => setIsEditing(true)}>
                                    프로필 수정
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;

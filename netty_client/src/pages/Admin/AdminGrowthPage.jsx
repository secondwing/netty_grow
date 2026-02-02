import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import '../../components/Admin/Admin.css'; // Reuse admin styles

const AdminGrowthPage = () => {
    // Users state
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [usersPage, setUsersPage] = useState(1);
    const [usersTotalPages, setUsersTotalPages] = useState(1);
    const [editingUserGrowth, setEditingUserGrowth] = useState(null); // userId being edited
    const [selectedGrowthStage, setSelectedGrowthStage] = useState('');

    useEffect(() => {
        fetchUsers(usersPage);
    }, [usersPage]);

    // --- User Logic ---
    const fetchUsers = async (page) => {
        setLoadingUsers(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/users?page=${page}&limit=10`, { withCredentials: true });
            setUsers(response.data.users);
            setUsersTotalPages(response.data.totalPages);
            setLoadingUsers(false);
        } catch (error) {
            console.error('Failed to fetch users', error);
            setLoadingUsers(false);
        }
    };

    const handleEditUserGrowthClick = (user) => {
        setEditingUserGrowth(user._id);
        setSelectedGrowthStage(user.growthStage || 'growth_01');
    };

    const handleCancelUserEdit = () => {
        setEditingUserGrowth(null);
        setSelectedGrowthStage('');
    };

    const handleSaveUserGrowth = async (userId) => {
        try {
            await axios.put(`${API_BASE_URL}/api/admin/users/${userId}/growth-stage`, {
                growthStage: selectedGrowthStage
            }, { withCredentials: true });

            alert('사용자 등급이 수정되었습니다.');
            setEditingUserGrowth(null);
            fetchUsers(usersPage);
        } catch (error) {
            console.error('Failed to update user growth', error);
            alert('수정 실패');
        }
    };

    const handleUserPageChange = (newPage) => {
        if (newPage >= 1 && newPage <= usersTotalPages) {
            setUsersPage(newPage);
        }
    };

    // Hardcoded stages for display as requested
    const STAGE_OPTIONS = [
        { id: 'growth_01', label: '1단계' },
        { id: 'growth_02', label: '2단계' },
        { id: 'growth_03', label: '3단계' },
        { id: 'growth_04', label: '4단계' },
        { id: 'growth_05', label: '5단계' },
        { id: 'growth_06', label: '6단계' },
    ];

    const getStageLabel = (stageId) => {
        const stage = STAGE_OPTIONS.find(s => s.id === stageId);
        return stage ? stage.label : stageId;
    };

    return (
        <div className="admin-page">
            <h2 className="admin-page-title">성장 도감 관리</h2>
            <div className="admin-card">
                <p className="admin-desc">
                    사용자별 성장 등급 현황을 조회하고 관리합니다.
                </p>
                {loadingUsers ? <div>로딩 중...</div> : (
                    <>
                        <div className="table-container">
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th>사용자 정보</th>
                                        <th>한 줄 소개</th>
                                        <th style={{ width: '150px' }}>현재 등급</th>
                                        <th style={{ width: '80px' }}>관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{user.name}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{user.username}</div>
                                            </td>
                                            <td>
                                                <div style={{ color: '#475569', fontSize: '0.9rem' }}>
                                                    {user.description || '-'}
                                                </div>
                                            </td>
                                            <td>
                                                {editingUserGrowth === user._id ? (
                                                    <select
                                                        value={selectedGrowthStage}
                                                        onChange={(e) => setSelectedGrowthStage(e.target.value)}
                                                        className="admin-select"
                                                        style={{ width: '100%' }}
                                                    >
                                                        {STAGE_OPTIONS.map(s => (
                                                            <option key={s.id} value={s.id}>
                                                                {s.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <div className="status-badge info" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                                                        {getStageLabel(user.growthStage || 'growth_01')}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {editingUserGrowth === user._id ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                        <button onClick={() => handleSaveUserGrowth(user._id)} className="admin-btn-small" style={{ backgroundColor: '#10b981' }}>저장</button>
                                                        <button onClick={handleCancelUserEdit} className="admin-btn-small" style={{ backgroundColor: '#ef4444' }}>취소</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => handleEditUserGrowthClick(user)} className="admin-btn-small">수정</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination (Simple) */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                            <button
                                onClick={() => handleUserPageChange(usersPage - 1)}
                                disabled={usersPage === 1}
                                className="admin-btn-small"
                                style={{ backgroundColor: usersPage === 1 ? '#cbd5e1' : '#64748b' }}
                            >
                                이전
                            </button>
                            <span style={{ alignSelf: 'center' }}> {usersPage} / {usersTotalPages} </span>
                            <button
                                onClick={() => handleUserPageChange(usersPage + 1)}
                                disabled={usersPage === usersTotalPages}
                                className="admin-btn-small"
                                style={{ backgroundColor: usersPage === usersTotalPages ? '#cbd5e1' : '#64748b' }}
                            >
                                다음
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminGrowthPage;

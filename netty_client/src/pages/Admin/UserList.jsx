import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { AuthContext } from '../../contexts/AuthContext';

const growthStageMap = {
    'growth_01': '땅',
    'growth_02': '씨앗',
    'growth_03': '새싹',
    'growth_04': '꽃',
    'growth_05': '꽃다발',
    'growth_06': '정원'
};

const UserList = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/admin/users?page=${page}`, {
                    withCredentials: true
                });
                setUsers(response.data.users);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [page]);

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`사용자의 권한을 변경하시겠습니까?`)) return;

        try {
            const response = await axios.put(`${API_BASE_URL}/api/admin/users/${userId}/role`,
                { role: newRole },
                { withCredentials: true }
            );

            setUsers(users.map(user =>
                user._id === userId ? { ...user, role: response.data.role } : user
            ));
        } catch (error) {
            console.error('Failed to update user role:', error);
            alert('권한 변경에 실패했습니다.');
        }
    };

    const handleGrowthStageChange = async (userId, newStage) => {
        if (!window.confirm(`사용자의 성장 단계를 변경하시겠습니까?`)) return;

        try {
            const response = await axios.put(`${API_BASE_URL}/api/admin/users/${userId}/growth-stage`,
                { growthStage: newStage },
                { withCredentials: true }
            );

            setUsers(users.map(user =>
                user._id === userId ? { ...user, growthStage: response.data.growthStage } : user
            ));
        } catch (error) {
            console.error('Failed to update growth stage:', error);
            alert('성장 단계 변경에 실패했습니다.');
        }
    };

    const handleInspectionChange = async (userId, newStatus) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/admin/users/${userId}/inspection`,
                { inspectionStatus: newStatus },
                { withCredentials: true }
            );

            setUsers(users.map(user =>
                user._id === userId ? { ...user, inspectionStatus: response.data.inspectionStatus } : user
            ));
        } catch (error) {
            console.error('Failed to update inspection status:', error);
            alert('점검 상태 변경에 실패했습니다.');
        }
    };

    if (loading) return <div>사용자 목록 불러오는 중...</div>;

    return (
        <div className="user-list-page">
            <h2 className="admin-page-title">사용자 관리</h2>

            <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>아이디</th>
                            <th>이름</th>
                            <th>별칭</th>
                            <th>권한</th>
                            <th>나성장</th>
                            <th>성장도감</th>
                            <th>성장기록</th>
                            <th>피드백</th>
                            <th>점검</th>
                            <th>참여활동</th>
                            <th>가입일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.name}</td>
                                <td>{user.nickname}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        className={`role-select ${user.role}`}
                                        disabled={currentUser && currentUser._id === user._id}
                                        title={currentUser && currentUser._id === user._id ? "자신의 권한은 변경할 수 없습니다." : "권한 변경"}
                                    >
                                        <option value="guest">게스트</option>
                                        <option value="member">멤버</option>
                                        <option value="admin">관리자</option>
                                    </select>
                                </td>
                                <td>
                                    <select
                                        value={user.growthStage || 'growth_01'}
                                        onChange={(e) => handleGrowthStageChange(user._id, e.target.value)}
                                        className={`role-select ${user.growthStage || 'growth_01'}`}
                                    >
                                        {Object.entries(growthStageMap).map(([key, value]) => (
                                            <option key={key} value={key}>{value}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <button
                                        className="admin-btn-small"
                                        onClick={() => window.open(`/mypage?username=${user.username}`, '_blank')}
                                    >
                                        성장도감 보기
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="admin-btn-small"
                                        onClick={() => window.location.href = `/admin/user/${user._id}/growth`}
                                    >
                                        관리
                                    </button>
                                </td>
                                <td style={{ textAlign: 'center', fontWeight: 'bold', color: user.feedbackNeeded > 0 ? '#e11d48' : '#6b7280' }}>
                                    {user.feedbackNeeded || 0}
                                </td>
                                <td>
                                    <select
                                        value={user.inspectionStatus || 'pending'}
                                        onChange={(e) => handleInspectionChange(user._id, e.target.value)}
                                        className="role-select"
                                        style={{ backgroundColor: user.inspectionStatus === 'completed' ? '#dcfce7' : '#fef9c3' }}
                                    >
                                        <option value="pending">점검대기</option>
                                        <option value="completed">점검완료</option>
                                    </select>
                                </td>
                                <td style={{ color: '#9ca3af' }}>준비중</td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="page-btn"
                >
                    이전
                </button>
                <span className="page-info">{page} / {totalPages} 페이지</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="page-btn"
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default UserList;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { AuthContext } from '../../contexts/AuthContext';

const affiliationMap = {
    student: '학생',
    job_seeker: '취업준비생',
    worker: '직장인',
    freelancer: '프리랜서',
    entrepreneur: '창업가',
    pre_entrepreneur: '예비창업가'
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
        if (!window.confirm(`사용자의 권한을 ${newRole}(으)로 변경하시겠습니까?`)) return;

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
                            <th>권한</th>
                            <th>소속</th>
                            <th>가입일</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.name}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        className={`role-select ${user.role}`}
                                        disabled={currentUser && currentUser._id === user._id}
                                        title={currentUser && currentUser._id === user._id ? "자신의 권한은 변경할 수 없습니다." : "권한 변경"}
                                    >
                                        <option value="free">Free</option>
                                        <option value="pro">Pro</option>
                                        <option value="ultra">Ultra</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>{affiliationMap[user.affiliation] || user.affiliation}</td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="admin-btn-small"
                                        onClick={() => window.location.href = `/admin/user/${user._id}/growth`}
                                    >
                                        성장기록 보기
                                    </button>
                                </td>
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

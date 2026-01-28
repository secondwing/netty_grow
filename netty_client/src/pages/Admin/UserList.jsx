import React, { useState, useEffect } from 'react';
import axios from 'axios';

const affiliationMap = {
    student: '학생',
    job_seeker: '취업준비생',
    worker: '직장인',
    freelancer: '프리랜서',
    entrepreneur: '창업가',
    pre_entrepreneur: '예비창업가'
};

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/admin/users?page=${page}`, {
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
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.name}</td>
                                <td>
                                    <span className={`role-badge ${user.role}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>{affiliationMap[user.affiliation] || user.affiliation}</td>
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useNotification } from '../../contexts/NotificationContext';
import '../../components/Admin/Admin.css';

const AdminApplicationList = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/application/all`, {
                withCredentials: true
            });
            setApplications(res.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
            showNotification('신청 목록을 불러오는데 실패했습니다.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="admin-page">
            <h2 className="admin-page-title">나성장계발모임 신청 내역</h2>
            <div className="admin-card">
                <p className="admin-desc">
                    신청자들의 상세 정보를 확인하고 관리합니다.
                </p>

                <div className="table-container">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>신청일</th>
                                <th>사용자</th>
                                <th>참여방식</th>
                                <th>납부상태</th>
                                <th>독려모임</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app._id}>
                                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{app.user?.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{app.user?.username}</div>
                                    </td>
                                    <td>
                                        {app.paymentType === '1month' ? '1개월 (5만원)' : '6개월 (25만원)'}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${app.paymentStatus === 'paid' ? 'success' : app.paymentStatus === 'free_event' ? 'info' : 'warning'}`}>
                                            {app.paymentStatus === 'paid' ? '납부완료' : app.paymentStatus === 'free_event' ? '무료혜택' : '미납'}
                                        </span>
                                    </td>
                                    <td>
                                        {app.communityParticipation === 'yes' ? '참여' : app.communityParticipation === 'later' ? '고민중' : '불참'}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${app.status === 'submitted' ? 'info' : app.status === 'approved' ? 'success' : 'error'}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {applications.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>신청 내역이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminApplicationList;

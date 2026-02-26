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

    const handlePaymentStatusChange = async (appId, newStatus) => {
        if (!window.confirm('결제 상태를 변경하시겠습니까?')) return;
        try {
            await axios.put(`${API_BASE_URL}/api/application/${appId}/payment`,
                { paymentStatus: newStatus },
                { withCredentials: true }
            );
            setApplications(applications.map(app =>
                app._id === appId ? { ...app, paymentStatus: newStatus } : app
            ));
            showNotification('결제 상태가 변경되었습니다.', 'success');
        } catch (error) {
            console.error('Error updating payment status:', error);
            showNotification('결제 상태 변경에 실패했습니다.', 'error');
        }
    };

    const handleParticipationChange = async (appId, newStatus) => {
        if (!window.confirm('독려모임 참여 여부를 변경하시겠습니까?')) return;
        try {
            await axios.put(`${API_BASE_URL}/api/application/${appId}/participation`,
                { communityParticipation: newStatus },
                { withCredentials: true }
            );
            setApplications(applications.map(app =>
                app._id === appId ? { ...app, communityParticipation: newStatus } : app
            ));
            showNotification('독려모임 상태가 변경되었습니다.', 'success');
        } catch (error) {
            console.error('Error updating participation:', error);
            showNotification('독려모임 상태 변경에 실패했습니다.', 'error');
        }
    };

    const handleStatusChange = async (appId, newStatus) => {
        if (!window.confirm('신청 상태를 변경하시겠습니까?')) return;
        try {
            await axios.put(`${API_BASE_URL}/api/application/${appId}/status`,
                { status: newStatus },
                { withCredentials: true }
            );
            setApplications(applications.map(app =>
                app._id === appId ? { ...app, status: newStatus } : app
            ));
            showNotification('신청 상태가 변경되었습니다.', 'success');
        } catch (error) {
            console.error('Error updating status:', error);
            showNotification('신청 상태 변경에 실패했습니다.', 'error');
        }
    };

    const handleDelete = async (appId) => {
        if (!window.confirm('이 신청서를 정말 삭제하시겠습니까? 복구할 수 없습니다.')) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/application/${appId}`, {
                withCredentials: true
            });
            setApplications(applications.filter(app => app._id !== appId));
            showNotification('신청서가 삭제되었습니다.', 'success');
        } catch (error) {
            console.error('Error deleting application:', error);
            showNotification('신청서 삭제에 실패했습니다.', 'error');
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
                                <th>관리</th>
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
                                        <select
                                            value={app.paymentStatus}
                                            onChange={(e) => handlePaymentStatusChange(app._id, e.target.value)}
                                            className="role-select"
                                            style={{
                                                minWidth: '100px',
                                                backgroundColor: app.paymentStatus === 'paid' ? '#dcfce7' : app.paymentStatus === 'free_event' ? '#e0f2fe' : '#fee2e2'
                                            }}
                                        >
                                            <option value="pending">미납</option>
                                            <option value="paid">납부완료</option>
                                            <option value="free_event">무료혜택</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            value={app.communityParticipation}
                                            onChange={(e) => handleParticipationChange(app._id, e.target.value)}
                                            className="role-select"
                                            style={{
                                                minWidth: '100px',
                                                backgroundColor: app.communityParticipation === 'yes' ? '#dcfce7' : app.communityParticipation === 'later' ? '#fef9c3' : '#f3f4f6'
                                            }}
                                        >
                                            <option value="yes">참여</option>
                                            <option value="later">고민중</option>
                                            <option value="no">불참</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            value={app.status || 'submitted'}
                                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                            className="role-select"
                                            style={{
                                                minWidth: '100px',
                                                backgroundColor: app.status === 'approved' ? '#dcfce7' : app.status === 'rejected' ? '#fee2e2' : '#e0f2fe'
                                            }}
                                        >
                                            <option value="submitted">신청됨</option>
                                            <option value="approved">승인됨</option>
                                            <option value="rejected">반려됨</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            className="admin-btn-small danger"
                                            onClick={() => handleDelete(app._id)}
                                        >
                                            삭제
                                        </button>
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
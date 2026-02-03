import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPayments, setTotalPayments] = useState(0);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        user: '',
        amount: '',
        description: '',
        method: 'card',
        paymentDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/admin/payments?page=${page}`, {
                    withCredentials: true
                });
                setPayments(response.data.payments);
                setTotalPages(response.data.totalPages);
                setTotalPayments(response.data.totalPayments);
            } catch (error) {
                console.error('Failed to fetch payments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [page]);

    // Fetch users for dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Reusing the users endpoint, but asking for all or a large limit if possible, 
                // or we could implementing a search. For now getting first 100 which should be enough for basic usage.
                // Or better, a dedicated simple list endpoint. Using existing list for now.
                const response = await axios.get(`${API_BASE_URL}/api/admin/users?limit=100`, {
                    withCredentials: true
                });
                setUsers(response.data.users);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        if (isModalOpen && users.length === 0) {
            fetchUsers();
        }
    }, [isModalOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/api/admin/payments`, formData, {
                withCredentials: true
            });

            // Add new payment to list (at top)
            setPayments([response.data, ...payments]);
            setTotalPayments(prev => prev + 1);
            setIsModalOpen(false);

            // Reset form
            setFormData({
                user: '',
                amount: '',
                description: '',
                method: 'card',
                paymentDate: new Date().toISOString().split('T')[0]
            });

            alert('결제 내역이 추가되었습니다.');
        } catch (error) {
            console.error('Failed to create payment:', error);
            alert('결제 내역 추가 실패');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="status-badge success">완료</span>;
            case 'pending':
                return <span className="status-badge warning">대기중</span>;
            case 'cancelled':
                return <span className="status-badge error">취소됨</span>;
            case 'refunded':
                return <span className="status-badge info">환불됨</span>;
            default:
                return status;
        }
    };

    const methodMap = {
        card: '카드',
        transfer: '계좌이체',
        cash: '현금',
        other: '기타'
    };

    if (loading) return <div>결제 내역 불러오는 중...</div>;

    return (
        <div className="payment-list-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="admin-page-title" style={{ margin: 0 }}>결제 내역 관리</h2>
                <button
                    className="admin-btn-small"
                    style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    + 결제 내역 추가
                </button>
            </div>

            <div className="stats-grid mb-6">
                <div className="stat-card">
                    <h3>총 거래 건수</h3>
                    <p className="stat-value">{totalPayments}건</p>
                </div>
            </div>

            <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>사용자</th>
                            <th>금액</th>
                            <th>내용</th>
                            <th>결제수단</th>
                            <th>상태</th>
                            <th>일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>결제 내역이 없습니다.</td>
                            </tr>
                        ) : (
                            payments.map(payment => (
                                <tr key={payment._id}>
                                    <td>
                                        <div className="font-medium">{payment.user?.name || '알 수 없음'}</div>
                                    </td>
                                    <td className="font-medium">{formatCurrency(payment.amount)}</td>
                                    <td>{payment.description}</td>
                                    <td>{methodMap[payment.method] || payment.method}</td>
                                    <td>{getStatusBadge(payment.status)}</td>
                                    <td>{new Date(payment.paymentDate).toLocaleDateString()} {new Date(payment.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
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
            )}

            {/* Manual Entry Modal */}
            {isModalOpen && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className="modal-content" style={{
                        backgroundColor: 'white', padding: '2rem', borderRadius: '12px',
                        width: '100%', maxWidth: '500px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#1e293b' }}>결제 내역 수기 입력</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>사용자</label>
                                <select
                                    name="user"
                                    value={formData.user}
                                    onChange={handleInputChange}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                >
                                    <option value="">사용자 선택</option>
                                    {users.map(u => (
                                        <option key={u._id} value={u._id}>{u.name} ({u.username})</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>금액 (KRW)</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="50000"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>결제 수단</label>
                                    <select
                                        name="method"
                                        value={formData.method}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                    >
                                        <option value="card">카드</option>
                                        <option value="transfer">계좌이체</option>
                                        <option value="cash">현금</option>
                                        <option value="other">기타</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>내용 (상품명)</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="예: 12월 컨설팅 비용"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>결제 일자</label>
                                <input
                                    type="date"
                                    name="paymentDate"
                                    value={formData.paymentDate}
                                    onChange={handleInputChange}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', color: '#475569' }}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: 'none', background: '#4f46e5', color: 'white', cursor: 'pointer', fontWeight: 500 }}
                                >
                                    추가하기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentList;

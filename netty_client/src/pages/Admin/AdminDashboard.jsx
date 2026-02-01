import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        userCount: 0,
        planCount: 0,
        logCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard`, {
                    withCredentials: true
                });
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>통계 불러오는 중...</div>;

    return (
        <div className="admin-dashboard">
            <h2 className="admin-page-title">대시보드</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>총 사용자 수</h3>
                    <p className="stat-value">{stats.userCount}</p>
                </div>
                <div className="stat-card">
                    <h3>총 성장 계획 수</h3>
                    <p className="stat-value">{stats.planCount}</p>
                </div>
                <div className="stat-card">
                    <h3>이번 달 성장 일지 수</h3>
                    <p className="stat-value">{stats.logCount}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

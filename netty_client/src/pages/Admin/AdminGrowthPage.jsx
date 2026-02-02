import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import '../../components/Admin/Admin.css'; // Reuse admin styles

const AdminGrowthPage = () => {
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingStage, setEditingStage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        minScore: 0,
        maxScore: 0
    });

    useEffect(() => {
        fetchStages();
    }, []);

    const fetchStages = async () => {
        try {
            // Note: This endpoint is public currently, or we can use the admin credential
            const response = await axios.get(`${API_BASE_URL}/api/growth-stages`);
            setStages(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch stages', error);
            setLoading(false);
        }
    };

    const handleEditClick = (stage) => {
        setEditingStage(stage.stageId);
        setFormData({
            name: stage.name,
            description: stage.description,
            imageUrl: stage.imageUrl,
            minScore: stage.minScore,
            maxScore: stage.maxScore
        });
    };

    const handleCancelEdit = () => {
        setEditingStage(null);
        setFormData({ name: '', description: '', imageUrl: '', minScore: 0, maxScore: 0 });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (stageId) => {
        try {
            await axios.put(`${API_BASE_URL}/api/growth-stages/${stageId}`, formData, {
                withCredentials: true
            });
            alert('성장 단계가 수정되었습니다.');
            setEditingStage(null);
            fetchStages(); // Refresh list
        } catch (error) {
            console.error('Failed to update stage', error);
            alert('수정 실패');
        }
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <div className="admin-page">
            <h2 className="admin-page-title">성장 도감 관리</h2>
            <div className="admin-card">
                <p className="admin-desc">
                    사용자의 성장 점수에 따라 부여되는 등급을 관리합니다.
                </p>

                <div className="table-container">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th style={{ width: '60px' }}>이미지</th>
                                <th style={{ width: '120px' }}>이름</th>
                                <th>설명</th>
                                <th style={{ width: '100px' }}>점수 범위</th>
                                <th style={{ width: '80px' }}>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stages.map(stage => (
                                <tr key={stage._id}>
                                    <td style={{ verticalAlign: 'top', color: '#64748b', fontSize: '0.85rem' }}>
                                        {stage.stageId}
                                    </td>
                                    <td style={{ verticalAlign: 'top' }}>
                                        <img src={stage.imageUrl} alt={stage.name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', backgroundColor: '#f1f5f9' }} />
                                    </td>
                                    <td style={{ verticalAlign: 'top' }}>
                                        {editingStage === stage.stageId ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="admin-input"
                                            />
                                        ) : (
                                            <div style={{ fontWeight: 600 }}>{stage.name}</div>
                                        )}
                                    </td>
                                    <td style={{ verticalAlign: 'top' }}>
                                        {editingStage === stage.stageId ? (
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                className="admin-textarea"
                                                rows={3}
                                            />
                                        ) : (
                                            <div style={{ color: '#475569', fontSize: '0.95rem' }}>{stage.description}</div>
                                        )}
                                    </td>
                                    <td style={{ verticalAlign: 'top' }}>
                                        {editingStage === stage.stageId ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <input
                                                    type="number"
                                                    name="minScore"
                                                    value={formData.minScore}
                                                    onChange={handleInputChange}
                                                    className="admin-input"
                                                    style={{ width: '50px' }}
                                                />
                                                ~
                                                <input
                                                    type="number"
                                                    name="maxScore"
                                                    value={formData.maxScore}
                                                    onChange={handleInputChange}
                                                    className="admin-input"
                                                    style={{ width: '50px' }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="status-badge info">
                                                {stage.minScore} ~ {stage.maxScore}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ verticalAlign: 'top' }}>
                                        {editingStage === stage.stageId ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                <button onClick={() => handleSave(stage.stageId)} className="admin-btn-small" style={{ backgroundColor: '#10b981' }}>저장</button>
                                                <button onClick={handleCancelEdit} className="admin-btn-small" style={{ backgroundColor: '#ef4444' }}>취소</button>
                                            </div>
                                        ) : (
                                            <button onClick={() => handleEditClick(stage)} className="admin-btn-small">수정</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminGrowthPage;

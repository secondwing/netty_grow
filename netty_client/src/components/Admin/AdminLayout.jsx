import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './Admin.css';

const AdminLayout = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'admin-nav-item active' : 'admin-nav-item';
    };

    const isGrowthPage = location.pathname.includes('/growth');

    return (
        <div className="admin-layout">
            <div className={`admin-container ${isGrowthPage ? 'vertical-layout' : ''}`}>
                <aside className="admin-sidebar">
                    <div className="admin-sidebar-header">
                        <h3>관리자</h3>
                    </div>
                    <nav className="admin-nav">
                        <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>
                            대시보드
                        </Link>
                        <Link to="/admin/users" className={isActive('/admin/users')}>
                            나성장 관리
                        </Link>
                        <Link to="/admin/applications" className={isActive('/admin/applications')}>
                            신청서 관리
                        </Link>
                        <Link to="/admin/members" className={isActive('/admin/members')}>
                            멤버십 관리
                        </Link>

                    </nav>
                </aside>
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

import { Outlet } from 'react-router-dom';
import Header from './Header';
import './Layout.css';

function Layout({ isLoggedIn, onLogout }) {
    return (
        <div className="layout">
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <main className="layout__main">
                <Outlet />
            </main>
            <footer className="layout__footer">
                <p>&copy; 2025 Netty. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Layout;

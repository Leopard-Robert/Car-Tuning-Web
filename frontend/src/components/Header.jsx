import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeSwitcher from './ThemeSwitcher.jsx';
import { Zap, LogOut, Shield } from 'lucide-react';

const Header = () => {
  const { isAdmin, logout } = useAuth();
  
  return (
    <header className="flex-between container" style={{ borderBottom: '1px solid var(--border)', padding: '20px 0', marginBottom: '2rem' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="flex-center" style={{ gap: '10px' }}>
          <Zap size={28} color="var(--primary)" />
          <h2 style={{ margin: 0 }}>SUPREME<span style={{ color: 'var(--primary)' }}>TUNING</span></h2>
        </div>
      </Link>
      
      <div className="flex-center" style={{ gap: '15px' }}>
        {/* ThemeSwitcher component integration */}
        <ThemeSwitcher />
        
        {isAdmin && (
          <Link to="/admin" style={{ textDecoration: 'none' }}>
             <button className="btn" style={{ background: 'var(--secondary)', padding: '8px 16px', fontSize: '0.9rem' }}>
                <Shield size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> Admin Panel
            </button>
          </Link>
        )}
        {isAdmin && (
          <button onClick={logout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', color: 'var(--error)', border: '1px solid var(--error)' }}>
            <LogOut size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
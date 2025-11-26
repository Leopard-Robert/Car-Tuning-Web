import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ChevronRight } from 'lucide-react';
import Header from '../components/Header';

const WelcomePage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // If already logged in, navigate immediately
  useEffect(() => {
      if (isAdmin) {
          navigate('/calculator');
      }
  }, [isAdmin, navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (!success) {
      setError("Invalid Credentials. Try 'admin' / 'password'");
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '20px', flexDirection: 'column' }}>
        <Header />
      <div className="card animate-in" style={{ width: '400px', maxWidth: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>SUPREME</h1>
          <p style={{ color: 'var(--text-muted)' }}>PROFESSIONAL TUNING SUITE</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <Link to="/calculator" style={{ textDecoration: 'none' }}>
            <button className="btn" style={{ width: '100%', fontSize: '1.1rem' }}>
              Launch Public Calculator <ChevronRight size={18} style={{ verticalAlign: 'middle' }}/>
            </button>
          </Link>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '15px' }}>ADMINISTRATOR ACCESS</p>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username (admin)" value={username} onChange={e=>setUsername(e.target.value)} />
            <input type="password" placeholder="Password (password)" value={password} onChange={e=>setPassword(e.target.value)} />
            {error && <p style={{ color: 'var(--error)', margin: '0 0 15px 0', fontSize: '0.9rem' }}>{error}</p>}
            <button type="submit" className="btn-secondary" style={{ width: '100%' }}>Secure Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
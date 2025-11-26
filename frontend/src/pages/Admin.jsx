// frontend/src/pages/Admin.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL_BASE = 'http://localhost:3001/api/supreme'; 

// Helper component to display success/error messages
const MessageBar = ({ message, type }) => {
    if (!message) return null;
    const color = type === 'success' ? 'var(--color-success)' : 'var(--color-warning)';
    return (
        <div style={{ padding: '10px', backgroundColor: 'var(--input-bg)', borderLeft: `3px solid ${color}`, marginBottom: '15px' }}>
            <p style={{ color }}>{message}</p>
        </div>
    );
};

export default function AdminPanel() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [activeTab, setActiveTab] = useState('brands'); // brands, models, engines, stages
    
    // Auth Headers for API calls
    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    // --- Data Fetching ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch(`${API_URL_BASE}/data`, { headers: authHeaders });
            if (!response.ok) throw new Error('Failed to fetch data. Session might be expired.');
            const fullData = await response.json();
            setData(fullData);
        } catch (error) {
            setMessage(error.message);
            setMessageType('error');
            // If fetching fails, we should assume token is bad and log out.
            logout();
            navigate('/');
        } finally {
            setLoading(false);
        }
    }, [token, logout, navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Data Saving ---
    const handleSave = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch(`${API_URL_BASE}/save`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to save data to the server.');

            setMessage('Data saved and backup created successfully!');
            setMessageType('success');
        } catch (error) {
            setMessage(`Save Error: ${error.message}`);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    // --- Editing Handlers (Simplified Inline Editing) ---
    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const newArray = [...data[activeTab]];
        
        // Handle numerical fields
        const numericFields = ['stockHp', 'stockNm', 'tunedHp', 'tunedNm', 'price', 'id', 'brandId', 'modelId', 'typeId', 'engineId', 'stage'];
        const finalValue = numericFields.includes(name) 
                           ? parseFloat(value) || value : value;
        
        newArray[index] = { ...newArray[index], [name]: finalValue };
        setData(prev => ({ ...prev, [activeTab]: newArray }));
    };
    
    // Basic rendering for the current active tab data
    const renderTable = () => {
        if (!data || !data[activeTab] || data[activeTab].length === 0) {
            return <p>No data available for {activeTab}.</p>;
        }
        
        const currentData = data[activeTab];
        const keys = Object.keys(currentData[0] || {});

        return (
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                    <thead>
                        <tr style={{ background: 'var(--color-border)', color: 'var(--color-text-light)' }}>
                            {keys.map(key => (
                                <th key={key} style={{ padding: '10px', border: '1px solid var(--color-border)', textAlign: 'left' }}>{key}</th>
                            ))}
                            <th style={{ padding: '10px', border: '1px solid var(--color-border)', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr key={item.id || index} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                {keys.map(key => (
                                    <td key={key} style={{ padding: '8px', border: '1px solid var(--color-border)' }}>
                                        <input
                                            type={['id', 'brandId', 'modelId', 'engineId', 'price', 'stage'].includes(key) ? 'number' : 'text'}
                                            name={key}
                                            value={item[key] || ''}
                                            onChange={(e) => handleChange(e, index)}
                                            style={{ width: '100%', padding: '5px', background: 'var(--input-bg)', border: '1px solid var(--color-border)' }}
                                            disabled={key === 'id'}
                                        />
                                    </td>
                                ))}
                                <td style={{ padding: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                                    {/* Action buttons (e.g., delete, add new row functionality would go here) */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="app-container">
            <div className="card" style={{ maxWidth: '1200px', width: '100%' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--color-secondary)', paddingBottom: '10px', marginBottom: '20px' }}>
                    <h1 style={{ margin: 0, color: 'var(--color-secondary)' }}>Admin Data Editor</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="primary-button" onClick={handleSave} disabled={loading}>
                            {loading ? 'Saving...' : '💾 Save All Data'}
                        </button>
                        <button className="secondary-button" onClick={logout}>
                            Logout
                        </button>
                    </div>
                </header>

                <MessageBar message={message} type={messageType} />

                {/* Tab Navigation */}
                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {['brands', 'models', 'engines', 'stages'].map(tab => (
                        <button
                            key={tab}
                            className={activeTab === tab ? 'primary-button' : 'secondary-button'}
                            onClick={() => { setActiveTab(tab); setMessage(''); }}
                            disabled={loading}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {loading && data === null ? (
                    <p style={{ textAlign: 'center' }} className="text-muted">Loading complete dataset...</p>
                ) : (
                    renderTable()
                )}
                
                <p className="text-muted" style={{ marginTop: '20px' }}>
                    *IDs are crucial for linking and cannot be edited directly. Changes are saved to the backend JSON file.
                </p>

            </div>
        </div>
    );
}
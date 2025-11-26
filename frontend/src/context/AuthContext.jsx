import React, { useState, createContext, useContext, useMemo } from 'react';
import { useTheme } from './ThemeContext.jsx'; // Import useTheme from its dedicated file

const AuthContext = createContext();
// This URL must match the backend server configuration
const API_BASE_URL = 'http://localhost:3001/api/supreme'; 

export const AuthProvider = ({ children }) => {
  // Note: Using a different localStorage key for the token to avoid conflicts
  const [token, setToken] = useState(localStorage.getItem('st_token_v2'));
  const [isAdmin, setIsAdmin] = useState(!!token);

  const login = async (username, password) => {
    try {
      // 1. Prepare for API Call
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed.');
      
      // 2. Set State and Storage
      setToken(data.token);
      setIsAdmin(true);
      localStorage.setItem('st_token_v2', data.token);
      return true;
    } catch (err) {
      console.error("Login Error:", err);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('st_token_v2');
  };
  
  const authValue = useMemo(() => ({ token, isAdmin, login, logout }), [token, isAdmin]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

/**
 * Hook to get the API fetching utility, including authentication headers and retry logic.
 * Components use this hook for all data requests.
 */
export const useApi = () => {
    const { token } = useAuth();
    
    // Auth Headers for Admin API calls
    const authHeaders = useMemo(() => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }), [token]);

    const fetchAPI = async (endpoint, options = {}) => {
        const { isProtected = false, ...fetchOptions } = options;
        const headers = isProtected ? authHeaders : { 'Content-Type': 'application/json' };
        
        // Exponential backoff retry mechanism
        for (let i = 0; i < 3; i++) {
            try {
                const res = await fetch(`${API_BASE_URL}/${endpoint}`, { 
                    ...fetchOptions, 
                    headers: { ...headers, ...fetchOptions.headers }
                });
                
                if (res.ok) {
                    return await res.json();
                }

                // If unauthorized on a protected route, trigger logout (401 or 403)
                if (isProtected && (res.status === 401 || res.status === 403)) {
                    // Note: We cannot call logout() directly here because it might cause circular dependency
                    // or improper rendering. Relying on the AdminPanel to handle the 401/403 response.
                    throw new Error(`Authentication failed (Status ${res.status}).`);
                }
                
                // Retry logic
                if (i < 2) { 
                    await new Promise(resolve => setTimeout(resolve, 500 * (2 ** i)));
                    continue; 
                }
            } catch (error) {
                if (i === 2) throw error; // Re-throw the last error after max retries
            }
        }
        throw new Error(`API call failed for ${endpoint} after all retries.`);
    };

    return { fetchAPI, API_BASE_URL, authHeaders };
};
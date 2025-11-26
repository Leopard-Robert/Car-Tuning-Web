import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; // Added .js
import { ThemeProvider } from './context/ThemeContext.jsx'; // Added .js
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Added .jsx

import WelcomePage from './pages/Login.jsx'; // Added .jsx
import CalculatorPage from './pages/Calculator.jsx'; // Added .jsx
import AdminPanel from './pages/Admin.jsx'; // Added .jsx

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
             <Route 
                path="/admin" 
                element={
                    <ProtectedRoute>
                        <AdminPanel />
                    </ProtectedRoute>
                } 
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
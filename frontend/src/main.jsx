import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // Changed to .jsx for consistency

const GlobalStyles = () => (
    <style jsx="true">{`
        :root {
            --primary: #007bff; /* Blue */
            --secondary: #28a745; /* Green */
            --success: #28a745;
            --warning: #ffc107;
            --error: #dc3545;
            --text-main: #333;
            --text-muted: #6c757d;
            --bg-body: #f8f9fa;
            --bg-card: #ffffff;
            --bg-input: #f8f9fa;
            --border: #dee2e6;
            --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            --shadow-hover: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        [data-theme="dark"] {
            --primary: #4a90e2; /* Lighter Blue */
            --secondary: #4cd964; /* Lighter Green */
            --success: #4cd964;
            --warning: #ffcc00;
            --error: #ff3b30;
            --text-main: #e8e8e8;
            --text-muted: #b0b0b0;
            --bg-body: #1c1c1c;
            --bg-card: #2c2c2c;
            --bg-input: #3a3a3a;
            --border: #444444;
            --shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
            --shadow-hover: 0 6px 15px rgba(0, 0, 0, 0.6);
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-body);
            color: var(--text-main);
            transition: background-color 0.3s, color 0.3s;
            margin: 0;
            padding: 0;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .card {
            background-color: var(--bg-card);
            border-radius: 8px;
            padding: 25px;
            box-shadow: var(--shadow);
            transition: box-shadow 0.3s, background-color 0.3s;
        }

        .card:hover {
            box-shadow: var(--shadow-hover);
        }

        .flex-center {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .flex-between {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .grid-brands {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 20px;
        }
        
        input[type="text"], input[type="password"], input[type="number"], select {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: 1px solid var(--border);
            border-radius: 6px;
            background-color: var(--bg-input);
            color: var(--text-main);
            transition: border-color 0.2s, background-color 0.2s;
            box-sizing: border-box;
        }

        input:focus, select:focus {
            border-color: var(--primary);
            outline: none;
        }

        .btn {
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            background-color: var(--primary);
            color: var(--bg-card);
            border: none;
            transition: background-color 0.2s, opacity 0.2s;
        }
        .btn:hover:not(:disabled) {
            background-color: color-mix(in srgb, var(--primary) 90%, black);
        }
        .btn-secondary {
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            background-color: var(--bg-input);
            color: var(--primary);
            border: 1px solid var(--primary);
            transition: background-color 0.2s, color 0.2s;
        }
        .btn-secondary:hover:not(:disabled) {
            background-color: var(--primary);
            color: var(--bg-card);
        }
        .btn:disabled, .btn-secondary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
            animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
        }
        .spinner { 
            border: 4px solid var(--border); 
            border-top: 4px solid var(--primary); 
            border-radius: 50%; 
            width: 24px; 
            height: 24px; 
            animation: spin 1s linear infinite; 
            margin: 0 auto 10px;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
            .container {
                padding: 0 10px;
            }
            header {
                flex-direction: column;
                gap: 15px;
                padding: 15px 0;
            }
        }
    `}</style>
);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <GlobalStyles />
    <App />
  </React.StrictMode>
);
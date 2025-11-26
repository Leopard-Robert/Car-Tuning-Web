/**
 * SUPREME TUNING BACKEND (v2.1) - MODULAR ENTRY POINT
 * Sets up middleware and imports dedicated services.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dataService = require('./dataService');
const apiRouter = require('./apiRouter');
const { handleLogin } = require('./auth');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

// --- CORE ROUTES ---

// 1. Authentication
app.post('/api/supreme/login', handleLogin);

// 2. Data API Router
app.use('/api/supreme', apiRouter);

// --- START ---

dataService.initDataLayer().then(() => {
    app.listen(PORT, () => console.log(`🚀 Supreme Backend v2.1 running on port ${PORT}`));
}).catch(err => {
    console.error("Failed to initialize server due to data service error:", err);
    process.exit(1);
});
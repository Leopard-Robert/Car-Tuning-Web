/**
 * Authentication Module: Handles user login and JWT validation middleware.
 */
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supreme_dev_secret_key_999';
const ADMIN_CREDENTIALS = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'password'
};

// Middleware to verify JWT and check for 'admin' role
const requireAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err || user.role !== 'admin') {
            return res.status(403).json({ message: "Admin access denied" });
        }
        req.user = user;
        next();
    });
};

// Login handler
const handleLogin = (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        const token = jwt.sign({ role: 'admin', username }, JWT_SECRET, { expiresIn: '2h' });
        return res.json({ token, role: 'admin' });
    }
    res.status(401).json({ message: "Invalid credentials" });
};

module.exports = { requireAdmin, handleLogin };
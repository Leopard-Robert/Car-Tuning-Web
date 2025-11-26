/**
 * API Router Module: Defines all data endpoints, utilizing the Data and Auth services.
 */
const express = require('express');
const router = express.Router();
const dataService = require('./dataService');
const { requireAdmin } = require('./auth');

// Public Data Routes (Calculator Flow)
router.get('/brands', (req, res) => res.json(dataService.getBrands()));

router.get('/models', (req, res) => {
    const brandId = parseInt(req.query.brandId);
    res.json(dataService.getModels(brandId));
});

router.get('/types', (req, res) => {
    const modelId = parseInt(req.query.modelId);
    res.json(dataService.getTypes(modelId));
});

router.get('/engines', (req, res) => {
    const typeId = parseInt(req.query.typeId);
    res.json(dataService.getEngines(typeId));
});

router.get('/stages', (req, res) => {
    const engineId = parseInt(req.query.engineId);
    res.json(dataService.getStages(engineId));
});

// Admin Protected Routes
router.get('/data', requireAdmin, (req, res) => {
    res.json(dataService.getData());
});

router.post('/save', requireAdmin, async (req, res) => {
    try {
        await dataService.saveData(req.body);
        res.json({ message: "Database saved and backed up successfully." });
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).json({ message: "Save failed. Check server logs.", error: err.message });
    }
});

module.exports = router;
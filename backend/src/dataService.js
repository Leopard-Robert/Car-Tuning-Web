/**
 * Data Service Module: Manages loading, caching, saving, and backup of tuning data.
 * This is the only module that interacts with the file system (FS).
 */
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'supreme-tuning-master.json');
const BACKUP_DIR = path.join(__dirname, '..', 'data', 'backups');

let dbCache = { brands: [], models: [], engines: [], stages: [] };

async function initDataLayer() {
    try {
        // Ensure data and backup directories exist
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
        await fs.mkdir(BACKUP_DIR, { recursive: true });

        const data = await fs.readFile(DATA_FILE, 'utf-8');
        dbCache = JSON.parse(data);
        console.log(`📦 Data loaded: ${dbCache.brands.length} brands.`);
    } catch (e) {
        if (e.code === 'ENOENT' || e instanceof SyntaxError) {
             console.warn("⚠️ Data file not found or corrupted. Initializing empty cache.");
             // Write the empty structure back if it failed to load
             await saveData(dbCache);
        } else {
             console.error("❌ Critical Data Layer Error:", e);
             throw e;
        }
    }
}

async function saveData(newData) {
    if (!newData || !newData.brands) {
        throw new Error("Invalid data structure provided for save operation.");
    }
    
    // 1. Backup existing cache before writing
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await fs.writeFile(
        path.join(BACKUP_DIR, `backup-${timestamp}.json`), 
        JSON.stringify(dbCache, null, 2)
    );
    
    // 2. Write Master file
    await fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2));
    
    // 3. Update Cache
    dbCache = newData;
}

const getData = () => dbCache;
const getBrands = () => dbCache.brands;
const getModels = (brandId) => dbCache.models.filter(m => m.brandId === brandId);
const getTypes = (modelId) => dbCache.types.filter(t => t.modelId === modelId);
const getEngines = (typeId) => dbCache.engines.filter(e => e.typeId === typeId);
const getStages = (engineId) => dbCache.stages.filter(s => s.engineId === engineId);

module.exports = { 
    initDataLayer, 
    saveData, 
    getData, 
    getBrands, 
    getModels, 
    getTypes,
    getEngines, 
    getStages 
};
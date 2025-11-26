import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useApi } from '../context/AuthContext.jsx'; // Added .js
import Header from '../components/Header.jsx'; // Added .jsx
import StageCard from '../components/StageCard.jsx'; // Added .jsx
import TuningInsightGenerator from '../components/TuningInsightGenerator.jsx'; // Added .jsx

// Global cache for static brands data. This ensures the brands API is only called once 
// per session, even if the component unmounts and remounts.
let brandsCache = null;

const CalculatorPage = () => {
    const { fetchAPI } = useApi();
    // State to hold all brands permanently after initial fetch
    const [loadedBrands, setLoadedBrands] = useState([]);
    // State for brands to display (will be loadedBrands)
    const [brands, setBrands] = useState([]);

    const [models, setModels] = useState([]);
    const [types, setTypes] = useState([]);
    const [engines, setEngines] = useState([]);
    const [stages, setStages] = useState([]);

    const [selBrand, setSelBrand] = useState(null);
    const [selModel, setSelModel] = useState(null);
    const [selType, setSelType] = useState(null);
    const [selEngine, setSelEngine] = useState(null);
    const [loading, setLoading] = useState(false);

    // State for the new engine type filter
    const [engineType, setEngineType] = useState(null);
    const engineTypes = useMemo(() => {
        console.log("Calculating engine types from engines:", engines);
        const types = engines.map(e => e.type).filter(Boolean);
        console.log("Derived engine types:", types);
        return [...new Set(types)];
    }, [engines]);

    // Initial load of brands (runs only once, and checks cache first)
    useEffect(() => {
        // 1. Check if data is already cached
        if (brandsCache) {
            setBrands(brandsCache);
            setLoadedBrands(brandsCache);
            return;
        }

        // 2. If not cached, fetch data
        setLoading(true);
        fetchAPI('brands')
            .then(data => {
                setBrands(data);
                setLoadedBrands(data);
                brandsCache = data; // Populate the global cache
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [fetchAPI]);

    const handleBrand = useCallback(async (brand) => {
        setSelBrand(brand);
        setSelModel(null);
        setSelEngine(null);
        setStages([]);
        setEngineType(null);
        setSelType(null);
        setTypes([]);
        setLoading(true);
        try {
            const data = await fetchAPI(`models?brandId=${brand.id}`);
            setModels(data);
        } catch (error) {
            console.error("Error fetching models:", error);
            setModels([]);
        }
        setLoading(false);
    }, [fetchAPI]);

    const fetchTypes = useCallback(async (modelId) => {
        setLoading(true);
        try {
            const data = await fetchAPI(`types?modelId=${modelId}`);
            setTypes(data);
            // setEngineType(null);
        } catch (error) {
            console.error("Error fetching types:", error);
            setTypes([]);
        }
        setLoading(false);
    }, [fetchAPI]);

    const handleModel = useCallback(async (e) => {
        setTypes([]);
        setSelType(null);
        setEngines([]);
        setSelEngine(null);
        setStages([]);
        // setEngineType(null);

        setLoading(true);
        const modelId = parseInt(e.target.value);
        const model = models.find(m => m.id === modelId);
        setSelModel(model);
        if (model) {
            await fetchTypes(modelId);
        } else {
            setTypes([]);
        }
    }, [models, fetchTypes]);

    const fetchEngines = useCallback(async (typeId) => {
        setLoading(true);
        try {
            const data = await fetchAPI(`engines?typeId=${typeId}`);
            setEngines(data);
            setEngineType(null);
        } catch (error) {
            console.error("Error fetching engines:", error);
            setEngines([]);
        }
        setLoading(false);
    }, [fetchAPI]);

    const handleType = useCallback(async (e) => {
        // setEngines([]);
        // setSelEngine(null);
        // setStages([]);
        const typeId = parseInt(e.target.value);
        const type = types.find(e => e.id === typeId);
        setSelType(type);
        if (type) {
            setLoading(true);
            try {
                const data = await fetchAPI(`engines?typeId=${typeId}`);
                setEngines(data);
            } catch (error) {
                console.error("Error fetching engines:", error);
                setEngines([]);
            }
            setLoading(false);
        } else {
            setEngines([]);
        }
    }, [types, fetchEngines]);

    const handleEngine = useCallback(async (e) => {
        const engineId = parseInt(e.target.value);
        const engine = engines.find(e => e.id === engineId);
        setSelEngine(engine);
        if (engine) {
            setLoading(true);
            try {
                const data = await fetchAPI(`stages?engineId=${engineId}`);
                setStages(data);
            } catch (error) {
                console.error("Error fetching stages:", error);
                setStages([]);
            }
            setLoading(false);
        } else {
            setStages([]);
        }
    }, [engines, fetchAPI]);

    const handleEngineType = useCallback((e) => {
        setEngineType(e.target.value);
        setSelEngine(null);
        setStages([]);
    }, []);


    // Filtered engines based on engineType selection
    const filteredEngines = useMemo(() => {
        if (!engineType) return engines;
        return engines.filter(e => e.type === engineType);
    }, [engines, engineType]);

    // Reset function now uses loadedBrands instead of fetching again
    const reset = () => {
        setSelBrand(null); setSelModel(null); setSelEngine(null); setStages([]); setModels([]); setEngines([]); setEngineType(null);
        // Use the already loaded brands data instead of making a new API call
        setBrands(loadedBrands);
    };

    return (
        <div className="container">
            <Header />

            <h1 style={{ marginBottom: '5px' }}>Tuning Calculator</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                Find the best performance package for your vehicle.
            </p>

            {/* Step 1: Brands */}
            {!selBrand && (
                <div className="animate-in">
                    <h2 style={{ marginBottom: '20px' }}>1. Select Manufacturer</h2>
                    {loading && brands.length === 0 ? (
                        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--secondary)' }}>Loading brands...</p>
                    ) : (
                        <div className="grid-brands">
                            {brands.map(b => (
                                <div
                                    key={b.id}
                                    onClick={() => handleBrand(b)}
                                    className="card"
                                    style={{ cursor: 'pointer', textAlign: 'center', padding: '20px', border: '2px solid var(--border)' }}>
                                    <img
                                        src={b.logoUrl || 'https://placehold.co/50x40/555/FFF?text=Logo'}
                                        alt={b.name}
                                        style={{ marginBottom: '10px', height: '40px', objectFit: 'contain' }}
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/50x40/555/FFF?text=Logo' }}
                                    />
                                    <div style={{ fontWeight: 'bold' }}>{b.name}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Step 2 & 3: Model/Engine and Results */}
            {selBrand && (
                <div className="animate-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div className="flex-between" style={{ marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid var(--border)' }}>
                        <h2>{selBrand.name} Configuration</h2>
                        <button onClick={reset} className="btn-secondary" style={{ padding: '8px 16px' }}>Change Vehicle</button>
                    </div>

                    <div className="card" style={{ marginBottom: '30px' }}>
                        <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>2. Vehicle Selection</h3>

                        {/* Model Selection */}
                        <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Model</label>
                        <select onChange={handleModel} value={selModel?.id || ''} disabled={loading}>
                            <option value="">-- Select Model --</option>
                            {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>

                        {/* Engine Type Filter */}
                        {types.length > 0 && (
                            <>
                                <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Chassis</label>
                                <select onChange={handleType} value={selType?.id || ''} disabled={loading}>
                                    <option value="">-- Select Chassis Type --</option>
                                    {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </>)
                        }

                        {/* Engine Type Filter (New) */}
                        {selType && engineTypes.length > 0 && (
                            <>
                                <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Engine Type</label>
                                <select onChange={handleEngineType} value={engineType || ''} disabled={loading}>
                                    <option value="">-- All Types --</option>
                                    {engineTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </>
                        )}

                        {/* Engine Selection */}
                        {selModel && filteredEngines.length > 0 && (
                            <>
                                <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Engine Variant</label>
                                <select onChange={handleEngine} value={selEngine?.id || ''} disabled={loading}>
                                    <option value="">-- Select Engine Name & Variant --</option>
                                    {filteredEngines.map(e => <option key={e.id} value={e.id}>{e.name} - {e.description} ({e.type})</option>)}
                                </select>
                            </>
                        )}

                        {selModel && filteredEngines.length === 0 && (
                            <p style={{ color: 'var(--error)' }}>No engines found for the selected model and type.</p>
                        )}

                    </div>
                    {loading && <p style={{ textAlign: 'center', color: 'var(--secondary)' }}>Loading options...</p>}

                    {/* Results */}
                    {selEngine && (
                        <div style={{ marginTop: '40px' }}>
                            <h2 style={{ color: 'var(--secondary)' }}>3. Performance Stages</h2>
                            {stages.length > 0 ? (
                                stages.map(stage => <StageCard key={stage.id} stage={stage} />)
                            ) : (
                                <div className="card" style={{ border: '1px solid var(--warning)' }}>
                                    <p style={{ color: 'var(--warning)', margin: 0 }}>No performance packages currently available for the selected engine.</p>
                                </div>
                            )}

                            {/* AI Insight Generator */}
                            {/* {selEngine && stages.length > 0 && <TuningInsightGenerator engine={selEngine} stages={stages} />} */}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CalculatorPage;
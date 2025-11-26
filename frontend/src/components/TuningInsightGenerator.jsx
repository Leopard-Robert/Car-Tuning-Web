import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '../context/AuthContext.jsx'; // Added .js
import { Shield } from 'lucide-react';

/**
 * Component to generate tuning insights using the Gemini API.
 */
const TuningInsightGenerator = ({ engine, stages }) => {
    const { fetchAPI } = useApi();
    const [insight, setInsight] = useState('');
    const [sources, setSources] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // API key is left empty and will be injected by the environment.
    const apiKey = ""; 

    const generateInsight = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setInsight('');
        setSources([]);

        // 1. Construct the detailed prompt from the app data
        const stockHp = stages[0]?.stockHp || 'N/A';
        const stockNm = stages[0]?.stockNm || 'N/A';
        const stageSummary = stages.map(s => `Stage ${s.stage}: Stock ${stockHp}HP/${stockNm}Nm -> Tuned ${s.tunedHp}HP/${s.tunedNm}Nm (Gain: +${s.tunedHp - stockHp}HP)`);
        
        const tuningRequest = `Engine: ${engine.code} - ${engine.description}, Type: ${engine.type}. Performance Data: ${stageSummary.join('; ')}`;
        
        const systemPrompt = "You are a world-class automotive tuning engineer and journalist. Provide a grounded, detailed, and persuasive analysis (3-5 paragraphs) of the tuning potential for the provided engine. Explain *why* the performance gains are achieved (e.g., turbocharger headroom, factory detuning, fuel systems). Use a professional, technical, yet accessible tone. Conclude with a note on reliability at the reported power levels. Only use real-time web knowledge and cite your sources.";
        
        const userQuery = `Analyze the tuning potential and package data for this vehicle configuration:\n\n${tuningRequest}`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            // Enable Google Search grounding
            tools: [{ "google_search": {} }], 
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        // 2. Fetch with Exponential Backoff
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorBody = await response.json();
                    throw new Error(`API returned status ${response.status}: ${errorBody.error?.message || 'Unknown error'}`);
                }

                const result = await response.json();
                const candidate = result.candidates?.[0];

                if (candidate && candidate.content?.parts?.[0]?.text) {
                    // Extract text
                    const text = candidate.content.parts[0].text;
                    setInsight(text);

                    // Extract sources (Grounding)
                    let extractedSources = [];
                    const groundingMetadata = candidate.groundingMetadata;
                    if (groundingMetadata && groundingMetadata.groundingAttributions) {
                        extractedSources = groundingMetadata.groundingAttributions
                            .map(attribution => ({
                                uri: attribution.web?.uri,
                                title: attribution.web?.title,
                            }))
                            .filter(source => source.uri && source.title);
                    }
                    setSources(extractedSources);
                    break; // Success, exit retry loop
                } else {
                    throw new Error("API response was valid, but contained no generated text.");
                }
            } catch (err) {
                console.error(`Attempt ${attempt + 1} failed:`, err);
                if (attempt < 2) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (2 ** attempt)));
                } else {
                    setError(`Failed to generate tuning insight: ${err.message}`);
                }
            }
        }
        setIsLoading(false);
    }, [engine, stages, fetchAPI]);
    
    // Auto-generate when engine/stages are selected/change
    useEffect(() => {
        // Only run if an engine is selected AND there are stages for it
        if (engine && stages.length > 0) {
            generateInsight();
        } else if (engine && stages.length === 0) {
            // If engine selected but no stages, clear insight
            setInsight('');
            setSources([]);
        }
    }, [engine, stages, generateInsight]);


    return (
        <div className="card animate-in" style={{ marginTop: '30px', borderLeft: '4px solid var(--secondary)' }}>
            <div className="flex-between">
                <h3 style={{ margin: 0, color: 'var(--secondary)' }}>Performance Insight Engine ✨</h3>
                <button 
                    onClick={generateInsight} 
                    className="btn-secondary" 
                    disabled={isLoading || stages.length === 0}
                    style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                >
                    {isLoading ? 'Analyzing...' : 'Re-Generate Analysis'}
                </button>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                Technical analysis powered by the Gemini AI, using real-time information.
            </p>

            {isLoading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div className="spinner"></div>
                    <p style={{ color: 'var(--primary)' }}>Deep engine analysis in progress...</p>
                </div>
            )}

            {error && (
                <p style={{ color: 'var(--error)', fontWeight: 'bold' }}>{error}</p>
            )}

            {!isLoading && insight && (
                <>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '1rem', color: 'var(--text-main)' }}>
                        {insight}
                    </div>
                    
                    {sources.length > 0 && (
                        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: '0 0 5px 0', color: 'var(--text-muted)' }}>Sources used for grounding:</p>
                            <ul style={{ listStyleType: 'none', paddingLeft: '0', margin: 0 }}>
                                {sources.map((source, index) => (
                                    <li key={index} style={{ fontSize: '0.8rem' }}>
                                        <a href={source.uri} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                                            {source.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TuningInsightGenerator;
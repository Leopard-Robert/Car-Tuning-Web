import React from 'react';
import { Shield } from 'lucide-react';

const StageCard = ({ stage }) => {
    const gainHp = stage.tunedHp - stage.stockHp;
    const gainNm = stage.tunedNm - stage.stockNm;

    return (
        <div className="card animate-in" style={{ marginBottom: '20px', borderLeft: '4px solid var(--primary)' }}>
            <div className="flex-between">
                <h3>{stage.stageName}</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Stock Power</p>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stage.stockHp} HP / {stage.stockNm} Nm</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Tuned Power</p>
                    <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stage.tunedHp} HP / {stage.tunedNm} Nm</span>
                </div>
            </div>

            <p style={{ textAlign: 'center', color: 'var(--success)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                Gain: +{gainHp} HP / +{gainNm} Nm
            </p>

            {/* ECU Unlock & CPC Visibility */}
            {stage.ecuNotes && (
                <div style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: '4px', border: '1px solid var(--warning)', marginTop: '15px' }}>
                    <p style={{ color: 'var(--warning)', margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>
                        <Shield size={16} style={{ verticalAlign: 'bottom', marginRight: '5px' }} /> **ECU/CPC Requirement:** {stage.ecuNotes}
                    </p>
                </div>
            )}

            <div className="flex-between" style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Notes: {stage.notes || 'No specific hardware required.'}</span>
                {/* <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>€{stage.price.toFixed(2)}</span> */}
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>€</span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                <h3>

                    {stage.cpcUpgrade && 'CPC Upgrade Required'}
                    {stage.ecuUnlock && 'ECU Unlock Required'}
                </h3>
            </div>
        </div>
    );
};

export default StageCard;
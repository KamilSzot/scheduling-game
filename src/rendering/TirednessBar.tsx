import React from 'react';

const ROOM_SIZE = 300;

export const TirednessBar: React.FC<{ tiredness: number; maxTiredness: number; tirednessDelta: number }> = ({ tiredness, maxTiredness, tirednessDelta }) => (
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: ROOM_SIZE, margin: '4px 0 8px 0' }}>
    {/* Tiredness delta */}
    <div style={{ width: 60, textAlign: 'right', marginRight: 8, color: tirednessDelta < 0 ? '#388e3c' : '#e53935', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>
      {tirednessDelta > 0 ? '+' : ''}{tirednessDelta.toFixed(2)}
    </div>
    <div style={{ flex: 1, height: 24, background: '#eee', borderRadius: 12, border: '1px solid #bbb', position: 'relative' }}>
      <div
        style={{
          width: `${(tiredness / maxTiredness) * 100}%`,
          height: '100%',
          background: tiredness < maxTiredness * 0.7 ? '#4caf50' : '#e53935',
          borderRadius: 12,
          transition: 'width 0.1s',
        }}
      />
      <span style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        color: '#222',
        fontSize: 16,
        textShadow: '0 1px 2px #fff',
      }}>{Math.round(tiredness)} / {maxTiredness} Tiredness</span>
    </div>
  </div>
);

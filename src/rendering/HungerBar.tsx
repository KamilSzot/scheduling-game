import React from 'react';
import { StomachIndicator } from './StomachIndicator';

const ROOM_SIZE = 300;

export const HungerBar: React.FC<{ hunger: number; maxHunger: number; hungerDelta: number; stomach: number }> = ({ hunger, maxHunger, hungerDelta, stomach }) => (
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: ROOM_SIZE, margin: '16px 0 4px 0' }}>
    {/* Hunger delta */}
    <div style={{ width: 60, textAlign: 'right', marginRight: 8, color: hungerDelta < 0 ? '#388e3c' : '#e53935', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>
      {hungerDelta > 0 ? '+' : ''}{hungerDelta.toFixed(2)}
    </div>
    <div style={{ flex: 1, height: 20, background: '#eee', borderRadius: 10, border: '1px solid #bbb', position: 'relative', marginRight: 12 }}>
      <div
        style={{
          width: `${(hunger / maxHunger) * 100}%`,
          height: '100%',
          background: hunger < maxHunger * 0.7 ? '#4caf50' : '#e53935',
          borderRadius: 10,
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
        fontSize: 14,
        textShadow: '0 1px 2px #fff',
      }}>{Math.round(hunger)} / {maxHunger} Hunger</span>
    </div>
    <StomachIndicator stomach={stomach} />
  </div>
);

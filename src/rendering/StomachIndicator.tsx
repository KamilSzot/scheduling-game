import React from 'react';

export const StomachIndicator: React.FC<{ stomach: number }> = ({ stomach }) => (
  <div style={{ width: 48, height: 20, background: '#fffde7', border: '1px solid #fbc02d', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fbc02d', fontSize: 13, marginLeft: 0, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${stomach * 100}%`, background: '#ffe082', borderRadius: 10, zIndex: 0, transition: 'width 0.1s' }} />
    <span style={{ position: 'relative', zIndex: 1 }}>Stomach</span>
  </div>
);

// src/rendering/RoomGame.tsx
// React component for rendering and interacting with the room game



import React from 'react';
import { useRoomGame } from './useRoomGame';


import { HungerBar } from './HungerBar';
import { TirednessBar } from './TirednessBar';

const ROOM_SIZE = 300; // px
const PERSON_RADIUS = 20; // px
const BED = { x: 60, y: 60, width: 60, height: 40 };
const CHAIR = { x: 180, y: 200, width: 40, height: 40 };
const KITCHENETTE = { x: 200, y: 40, width: 70, height: 40 };

export const RoomGame: React.FC = () => {
  const { room, setAction, action, tiredness, maxTiredness, hunger, maxHunger, stomach, hungerDelta, tirednessDelta, clock, day, hours, minutes, background } = useRoomGame();
  // Stomach is now managed by game logic in person.ts and exposed by useRoomGame

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background }}>
      {/* Virtual clock and day */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: ROOM_SIZE, margin: '12px 0 0 0', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#333' }}>Day {day}</div>
        <div style={{ width: 180, height: 18, background: '#e3f2fd', borderRadius: 9, border: '1px solid #90caf9', position: 'relative', marginLeft: 12, marginRight: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: `${(clock ?? 0) * 100}%`, height: '100%', background: '#42a5f5', borderRadius: 9, position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 0, transition: 'width 0.1s' }} />
          <span style={{ position: 'relative', zIndex: 1, fontWeight: 700, color: '#1565c0', fontSize: 13 }}>
            {(() => {
              // Round minutes to nearest 15
              const roundedMinutes = Math.round(minutes / 15) * 15;
              const displayHours = (roundedMinutes === 60) ? (hours + 1) % 24 : hours;
              const displayMinutes = (roundedMinutes === 60) ? 0 : roundedMinutes;
              return `${displayHours.toString().padStart(2, '0')}:${displayMinutes.toString().padStart(2, '0')}`;
            })()}
          </span>
        </div>
      </div>
      {/* Hunger bar */}
      <HungerBar hunger={hunger} maxHunger={maxHunger} hungerDelta={hungerDelta} stomach={stomach} />
      {/* Tiredness bar */}
      <TirednessBar tiredness={tiredness} maxTiredness={maxTiredness} tirednessDelta={tirednessDelta} />
      <svg width={ROOM_SIZE} height={ROOM_SIZE} style={{ display: 'block', margin: '40px auto', background: '#f0f0f0', border: '2px solid #333' }}>
        {/* Bed */}
        <rect
          x={BED.x}
          y={BED.y}
          width={BED.width}
          height={BED.height}
          fill="#b3e5fc"
          stroke="#1976d2"
          strokeWidth={2}
          rx={8}
          style={{ cursor: 'pointer' }}
          onClick={() => setAction('sleep')}
        />
        <text x={BED.x + BED.width / 2} y={BED.y + BED.height / 2 + 5} textAnchor="middle" fontSize={14} fill="#1976d2" style={{ pointerEvents: 'none' }}>Bed</text>
        {/* Chair */}
        <rect
          x={CHAIR.x}
          y={CHAIR.y}
          width={CHAIR.width}
          height={CHAIR.height}
          fill="#ffe082"
          stroke="#b28704"
          strokeWidth={2}
          rx={6}
          style={{ cursor: 'pointer' }}
          onClick={() => setAction('sit')}
        />
        <text x={CHAIR.x + CHAIR.width / 2} y={CHAIR.y + CHAIR.height / 2 + 5} textAnchor="middle" fontSize={14} fill="#b28704" style={{ pointerEvents: 'none' }}>Chair</text>
        {/* Kitchenette */}
        <rect
          x={KITCHENETTE.x}
          y={KITCHENETTE.y}
          width={KITCHENETTE.width}
          height={KITCHENETTE.height}
          fill="#c8e6c9"
          stroke="#388e3c"
          strokeWidth={2}
          rx={8}
          style={{ cursor: 'pointer' }}
          onClick={() => setAction('kitchen')}
        />
        <text x={KITCHENETTE.x + KITCHENETTE.width / 2} y={KITCHENETTE.y + KITCHENETTE.height / 2 + 5} textAnchor="middle" fontSize={14} fill="#388e3c" style={{ pointerEvents: 'none' }}>Kitchen</text>
        {/* Person */}
        <circle
          cx={room.person.x}
          cy={room.person.y}
          r={PERSON_RADIUS}
          fill="#3498db"
          stroke="#222"
          strokeWidth={2}
        />
      </svg>
      <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
        <button onClick={() => setAction('sleep')} disabled={action === 'sleep'}>Sleep in Bed</button>
        <button onClick={() => setAction('sit')} disabled={action === 'sit'}>Sit on Chair</button>
        <button onClick={() => setAction('kitchen')} disabled={action === 'kitchen'}>Go to Kitchenette</button>
      </div>
    </div>
  );
};

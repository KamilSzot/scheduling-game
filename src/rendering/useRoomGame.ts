// Helper to get background color for day/night cycle
function getDayNightBackground(clock: number) {
  // 0 = midnight, 0.25 = 6am, 0.5 = noon, 0.75 = 6pm, 1 = midnight
  // We'll interpolate between night and day colors
  // Night: #222c44, Day: #e3f2fd
  const t = Math.cos((clock ?? 0) * 2 * Math.PI - Math.PI) * 0.5 + 0.5; // 0 at midnight, 1 at noon
  // Interpolate RGB
  function lerp(a: number, b: number, t: number) { return Math.round(a + (b - a) * t); }
  const night = { r: 34, g: 44, b: 68 };
  const day = { r: 227, g: 242, b: 253 };
  const r = lerp(night.r, day.r, t);
  const g = lerp(night.g, day.g, t);
  const b = lerp(night.b, day.b, t);
  return `rgb(${r},${g},${b})`;
}
// Helper to convert clock (0..1) to hours and minutes
function getTimeFromClock(clock: number) {
  // Let's say 1 day = 24 hours
  const totalMinutes = Math.floor((clock ?? 0) * 24 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}
// src/rendering/useRoomGame.ts
// Custom hook for room game state and interactions

import { useState, useEffect } from 'react';
import { createRoom, Room, updateRoomState } from '../game/room';
import { updatePersonState, getAutoAction } from '../game/person';


const ROOM_SIZE = 300; // px
const BED = { x: 60, y: 60, width: 60, height: 40 };
const CHAIR = { x: 180, y: 200, width: 40, height: 40 };
// Add kitchenette position
const KITCHENETTE = { x: 200, y: 40, width: 70, height: 40 };
import { PERSON_CONFIG } from '../game/personConfig';
export const TICK_MS = 50;

// Add 'kitchen' to Action type
// Remove snack from Action type
// type Action = 'sleep' | 'sit';
type Action = 'sleep' | 'sit' | 'kitchen';


export function useRoomGame() {
  const [room, setRoom] = useState<Room>(() => {
    // Start in bed
    const r = createRoom(ROOM_SIZE);
    r.person = { x: BED.x + BED.width / 2, y: BED.y + BED.height / 2 };
    return r;
  });
  const [action, setAction] = useState<Action>('sleep');
  const [tiredness, setTiredness] = useState<number>(0);
  const [hunger, setHunger] = useState<number>(30);
  const [stomach, setStomach] = useState<number>(0);
  const [hungerDelta, setHungerDelta] = useState<number>(0);
  const [tirednessDelta, setTirednessDelta] = useState<number>(0);
  const [clock, setClock] = useState<number>(0);
  const [day, setDay] = useState<number>(1);

  // Animate person to bed, chair, or kitchenette when action changes
  useEffect(() => {
    let animationFrame: number;
    const speed = 3; // pixels per frame (slower)
    const getTarget = () => {
      if (action === 'sleep') return { x: BED.x + BED.width / 2, y: BED.y + BED.height / 2 };
      if (action === 'kitchen') return { x: KITCHENETTE.x + KITCHENETTE.width / 2, y: KITCHENETTE.y + KITCHENETTE.height / 2 };
      return { x: CHAIR.x + CHAIR.width / 2, y: CHAIR.y + CHAIR.height / 2 };
    };

    function animate() {
      setRoom(room => {
        const target = getTarget();
        const dx = target.x - room.person.x;
        const dy = target.y - room.person.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < speed) {
          return { ...room, person: target };
        }
        const angle = Math.atan2(dy, dx);
        return {
          ...room,
          person: {
            x: room.person.x + Math.cos(angle) * speed,
            y: room.person.y + Math.sin(angle) * speed,
          },
        };
      });
      animationFrame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [action]);

  // Energy, satiety, and auto-action logic: update on a fixed interval, not animation frame
  useEffect(() => {
    let running = true;
    let last = performance.now();
    const TICK_MS = 50;
    let prevTiredness = tiredness;
    let prevHunger = hunger;
    function tick(now: number) {
      if (!running) return;
      if (now - last >= TICK_MS) {
        last = now;
        const next = updatePersonState(
          { tiredness, hunger, stomach },
          action,
          PERSON_CONFIG,
          TICK_MS
        );
        let nextAction = getAutoAction(next, action, PERSON_CONFIG);
        setHungerDelta((next.hunger - prevHunger) * (1000 / TICK_MS));
        setTirednessDelta((next.tiredness - prevTiredness) * (1000 / TICK_MS));
        // Update room clock and day using tirednessDelta
        setRoom(room => {
          const updated = updateRoomState(room);
          setClock(updated.clock ?? 0);
          setDay(updated.day ?? 1);
          return updated;
        });
        prevTiredness = next.tiredness;
        prevHunger = next.hunger;
        if (next.tiredness !== tiredness) setTiredness(next.tiredness);
        if (next.hunger !== hunger) setHunger(next.hunger);
        if (typeof next.stomach === 'number' && next.stomach !== stomach) setStomach(next.stomach);
        if (nextAction !== action) setAction(nextAction);
      }
      requestAnimationFrame(tick);
    }
    const id = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(id); };
  }, [action, tiredness, hunger, stomach]);



  const { hours, minutes } = getTimeFromClock(clock);
  const background = getDayNightBackground(clock);
  return { room, setAction, action, tiredness, maxTiredness: PERSON_CONFIG.maxTiredness, hunger, maxHunger: PERSON_CONFIG.maxHunger, stomach, KITCHENETTE, hungerDelta, tirednessDelta, clock, day, hours, minutes, background };
}

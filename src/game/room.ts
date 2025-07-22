// src/game/room.ts
// Game logic for the room and person

export interface Position {
  x: number;
  y: number;
}

export interface Room {
  size: number; // width and height (square)
  person: Position;
  clock?: number; // 0..1, fraction of day
  day?: number; // integer day counter
}

export function createRoom(size: number): Room {
  // Start person in the center
  return {
    size,
    person: { x: size / 2, y: size / 2 },
    clock: 0.25, // 6:00 AM (0.25 of the day)
    day: 1,
  };
}

import { TICKS_PER_DAY } from './roomConfig';
// Update the virtual clock and day based on tirednessDelta
export function updateRoomState(room: Room): Room {
  // 1 day = TICKS_PER_DAY ticks (see constants)
  let { clock = 0, day = 1 } = room;
  let clockDelta = 1 / TICKS_PER_DAY;
  clock += clockDelta;
  if (clock >= 1) {
    clock = 0;
    day += 1;
  }
  return { ...room, clock, day };
}

export function movePerson(room: Room, dx: number, dy: number): Room {
  // Move person, clamping to room bounds
  const newX = Math.max(0, Math.min(room.size, room.person.x + dx));
  const newY = Math.max(0, Math.min(room.size, room.person.y + dy));
  return {
    ...room,
    person: { x: newX, y: newY },
  };
}

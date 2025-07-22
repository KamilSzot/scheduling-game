import { useState, useEffect } from 'react';
import { subscribeToTimeChanges } from '../game/clock';

type State = { hour: number; minute: number; second: number };

export function useClockState(): State | null {
    const [clockState, setClockState] = useState<State | null>(null);
  const [hasInitialValue, setHasInitialValue] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToTimeChanges(newState => {
      if (!hasInitialValue) {
                setClockState(newState);
        setHasInitialValue(true);
      } else {
        setClockState(newState);
      }
        });

        return () => {
            unsubscribe();
        };
  }, [hasInitialValue]);
    return clockState;
}
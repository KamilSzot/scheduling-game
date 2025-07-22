import { useClockState } from './useClockState';
import { format } from 'date-fns';

interface ClockFaceProps {
    formatString?: string; // Allow customization of the format string
}

function ClockFace({ formatString = 'HH:mm:ss' }: ClockFaceProps) {
    const time = useClockState();
    
  if (!time) {
    return <div>Loading...</div>; // Or return null;
  }

    return (
        <div>
            {format(new Date(0, 0, 0, time.hour, time.minute, time.second), formatString)}
        </div>
    );
}

export default ClockFace;


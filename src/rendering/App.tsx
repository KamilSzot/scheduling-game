import './App.css';


import ClockFace from './ClockFace';
import { RoomGame } from './RoomGame';

const App = () => {
  return (
    <div className="content">
      <div className="clock-container">
        <ClockFace />
      </div>
      <RoomGame />
      <h1>Rsbuild with React!</h1>
      <p>Start building amazing things with Rsbuild.</p>
    </div>
  );
};

export default App;

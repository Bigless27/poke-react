import './App.css';
import PokeCalendar from './Poke.jsx';

function App() {
  return (
    <div className="App">
      <div className="flex-container flex-col flex-center">
        <div className="flex-container flex-center">
          <img className="pika" alt="pikachu" height="50px" length="50px" src="/pikachu.gif" />
          <img height="50px" alt="loc" length="50px" src="/loc-logo.png" />
        </div>
        <PokeCalendar />
      </div>
    </div>
  );
}

export default App;

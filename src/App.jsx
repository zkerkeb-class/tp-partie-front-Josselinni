import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PokeList from './components/PokeList';
import PokePage from './pokePages/index';
import CreatePokemon from './pokePages/createPokemon';

function App() {
  return (
    <div className="app-container">
      <nav style={{ padding: '20px', borderBottom: '1px solid #444', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '20px', color: 'white', fontWeight: 'bold' }}>Home</Link>
        <Link to="/create" style={{ color: '#4caf50', fontWeight: 'bold' }}>+ Add a Pokemon</Link>
      </nav>

      <Routes>
        <Route path="/" element={<PokeList />} />
        <Route path="/pokemon/:id" element={<PokePage />} />
        <Route path="/create" element={<CreatePokemon />} />
      </Routes>
    </div>
  )
}

export default App;
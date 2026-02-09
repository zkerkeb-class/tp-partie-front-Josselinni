import { useState } from "react";
import { Link } from "react-router-dom";
import PokeCard from "../components/pokeCard";

const SearchPokemon = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setError("");
        setPokemon(null);

        if (value.trim() === "") {
            return;
        }

        setLoading(true);
        fetch(`http://localhost:3000/pokemon/search/${value}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Pokemon not found");
                }
                return response.json();
            })
            .then((data) => {
                setPokemon(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
                setPokemon(null);
            });
    };

    return (
        <div style={{ color: 'white', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Search a Pokemon</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Enter pokemon name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '1rem',
                        borderRadius: '5px',
                        border: 'none',
                        boxSizing: 'border-box'
                    }}
                />
            </div>

            {loading && <p>Searching...</p>}

            {error && (
                <p style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                    ❌ {error}
                </p>
            )}

            {pokemon && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Found:</h3>
                    <Link to={`/pokemon/${pokemon.id}`} style={{ textDecoration: 'none' }}>
                        <PokeCard pokemon={pokemon} />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default SearchPokemon;

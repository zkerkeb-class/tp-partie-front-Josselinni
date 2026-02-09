import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PokeCard from "../pokeCard";

const PokeList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:3000/pokemon?page=${page}`)
            .then((response) => response.json())
            .then((data) => {
                setPokemons(data.results);
                setTotalPages(data.totalPages);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erreur:", error);
                setLoading(false);
            });
    }, [page]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Pokedex page {page}</h2>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button 
                    disabled={page === 1} 
                    onClick={() => setPage(p => p - 1)}
                    style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer'}}
                >
                    ← Previous
                </button>

                <button 
                    disabled={page === totalPages} 
                    onClick={() => setPage(p => p + 1)}
                    style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer'}}
                >
                    Next →
                </button>
            </div>
            
            <ul className="pokemon-grid">
                {pokemons.map((pokemon) => (
                    <Link key={pokemon.id} to={`/pokemon/${pokemon.id}`} style={{ textDecoration: 'none' }}>
                        <PokeCard 
                            pokemon={pokemon} 
                        />
                    </Link>
                ))}
            </ul>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button 
                    disabled={page === 1} 
                    onClick={() => setPage(p => p - 1)}
                    style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer'}}
                >
                    ← Previous
                </button>

                <button 
                    disabled={page === totalPages} 
                    onClick={() => setPage(p => p + 1)}
                    style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer'}}
                >
                    Next →
                </button>
            </div>
        </div>
    );
};

export default PokeList;
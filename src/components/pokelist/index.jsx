import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PokeCard from "../pokeCard";

const PokeList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cutId, setCutId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [chosenPokemon, setChosenPokemon] = useState(null);
    
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

    // Best-effort: play a cry audio for a pokemon object (local url or fallback to PokeAPI)
    const playCry = async (poke) => {
        try {
            const maybe = poke?.cries?.latest || poke?.cry || poke?.cries?.url;
            if (maybe) {
                const a = new Audio(maybe);
                await a.play().catch(() => {});
                return;
            }

            // fallback to pokeapi
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke.id}`);
            if (!res.ok) return;
            const data = await res.json();
            const url = data.cries?.latest;
            if (url) {
                const a2 = new Audio(url);
                await a2.play().catch(() => {});
            }
        } catch (e) {
            // ignore
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <button
                    onClick={() => {
                        if (isProcessing) return;
                        setIsProcessing(true);

                        // Fetch ALL pokemons from backend then pick one at random
                        fetch(`http://localhost:3000/pokemon`)
                            .then((res) => res.json())
                            .then((all) => {
                                // backend may return { results: [...] } or an array
                                const list = Array.isArray(all) ? all : (all.results || []);
                                if (!list.length) throw new Error('No pokemons available');

                                const idx = Math.floor(Math.random() * list.length);
                                const chosen = list[idx];
                                setChosenPokemon(chosen);

                                // play cry during animation (best-effort)
                                playCry(chosen);

                                // if chosen is visible on this page, highlight it too
                                if (pokemons.some(p => p.id === chosen.id)) setCutId(chosen.id);

                                // wait for the cut animation, then delete from backend and remove from state
                                setTimeout(() => {
                                    fetch(`http://localhost:3000/pokemon/${chosen.id}`, { method: 'DELETE' })
                                        .then(() => {
                                            setPokemons(prev => prev.filter(p => p.id !== chosen.id));
                                            setCutId(null);
                                            setChosenPokemon(null);
                                            setIsProcessing(false);
                                            alert(`C'EST CIAO ${chosen.name.french}.`);
                                        })
                                        .catch((err) => {
                                            console.error(err);
                                            setCutId(null);
                                            setChosenPokemon(null);
                                            setIsProcessing(false);
                                            alert('Erreur lors de la suppression.');
                                        });
                                }, 1200);
                            })
                            .catch((err) => {
                                console.error(err);
                                setIsProcessing(false);
                                alert('Impossible de récupérer la liste complète.');
                            });
                    }}
                    style={{ padding: '10px 20px', fontSize: '1.1rem', background: 'black', color: 'white', cursor: isProcessing ? 'not-allowed' : 'pointer' }}
                    disabled={isProcessing}
                >
                    Russian Roulette
                </button>
            </div>

            {/* Overlay to show chosen pokemon (when it's not in current list or to emphasize) */}
            {chosenPokemon && (
                <div style={{ position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 2000 }}>
                    <div style={{ pointerEvents: 'auto' }}>
                        <PokeCard pokemon={chosenPokemon} isCut={true} />
                    </div>
                </div>
            )}
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
                            isCut={cutId === pokemon.id}
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
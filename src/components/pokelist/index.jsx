import { useState, useEffect } from "react";
import PokeCard from "../pokeCard";
import PokeModal from "../pokeModal";

const PokeList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
            .then((response) => response.json())
            .then((data) => {
                console.log("Données reçues:", data);
                setPokemons(data.results);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erreur:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Chargement...</p>
    }

    return (
        <div>
            <h2>Pokemon List</h2>
            
            {selectedPokemon && (
                <PokeModal 
                    pokemon={selectedPokemon} 
                    onClose={() => setSelectedPokemon(null)} 
                />
            )}

            <ul className="pokemon-grid">
                {pokemons.map((pokemon, index) => (
                    // On passe la fonction directement à PokeCard via la prop "onImageClick"
                    <PokeCard 
                        key={index} 
                        pokemon={pokemon} 
                        onImageClick={() => setSelectedPokemon(pokemon)}
                    />
                ))}
            </ul>
        </div>
    );
};

export default PokeList;

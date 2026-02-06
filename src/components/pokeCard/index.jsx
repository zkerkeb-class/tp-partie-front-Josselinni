import { useEffect, useState } from "react";

// On ajoute "onImageClick" dans les paramètres reçus
const PokeCard = ({ pokemon, onImageClick }) => {
    const [pokeState, setPokeState] = useState({});

    useEffect(() => {
        fetch(pokemon.url)
            .then((response) => response.json())
            .then((data) => setPokeState(data))
            .catch((error) => console.error(error));
    }, [pokemon]);

    const playCry = () => {
        if (pokeState.cries?.latest) {
            const audio = new Audio(pokeState.cries.latest);
            audio.volume = 0.2;
            audio.play();
        }
    };

    return (
        <div className="poke-card">
            <div className="card-header">
                <h3>{pokeState.name}</h3>
                <button className="cry-btn" onClick={playCry}>
                    🔊
                </button>
            </div>
            
            {/* L'événement onClick est maintenant ICI, sur l'image uniquement */}
            <img 
                className="pokemon-sprite"
                src={pokeState.sprites?.front_default} 
                alt={pokeState.name} 
                onClick={onImageClick} 
                style={{ cursor: "pointer" }} 
            />   
        </div>
    );
}

export default PokeCard;
import React from 'react';

const PokeCard = ({ pokemon }) => {
    if (!pokemon) return null;

    return (
        <div className="poke-card">
            <div className="card-header">
                <h3>{pokemon.name.english}</h3>
            </div>
            
            <img 
                className="pokemon-sprite"
                src={pokemon.image} 
                alt={pokemon.name.english} 
            />   
        </div>
    );
}

export default PokeCard;
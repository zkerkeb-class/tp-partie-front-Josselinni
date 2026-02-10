import React from 'react';

const PokeCard = ({ pokemon, isCut = false }) => {
    if (!pokemon) return null;

    const content = (
        <>
            <div className="card-header">
                <h3 style={{ margin: 0 }}>{pokemon.name.english}</h3>
            </div>
            <img
                className="pokemon-sprite"
                src={pokemon.image}
                alt={pokemon.name.english}
            />
        </>
    );

    if (!isCut) {
        return (
            <div className="poke-card" style={{ transition: 'opacity 300ms' }}>
                {content}
            </div>
        );
    }

    return (
        <div className="poke-card cut">
            <div className="half left" aria-hidden>
                <div className="inner">
                    {content}
                </div>
            </div>

            <div className="half right" aria-hidden>
                <div className="inner" style={{ marginLeft: '-100%' }}>
                    {content}
                </div>
            </div>
        </div>
    );
};

export default PokeCard;
import { useEffect, useState } from "react";

const typeBackgrounds = {
    fire: "url('/card_backgrounds/Fire_type_background.png')", 
    normal: "url('/card_backgrounds/Flight_type_background.png')",
    grass: "url('/card_backgrounds/Plant_type_background.png')", 
    water: "url('/card_backgrounds/Water_type_background.png')", 
    bug: "url('/card_backgrounds/Plant_type_background_V3.png')", 
};
const defaultBg = "linear-gradient(135deg, #fceabb 0%, #f8b500 100%)";

const cardColors = {
    fire: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)", // Rouge/Orange feu
    normal: "linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)", // Gris/Blanc
    grass: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)", // Vert/Bleu forêt
    water: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)", // Bleu Océan
    bug: "linear-gradient(135deg, #D4FC79 0%, #96E6A1 100%)", // Vert insecte
};

const defaultCardBg = "linear-gradient(135deg, #fceabb 0%, #f8b500 100%)";


const PokeModal = ({ pokemon, onClose }) => {
    const [details, setDetails] = useState(null);

    useEffect(() => {
        fetch(pokemon.url)
            .then((res) => res.json())
            .then((data) => setDetails(data));
    }, [pokemon]);

    useEffect(() => {
        if (details?.cries?.latest) {
            const timer = setTimeout(() => {
                const audio = new Audio(details.cries.latest);
                audio.volume = 0.2; 
                audio.play().catch(e => console.log("Audio play blocked", e));
            }, 700);

            return () => clearTimeout(timer);
        }
    }, [details]);

    if (!details) return null;

    const hp = details.stats.find(stat => stat.stat.name === 'hp').base_stat;
    const moves = details.moves.slice(0, 4);

    const mainType = details.types[0].type.name;
    console.log("Type du Pokémon :", mainType);
    const backgroundStyle = typeBackgrounds[mainType] || defaultBg;
    const cardColorStyle = cardColors[mainType] || defaultCardBg;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}
                style={{ background: cardColorStyle }}
            >
                
                <div className="card-header-detail">
                    <h2>{details.name}</h2>
                    <span className="hp-badge">PV {hp}</span>
                </div>

                <div className="card-image-container"
                style={{ 
                    background: backgroundStyle,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                    <img 
                        className="modal-sprite"
                        src={details.sprites.front_default} 
                        alt={details.name} 
                    />
                </div>

                <div className="attacks-list">
                    <h3>Attack</h3>
                    <ul>
                        {moves.map((moveObj, index) => (
                            <li key={index}>{moveObj.move.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PokeModal;
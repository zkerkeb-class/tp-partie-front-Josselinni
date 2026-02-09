import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Tes dictionnaires de couleurs/images (je les garde, ils sont très bien)
const typeBackgrounds = {
    fire: "url('/card_backgrounds/Fire_type_background.png')", 
    normal: "url('/card_backgrounds/Flight_type_background.png')",
    grass: "url('/card_backgrounds/Plant_type_background.png')", 
    water: "url('/card_backgrounds/Water_type_background.png')", 
    bug: "url('/card_backgrounds/Plant_type_background_V3.png')", 
    // Ajoute les autres si besoin...
};
const cardColors = {
    fire: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)",
    normal: "linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)",
    grass: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
    water: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
    bug: "linear-gradient(135deg, #D4FC79 0%, #96E6A1 100%)",
};
const defaultBg = "linear-gradient(135deg, #fceabb 0%, #f8b500 100%)";

const PokePage = () => {
    const { id } = useParams(); // On récupère l'ID depuis l'URL
    const navigate = useNavigate(); // Pour rediriger après suppression
    const [details, setDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Mode édition

    // États pour le formulaire de modification
    const [formData, setFormData] = useState({
        englishName: "",
        hp: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0
    });

    // 1. Charger les données
    useEffect(() => {
        fetch(`http://localhost:3000/pokemon/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setDetails(data);
                // On initialise le formulaire avec les données reçues
                setFormData({
                    englishName: data.name.english,
                    hp: data.base.HP,
                    attack: data.base.Attack,
                    defense: data.base.Defense,
                    specialAttack: data.base.SpA || data.base.SpecialAttack || 0,
                    specialDefense: data.base.SpD || data.base.SpecialDefense || 0,
                    speed: data.base.Speed
                });
            });
    }, [id]);

    useEffect(() => {
        if (!details) return;

        const timer = setTimeout(() => {
            // Récupérer le cri du pokémon depuis l'API PokeAPI
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    // L'URL du cri se trouve dans les "cries"
                    const cryCry = data.cries?.latest;
                    if (cryCry) {
                        const audio = new Audio(cryCry);
                        audio.play().catch((err) => console.log("Impossible de jouer le son:", err));
                    }
                })
                .catch((err) => console.log("Erreur lors de la récupération du cri:", err));
        }, 700);

        return () => clearTimeout(timer);
    }, [id, details]);

    // 3. Fonction de Modification (Update)
    const handleUpdate = () => {
        // On prépare l'objet à envoyer au backend
        const updatedInfo = {
            name: { ...details.name, english: formData.englishName },
            base: { 
                ...details.base, 
                HP: parseInt(formData.hp),
                Attack: parseInt(formData.attack),
                Defense: parseInt(formData.defense),
                SpA: parseInt(formData.specialAttack),
                SpD: parseInt(formData.specialDefense),
                Speed: parseInt(formData.speed)
            }
        };

        fetch(`http://localhost:3000/pokemon/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedInfo)
        })
        .then(res => res.json())
        .then(data => {
            setDetails(data);
            setIsEditing(false);
        });
    };

    // 2. Fonction de Suppression
    const handleDelete = () => {
        if (window.confirm("Wanna say goodbye to your Pokemon? (definitive delete)")) {
            fetch(`http://localhost:3000/pokemon/${id}`, { method: 'DELETE' })
                .then(() => {
                    alert("Pokemon put to sleep...");
                    navigate('/');
                })
                .catch(err => console.error(err));
        }
    };

    if (!details) return <p style={{color:'white'}}>Loading...</p>;

    // Logique d'affichage (Styles)
    const mainType = details.type && details.type[0] ? details.type[0].toLowerCase() : 'normal'; 
    
    const backgroundStyle = typeBackgrounds[mainType] || defaultBg;
    const cardColorStyle = cardColors[mainType] || defaultBg;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            
            {/* Boutons d'action */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Modify"}
                </button>
                <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>
                    Delete
                </button>
            </div>

            {/* La Carte (Reprise de ton code Modal) */}
            <div className="modal-card" style={{ background: cardColorStyle }}>
                
                <div className="card-header-detail">
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={formData.englishName} 
                            onChange={(e) => setFormData({...formData, englishName: e.target.value})}
                            style={{ padding: '8px', borderRadius: '4px', border: 'none', fontSize: '24px', fontWeight: 'bold' }}
                        />
                    ) : (
                        <h2>{details.name.english}</h2>
                    )}
                </div>

                <div className="card-image-container" style={{ background: backgroundStyle, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <img 
                        className="modal-sprite"
                        src={details.image} 
                        alt={details.name.english} 
                    />
                </div>

                {/* Stats Section */}
                <div style={{ padding: '20px', color: 'white' }}>
                    <h3 style={{ marginTop: '0', marginBottom: '15px', borderBottom: '2px solid rgba(255,255,255,0.5)', paddingBottom: '10px' }}>
                        Base Stats
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        {/* HP */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>HP</label>
                            {isEditing ? (
                                <input 
                                    type="number" 
                                    value={formData.hp}
                                    onChange={(e) => setFormData({...formData, hp: e.target.value})}
                                    style={{ padding: '8px', borderRadius: '4px', border: 'none' }}
                                />
                            ) : (
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{details.base.HP}</span>
                            )}
                        </div>

                        {/* Attack */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Attack</label>
                            {isEditing ? (
                                <input 
                                    type="number" 
                                    value={formData.attack}
                                    onChange={(e) => setFormData({...formData, attack: e.target.value})}
                                    style={{ padding: '8px', borderRadius: '4px', border: 'none' }}
                                />
                            ) : (
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{details.base.Attack}</span>
                            )}
                        </div>

                        {/* Defense */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Defense</label>
                            {isEditing ? (
                                <input 
                                    type="number" 
                                    value={formData.defense}
                                    onChange={(e) => setFormData({...formData, defense: e.target.value})}
                                    style={{ padding: '8px', borderRadius: '4px', border: 'none' }}
                                />
                            ) : (
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{details.base.Defense}</span>
                            )}
                        </div>

                        {/* Sp. Attack */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Sp. Attack</label>
                            {isEditing ? (
                                <input 
                                    type="number" 
                                    value={formData.specialAttack}
                                    onChange={(e) => setFormData({...formData, specialAttack: e.target.value})}
                                    style={{ padding: '8px', borderRadius: '4px', border: 'none' }}
                                />
                            ) : (
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{details.base.SpA || details.base.SpecialAttack || 'N/A'}</span>
                            )}
                        </div>

                        {/* Sp. Defense */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Sp. Defense</label>
                            {isEditing ? (
                                <input 
                                    type="number" 
                                    value={formData.specialDefense}
                                    onChange={(e) => setFormData({...formData, specialDefense: e.target.value})}
                                    style={{ padding: '8px', borderRadius: '4px', border: 'none' }}
                                />
                            ) : (
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{details.base.SpD || details.base.SpecialDefense || 'N/A'}</span>
                            )}
                        </div>

                        {/* Speed */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Speed</label>
                            {isEditing ? (
                                <input 
                                    type="number" 
                                    value={formData.speed}
                                    onChange={(e) => setFormData({...formData, speed: e.target.value})}
                                    style={{ padding: '8px', borderRadius: '4px', border: 'none' }}
                                />
                            ) : (
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{details.base.Speed}</span>
                            )}
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <button onClick={handleUpdate} style={{ width: '100%', marginTop: '10px', background: 'green', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Apply
                    </button>
                )}
            </div>
        </div>
    );
};

export default PokePage;
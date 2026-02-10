import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePokemon = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        englishName: "",
        type1: "Normal",
        hp: 50,
        attack: 50,
        defense: 50,
        specialAttack: 50,
        specialDefense: 50,
        speed: 50,
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png"
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // On construit l'objet comme le backend l'attend
        const newPokemon = {
            name: { english: formData.englishName, french: formData.englishName, japanese: formData.englishName, chinese: formData.englishName },
            type: [formData.type1],
            base: { HP: parseInt(formData.hp), Attack: parseInt(formData.attack), Defense: parseInt(formData.defense), SpecialAttack: parseInt(formData.specialAttack), SpecialDefense: parseInt(formData.specialDefense), Speed: parseInt(formData.speed) },
            image: formData.image
        };

        console.log("Envoi du pokémon:", newPokemon);

        fetch("http://localhost:3000/pokemon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPokemon)
        })
        .then(res => {
            console.log("Réponse du serveur:", res.status);
            if (!res.ok) {
                throw new Error(`Erreur ${res.status}: ${res.statusText}`);
            }
            return res.json();
        })
        .then(() => {
            alert("Pokemon successfully added to the Pokedex!");
            navigate('/');
        })
        .catch(error => {
            console.error("Creation failed:", error);
            alert(`Erreur: ${error.message}`);
        });
    };

    return (
        <div style={{ color: 'white', maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
            <h2>Create a new Pokemon</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <label>Name :
                    <input type="text" required value={formData.englishName} onChange={e => setFormData({...formData, englishName: e.target.value})} />
                </label>

                <label>Type :
                    <select value={formData.type1} onChange={e => setFormData({...formData, type1: e.target.value})}>
                        <option value="Normal">Normal</option>
                        <option value="Fighting">Fighting</option>
                        <option value="Flying">Flying</option>
                        <option value="Poison">Poison</option>
                        <option value="Ground">Ground</option>
                        <option value="Rock">Rock</option>
                        <option value="Bug">Bug</option>
                        <option value="Ghost">Ghost</option>
                        <option value="Steel">Steel</option>
                        <option value="Fire">Fire</option>
                        <option value="Water">Water</option>
                        <option value="Grass">Grass</option>
                        <option value="Electric">Electric</option>
                        <option value="Psychic">Psychic</option>
                        <option value="Ice">Ice</option>
                        <option value="Dragon">Dragon</option>
                        <option value="Dark">Dark</option>
                        <option value="Fairy">Fairy</option>
                    </select>
                </label>

                <label>HP :
                    <input type="number" required value={formData.hp} onChange={e => setFormData({...formData, hp: e.target.value})} />
                </label>

                <label>Attack :
                    <input type="number" required value={formData.attack} onChange={e => setFormData({...formData, attack: e.target.value})} />
                </label>

                <label>Defense :
                    <input type="number" required value={formData.defense} onChange={e => setFormData({...formData, defense: e.target.value})} />
                </label>

                <label>Special Attack :
                    <input type="number" required value={formData.specialAttack} onChange={e => setFormData({...formData, specialAttack: e.target.value})} />
                </label>

                <label>Special Defense :
                    <input type="number" required value={formData.specialDefense} onChange={e => setFormData({...formData, specialDefense: e.target.value})} />
                </label>

                <label>Speed :
                    <input type="number" required value={formData.speed} onChange={e => setFormData({...formData, speed: e.target.value})} />
                </label>
                
                <button type="submit" style={{ padding: '10px', background: '#4caf50', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                    ADD TO POKEDEX
                </button>
            </form>
        </div>
    );
};

export default CreatePokemon;
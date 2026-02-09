import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePokemon = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        englishName: "",
        type1: "Normal",
        hp: 50,
        attack: 50,
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png"
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // On construit l'objet comme le backend l'attend
        const newPokemon = {
            name: { english: formData.englishName, french: formData.englishName },
            type: [formData.type1],
            base: { HP: parseInt(formData.hp), Attack: parseInt(formData.attack), Defense: 50, SpecialAttack: 50, SpecialDefense: 50, Speed: 50 },
            image: formData.image
        };

        fetch("http://localhost:3000/pokemons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPokemon)
        })
        .then(res => res.json())
        .then(() => {
            alert("Pokemon successfully added to the Pokedex!");
            navigate('/');
        });
    };

    return (
        <div style={{ color: 'white', maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
            <h2>Create a new Pokemon</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <label>Name (Anglais) :
                    <input type="text" required value={formData.englishName} onChange={e => setFormData({...formData, englishName: e.target.value})} />
                </label>

                <label>Type :
                    <select value={formData.type1} onChange={e => setFormData({...formData, type1: e.target.value})}>
                        <option value="Normal">Normal</option>
                        <option value="Fire">Fire</option>
                        <option value="Water">Water</option>
                        <option value="Grass">Grass</option>
                        <option value="Electric">Electric</option>
                    </select>
                </label>

                <label>HP :
                    <input type="number" required value={formData.hp} onChange={e => setFormData({...formData, hp: e.target.value})} />
                </label>

                <label>ATTACKS :
                    <input type="number" required value={formData.attack} onChange={e => setFormData({...formData, attack: e.target.value})} />
                </label>
                
                <button type="submit" style={{ padding: '10px', background: '#4caf50', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                    ADD TO POKEDEX
                </button>
            </form>
        </div>
    );
};

export default CreatePokemon;
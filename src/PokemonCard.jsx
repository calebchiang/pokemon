import React from 'react';
import './styles/PokemonCard.css';

// Updated to include isFlipped and onClick props
const PokemonCard = ({ pokemon, isFlipped, onClick }) => {
    const pokemonExists = pokemon && pokemon.sprites && pokemon.sprites.front_default && pokemon.name;

    return (
        // Updated to call onClick when the card is clicked
        <div className="pokemon-card" onClick={onClick}>
            {isFlipped && pokemonExists ? (
                <>
                    <div className="pokemon-image-container">
                        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                    </div>
                    <div className="pokemon-name">
                        {pokemon.name}
                    </div>
                </>
            ) : (
                // Placeholder for the back of the card if not flipped or data not available
                <div className="pokemon-card-back">
                    <img src='./images/pokemoncard.jpeg'/>
                </div>
            )}
        </div>
    );
};

export default PokemonCard;

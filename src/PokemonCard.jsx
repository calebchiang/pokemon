import React from 'react';
import './styles/PokemonCard.css';

const PokemonCard = ({ pokemon }) => {
    const pokemonExists = pokemon && pokemon.sprites && pokemon.sprites.front_default && pokemon.name;

    return (
        <div className="pokemon-card">
            {pokemonExists ? (
                <>
                    <div className="pokemon-image-container">
                        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                    </div>
                    <div className="pokemon-name">
                        {pokemon.name}
                    </div>
                </>
            ) : (
                <p>Pokémon data is not available</p>
            )}
        </div>
    );
};

export default PokemonCard;

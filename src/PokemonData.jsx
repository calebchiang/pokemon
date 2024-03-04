import React, { useState, useEffect } from 'react';
import PokemonCard from './PokemonCard.jsx'
import './styles/PokemonData.css';
const PokemonData = () => {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to generate random IDs
    const getRandomPokemonIds = (count) => {
        const maxId = 400;
        const ids = new Set();
        while (ids.size < count) {
            const id = Math.floor(Math.random() * maxId) + 1;
            ids.add(id);
        }
        return [...ids];
    };

    // Function to shuffle an array
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    };

    useEffect(() => {

        console.log("Effect is running");
        const fetchPokemon = async () => {
            try {
                // Generate 8 unique IDs and then duplicate and shuffle them
                const uniqueIds = getRandomPokemonIds(8);
                const gameIds = shuffleArray([...uniqueIds, ...uniqueIds]); // Duplicate and shuffle IDs

                const pokemonPromises = gameIds.map(id =>
                    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(response => response.json())
                );
                const pokemonData = await Promise.all(pokemonPromises);
                console.log(pokemonData);
                setPokemon(pokemonData);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchPokemon();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data</div>;

    return (
        <div className = 'pokemon-grid'>
            {pokemon.map((p, index) => (

                <PokemonCard key={index} pokemon={p} />
            ))}
        </div>
    );

};

export default PokemonData;

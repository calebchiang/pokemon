import React, { useState, useEffect } from 'react';
import PokemonCard from './PokemonCard.jsx'
import './styles/PokemonData.css';
const PokemonData = () => {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [turns, setTurns] = useState(0);

    const handleCardClick = (uid) => {
        console.log("clicked");
        // Prevent flipping more than two cards or flipping already matched or flipped cards
        if(flippedCards.includes(uid) || matchedCards.includes(uid) || flippedCards.length === 2){
            return;
        }
        const newFlippedCards = [...flippedCards,uid];
        setFlippedCards(newFlippedCards);

        if (newFlippedCards.length === 2) {
            setTurns(prevTurns => prevTurns + 1);
            const firstCard = pokemon.find(p => p.uid === newFlippedCards[0]);
            const secondCard = pokemon.find(p => p.uid === newFlippedCards[1]);

            if (firstCard.matchId === secondCard.matchId) {
                // They match, keep them flipped
                setMatchedCards(prev => [...prev, newFlippedCards[0], newFlippedCards[1]]);
                setFlippedCards([]);
            } else {
                // No match, flip them back after a delay
                setTimeout(() => {
                    setFlippedCards(currentFlipped => currentFlipped.filter(uid => !newFlippedCards.includes(uid)));
                }, 1000); // Delay of 1000 milliseconds
            }
        }
    };

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
        if (matchedCards.length === 16) { // 8 matches * 2 cards per match
            alert('Congratulations! You finished the game.');
        }
    }, [matchedCards]);

    const initializeGame = async () => {
        try {
            setLoading(true);
            const uniqueIds = getRandomPokemonIds(8);
            const gameIds = shuffleArray([...uniqueIds, ...uniqueIds]);

            const pokemonPromises = gameIds.map(id =>
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(response => response.json())
            );
            let pokemonData = await Promise.all(pokemonPromises);

            pokemonData = pokemonData.map((p, index) => ({
                ...p,
                uid: index, // Unique identifier for each card
                matchId: p.id // Matching identifier (using the Pokémon's original ID)
            }));

            pokemonData = shuffleArray(pokemonData);
            setPokemon(pokemonData);
            setFlippedCards([]);
            setMatchedCards([]);
            setTurns(0);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };


    useEffect(() => {
        initializeGame();
    }, []);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data</div>;

    return (
        <div className="game-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
            {/* Turn counter display */}
            <div className="turns-counter" style={{ marginRight: '20px' }}>
                <p> Turns: {turns} </p>
                <p>Matches: {matchedCards.length / 2}</p>
                <button onClick={initializeGame}>Reset Game</button>
            </div>

            {/* Pokemon grid */}
            <div className='pokemon-grid'>
                {pokemon.map((p) => (
                    <PokemonCard
                        key={p.uid}
                        pokemon={p}
                        isFlipped={flippedCards.includes(p.uid) || matchedCards.includes(p.uid)}
                        onClick={() => handleCardClick(p.uid)}
                    />
                ))}
            </div>
        </div>
    );



};

export default PokemonData;

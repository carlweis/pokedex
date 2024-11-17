import { useEffect, useState } from "react";
import { fetchAllPokemon, fetchPokemonDetailsByName, fetchEvolutionChainById } from "./api";

function App() {
    const [pokemonIndex, setPokemonIndex] = useState([])
    const [pokemon, setPokemon] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [pokemonDetails, setPokemonDetails] = useState()

    useEffect(() => {
        const fetchPokemon = async () => {
            const {results: pokemonList} = await fetchAllPokemon()

            setPokemon(pokemonList)
            setPokemonIndex(pokemonList)
        }

        fetchPokemon().then(() => {
            /** noop **/
        })
    }, [])

    const onSearchValueChange = (event) => {
        const value = event.target.value
        setSearchValue(value)

        setPokemon(
            pokemonIndex.filter(monster => monster.name.includes(value))
        )
    }

    const onGetDetails = (name) => async () => {
        try {
            const pokemon = await fetchPokemonDetailsByName(name);
            const evolutionChain = await fetchEvolutionChainById(pokemon.id);

            let evolutions = [];
            let current = evolutionChain.chain;
            while (current) {
                evolutions.push(current.species.name);
                current = current.evolves_to[0];
            }
            pokemon.evolutions = evolutions;

            setPokemonDetails(pokemon);
            console.log(pokemon);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className={'pokedex__container'}>
            <div className={'pokedex__search-input'}>
                <input value={searchValue} onChange={onSearchValueChange} placeholder={'Search Pokemon'}/>
            </div>
            <div className={'pokedex__content'}>
                {pokemon.length > 0 ? (
                    <div className={'pokedex__search-results'}>
                        {
                            pokemon.map(monster => {
                                return (
                                    <div className={'pokedex__list-item'} key={monster.name}>
                                        <div className="pokedex__list-item__title">
                                            {monster.name}
                                        </div>
                                        <button onClick={onGetDetails(monster.name)}>Get Details</button>
                                    </div>
                                )
                            })
                        }
                    </div>
                ) : (
                        searchValue && <div>No results found</div>
                    )}
                {
                    pokemonDetails && (
                        <div className={'pokedex__details'}>
                            <div className="pokedex__details-name">{pokemonDetails.name}</div>
                            <div className="pokedex__details-sprite">
                                <img src={pokemonDetails.sprites.front_default} alt={pokemonDetails.name} />
                            </div>
                            <div>
                                <div  className="pokedex__details-stats">
                                    <div>
                                        <div className="header">Types</div>
                                        <ul>
                                            {pokemonDetails.types.map(type => (
                                                <li key={type.type.name}>{type.type.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="header">Moves</div>
                                        <ul>
                                            {pokemonDetails.moves.map(move => (
                                                <li key={move.move.name}>{move.move.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <div className="header">Evolutions</div>
                                    <div className="pokedex__details-evolutions">
                                        {pokemonDetails.evolutions.map(evolution => (
                                            <span key={evolution}>{evolution}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default App;

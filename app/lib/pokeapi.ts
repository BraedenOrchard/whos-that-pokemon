import { IPokemon } from "../interfaces/IPokemon";

export const fetchList = async (): Promise<IPokemon[]> => {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
  const data = await res.json();

  const pokemonArray: IPokemon[] = data.results.map((pokemon: {name: string}, index: number) => ({
    name: pokemon.name,
    id: index + 1,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png`,
  }));

  return pokemonArray;
};
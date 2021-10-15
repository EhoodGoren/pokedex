const baseURL = "https://pokeapi.co/api/v2/";
// identifier is name or id
async function getPokemon(identifier){
    const response = await axios.get(`${baseURL}pokemon/ditto`).catch((error) => {
        throw error
    });
    return response.data;
}

// returns a pokemon object with selected attributes
function pokemonInfo(pokemon){
    const newPokemon = {
        height: pokemon.height,
        weight: pokemon.weight,
        img: pokemon.image,
        back: pokemon.backImg
    }
    return newPokemon;
}

// generates a new pokemon in DOM
// pokemon = obj
function generatePokemon(pokemon){
    console.log(pokemon);
    const newPokemon = document.createElement("div");
    for(let attribute in pokemon){
        console.log(pokemon[attribute])
        const newAttribute = document.createElement("div");
        newAttribute.innerText = `${attribute}: ${pokemon[attribute]}`;
        newPokemon.appendChild(newAttribute);
    }
    const resultArea = document.getElementById("selected_pokemon");
    resultArea.appendChild(newPokemon);
}

// identifier is name or id
async function createPokemon(identifier){
    const pokemonResponse = await getPokemon(identifier);
    const selectedPokemon = pokemonInfo(pokemonResponse);
    generatePokemon(selectedPokemon);
}

createPokemon("Pikachu");

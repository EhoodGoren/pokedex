const baseURL = "https://pokeapi.co/api/v2/";
// identifier is name or id
async function getPokemon(identifier){
    if (typeof(identifier) === "string"){
        identifier = identifier.toLowerCase();
    }
    identifier = identifier.toLowerCase();
    const response = await axios.get(`${baseURL}pokemon/${identifier}`).catch((error) => {
        throw error
    });
    return response.data;
}

// returns a pokemon object with selected attributes
function pokemonInfo(pokemon){
    const newPokemon = {
        height: pokemon.height,
        weight: pokemon.weight,
        img: pokemon.sprites.front_default,
        back: pokemon.sprites.back_default
    }
    return newPokemon;
}

// generates a new pokemon in DOM
// pokemon = obj
function generatePokemon(pokemon){
    const newPokemon = document.createElement("div");
    for(let attribute in pokemon){
        const newAttribute = checkAttribute(pokemon, attribute)
        newPokemon.appendChild(newAttribute);
    }
    const resultArea = document.getElementById("selected_pokemon");
    resultArea.appendChild(newPokemon);
}

function checkAttribute(pokemon, attribute){
    if(attribute === "img" || attribute === "back"){
        const newImg = document.createElement("img");
        newImg.setAttribute("src", pokemon[attribute]);
        return newImg;
    }
    else{
        const textAttribtue = document.createElement("div");
        textAttribtue.innerText = `${attribute}: ${pokemon[attribute]}`;
        return textAttribtue;
    }
}

// identifier is name or id
async function createPokemon(identifier){
    const pokemonResponse = await getPokemon(identifier);
    console.log(pokemonResponse)
    const selectedPokemon = pokemonInfo(pokemonResponse);
    generatePokemon(selectedPokemon);
}

createPokemon("Pikachu");

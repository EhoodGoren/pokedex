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
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
        front: pokemon.sprites.front_default,
        back: pokemon.sprites.back_default
    }
    return newPokemon;
}

// generates a new pokemon in DOM
// pokemon = obj
function generatePokemon(pokemon){
    const newPokemon = document.createElement("div");
    newPokemon.classList.add("pokemon");
    for(let attribute in pokemon){
        const newAttribute = checkAttribute(attribute, pokemon[attribute]);
        if(newAttribute === "dont_display") continue;
        newPokemon.appendChild(newAttribute);
    }
    const resultArea = document.getElementById("selected_pokemon");
    resultArea.appendChild(newPokemon);
}

function checkAttribute(attribute, value){
    if(attribute === "front"){
        const newImg = document.createElement("img");
        newImg.setAttribute("src", value);
        newImg.classList.add("pokemon_picture");
        return newImg;
    }
    if(attribute === "back") return "dont_display";
    else{
        const textAttribtue = document.createElement("div");
        textAttribtue.innerText = `${attribute}: ${value}`;
        return textAttribtue;
    }
}

// identifier is name or id
async function createPokemon(identifier){
    const pokemonResponse = await getPokemon(identifier);
    const selectedPokemon = pokemonInfo(pokemonResponse);
    generatePokemon(selectedPokemon);
    addHoverListeners(selectedPokemon.front, selectedPokemon.back);
}

function addHoverListeners(frontImg, backImg){
    const pokemons = document.querySelectorAll(".pokemon_picture");
    for(let pokemon of pokemons){
        pokemon.addEventListener("mouseover", (event) => {
            showBack(event, backImg);
        });
        pokemon.addEventListener("mouseleave", (event) => {
            showFront(event, frontImg);
        });
    }
}

function showBack(event, backImg){
    const hoveredPokemonFront = event.target;
    hoveredPokemonFront.setAttribute("src", backImg);
}

function showFront(event, frontImg){
    const revertPokemonBack = event.target;
    revertPokemonBack.setAttribute("src", frontImg);
}

createPokemon("pikachu");

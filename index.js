const baseURL = "https://pokeapi.co/api/v2/";
// Searches for a pokemon by its name or id
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

// Returns a pokemon object with selected attributes
function pokemonInfo(pokemon){
    const newPokemon = {
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
        types: pokemon.types,
        front: pokemon.sprites.front_default,
        back: pokemon.sprites.back_default,
    }
    return newPokemon;
}

// Generates a new pokemon in DOM
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

// Returns an element with the value as content
function checkAttribute(attribute, value){
    if(attribute === "front"){
        const newImg = document.createElement("img");
        newImg.setAttribute("src", value);
        newImg.classList.add("pokemon_picture");
        return newImg;
    }
    if(attribute === "back") return "dont_display";
    if(attribute === "types"){
        return createTypes(value);
    }
    else{
        const textAttribtue = document.createElement("div");
        textAttribtue.innerText = `${attribute}: ${value}`;
        return textAttribtue;
    }
}

// Creates the types section
// types is an object
function createTypes(types){
    const typesList = document.createElement("div");
    typesList.innerText = "Types: ";
    for(let type of types){
        const newType = document.createElement("div");
        newType.innerText += `${type.type.name} `;
        newType.classList.add("types");
        typesList.appendChild(newType);
    }
    return typesList;
}

// Displays a new featured Pokemon.
async function createPokemon(identifier){
    clearPrevPokemon();
    const pokemonResponse = await getPokemon(identifier);
    const selectedPokemon = pokemonInfo(pokemonResponse);
    generatePokemon(selectedPokemon);
    addHoverListeners(selectedPokemon.front, selectedPokemon.back);
    addTypesListeners(selectedPokemon);
}

// Clears all previously displayed pokemons
function clearPrevPokemon(){
    const existingPokemons = document.querySelectorAll(".pokemon");
    for(let pokemon of existingPokemons){
        pokemon.remove();
    }
}

// Hovering mouse over a pokemon will display its back image, leaving will revert to front
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

// Shows the pokemon's back instead of front
function showBack(event, backImg){
    const hoveredPokemonFront = event.target;
    hoveredPokemonFront.setAttribute("src", backImg);
}

// Shows the pokemon's front instead of back
function showFront(event, frontImg){
    const revertPokemonBack = event.target;
    revertPokemonBack.setAttribute("src", frontImg);
}

// Adds click listener for each type of a pokemon
function addTypesListeners(){
    const typeList = document.querySelectorAll(".types");
    for(let type of typeList){
        type.addEventListener("click", searchType)
    }
}

// Searches all pokemons by the cilcked type, and displays them
async function searchType(event){
    const clickedType = event.target.innerText;
    const typePokemons = await getTypePokemons(clickedType);
    displayTypePokemons(typePokemons);
}

// Searches all pokemons by a type
async function getTypePokemons(type){
    const response = await axios.get(`${baseURL}type/${type}`).catch((error) => {
        throw error
    });
    return response.data;
}

// Displays all matching type pokemons
function displayTypePokemons(typePokemons){
    clearPrevTypePokemons();
    const typePokemonList = createTypePokemonList();

    const pokemonList = typePokemons.pokemon;
    for(let pokemon of pokemonList){
        const typePokemon = document.createElement("li");
        typePokemon.classList.add("type_pokemons");
        typePokemon.innerText = pokemon.pokemon.name;
        typePokemonList.appendChild(typePokemon);
    }
    addClickToTypePokemons();
}

// Clears all previously displayed matching type pokemons
function clearPrevTypePokemons(){
    const typePokemons = document.querySelectorAll(".type_pokemons_list");
    for(let pokemon of typePokemons){
        pokemon.remove();
    }
}

// Creates a list for all matching type pokemons 
function createTypePokemonList(){
    const pokemonDisplayList = document.createElement("ul");
    pokemonDisplayList.classList.add("type_pokemons_list");
    const selectedPokemon = document.querySelector("#selected_pokemon");
    selectedPokemon.appendChild(pokemonDisplayList);
    return pokemonDisplayList;
}

// Searches for a pokemon by its name or id with the text in the search bar
function searchPokemon(){
    const inputValue = document.getElementById("pokemon_input").value;
    createPokemon(inputValue);
}

// Adds a listener to every matching type pokemon
function addClickToTypePokemons(){
    const typePokemons = document.querySelectorAll(".type_pokemons");
    for(let pokemon of typePokemons){
        pokemon.addEventListener("click", typePokemonClicked)
    }
}

// Handles a click on a matching type pokemon
async function typePokemonClicked(event){
    const clickedPokemon = event.target;
    await createPokemon(clickedPokemon.innerText);
    clearPrevTypePokemons();
}

createPokemon("magnemite");

const searchButton = document.querySelector("#search_pokemon");
searchButton.addEventListener("click", searchPokemon);

// document.body.style.backgroundImage = "url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2fb2821a-1406-4a1d-9b04-6668f278e944/d843okx-eb13e8e4-0fa4-4fa9-968a-e0f36ff168de.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzJmYjI4MjFhLTE0MDYtNGExZC05YjA0LTY2NjhmMjc4ZTk0NFwvZDg0M29reC1lYjEzZThlNC0wZmE0LTRmYTktOTY4YS1lMGYzNmZmMTY4ZGUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.TIK_E5L8dTyBUk_dADA5WkLP8jSJMR7YGJG54KNAido')"
// document.querySelector("#selected_pokemon").style.backgroundImage = "url('')"

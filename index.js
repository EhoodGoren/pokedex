const baseURL = "http://localhost:3000/";
// Searches for a pokemon by its name or id
async function getPokemon(identifier){
    const username = document.querySelector('#username').value;
    let response;
    try{
        if (typeof(identifier) === "string"){
            identifier = identifier.toLowerCase();
            response = await axios.get(`${baseURL}pokemon/query?query=${identifier}`, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Headers": "*",
                    "username": username,
                }
            });
        }
        else{
            response = await axios.get(`${baseURL}pokemon/get/${identifier}`);
        }
    }
    catch (error){
        displayError("Can't find pokemon");
    }
    // identifier = identifier.toLowerCase();
    // const response = await axios.get(`${baseURL}pokemon/${identifier}`);
    return response.data;
}

/*// Returns a pokemon object with selected attributes
function pokemonInfo(pokemon){
    const newPokemon = {
        Name: pokemon.name,
        Height: pokemon.height,
        Weight: pokemon.weight,
        Types: pokemon.types,
        front: pokemon.front_pic,
        back: pokemon.back_pic,
        abilities: pokemon.abilities
    }
    console.log(newPokemon);
    return newPokemon;
}*/

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
    if(attribute === "front_pic"){
        const newImg = document.createElement("img");
        newImg.setAttribute("src", value);
        newImg.classList.add("pokemon_picture");
        return newImg;
    }
    if(attribute === "back_pic") return "dont_display";
    if(attribute === "types"){
        return createTypes(value);
    }
    if(attribute === "abilities"){
        return createAbilities(value);
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
        // newType.innerText += `${type.type.name} `;
        newType.innerText += `${type} `;
        newType.classList.add("types");
        typesList.appendChild(newType);
    }
    return typesList;
}

function createAbilities(abilities){
    const abilitiesList = document.createElement("div");
    abilitiesList.innerText = "Abilities: ";
    for(let ability of abilities){
        const newAbility = document.createElement("div");
        newAbility.innerText += `${ability} `;
        newAbility.classList.add("abilities");
        abilitiesList.appendChild(newAbility);
    }
    return abilitiesList;
}

// Displays a new featured Pokemon.
async function createPokemon(identifier){
    clearPrevPokemon();
    clearPrevTypePokemons();
    let error = false;
    const responsePokemon = await getPokemon(identifier).catch(() => {
        error = true;
    });
    if(error){
        pokemonNotFound();
        return;
    }
    // const selectedPokemon = pokemonInfo(pokemonResponse);
    generatePokemon(responsePokemon);
    addHoverListeners(responsePokemon.front_pic, responsePokemon.back_pic);
    addTypesListeners(responsePokemon);
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
        // type.addEventListener("click", searchType)
        type.addEventListener("mouseover", () => {
            type.classList.add("hovered");
        });
        type.addEventListener("mouseleave", () => {
            type.classList.remove("hovered");
        })
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
    const response = await axios.get(`${baseURL}type/${type}`);
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
    let input = document.getElementById("pokemon_input");
    createPokemon(input.value);
    input.value = "";
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

function pokemonNotFound(){
    // const pokemon = document.querySelector("#selected_pokemon");
    // const error = document.createElement("div");
    const error = document.querySelector('#status');
    error.innerText = "Pokemon not found";
    // pokemon.appendChild(error);
    // setTimeout(() => pokemon.removeChild(error), 5000);
    setTimeout(() => {document.querySelector('#status').value=""}, 5000);
}

const searchButton = document.querySelector("#search_pokemon");
searchButton.addEventListener("click", searchPokemon);

document.body.style.backgroundImage = "url('https://pbs.twimg.com/media/DVMT-6OXcAE2rZY.jpg')";


document.querySelector('#capture').addEventListener('click', capturePokemon)

async function capturePokemon(){
    const username = document.querySelector('#username').value;
    const id = document.querySelector('#pokemon_input').value;
    if(!typeof(id) === 'number') return;
    try{
        await axios.put(`${baseURL}pokemon/catch/${id}`,{},{
            headers: {
                // "Access-Control-Allow-Origin": "*",
                // "Access-Control-Allow-Methods": "*",
                // "Access-Control-Allow-Headers": "*",
                "username": username,
            }
        })
        document.querySelector('#status').innerText = 'Captured!';
        setTimeout(()=>document.querySelector('#status').innerText = '',5000);
        await getUsersPokemon();
    }
    catch(error){
        displayError("Pokemon already captured!");
    }
}
function displayError(error){
    const statusBox = document.querySelector('#status');
    statusBox.innerText = error;
    setTimeout(()=>statusBox.innerText="",5000);
}

document.querySelector('#release').addEventListener("click", releasePokemon)

async function releasePokemon(){
    const username = document.querySelector('#username').value;
    const id = document.querySelector('#pokemon_input').value;
    try{
        await axios.delete(`${baseURL}pokemon/release/${id}`,{
            headers: {
                "username": username,
            }
        })
        document.querySelector('#status').innerText = 'Released!';
        setTimeout(()=>document.querySelector('#status').innerText = '',5000);
        await getUsersPokemon();
    }
    catch(error){
        displayError("Pokemon isn't in your collection");
    }   
}

async function getUsersPokemon(){
    const username = document.querySelector('#username').value;
    const userPokemonsResponse = await axios.get(`${baseURL}pokemon/`, {
        headers: {
            "username": username,
        }
    });
    const userPokemons = userPokemonsResponse.data['was_caught'];
    const userPokemonDisplay = document.querySelector('#user_pokemons');
    userPokemonDisplay.innerText = '';
    for(let pokemon of userPokemons){
        const newPokemon = document.createElement('div');
        newPokemon.innerText = pokemon;
        userPokemonDisplay.appendChild(newPokemon);
    }
}

document.querySelector('#user_pokemons_btn').addEventListener('click', getUsersPokemon);

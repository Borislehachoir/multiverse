function toggleMenu() {
    const menu = document.getElementById("menu");
    const separator = document.getElementById("separator");

    menu.classList.toggle("hidden");
    separator.classList.toggle("hidden");
}


var form = document.getElementById("searchForm");
var deckDiv = document.getElementById("deck");
var passBtn = document.getElementById("passBtn");
var likeBtn = document.getElementById("likeBtn");
var matchesList = document.getElementById("matchesList");

var currentCandidates = [];
var myMatches = [];

// --- LocalStorage functions ---
function saveMatches() {
    localStorage.setItem('myMatches', JSON.stringify(myMatches));
}

function loadMatches() {
    var stored = localStorage.getItem('myMatches');
    if (stored) {
        myMatches = JSON.parse(stored);
        renderMatches();
    }
}

function removeMatch(characterId) {
    myMatches = myMatches.filter(function (match) {
        return match.id !== characterId;
    });
    saveMatches();
    renderMatches();
}

function renderMatches() {
    matchesList.innerHTML = "";
    for (var i = 0; i < myMatches.length; i++) {
        var match = myMatches[i];
        var img = document.createElement("img");
        img.src = match.image;
        img.title = match.name;
        img.className = "match-avatar";
        img.addEventListener("click", function () {
            removeMatch(match.id);
        });
        matchesList.appendChild(img);
    }
}

// --- Deck functions ---
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    var baseUrl = "https://rickandmortyapi.com/api/character/";

    var name = document.getElementById("nameInput").value;
    var status = document.getElementById("statusSelect").value;
    var gender = document.getElementById("genderSelect").value;

    var params = [];
    if (name !== "") { params.push("name=" + name); }
    if (status !== "") { params.push("status=" + status); }
    if (gender !== "") { params.push("gender=" + gender); }

    var finalUrl = baseUrl;
    if (params.length > 0) {
        finalUrl = finalUrl + "?";
        for (var i = 0; i < params.length; i++) {
            finalUrl = finalUrl + params[i];
            if (i < params.length - 1) { finalUrl = finalUrl + "&"; }
        }
    }

    deckDiv.innerHTML = "";
    currentCandidates = [];

    try {
        var response = await fetch(finalUrl);
        if (!response.ok) { throw new Error("Erreur API"); }
        var data = await response.json();
        currentCandidates = data.results;
        showNextCard();
    } catch (error) {
        deckDiv.innerHTML = "<p>Vous savez, c'est pas grave si personne ne s'affiche. Et puis le célibat, au final... vous êtes libre, non ? </p>";
    }
});

function showNextCard() {
    deckDiv.innerHTML = "";
    if (currentCandidates.length === 0) {
        deckDiv.innerHTML = "<p>Félicitations boloss, vous avez vidé le multivers de tous ses célibataires.</p>";
        return;
    }
    var character = currentCandidates[0];
    var card = `
        <div class="character-card">
          <img src="${character.image}" alt="${character.name}">
          <h2>${character.name}</h2>
          <p> Status : <span>${character.status}</span> </p>
          <p>Espèce: ${character.species}</p>
          <p>Genre: ${character.gender}</p>
        </div>
      `;
    deckDiv.innerHTML = card;
}

passBtn.addEventListener("click", function () {
    if (currentCandidates.length > 0) {
        currentCandidates.shift();
        showNextCard();
    }
});

likeBtn.addEventListener("click", function () {
    if (currentCandidates.length > 0) {
        var liked = currentCandidates.shift();
        myMatches.push(liked);
        saveMatches();
        renderMatches();
        showNextCard();
    }
});

loadMatches();

// let deck; 
let deckId;
let currentOpponentCard;
let currentPlayerCard;

let opponentCardEl = document.getElementById("opponent-card");
let playerCardEl = document.getElementById("player-card");

function getNewDeck(){ //handleClick() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            // deck = data;
            console.log(data)
            deckId = data.deck_id;
    })
};

function draw(){
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            currentOpponentCard = data.cards[0];
            currentPlayerCard = data.cards[1];
            renderCards();
        })
}

document.getElementById("new-deck").addEventListener("click", getNewDeck);
document.getElementById("draw-btn").addEventListener("click", draw);

function renderCards(){
    clearCards();

    const opponentCard = document.createElement("img");
    opponentCard.setAttribute("src", `${currentOpponentCard.image}`)

    const playerCard = document.createElement("img");
    playerCard.setAttribute("src", `${currentPlayerCard.image}`)

    opponentCardEl.append(opponentCard);
    playerCardEl.append(playerCard)
}

function clearCards(){
    opponentCardEl.innerHTML = "";
    playerCardEl.innerHTML = "";
}
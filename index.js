
let deckId;
let currentOpponentCard;
let currentPlayerCard;

let opponentCardEl = document.getElementById("opponent-card");
let playerCardEl = document.getElementById("player-card");
let drawBtn = document.getElementById("draw-btn");
let announcementEl = document.getElementById("announcement-el"); 

let opponentScore = 0;
let playerScore = 0;


// Add multiple cards to cardpile - dependent on remaining, connect to "renderRemainingCards"
// use z-index: -1, -2 for each, and skew them slightly behind the card in front.

function getNewDeck(){ 
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id;
            renderRemainingCards(52);
    })
};

function draw(){
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            currentOpponentCard = data.cards[0];
            currentPlayerCard = data.cards[1];
            renderCards();
            checkDrawWinner(currentOpponentCard, currentPlayerCard);
            renderRemainingCards(data.remaining);

            if(data.remaining <= 0){
                disableDrawBtn(true);
                displayWinner()
            }
        })
}

function displayWinner(){

    let displayText = "";

    if (opponentScore > playerScore){
        displayText = "Opponent wins!";
    }
    else if (playerScore > opponentScore){
        displayText = "You win!";
    }
    else {
        displayText = "It's a tie!";
    }

    announcementEl.textContent = displayText;
    showModal(true);
}

function resetGame(){
    getNewDeck();
    
    disableDrawBtn(false);

    announcementEl.textContent = "Let's play a game of War";

    playerScore = 0; 
    opponentScore = 0;
    renderScore();
}

function disableDrawBtn(shouldDisable){
    drawBtn.disabled = shouldDisable || false;
}

document.getElementById("new-game").addEventListener("click", function(){
    resetGame();
    getNewDeck(); 
    showModal(false);
});
drawBtn.addEventListener("click", draw);


function showModal(showModal){
    const startGameModal = document.getElementById("start-game-modal");
    if (showModal){
        startGameModal.style.display = "block";
    }
    else {
        startGameModal.style.display = "none";
    }
}


function renderCards(){
    clearCards();

    const opponentCard = document.createElement("img");
    opponentCard.setAttribute("src", `${currentOpponentCard.image}`);
    opponentCard.classList.add("card");

    const playerCard = document.createElement("img");
    playerCard.setAttribute("src", `${currentPlayerCard.image}`);
    playerCard.classList.add("card");


    opponentCardEl.append(opponentCard);
    playerCardEl.append(playerCard)
}

function clearCards(){
    opponentCardEl.innerHTML = "";
    playerCardEl.innerHTML = "";
}

function checkDrawWinner(opponentCard, playerCard){
    const opponentCardScore = convertCardValueToNumber(opponentCard.value);
    const playerCardScore = convertCardValueToNumber(playerCard.value);

    if (opponentCardScore === playerCardScore){
        // Both get score? or none? 
        addScore("opponent");
        addScore("player");
    }
    else if(opponentCardScore > playerCardScore){
        addScore("opponent");
    }
    else{
        addScore("player");
    }
}

function convertCardValueToNumber(cardValue){
    let cardValueInNumber;
    switch (cardValue) {
        case "ACE":
            cardValueInNumber = 14;
            break;
        case "KING":
            cardValueInNumber = 13;
            break;
        case "QUEEN":
            cardValueInNumber = 12;
            break;
        case "JACK":
            cardValueInNumber = 11;
            break;
        default:
            cardValueInNumber = Number(cardValue);
    }
    return cardValueInNumber;
}

function addScore(playerOrOpponent){
    if (playerOrOpponent == "player"){
        playerScore += 1;
    }
    else{
        opponentScore += 1;
    }
    renderScore();
}

function renderScore(){
    document.getElementById("opponent-score-count").innerText = opponentScore;
    document.getElementById("player-score-count").innerText = playerScore;
}

function renderRemainingCards(remainingCards){
    document.getElementById("remaining-cards-count").innerText = remainingCards;
}
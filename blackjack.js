var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0;

var hidden;
var deck;

var saveBalance = 10000;

var yourBalance = 10000;
var betValue = 0;

var win = "";
var blackJack = "";
var draw = "";

let message = "";

let hiddenImg = document.createElement("img");

window.onload = function () {
  buildDeck();
  startBet();
};

function buildDeck() {
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  let types = ["C", "D", "H", "S"];

  deck = [];

  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push(values[j] + "-" + types[i]);
    }
  }
}

function removeDeck(deck) {
  deck = [];
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length);
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

function displayDeck() {
  console.log(deck);
}

function startBet() {
  buildDeck();
  displayDeck();
  shuffleDeck();
  displayDeck();

  yourBalance = saveBalance;

  document.getElementById("hit").disabled = true;
  document.getElementById("stay").disabled = true;
  document.getElementById("play-again").disabled = true;

  document.getElementById("bet").disabled = false;
  document.getElementById("bet100").disabled = false;
  document.getElementById("bet500").disabled = false;
  document.getElementById("bet1000").disabled = false;
  document.getElementById("bet5000").disabled = false;
  document.getElementById("bet10000").disabled = false;

  document.getElementById("bet").addEventListener("click", finalBet);
  document.getElementById("bet100").addEventListener("click", bet100);
  document.getElementById("bet500").addEventListener("click", bet500);
  document.getElementById("bet1000").addEventListener("click", bet1000);
  document.getElementById("bet5000").addEventListener("click", bet5000);
  document.getElementById("bet10000").addEventListener("click", bet10000);
  displayBalance();
  updateBet();
}

function startGame() {
  hidden = deck.pop();
  hiddenImg.src = "./cards/BACK.png";
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden);
  document.getElementById("dealer-cards").append(hiddenImg);

  giveCardsToDealer();
  document.getElementById("dealer-sum").innerText =
    dealerSum - getValue(hidden);

  for (let i = 0; i < 2; i++) {
    giveCardToPlayer();
  }
  console.log(dealerSum);

  document.getElementById("your-sum").innerText = yourSum;

  if (yourSum == 21) {
    canHit = false;
    document.getElementById("hit").disabled = true;
    blackJack = true;
    stay();
  }

  if (yourSum > 21 && yourAceCount > 0) {
    while (yourAceCount > 0) {
      yourSum = reduceAce(yourSum, yourAceCount);
      // yourAceCount -= 1;
    }
  }

  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);
  document.getElementById("play-again").addEventListener("click", playAgain);
}

function hit() {
  giveCardToPlayer();

  if (yourSum == 21) {
    document.getElementById("hit").disabled = true;
    stay();
  }

  if (reduceAce(yourSum, yourAceCount) > 21) {
    document.getElementById("hit").disabled = true;
    stay();
  }
  if (yourAceCount > 0 && yourSum > 21) {
    yourSum = reduceAce(yourSum, yourAceCount);
    yourAceCount -= 1;
    document.getElementById("your-sum").innerText = yourSum;
  } else document.getElementById("your-sum").innerText = yourSum;

  if (yourSum == 21) {
    document.getElementById("hit").disabled = true;
    stay();
  }
}

function stay() {
  hiddenImg.src = "./cards/" + hidden + ".png";

  document.getElementById("stay").disabled = true;
  document.getElementById("hit").disabled = true;

  console.log(dealerAceCount);
  console.log(dealerSum);

  if (dealerSum < 17 || dealerSum == 22) {
    while (dealerSum < 17) {
      giveCardsToDealer();
      console.log(dealerSum);
      if (dealerAceCount > 0 && dealerSum > 21) {
        while (dealerAceCount > 0) {
          dealerSum = reduceAce(dealerSum, dealerAceCount);
          //dealerAceCount -= 1;
        }
      }
    }
  }

  console.log(dealerSum);
  console.log(dealerAceCount);

  if (yourSum > 21) {
    message = "You Lose!";
    win = false;
  } else if (dealerSum > 21) {
    message = "You win!";
    win = true;
  } else if (yourSum == dealerSum) {
    message = "Draw!";
    draw = true;
  } else if (yourSum > dealerSum) {
    message = "You win!";
    win = true;
  } else if (yourSum < dealerSum) {
    message = "You Lose!";
    win = false;
  }

  updateBalance();
  displayBalance();
  updateSum();

  displayMessage();
  document.getElementById("play-again").disabled = false;
}

function displayMessage() {
  document.getElementById("results").innerText = message;
}

function getValue(card) {
  let data = card.split("-");
  let value = data[0];

  if (isNaN(value)) {
    if (value == "A") {
      return 11;
    }
    return 10;
  }

  return parseInt(value);
}

function checkAce(card) {
  if (card[0] == "A") {
    return 1;
  }
  return 0;
}

function giveCardsToDealer() {
  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  dealerSum += getValue(card);
  dealerAceCount += checkAce(card);
  document.getElementById("dealer-cards").append(cardImg);
}

function removeCards() {
  document.getElementById("dealer-cards").innerHTML = "";
  document.getElementById("your-cards").innerHTML = "";
}

function giveCardToPlayer() {
  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  yourSum += getValue(card);
  yourAceCount += checkAce(card);
  document.getElementById("your-cards").append(cardImg);
}

function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}

function bet100() {
  if (
    betValue >= yourBalance ||
    100 > yourBalance ||
    betValue + 100 > yourBalance
  ) {
    return;
  } else {
    betValue += 100;
    updateBet();
  }
}

function bet500() {
  if (
    betValue >= yourBalance ||
    500 > yourBalance ||
    betValue + 500 > yourBalance
  ) {
    return;
  } else {
    betValue += 500;
    updateBet();
  }
}

function bet1000() {
  if (
    betValue >= yourBalance ||
    1000 > yourBalance ||
    betValue + 1000 > yourBalance
  ) {
    return;
  } else {
    betValue += 1000;
    updateBet();
  }
}

function bet5000() {
  if (
    betValue >= yourBalance ||
    5000 > yourBalance ||
    betValue + 5000 > yourBalance
  ) {
    return;
  } else {
    betValue += 5000;
    updateBet();
  }
}

function bet10000() {
  if (
    betValue >= yourBalance ||
    10000 > yourBalance ||
    betValue + 10000 > yourBalance
  ) {
    return;
  } else {
    betValue += 10000;
    updateBet();
  }
}

function updateBalance() {
  if (win == true && blackJack == false && draw == false) {
    yourBalance = yourBalance + betValue;
    resetWin();
  } else if (win == false && blackJack == false && draw == false) {
    yourBalance = yourBalance - betValue;
    resetWin();
  } else if (win == true && blackJack == true && draw == false) {
    yourBalance = yourBalance + betValue * 1.5;
    resetWin();
  } else if (draw == true) {
    resetWin();
  }

  displayBalance();
}

function resetWin() {
  win = "";
  blackJack = "";
  draw = "";
}

function displayBalance() {
  document.getElementById("balance").innerText = yourBalance;
}

function finalBet() {
  if (betValue == 0 || betValue > yourBalance) {
    return;
  }
  document.getElementById("hit").disabled = false;
  document.getElementById("stay").disabled = false;
  document.getElementById("bet").disabled = true;
  document.getElementById("bet100").disabled = true;
  document.getElementById("bet500").disabled = true;
  document.getElementById("bet1000").disabled = true;
  document.getElementById("bet5000").disabled = true;
  document.getElementById("bet10000").disabled = true;
  startGame();
}

function updateBet() {
  document.getElementById("totalBet").innerText = betValue;
}

function updateSum() {
  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("your-sum").innerText = yourSum;
}

function playAgain() {
  saveBalance = yourBalance;
  dealerAceCount = 0;
  dealerSum = 0;
  yourAceCount = 0;
  yourSum = 0;
  message = "";
  displayMessage();
  updateSum();
  removeDeck();
  removeCards();
  betValue = 0;
  startBet();
}

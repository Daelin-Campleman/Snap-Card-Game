const ws = new WebSocket("ws://localhost:8081");
ws.addEventListener("open", () => {
    console.log("We are connected");
});

ws.addEventListener('message', function (event) {
    let msg = JSON.parse(event.data);
    console.log(msg);

    switch (msg.type) {
        case "create":
            jCode = msg.joinCode;

            document.getElementById("join-code").textContent = jCode;
            break;
        case "join":
            if (waitingToJoin) {
                showWaiting();
                waitingToJoin = false;
            } else {
                try {
                    let li = document.createElement("li");
                    li.innerText = msg.player;
                    document.getElementById("playerList").appendChild(li);
                } catch (e) {

                }
            }

            break;
        case "start":
            startGame(msg.players);
            break;
        case "yourTurn":
            myTurn = true;

            let topCard1 = document.getElementsByClassName("my-cards");
            topCard1[0].classList.add("highlight");

            for (let i = 0; i < playerIds.length; i++) {
                if (document.getElementsByClassName(`p${i + 1}-cards`)[0] != null) {
                    document.getElementsByClassName(`p${i + 1}-cards`)[0].classList.remove("highlight");
                }
            }


            break;
        case "playerTurn":
            myTurn = false;

            let topCard2 = document.getElementsByClassName("my-cards");
            if (topCard2[0] != null) {
                topCard2[0].classList.remove("highlight");
            }


            for (let i = 0; i < playerIds.length; i++) {
                if (document.getElementsByClassName(`p${i + 1}-cards`)[0] != null) {
                    document.getElementsByClassName(`p${i + 1}-cards`)[0].classList.remove("highlight");
                }
            }

            let otherPlayer = getPlayerIndex(msg.player);
            if (document.getElementsByClassName(`p${otherPlayer + 1}-cards`)[0] != null) {
                document.getElementsByClassName(`p${otherPlayer + 1}-cards`)[0].classList.add("highlight");
            }


            break;
        case "placed":
            let card = msg.card;
            let player = msg.player;

            let elements = document.getElementsByClassName("whole-card");

            elements = [...elements].filter(element => {
                return element.getAttribute("data-id") === player;
            });

            let nextCard = elements[elements.length - 1];

            nextCard.getElementsByClassName("card-front")[0].src = `/images/cards/${card.code}.png`;
            nextCard.classList.add("in-center");
            nextCard.style.zIndex = zIndexCount++;
            nextCard.removeAttribute("data-id");
            nextCard.classList.remove("highlight");

            updateCardAmounts();

            break;
        case "gameOver":
            let winner = msg.winner;

            clearGamePage();

            let header = document.getElementsByTagName("header")[0];
            let logo = document.createElement("img");
            logo.src = "/images/logo.svg";
            logo.id = "snapy";
            logo.alt = "Snapy";

            header.appendChild(logo);

            let h1 = document.createElement("h1");
            h1.textContent = `Game Over!`;
            let h2 = document.createElement("h2");
            h2.textContent = `${winner} won!`;

            let box = document.createElement("section");
            box.classList.add("box");

            box.appendChild(h1);
            box.appendChild(h2);

            let backBtn = document.createElement("a");
            backBtn.textContent = "Back to home";
            backBtn.href = "/home";
            backBtn.setAttribute("type", "button")
            box.appendChild(backBtn);

            document.getElementsByTagName("main")[0].appendChild(box);


            break;
        case "youWinPot":
            let myNewCards = document.getElementsByClassName("in-center");

            [...myNewCards].map(card => {
                card.classList.remove("my-cards", "p1-cards", "p2-cards", "p3-cards", "in-center");
                card.classList.add("my-cards");
                card.setAttribute("data-id", `${myId}`);
                card.style.zIndex = "initial";
                card.getElementsByClassName("card-front")[0].src = `/images/cards/blank.png`;
                card.removeEventListener("click", () => {
                    if (myTurn) {
                        let msg = {
                            type: "place",
                            joinCode: jCode
                        }
                        sendMessage(msg);

                        myTurn = false;
                    }
                });
                card.addEventListener("click", () => {
                    if (myTurn) {
                        let msg = {
                            type: "place",
                            joinCode: jCode
                        }
                        sendMessage(msg);

                        myTurn = false;
                    }
                });
            });

            updateCardAmounts();

            break;
        case "potWon":
            let playerNewCards = document.getElementsByClassName("in-center");
            let winningPlayer = msg.player;

            [...playerNewCards].map(card => {
                card.classList.remove("my-cards", "p1-cards", "p2-cards", "p3-cards", "in-center");
                card.classList.add(`p${getPlayerIndex(winningPlayer) + 1}-cards`);
                card.setAttribute("data-id", `${winningPlayer}`);
                card.style.zIndex = "initial";
                card.getElementsByClassName("card-front")[0].src = `/images/cards/blank.png`;
            });

            updateCardAmounts();

            break;
        case "leave":
            let playerId = msg.player;

            let leaveElems = document.getElementsByClassName("whole-card");

            leaveElems = [...leaveElems].filter(element => {
                return element.getAttribute("data-id") === playerId;
            });

            for (let i = 0; i < leaveElems.length; i++) {
                leaveElems[i].classList.add("in-center");
                leaveElems[i].removeAttribute("data-id");
            }


            break;
        case "redistribute":
            let players = msg.players;

            let allCards = document.getElementsByTagName("article");
            [...allCards].forEach(card => {
                card.remove();
            });

            let myCards = -1;
            let myIndex = -1;
            let totalPlayers = players.length;
            for (let i = 0; i < totalPlayers; i++) {
                let id = players[i].id;

                if (id == myId) {
                    myCards = players[i].cards;
                    myIndex = i;
                    break;
                }
            }

            if (totalPlayers == 2) {
                totalPlayers = "two";
            } else if (totalPlayers == 3) {
                totalPlayers = "three";
            } else {
                totalPlayers = "four";
            }

            numPlayers = totalPlayers;

            players = players.filter(player => {
                return player.id != myId;
            });
            console.log(`Creating ${myCards} cards for myself`);

            // add my cards
            for (let i = 0; i < myCards; i++) {
                article = document.createElement("article");
                article.classList.add("my-cards");
                article.classList.add("whole-card");
                article.classList.add(totalPlayers);
                article.setAttribute("data-id", `${myId}`);

                cardback = document.createElement("img");
                cardback.src = "/images/cards/back.png";
                cardback.classList.add("card-back");

                cardfront = document.createElement("img");
                cardfront.src = "/images/cards/blank.png";
                cardfront.classList.add("card-front");

                article.appendChild(cardback);
                article.appendChild(cardfront);

                document.body.appendChild(article);

                article.addEventListener("click", () => {
                    if (myTurn) {
                        let msg = {
                            type: "place",
                            joinCode: jCode
                        }
                        sendMessage(msg);

                        myTurn = false;
                    }
                });
            }

            // Other players
            for (let i = 0; i < players.length; i++) {

                playerIds.push(players[i].id);
                let numCards = players[i].cards;

                console.log(`Creating ${numCards} cards for ${players[i].id}`);

                let article;
                let cardback;
                let cardfront;

                for (let j = 0; j < numCards; j++) {
                    article = document.createElement("article");
                    article.classList.add(`p${i + 1}-cards`);
                    article.classList.add("whole-card");
                    article.classList.add(totalPlayers);
                    article.setAttribute("data-id", `${players[i].id}`);

                    cardback = document.createElement("img");
                    cardback.src = "/images/cards/back.png";
                    cardback.classList.add("card-back");

                    cardfront = document.createElement("img");
                    cardfront.src = "/images/cards/blank.png";
                    cardfront.classList.add("card-front");

                    article.appendChild(cardback);
                    article.appendChild(cardfront);

                    document.body.appendChild(article);
                }
            }

            updateCardAmounts();

            break;
        case "debug":
            checkCardSync(msg.players);
        default:
            // stuff
            break;
    }
});

function sendMessage(data) {
    ws.send(JSON.stringify(data));
}

function checkCardSync(players) {
    console.log("[INFO] Comparing number of cards on front-end and back-end...");

    let checkArr = [];

    for (let i = 0; i < players.length; i++) {
        let playerId = players[i].id;
        let playerCards = players[i].cards;

        let elements = document.getElementsByClassName("whole-card");
        elements = [...elements].filter(element => {
            return element.getAttribute("data-id") === playerId;
        });

        console.log(`[INFO] Player "${playerId}" has ${playerCards} cards on the server (Front-end: ${elements.length})`);

        checkArr.push(playerCards == elements.length);
    }


    console.log(`${checkArr.every(element => element) ? "[SUCCESS]" : "[ERROR]"} Sync check ${checkArr.every(element => element) ? "passed" : "failed"}`);
}

function updateCardAmounts() {
    let elements = document.getElementsByClassName("my-cards");
    elements = [...elements].filter(element => {
        return element.getAttribute("data-id") == myId;
    });

    document.getElementById("my-count").textContent = elements.length;
}
window.onload = function (event) {
  const ws = new WebSocket(`wss://d2lgqlnck8vz6t.cloudfront.net/socket`);
  ws.addEventListener("open", () => {
    console.log("Connected to server");

    const msg = {
      type: "history",
      token: sessionStorage.getItem("token")
    }
    ws.send(JSON.stringify(msg));
  });

  ws.addEventListener('message', function (event) {
    let msg = JSON.parse(event.data);

    switch (msg.type) {
      case "history":
        console.log(msg.history);
        createHistoryTable(msg.history);
        break;
    }
  })
};



function createHistoryTable(history) {
  let place = document.getElementById("historyTable");

  place.innerHTML = "";

  for (let j = 0; j < history.length; j++) {
    const winner = history[j].winner || "";
    let tr = document.createElement("tr");
    let tdNum = document.createElement("td");
    tdNum.textContent = `Game ${j + 1}`;
    let td = document.createElement("td");
    let ul = document.createElement("ul");
    ul.classList.add("name-list");
    for (let i = 0; i < history[j].players.length; i++) {
      let li = document.createElement("li");
      li.textContent = history[j].players[i];
      if(winner == history[j].players[i]){
        li.classList.add("winner");
      }
      ul.appendChild(li);
    }

    td.appendChild(ul);
    tr.appendChild(tdNum);
    tr.appendChild(td);
    place.appendChild(tr);
  }

}
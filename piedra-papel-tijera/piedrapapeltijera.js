const controls = {
  playStoneButton: null,
  playPaperButton: null,
  playScissorsButton: null,
  resetScoreButton: null,
  cpuPlaySpan: null,
  playerPlaySpan: null,
  resultSpan: null,
  cpuScoreSpan: null,
  playerScoreSpan: null
};

const possiblePlays = {
  stone: {
    messages: ["PIEDRA!!!", "Te juego piedra buacho", "Más piedra que tu vieja"]
  },
  paper: {
    messages: [
      "PAPEL!",
      "PAPAPAPAPAPAPAPAAPEL!!!",
      "Te envuelto con esta (papel)"
    ]
  },
  scissors: {
    messages: [
      "Tijereta",
      "TIJERRRRRRRRRRRA",
      "A ver si te corto al medio con esta (tijera)"
    ]
  }
};

const resultMessages = {
  playerWinMessages: [
    "Ganaste !!!",
    "Le hiciste el ogt a la cpu",
    "El culo que tuviste! Felicitaciones."
  ],
  cpuWinMessages: [
    "La CPU te culeó",
    "A veces es mejor no hacer parciales. Perdiste.",
    "Se vé que te gusta perder."
  ],
  drawMessages: ["Empate!", "Jueguen de nuevo inútiles."]
};

const game = {
  cpuScore: 0,
  playerScore: 0,

  setCpuScore(score) {
    game.cpuScore = score;
    controls.cpuScoreSpan.innerHTML = game.cpuScore;
  },

  setPlayerScore(score) {
    game.playerScore = score;
    controls.playerScoreSpan.innerHTML = game.playerScore;
  },

  handleCpuWins() {
    game.cpuScore++;
    game.setCpuScore(game.cpuScore);
  },

  handlePlayerWins() {
    game.playerScore++;
    game.setPlayerScore(game.playerScore);
  },

  resetGame: () => {
    game.setCpuScore(0);
    game.setPlayerScore(0);
    controls.cpuPlaySpan.innerHTML = "";
    controls.resultSpan.innerHTML = "";
    controls.playerPlaySpan.innerHTML = "";
  },

  getMessageFrom(messages) {
    const messageIndex = Math.floor(Math.random() * messages.length);
    return messages[messageIndex];
  },

  handlePlay(playerChoice, cpuChoice) {
    const playerMessage = game.getMessageFrom(playerChoice.messages);
    const cpuMessage = game.getMessageFrom(cpuChoice.messages);

    controls.playerPlaySpan.innerHTML = playerMessage;
    controls.cpuPlaySpan.innerHTML = cpuMessage;

    if (playerChoice.winsTo === cpuChoice) {
      game.handlePlayerWins();
      const message = this.getMessageFrom(resultMessages.playerWinMessages);
      controls.resultSpan.innerHTML = message;
    } else if (playerChoice.losesTo === cpuChoice) {
      game.handleCpuWins();
      const message = this.getMessageFrom(resultMessages.cpuWinMessages);
      controls.resultSpan.innerHTML = message;
    } else {
      const message = this.getMessageFrom(resultMessages.drawMessages);
      controls.resultSpan.innerHTML = message;
    }
  }
};

const player = {
  playStone: function() {
    game.handlePlay(possiblePlays.stone, cpu.play());
  },

  playPaper: function() {
    game.handlePlay(possiblePlays.paper, cpu.play());
  },

  playScissors: function() {
    game.handlePlay(possiblePlays.scissors, cpu.play());
  }
};

const cpu = {
  play() {
    const playIndex = Math.floor(Math.random() * 3);
    const cpuPlay = Object.values(possiblePlays)[playIndex];
    return cpuPlay;
  }
};

function init() {
  function initControls() {
    controls.cpuScoreSpan = document.querySelector("#cpu-score");
    controls.playerScoreSpan = document.querySelector("#player-score");

    controls.cpuPlaySpan = document.querySelector("#cpu-play-span");
    controls.resultSpan = document.querySelector("#game-result-span");
    controls.playerPlaySpan = document.querySelector("#player-play-span");

    controls.playStoneButton = document.querySelector("#playStoneButton");
    controls.playPaperButton = document.querySelector("#playPaperButton");
    controls.playScissorsButton = document.querySelector("#playScissorsButton");

    controls.resetScoreButton = document.querySelector("#resetScoreButton");

    controls.playStoneButton.addEventListener("click", () =>
      player.playStone()
    );
    controls.playPaperButton.addEventListener("click", () =>
      player.playPaper()
    );
    controls.playScissorsButton.addEventListener("click", () =>
      player.playScissors()
    );

    controls.resetScoreButton.addEventListener("click", () => game.resetGame());
  }

  function initPossiblePlays() {
    possiblePlays.stone.winsTo = possiblePlays.scissors;
    possiblePlays.stone.losesTo = possiblePlays.paper;

    possiblePlays.paper.winsTo = possiblePlays.stone;
    possiblePlays.paper.losesTo = possiblePlays.scissors;

    possiblePlays.scissors.winsTo = possiblePlays.paper;
    possiblePlays.scissors.losesTo = possiblePlays.stone;
  }

  initControls();
  initPossiblePlays();
}

document.addEventListener("DOMContentLoaded", init);

const controls = {
    newGameButton: null,
    currentPlayerLabel: null
};

const game = {
    graph: null,
    minRow: 1,
    maxRow: 3,
    minCol: 1,
    maxCol: 3,
    currentPlayer: -1,
    playerValues: { '0': 'X', '-1': 'O' },
    numberOfPlays: 0,

    nextPlayer: () => {
        game.currentPlayer = ~game.currentPlayer;
        controls.currentPlayerLabel.innerHTML = `Player ${game.currentPlayer + 2}`;
    }
};

const buildNodeElementId = (row, col) => `#box-${row}-${col}`;

class Graph {
    constructor(nodes) {
        this.nodes = nodes;
    }

    cleanValues() {
        this.nodes.forEach(node => node.clearValue());
    }
}

class GraphNode {
    constructor(row, col, $el) {
        this.row = row;
        this.col = col;
        this.$el = $el;

        this.up = null;
        this.right = null;
        this.down = null;
        this.left = null;
        this.upLeft = null;
        this.upRight = null;
        this.downLeft = null;
        this.downRight = null;

        this.value = null;

        this.$el.addEventListener('click', () => {
            if (this.value) return;

            const value = game.playerValues[`${game.currentPlayer}`];
            this.setValue(value);

            game.nextPlayer();
        });

        this.winningConditionChecks = [
            () => this.checkWinningCondition(this.up, node => node.up, this.value, 1),
            () => this.checkWinningCondition(this.upLeft, node => node.upLeft, this.value, 1),
            () => this.checkWinningCondition(this.upRight, node => node.upRight, this.value, 1),
            () => this.checkWinningCondition(this.right, node => node.right, this.value, 1),
            () => this.checkWinningCondition(this.down, node => node.down, this.value, 1),
            () => this.checkWinningCondition(this.downLeft, node => node.downLeft, this.value, 1),
            () => this.checkWinningCondition(this.downRight, node => node.downRight, this.value, 1),
            () => this.checkWinningCondition(this.left, node => node.left, this.value, 1),
        ];
    }

    wireConnections(graph) {
        if (this.row !== game.minRow) {
            const elementId = buildNodeElementId(this.row - 1, this.col);
            this.up = graph.nodes.get(elementId);
        }

        if (this.row !== game.minRow && this.col !== game.minCol) {
            const elementId = buildNodeElementId(this.row - 1, this.col - 1);
            this.upLeft = graph.nodes.get(elementId);
        }

        if (this.row !== game.minRow && this.col !== game.maxCol) {
            const elementId = buildNodeElementId(this.row - 1, this.col + 1);
            this.upRight = graph.nodes.get(elementId);
        }

        if (this.col !== game.maxCol) {
            const elementId = buildNodeElementId(this.row, this.col + 1);
            this.right = graph.nodes.get(elementId);
        }

        if (this.row !== game.maxRow) {
            const elementId = buildNodeElementId(this.row + 1, this.col);
            this.down = graph.nodes.get(elementId);
        }

        if (this.row !== game.maxRow && this.col !== game.minCol) {
            const elementId = buildNodeElementId(this.row + 1, this.col - 1);
            this.downLeft = graph.nodes.get(elementId);
        }

        if (this.row !== game.maxRow && this.col !== game.maxCol) {
            const elementId = buildNodeElementId(this.row + 1, this.col + 1);
            this.downRight = graph.nodes.get(elementId);
        }

        if (this.col !== game.minCol) {
            const elementId = buildNodeElementId(this.row, this.col - 1);
            this.left = graph.nodes.get(elementId);
        }
    }

    clearValue() {
        this.value = null;
        this.$el.innerHTML = '';
    }

    setValue(value) {
        this.value = value;
        this.$el.innerHTML = value;

        if (this.checkForAWin())
            return;

        game.numberOfPlays++;

        if (game.numberOfPlays >= 9) {
            alert('Empate! Mancos');
        }
    }

    checkForAWin() {
        for (let closure of this.winningConditionChecks.values()) {
            const result = closure();

            if (result) {
                alert(`${controls.currentPlayerLabel.innerHTML} Wins!!!`);
                startNewGame();
                return true;
                break;
            }
        }

        return false;
    }

    checkWinningCondition(node, nextClosure, valueToFind, accumulator) {
        if (!node)
            return false;

        if (node.value === valueToFind)
            accumulator += 1;

        if (accumulator === 3)
            return true;

        const nextNode = nextClosure(node);

        return this.checkWinningCondition(nextNode, nextClosure, valueToFind, accumulator);
    }
}

function init() {

    function initControls() {
        controls.newGameButton = document.querySelector("#newGameButton");
        controls.currentPlayerLabel = document.querySelector("#currentPlayerLabel");

        controls.newGameButton.addEventListener('click', startNewGame);
    }

    function initGraph() {
        const nodes = new Map();

        for (let row = 1; row <= 3; row++) {
            for (let col = 1; col <= 3; col++) {

                const elementId = buildNodeElementId(row, col);
                const $el = document.querySelector(elementId);

                const node = new GraphNode(row, col, $el);
                nodes.set(elementId, node);
            }
        }

        game.graph = new Graph(nodes);

        // Connect all my nodes
        game.graph.nodes.forEach(node => node.wireConnections(game.graph));
    }

    initControls();
    initGraph();

}

function startNewGame() {
    game.graph.cleanValues();
    game.currentPlayer = -1;
    controls.currentPlayerLabel.innerHTML = `Player ${game.currentPlayer + 2}`;
    game.numberOfPlays = 0;
}

function finishGame(message) {
    alert(message);
}

document.addEventListener('DOMContentLoaded', init);
import React from 'react';
import './Game.css';

const CELL_SIZE = 20;
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;

// TODO: Change cell into function component
class Cell extends React.Component {
    render() {
        const { x, y } = this.props;
        return (
            <div className="Cell" style={{
                left: `${CELL_SIZE * x + 1}px`,
                top: `${CELL_SIZE * y + 1}px`,
                width: `${CELL_SIZE - 1}px`,
                height: `${CELL_SIZE - 1}px`,
            }} />
        );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.rows = GAME_HEIGHT / CELL_SIZE;
        this.cols = GAME_WIDTH / CELL_SIZE;
        console.log(this.cols);
        console.log(this.rows);
        this.board = this.makeEmptyBoard();
    }
    state = {
        cells: [],
        interval: 100,
        isRunning: false,
        seed : 42,
    }

    // Counts the neighboors of a cell located at x, y given a board of cells.
    calculateNeighbors(board, x, y) {
        let neighbors = 0;
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            let yNeighboor = y + dir[0];
            let xNeightboor = x + dir[1];

            // bounds check then value check
            if (xNeightboor >= 0 && xNeightboor < this.cols && yNeighboor >= 0 && yNeighboor < this.rows 
                && board[yNeighboor][xNeightboor]) {
                neighbors++;
            }
        }

        return neighbors;
    }

    runGame = () => {
        this.setState({ isRunning: true });
        this.runIteration();
    }

    stopGame = () => {
        this.setState({ isRunning: false });
        if (this.timeoutHandler) {
            window.clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
    }

    runIteration() {
        console.log('running iteration');
        let newBoard = this.makeEmptyBoard();

        // Game Logic
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let neighbors = this.calculateNeighbors(this.board, x, y);
                if (this.board[y][x]) {
                    if (neighbors === 2 || neighbors === 3) {
                        newBoard[y][x] = true;
                    } else {
                        newBoard[y][x] = false;
                    }
                } else {
                    if (!this.board[y][x] && neighbors === 3) {
                        newBoard[y][x] = true;
                    }
                }
            }
        }

        this.board = newBoard;
        this.setState({ cells: this.makeCells() });
        this.timeoutHandler = window.setTimeout(() => {
            this.runIteration();
        }, this.state.interval);
    }

    handleIntervalChange = (event) => {
        this.setState({ interval: event.target.value });
    }

    handleSeedChange = (event) => {
        console.log('Setting seed to: ' + event.target.value);
        this.setState({seed : event.target.value});
    }
    
    mulberry32 = (a) => {
        return function() {
          var t = a += 0x6D2B79F5;
          t = Math.imul(t ^ t >>> 15, t | 1);
          t ^= t + Math.imul(t ^ t >>> 7, t | 61);
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }

    seedGame = () => {
        let newBoard = this.makeEmptyBoard();
        
        var prng = this.mulberry32(this.state.seed);

        for(let y = 0; y < this.rows; y++){
            for(let x = 0; x < this.cols; x++){
                var i = Math.floor(prng() * 1337);
                console.log('i is:' + i);
                newBoard[y][x] = ((i % 7) === 0);
            }
        }

        this.board = newBoard;
        this.setState({ cells: this.makeCells() });
    }

    // Create a 2d array represenation of the board 
    makeEmptyBoard() {
        let board = [];
        for (let y = 0; y < this.rows; y++) {
            board[y] = [];
            for (let x = 0; x < this.cols; x++) {
                board[y][x] = false;
            }
        }
        return board;
    }

    // Create cells from this.board
    makeCells() {
        let cells = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x]) {
                    cells.push({ x, y });
                }
            }
        }
        return cells;
    }

    getElementOffset() {
        const rect = this.boardRef.getBoundingClientRect();
        const doc = document.documentElement;
        return {
            x: (rect.left + window.pageXOffset) - doc.clientLeft,
            y: (rect.top + window.pageYOffset) - doc.clientTop,
        };
    }
    handleClick = (event) => {
        const elemOffset = this.getElementOffset();
        const offsetX = event.clientX - elemOffset.x;
        const offsetY = event.clientY - elemOffset.y;

        const xIndex = Math.floor(offsetX / CELL_SIZE);
        const yIndex = Math.floor(offsetY / CELL_SIZE);
        if (xIndex >= 0 && xIndex <= this.cols && yIndex >= 0 && yIndex <= this.rows) {
            this.board[yIndex][xIndex] = !this.board[yIndex][xIndex];
        }
        this.setState({ cells: this.makeCells() });
    }

    render() {
        return (
            <div>
                <div className="Board"
                    style={{
                        width: GAME_WIDTH, height: GAME_HEIGHT,
                        backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
                    }}
                    onClick={this.handleClick}
                    ref={(n) => { this.boardRef = n; }}>
                    {this.state.cells.map(cell => (
                        <Cell x={cell.x} y={cell.y}
                            key={`${cell.x},${cell.y}`} />
                    ))}
                </div>
                <div className="controls">
                    Update every <input value={this.state.interval}
                        onChange={this.handleIntervalChange} /> msec
                {this.state.isRunning ?
                        <button className="button"
                            onClick={this.stopGame}>Stop</button> :
                        <button className="button"
                            onClick={this.runGame}>Run</button>
                    }
                First generation seed <input value={this.state.seed}
                        onChange={this.handleSeedChange} />
                <button className="button"
                        onClick={this.seedGame}>Seed Game</button>
                </div>
            </div>
        );
    }
}
export default Game;
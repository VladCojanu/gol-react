import React from 'react';
import './Game.css';

const CELL_SIZE = 20;
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;

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
        this.rows = GAME_WIDTH / CELL_SIZE;
        this.cols = GAME_WIDTH / CELL_SIZE;
        this.board = this.makeEmptyBoard();
    }
    state = {
        cells: [],
        interval: 100,
        isRunning: false,
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
        // TODO: Add logic for each iteration here.
        this.board = newBoard;
        this.setState({ cells: this.makeCells() });
        this.timeoutHandler = window.setTimeout(() => {
            this.runIteration();
        }, this.state.interval);
    }

    handleIntervalChange = (event) => {
        this.setState({ interval: event.target.value });
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
                </div>
            </div>
        );
    }
}
export default Game;
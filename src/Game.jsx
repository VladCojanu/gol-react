import React from 'react';
import './Game.css';

const CELL_SIZE = 20;
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;

class Game extends React.Component {
    constructor() {
      super();
      this.rows = GAME_WIDTH / CELL_SIZE;
      this.cols = GAME_WIDTH / CELL_SIZE;
      this.board = this.makeEmptyBoard();
    }
    state = {
      cells: [],
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

    render() {
      return (
        <div>
          <div className="Board"
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT, 
                backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}>
          </div>
        </div>
      );
    }
  }
export default Game;
import React from 'react';
import Label from './Label';
import Mooe from './Mooe';
import Board from './Board';
import Button from './Button';
import * as utils from './Utils';
import './Game.css';

class Game extends React.Component {

  constructor() {
    super();
    const size = 9;
    this.state = {
      size: size,
      balls: 0,
      score: 0,
      grid: Array(size * size).fill(0),
      nexts: this.randomBalls(),
      active: -1,
      dest: -1,
      fadeOut: Array(),
      path: Array()
    };

    this.selected = this.selected.bind(this);
    this.onAction = this.onAction.bind(this);
    this.movePiece = this.movePiece.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    let grid = this.state.grid.slice();
    let nexts = this.state.nexts.slice();
    let balls = this.state.balls;

    this.pushNewBalls(grid, nexts, balls);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  randomBalls() {
    return [Math.floor(1 + Math.random() * 7), Math.floor(1 + Math.random() * 7), Math.floor(1 + Math.random() * 7)];
  }

  randomPosition() {
    const empty = this.state.size * this.state.size - this.state.balls;
    return [Math.floor(1 + Math.random() * empty), Math.floor(1 + Math.random() * (empty - 1)), Math.floor(1 + Math.random() * (empty - 2))];
  }

  selected(pos) {
    this.setState({
      active: pos
    });
  }

  movePiece() {
    if (this.state.path.length > 0) {
      let path = this.state.path.slice();
      let grid = this.state.grid.slice();
      let active = this.state.active;

      let step = path.pop();
      grid[step] = grid[active];
      grid[active] = 0;
      this.setState({
        grid: grid,
        active: step,
        path: path
      });
    } else {
      clearInterval(this.interval);
      let grid = this.state.grid.slice();
      let dest = this.state.dest;
      let balls = this.checkBingo(grid, dest);
      if (balls <= 0) {
        let nexts = this.state.nexts.slice();
        this.pushNewBalls(grid, nexts);
      }
    }
  }

  onAction(dest) {
    if (this.state.path.length > 0) {
      return;
    }

    if (this.state.grid[dest] !== 0) {
      this.selected(dest);
    }

    if (this.state.active <= -1) {
      return;
    }

    let valid = utils.validPath(this.state.active, dest, this.state.size, this.state.grid);
    if (!valid.access) {
      return;
    }
    let grid = this.state.grid.slice();
    valid.path.forEach(p => {
      grid[p] = 8;
    });

    this.setState({
      path: valid.path,
      dest: dest,
      grid: grid
    });
    this.interval = setInterval(this.movePiece, 100);
  }

  checkBingo(grid, dest) {
    let lines = this.calculateBalls(grid, dest, this.state.size);
    let bingo = false;
    let fadeOut = Array();
    lines.forEach(line => {
      if (line.length >= 4) {
        bingo = true;
        fadeOut = fadeOut.concat(line);
      }
    });

    if (bingo) {
      fadeOut = fadeOut.concat(dest);
      this.setState({
        grid: grid,
        fadeOut: fadeOut,
        dest: -1,
        active: -1
      });
      this.timer = setTimeout(() => {
        let balls = this.state.balls - fadeOut.length;
        let score = this.state.score + this.calculateScore(fadeOut.length);
        fadeOut.forEach(out => {
          grid[out] = 0;
        });

        this.setState({
          grid: grid,
          score: score,
          balls: balls,
          fadeOut: []
        });
      }, 500);
    }
    return fadeOut.length;
  }

  calculateScore(balls) {
    let score = 5;
    balls = balls - 5;

    while (balls > 0) {
      score += (1 << balls);
      balls--;
    }

    return score;
  }

  calculateBalls(grid, dest, size) {
    const result = Array(4);

    // row
    result[0] = Array();
    [1, -1].forEach(shift => {
      let row = dest + shift;
      while (row >= 0 && row < size * size && (Math.floor(row / size) === Math.floor(dest / size))) {
        if (grid[row] === grid[dest]) {
          result[0] = result[0].concat(row);
          row = row + shift;
        } else {
          break;
        }
      }
    });

    //col 
    result[1] = Array();
    [size, -size].forEach(shift => {
      let col = dest + shift;
      while (col >= 0 && col < size * size && (col % size === dest % size)) {
        if (grid[col] === grid[dest]) {
          result[1] = result[1].concat(col);
          col = col + shift;
        } else {
          break;
        }
      }
    });

    //left
    result[2] = Array();
    [size + 1, -1 - size].forEach(shift => {
      let left = dest + shift;
      while (left >= 0 && left < size * size && (Math.abs(Math.floor(left / size) - Math.floor((left - shift) / size)) === 1)) {
        if (grid[left] === grid[dest]) {
          result[2] = result[2].concat(left);
          left = left + shift;
        } else {
          break;
        }
      }
    });

    //right
    result[3] = Array();
    [size - 1, 1 - size].forEach(shift => {
      let right = dest + shift;
      while (right >= 0 && right < size * size && (Math.abs(Math.floor(right / size) - Math.floor((right - shift) / size)) === 1)) {
        if (grid[right] === grid[dest]) {
          result[3] = result[3].concat(right);
          right = right + shift;
        } else {
          break;
        }
      }
    });

    return result;
  }

  pushNewBalls(grid, nexts) {
    let seed = this.randomPosition();
    let position = Array(3);
    let balls = 0;
    seed.forEach((pos, ball) => {
      for (var i = 0; i < grid.length; i++) {
        if (grid[i] === 0 && --pos === 0) {
          grid[i] = nexts[ball];
          position[ball] = i;
          balls++;
          break;
        }
      }
    });

    position.forEach(pos => {
      balls -= this.checkBingo(grid, pos);
    });
    nexts = this.randomBalls();
    this.setState((prevState, props) => ({
      nexts: nexts,
      grid: grid,
      balls: prevState.balls + balls,
      active: -1
    }));
  }

  reset() {
    let size = this.state.size;
    this.setState({
      score: 0,
      active: -1,
      dest: -1,
      fadeOut: Array(),
      path: Array(),
      balls: 0
    });
    let grid = Array(size * size).fill(0);
    let nexts = this.randomBalls();

    this.pushNewBalls(grid, nexts);
  }

  render() {
    const nexts = this.state.nexts;
    const grid = this.state.grid;

    return (
      <div className="game">
        <div className="head">
          <Label name="Balls" value={this.state.balls} />
          <Mooe nexts={nexts} />
          <Label name="Score" value = {this.state.score} />
        </div>
        <Board grid={grid} fadeOut={this.state.fadeOut} size = {this.state.size} active={this.state.active} onAction={this.onAction} />
        <div className="footer">
          <Button name="UNDO" />
          <div className="copyright"> CopyRight * Made by Zeron </div>
          <Button name="RESET" reset={this.reset} />
        </div>
      </div>
    );
  }
}

export default Game;
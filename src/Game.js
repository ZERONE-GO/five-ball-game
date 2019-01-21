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
    this.state = this.initState();

    this.selected = this.selected.bind(this);
    this.onAction = this.onAction.bind(this);
    this.movePiece = this.movePiece.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    this.setState(this.pushBalls);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  initState() {
    const size = 10;
    return {
      size: size,
      balls: 0,
      score: 0,
      grid: Array(size * size).fill(0),
      nexts: utils.randomBalls(),
      active: -1,
      dest: -1,
      fadeOut: [],
      path: [],
      history: []
    };
  }

  selected(pos) {
    if (pos !== this.state.active) {
      this.setState({
        active: pos
      });
    }
  }

  movePiece() {
    if (this.state.path.length > 0) {
      this.setState(function(prevState, props) {
        let path = prevState.path.slice();
        let grid = prevState.grid.slice();
        let active = prevState.active;

        let step = path.pop();
        grid[step] = grid[active];
        grid[active] = 0;

        return {
          grid: grid,
          active: step,
          path: path
        };
      });
    } else {
      clearInterval(this.interval);
      let grid = this.state.grid.slice();
      let dest = this.state.dest;
      let balls = this.checkBingo(grid, dest);
      if (balls <= 0) {
        this.setState(this.pushBalls);
      }
    }
  }

  onAction(dest) {
    if (this.state.path.length > 0) {
      return;
    }

    if (this.state.grid[dest] !== 0) {
      this.selected(dest);
      return;
    }

    if (this.state.active <= -1) {
      return;
    }

    let valid = utils.findPath(this.state.active, dest, this.state.size, this.state.grid);
    if (!valid.access) {
      return;
    }
    this.setState(function(prevState, props) {
      let grid = prevState.grid.slice();
      valid.path.forEach(p => {
        grid[p] = 8;
      });

      return {
        path: valid.path,
        dest: dest,
        grid: grid
      };
    });

    this.interval = setInterval(this.movePiece, 100);
  }

  earnScore(fadeOut) {
    this.setState(function(prevState, props) {
      let grid = prevState.grid.slice();
      let balls = prevState.balls - fadeOut.length;
      let score = prevState.score + utils.calculateScore(fadeOut.length);
      fadeOut.forEach(out => {
        grid[out] = 0;
      });

      return {
        grid: grid,
        score: score,
        balls: balls,
        fadeOut: []
      };
    })
  }

  checkBingo(grid, dest) {
    let lines = utils.calculateBalls(grid, dest, this.state.size);
    let bingo = false;
    let fadeOut = [];
    lines.forEach(line => {
      if (line.length >= 4) {
        bingo = true;
        fadeOut = fadeOut.concat(line);
      }
    });

    if (bingo) {
      fadeOut.push(dest);
      this.setState({
        fadeOut: fadeOut,
        dest: -1,
        active: -1
      });
      this.timer = setTimeout(this.earnScore(fadeOut), 500);
    }
    return fadeOut.length;
  }

  pushBalls(prevState, props) {
    let grid = prevState.grid;
    let nexts = prevState.nexts;
    let balls = prevState.balls;
    let position = utils.randomPositions(grid, balls, prevState.size);

    position.forEach((pos, i) => {
      grid[pos] = nexts[i];
      balls++;
    });

    position.forEach(pos => {
      balls -= this.checkBingo(grid, pos);
    });
    nexts = utils.randomBalls();
    return {
      nexts: nexts,
      grid: grid,
      balls: balls,
      active: -1
    };
  }

  reset() {
    let state = this.initState();
    this.setState(state);
    this.setState(this.pushBalls);
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
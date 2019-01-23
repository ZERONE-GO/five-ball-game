import React from 'react';
import Label from './Label';
import Mooe from './Mooe';
import Board from './Board';
import Button from './Button';
import * as utils from './Utils';
import History from './History';
import './Game.css';

class Game extends React.Component {

  constructor() {
    super();
    this.state = this.initState();
    this.history = new History();

    this.selected = this.selected.bind(this);
    this.onAction = this.onAction.bind(this);
    this.movePiece = this.movePiece.bind(this);
    this.reset = this.reset.bind(this);
    this.undo = this.undo.bind(this);
  }

  componentDidMount() {
    this.setState(this.pushBalls);
    this.history.push(this.state);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  initState(prevState) {
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
      gameover: false
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
      let bingo = this.checkBingo(grid, dest);
      this.setState(function(prevState) {
        return {
          fadeOut: bingo,
          dest: -1,
          active: -1
        };
      });
      if (bingo.length <= 0) {
        this.setState(this.pushBalls);
      }
      this.timer = setTimeout(this.earnScore(), 500);
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

  earnScore() {
    this.setState(function(prevState, props) {
      let fadeOut = prevState.fadeOut;
      if (fadeOut.length > 0) {
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
      } else {
        if (prevState.balls >= prevState.size * prevState.size) {
          return {
            gameover: true
          };
        }
      }
    });
    this.history.push(this.state);
  }

  checkBingo(grid, dest) {
    let lines = utils.calculateBalls(grid, dest, this.state.size);
    let bingo = [];
    lines.forEach(line => {
      if (line.length >= 4) {
        bingo = bingo.concat(line);
      }
    });

    if (bingo.length >= 4) {
      bingo.push(dest);
    }
    return bingo;
  }

  pushBalls(prevState) {
    let grid = prevState.grid;
    let nexts = prevState.nexts;
    let balls = prevState.balls;
    let position = utils.randomPositions(grid, balls, prevState.size);
    let bingo = [];

    position.forEach((pos, i) => {
      if (pos >= 0) {
        grid[pos] = nexts[i];
        balls++;
      }
    });

    position.forEach(pos => {
      if (pos >= 0) {
        bingo = bingo.concat(this.checkBingo(grid, pos));
      }
    });
    nexts = utils.randomBalls();
    return {
      nexts: nexts,
      grid: grid,
      balls: balls,
      fadeOut: bingo
    };
  }

  reset() {
    this.setState(this.initState);
    this.setState(this.pushBalls);
  }

  undo() {
    let state = this.history.pop();
    state && this.setState(function(preState) {
      return state;
    });
  }

  render() {
    let gameover = this.state.gameover ? <div className="gameover-container" onClick={this.reset}><span className="gameover-text" >GAME OVER</span></div> : '';
    return (
      <div className="game">
        <div className="head">
          <Label name="Balls" value={this.state.balls} />
          <Mooe nexts={this.state.nexts} />
          <Label name="Score" value = {this.state.score} />
        </div>
        <Board grid={this.state.grid} fadeOut={this.state.fadeOut} size = {this.state.size} active={this.state.active} onAction={this.onAction} />
        <div className="footer">
          <Button name="UNDO" onAction={this.undo}/>
          <div className="copyright"> CopyRight * Made by Zeron </div>
          <Button name="RESET" onAction={this.reset} />
        </div>
        {gameover}
      </div>
    );
  }
}

export default Game;
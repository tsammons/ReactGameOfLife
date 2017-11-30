import React from "react";
import Grid from "./Grid";

export default class Game extends React.Component {

  // initialize state with grid
  constructor(props) {
    super(props);
    let height = 15;
    let width = 15;

    this.state = {
      history: [
        {
          grid: this.initializeGrid(height, width)
        }
      ],
      gridHeight: height,
      gridWidth: width,
      intervalStatus: '',
      gameOn: 0,
    };
  }

  // randomize grid with alive cells
  initializeGrid(height, width) {
    let tempGrid = [];
    for (var i = 0; i < height; i++) {
      let row = [];
      for (var j = 0; j < width; j++) {
        row.push(Math.random() > .8 ? 1 : 0);
      }
      tempGrid.push(row);
    }
    return tempGrid;
  }

  // change whether cell is dead or alive
  handleClick(i, j) {
    const current = this.state.history[this.state.history.length - 1].grid.slice();
    current[i][j] = current[i][j] ? 0 : 1;
    this.setState({
      history: this.state.history.concat([
        {
          grid: current
        }
      ]),
    });
  }

  // randomize grid
  resetGrid() {
    this.setState({
      history: [{ grid: this.initializeGrid(this.state.gridHeight, this.state.gridWidth)}],
    });
  }

  // check if grid is empty
  checkEmpty() {
    const current = this.state.history[this.state.history.length - 1].grid.slice();
    for (var i = 0; i < this.state.gridHeight; i++) {
      for (var j = 0; j < this.state.gridWidth; j++) {
        if (current[i][j] === 1)
          return false;
      }
    }
    return true;
  }

  // press forward button
  tick() {
    if (this.checkEmpty())
      this.stop();

    let tempGrid = [];
    const current = this.state.history[this.state.history.length - 1].grid.slice();

    for (var i = 0; i < this.state.gridHeight; i++) {
      let row = [];
      for (var j = 0; j < this.state.gridWidth; j++) {
        let count = this.countNeighbors(i, j, current);
        if (count < 2 || count > 3)
          row.push(0);
        if (count === 3)
          row.push(1);
        if (count === 2)
          row.push(current[i][j]);
      }
      tempGrid.push(row);
    }
    this.setState({
      history: this.state.history.concat([
        {
          grid: tempGrid
        }
      ]),
    });
  }

  // count cell neighbors
  countNeighbors(row, col, current) {
    let neighborCount = 0;

    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        if (row + i >= 0 && row + i < this.state.gridHeight) {
          if (col + j >= 0 && col + j < this.state.gridHeight) {
            if (current[row + i][col + j] === 1) {
              if (!(i === 0 && j === 0))
                neighborCount++;
            }
          }
        }
      }
    }
    return neighborCount;
  }

  // begin ticks on an interval
  play() {
    if (!this.state.gameOn) {
      this.setState({
        intervalStatus: setInterval(() => this.tick(), 50),
        gameOn: 1,
      });
    }
  }

  // stop ticks
  stop() {
    clearInterval(this.state.intervalStatus);
    this.setState({
      gameOn: 0,
    });
  }

  // tick once
  goForward() {
    this.tick();
  }

  // reverse state
  goBack() {
    if (this.state.history.length === 1)
      return;

    const hist = this.state.history.slice(0, this.state.history.length-1);  
    this.setState({
      history: hist
    })
  }

  // rewind state
  rewind() {
    clearInterval(this.state.intervalStatus);
    this.setState({
      intervalStatus: setInterval(() => this.rewindHelper(), 50)
    });
  }

  // manage rewind interval
  rewindHelper() {
    const hist = this.state.history.slice(0, this.state.history.length - 1);
    this.setState({
      history: hist
    })

    if (this.state.history.length === 1) {
      clearInterval(this.state.intervalStatus);
      this.setState({
        gameOn: 0
      });
    }
  }

  // return Grid component and button
  render() {
    const current = this.state.history[this.state.history.length - 1].grid.slice();
    const backward = "<";
    const forward = ">";

    return (
      <div className="game">
        <h1>Game of Life</h1>
        <div className="game-board">
          <Grid
            grid={current}
            onClick={(i, j) => this.handleClick(i, j)}
          />
        </div>
        <button onClick={() => this.goBack()}> {backward} </button>
        <button onClick={() => this.goForward()}> {forward} </button><br />
        <button onClick={() => this.play()}>Play</button>
        <button onClick={() => this.rewind()}>Rewind</button><br />
        <button onClick={() => this.stop()}>Stop</button>
        <button onClick={() => this.resetGrid()}>Reset</button>
      </div>
    );
  }
}
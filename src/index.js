import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// TODO: Add basic AI to play tic-tac-toe
// TODO: Add prediction to choose next-best move based on experience
// TODO: Extend to make Checkers
// TODO: Extend to make Go
// TODO: Extend ot make Chess
// TODO: Add real-time sync

// this replaces the above equivalent class since it contains only a render function!
function Square(props) {
  console.log(props.winnerSquare);
  return (
	<button className="square" onClick={props.onClick} style={{ backgroundColor: props.winnerSquare ? 'green' : 'white' }}>
	  {props.value}
	</button>
  );
};

class Board extends React.Component {
  
  renderSquare(i,j) {
	const index = (3*(j-1)+(i-1));
	const winnerPosition = this.props.winnerPosition;
	const winnerSquare = winnerPosition && winnerPosition.indexOf(index) >= 0; // true or false
    return (
	  <Square 
		value={this.props.squares[index]}
		winnerSquare={ winnerSquare }
		onClick={() => this.props.onClick(index)}
	  />
	);
  }

  render() {

	// 0 = 3*(j-1) + (i-1) => 0 + 0 = 0
	// 1 =                 => 0 + 1 = 1
    // 2 =                 => 0 + 2 = 2
	// 3 =                 => 3 + 0 = 3
	// 4 =
	// 5 =
	// 6 =
	// 7 =
	// 8 =
	
	//const rows = 3;
	//const cols = 3;
	//for (let i = 0; i < rows; i++) {
		//for (let j = 0; j < cols; j++) {
		//}
	//}
	
	// Reference: https://jsfiddle.net/mrlew/cLbyyL27/
    return (
      <div>
	    {
		  [1,2,3].map((row) => {
			return (
				<div key={row} className="board-row">
				{
					[1,2,3].map((col) => {
						return this.renderSquare(col,row)
					})
				}
				</div>
			)
		  })
		}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor() {
	super();
	this.state = {
	  history: [{
		squares: Array(9).fill(null),
	  }],
	  stepNumber: 0,
	  xIsNext: true,
	  winnerPosition: null,
	  reverseMoveList: true,
	};
  }

  handleClick(i) {
	const history = this.state.history.slice(0, this.state.stepNumber + 1);
	const current = history[history.length - 1];
	const squares = current.squares.slice();
	if (calculateWinner(squares) || squares[i]) {
	  return;
	}
	squares[i] = this.state.xIsNext ? 'X' : 'O';
	// set state of 'history' and 'xIsNext'
	this.setState({
	  history: history.concat([{
		squares: squares,
	  }]),
	  stepNumber: history.length,
	  xIsNext: !this.state.xIsNext,
	});
  }

  jumpTo(step) {
	this.setState({
	  stepNumber: step,
	  xIsNext: (step % 2) === 0,
	});
  }

  render() {
	const history = this.state.history.slice(0, this.state.stepNumber + 1);
	const current = history[this.state.stepNumber]; // history[history.length - 1];
	const winner = calculateWinner(current.squares);
	const winnerPosition = calculateWinnerPosition(current.squares);
	
	// history.map returns a list... in this case, it returns a list of functions... components? yes, components.
	// specifically, it returns a list of list items... links specifically.
	// TODO: What is 'step'?
	const moves = history.map((step, move) => {
	  // in the list print either "Move #{move}" or "Game start" (the default option shown at the top of the list)
	  const desc = move ?
		'Move #' + move	:
		'Game start';
	
	  // Question: Can state be returned in this component? How is that represented?
	  return (
		<li key={move}>
		  <a href="#" style={{fontWeight: move === this.state.stepNumber ? 'bold' : 'normal'}} onClick={() => this.jumpTo(move)}>{desc}</a>
		</li>
	  );
	});

	let status;
	if (winner) {
	  status = 'Winner: ' + winner;
	} else {
	  status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
	}

    return (
      <div className="game">
        <div className="game-board">
          <Board 
		    squares={current.squares} 
			winnerPosition={winnerPosition}
		    onClick={(i) => this.handleClick(i)} 
		  />
        </div>
        <div className="game-info">
		  <button onClick={() => this.setState({ reverseMoveList: !this.state.reverseMoveList})}>Reverse</button>
          <div>{status}</div>
          <ol>{ this.state.reverseMoveList ? moves.reverse() : moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
	const [a, b, c] = lines[i];
	if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
	  return squares[a];
	}
  };
  return null;
};

function calculateWinnerPosition(squares) {
  const lines = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
	const [a, b, c] = lines[i];
	if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
	  return lines[i].slice();
	}
  };
  return null;
};

import React from 'react';
import BoardRow from './BoardRow'
import './Board.css';

class Board extends React.Component {

    render() {
        const boardRows = Array(this.props.size);

        for (var i = 0; i < this.props.size; i++) {
            boardRows[i] = <BoardRow key={i} row={i} size={this.props.size} grid={this.props.grid} fadeOut={this.props.fadeOut} active={this.props.active} selected={this.props.selected} move={this.props.move} />
        }

        return (
            <div className="board">
                {boardRows}
            </div>
        );
    }
}

export default Board;
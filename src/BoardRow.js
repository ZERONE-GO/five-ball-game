import React from 'react';
import Piece from './Piece';
import './BoardRow.css';

class BoardRow extends React.Component {

    render() {
        const rowItems = Array(this.props.size);

        for (var i = 0; i < this.props.size; i++) {
            let pos = this.props.row * this.props.size + i;
            let item = this.props.grid[pos];
            rowItems[i] = (
                <div key={i} className="board-row-item" onClick={() => this.props.onAction(pos)}>
                    <Piece pos={pos} value={item} fadeOut={this.props.fadeOut} active={this.props.active} />
                </div>);
        }

        return (
            <div className="board-row">
                {rowItems}
            </div>
        );
    }
}

export default BoardRow;
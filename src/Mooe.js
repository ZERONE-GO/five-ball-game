import React from 'react';
import Piece from './Piece';
import './Mooe.css';

class Mooe extends React.Component {

    render() {
        return (
            <div className="mooe"> 
                <div className="mooe-item"><Piece value={this.props.nexts[0]} active="false"/></div>
                <div className="mooe-item"><Piece value={this.props.nexts[1]} active="false"/></div>
                <div className="mooe-item"><Piece value={this.props.nexts[2]} active="false"/></div> 
            </div>
        );
    }
}

export default Mooe;
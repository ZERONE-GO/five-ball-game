import React from 'react';
import './Piece.css';

class Piece extends React.Component {

    render() {
        const active = this.props.pos === this.props.active ? " active" : "";
        let fadeOut = "";

        this.props.fadeOut && this.props.fadeOut.forEach(index => {
            if (index === this.props.pos) {
                fadeOut = " fade-out";
                return;
            }
        });

        return (
            <div className={"piece color" + this.props.value + active + fadeOut}></div>
        );
    }

}

export default Piece;
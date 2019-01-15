import React from 'react';
import './Button.css';

class Button extends React.Component {

    render() {
        return (
            <div className="button">{this.props.name}</div>
        );
    }
}

export default Button;
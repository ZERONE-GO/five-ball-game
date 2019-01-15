import React from 'react';
import './Label.css';

class Label extends React.Component {

    render() {
        return (
            <div className="label">
                <div className="label-name"> {this.props.name} </div>
                <div className="label-value"> {this.props.value} </div>
            </div>
        );
    }
}

export default Label;
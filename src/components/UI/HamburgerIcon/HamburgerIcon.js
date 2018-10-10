import React from 'react';

import classes from './HamburgerIcon.css';

const hamburgerIcon = (props) => {
    let attachedClasses = [classes.HamburgerIcon];
    if (props.hide) {
        attachedClasses.push(classes.Open)
    }
    return (
        <div
            className={attachedClasses.join(' ')}
            onClick={props.clicked}>
            <span></span>
        </div>
    )
}

export default hamburgerIcon;

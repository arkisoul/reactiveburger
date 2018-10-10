import React from 'react';

import classes from './Toolbar.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import HamburgerIcon from '../../UI/HamburgerIcon/HamburgerIcon';

const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <HamburgerIcon
            clicked={props.opened}
            hide={props.close}/>
        <div className={classes.Logo}><Logo /></div>
        <nav className={classes.DesktopOnly}>
            <NavigationItems authenticated={props.authenticated} />
        </nav>
    </header>
)

export default toolbar;

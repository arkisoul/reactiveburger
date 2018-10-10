import React from 'react';

import Button from '../../UI/Button/Button';
import Burger from '../../Burger/Burger';
import classes from './CheckoutSummary.css';

const checkoutSummary = (props) => {
    return (
        <div className={classes.CheckoutSummary}>
            <h1>Hope it looks delicious!!!</h1>
            <Burger ingredients={props.ingredients}/>
            <Button
                btnType='Danger'
                clicked={props.orderCancelled}
                >CANCEL</Button>
            <Button
                btnType='Success'
                clicked={props.orderContinued}
                >CONTINUE</Button>
        </div>
    )
}

export default checkoutSummary;

import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import classes from './Checkout.css';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {

    orderCancelledHandler = () => {
        this.props.history.goBack();
    }

    orderContinuedHandler = () => {
        this.props.history.push(this.props.match.path + '/contact-data');
    }

    render() {
        let summary = <Redirect to='/' />
        console.log('[Checkout] ingredients unavailable', this.props.ings, this.props.purchased)
        if (this.props.ings) {
            console.log('[Checkout] ingredients available', this.props.ings, this.props.purchased);
            const purchasedInit = this.props.purchased ? <Redirect to='/' /> : null;
            summary = (
                <div className={classes.Checkout}>
                    {purchasedInit}
                    <CheckoutSummary
                        orderCancelled={this.orderCancelledHandler}
                        orderContinued={this.orderContinuedHandler}
                        ingredients={this.props.ings} />
                    <Route
                        path={this.props.match.path + '/contact-data'}
                        component={ContactData} />
                </div>
            );
        }
        return summary
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
}

export default connect(mapStateToProps)(Checkout);

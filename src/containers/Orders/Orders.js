import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './Orders.css';
import Order from '../../components/Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../stores/actions/index';

class Orders extends Component {
    componentDidMount() {
        this.props.onFetchOrders( this.props.token, this.props.userId );
    }

    render () {
        let orders;
        if (this.props.orders) {
            orders = this.props.orders.map(order => {
                return (<Order
                        key={order.id}
                        ingredients={order.ingredients}
                        price={+order.price} />);
            });
        }
        if (this.props.loading) {
            orders = <Spinner />
        }
        return (
            <div className={classes.Orders}>
                <h1>Your orders</h1>
                {orders}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        userId: state.auth.userId,
        token: state.auth.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: ( token, userId ) => dispatch(actions.fetchOrders( token, userId ))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));

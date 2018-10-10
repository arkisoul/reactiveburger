import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './ContactData.css';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { updateObject, inputValidationHandler } from '../../../shared/utility';
import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../stores/actions/index';

class ContactData extends Component {
    state = {
        contactForm: {
            name: {
                elementType: 'input',
                elementLabel: 'Name',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter Name',
                    name: 'name',
                    id: 'name'
                },
                valid: false,
                dirty: false,
                validation: {
                    required: true
                },
                validationMessages: {
                    required: 'Name is required'
                },
                errors: [],
                value: ''
            },
            email: {
                elementType: 'input',
                elementLabel: 'Email',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Enter Email',
                    name: 'email',
                    id: 'email'
                },
                valid: false,
                dirty: false,
                validation: {
                    required: true,
                    isEmail: true
                },
                validationMessages: {
                    required: 'Email is required',
                    isEmail: 'Email should be in correct format'
                },
                errors: [],
                value: ''
            },
            street: {
                elementType: 'input',
                elementLabel: 'Street',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter Street',
                    name: 'street',
                    id: 'street'
                },
                valid: false,
                dirty: false,
                validation: {
                    required: true
                },
                validationMessages: {
                    required: 'Street name is required'
                },
                errors: [],
                value: ''
            },
            zipCode: {
                elementType: 'input',
                elementLabel: 'Postal Code',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter Postal Code',
                    name: 'postal-code',
                    id: 'postal-code'
                },
                valid: false,
                dirty: false,
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5,
                    isNumeric: true
                },
                validationMessages: {
                    required: 'Zipcode is required',
                    isNumeric: 'Zipcode should only be of digits',
                    minLength: 'Zipcode should be of minimum 5 digits',
                    maxLength: 'Zipcode should be of maximum 5 digits',
                },
                errors: [],
                value: ''
            },
            country: {
                elementType: 'input',
                elementLabel: 'Country',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter Country',
                    name: 'country',
                    id: 'country'
                },
                valid: false,
                dirty: false,
                validation: {
                    required: true
                },
                validationMessages: {
                    required: 'Country name is required'
                },
                errors: [],
                value: ''
            },
            deliveryMethod: {
                elementType: 'select',
                elementLabel: 'Delivery Method',
                elementConfig: {
                    config: {
                        placeholder: 'Enter Delivery Method',
                        name: 'delivery-method',
                        id: 'delivery-method'
                    },
                    options: [
                        { value: '', displayName: 'Select Delivery Method'},
                        { value: 'fastest', displayName: 'Fastest'},
                        { value: 'cheapest', displayName: 'Cheapest'}
                    ]
                },
                valid: false,
                dirty: false,
                validation: {
                    required: true
                },
                validationMessages: {
                    required: 'Delivery method is required'
                },
                errors: [],
                value: ''
            }
        },
        isFormValid: false
    }

    orderConfirmedHandler = (event) => {
        event.preventDefault();
        const updatedValues = {};
        for(let ele in this.state.contactForm) {
            updatedValues[ele] = this.state.contactForm[ele].value;
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: updatedValues,
            userId: this.props.userId
        }
        this.props.onBurgerOrder( order, this.props.token );
    }

    formElementChangeHandler = (event, field) => {
        const errors = inputValidationHandler(event.target.value, this.state.contactForm[field].validation)
        const updatedFormElements = updateObject(this.state.contactForm, {
            [field]: updateObject(this.state.contactForm[field], {
                value: event.target.value,
                valid: errors.length <= 0,
                errors: errors,
                dirty: true
            })
        });

        let isFormValid = true;
        for (let formElement in updatedFormElements) {
            isFormValid = updatedFormElements[formElement].valid && isFormValid;
        }

        this.setState({contactForm: updatedFormElements, isFormValid: isFormValid});
    }

    render () {
        const inputElements = [];
        for(let inputElement in this.state.contactForm) {
            inputElements.push({
                name: inputElement,
                config: this.state.contactForm[inputElement]
            });
        }
        const inputElementsRender = inputElements.map(inputElement => (
            <Input
                key={inputElement.name}
                changed={(event) => this.formElementChangeHandler(event, inputElement.name)}
                elementType={inputElement.config.elementType}
                elementLabel={inputElement.config.elementLabel}
                elementConfig={inputElement.config.elementConfig}
                invalid={!inputElement.config.valid}
                dirty={inputElement.config.dirty}
                errors={inputElement.config.errors}
                validationMessages={inputElement.config.validationMessages}
                value={inputElement.config.value} />
        ))
        let form = (
            <form onSubmit={this.orderConfirmedHandler}>
                {inputElementsRender}
                <Button
                    disabled={!this.state.isFormValid}
                    btnType='Success'>ORDER</Button>
            </form>
        );

        if (this.props.loading) {
            form = <Spinner />;
        }

        return (
            <div className={classes.ContactData}>
                <h4>Fill in Contact data to order:</h4>
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        userId: state.auth.userId,
        token: state.auth.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onBurgerOrder: ( orderData, token ) => dispatch(actions.purchaseBurger( orderData, token ))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));

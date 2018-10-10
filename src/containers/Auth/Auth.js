import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import classes from './Auth.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import { updateObject, inputValidationHandler } from '../../shared/utility';
import * as actions from '../../stores/actions/index';

class Auth extends Component {
    state = {
        controls: {
            username: {
                elementType: 'input',
                elementLabel: 'Username',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Enter Email Address',
                    name: 'username',
                    id: 'username'
                },
                valid: false,
                dirty: false,
                validation: {
                    required: true,
                    isEmail: true
                },
                validationMessages: {
                    required: 'Username is required',
                    isEmail: 'Email should be in correct form'
                },
                errors: [],
                value: ''
            },
            password: {
                elementType: 'input',
                elementLabel: 'Password',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Enter Password',
                    name: 'password',
                    id: 'password'
                },
                valid: false,
                dirty: false,
                validation: {
                    required: true,
                    minLength: 6
                },
                validationMessages: {
                    required: 'Password is required',
                    minLength: 'Password should at least be 6 characters long'
                },
                errors: [],
                value: ''
            }
        },
        signup: true
    }

    formElementChangeHandler = (event, field) => {
        const errors = inputValidationHandler(event.target.value, this.state.controls[field].validation);
        const updatedControls = updateObject(this.state.controls, {
            [field]: updateObject(this.state.controls[field], {
                value: event.target.value,
                valid: errors.length <= 0,
                errors: errors,
                dirty: true
            })
        });

        this.setState({ controls: updatedControls });
    }

    toggleAuthHandler = () => {
        this.setState(prevState => {
            return {
                signup: !prevState.signup
            }
        });
    }

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onAuthSetRedirectPath('/');
        }
    }

    authenticateHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.username.value, this.state.controls.password.value, this.state.signup);
    }

    render() {
        const inputElements = [];
        for (let inputElement in this.state.controls) {
            inputElements.push({
                name: inputElement,
                config: this.state.controls[inputElement]
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
                errors={inputElement.config.errors}
                validationMessages={inputElement.config.validationMessages}
                dirty={inputElement.config.dirty}
                value={inputElement.config.value} />
        ))
        let heading = (
            <h1 className={classes.Heading}>Sign Up</h1>
        )
        let prompt = (
            <p className={classes.Prompt}>Already a user?
                <Button btnType='Danger' clicked={this.toggleAuthHandler}>&nbsp;Sign in</Button>
            </p>
        )
        if (!this.state.signup) {
            prompt = (
                <p className={classes.Prompt}>New user?
                    <Button btnType='Danger' clicked={this.toggleAuthHandler}>&nbsp;Sign up</Button>
                </p>
            )
            heading = (<h1 className={classes.Heading}>Sign In</h1>)
        }
        let form = (
            <form onSubmit={this.authenticateHandler}>
                {inputElementsRender}
                <Button
                    btnType='Success'>{ this.state.signup ? 'SIGN UP' : 'SIGN IN' }</Button>
            </form>
        );

        if(this.props.loading) {
            form = <Spinner />
        }

        let errorMessage = null;

        if (this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
        }

        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }
        return (
            <div className={classes.AuthWrap}>
                {authRedirect}
                <div className={classes.AuthForm}>
                    {errorMessage}
                    {heading}
                    {form}
                    {prompt}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        loading: state.auth.loading,
        authRedirectPath: state.auth.authRedirectPath,
        buildingBurger: state.burgerBuilder.buildingBurger,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, signup) => dispatch(actions.auth(email, password, signup)),
        onAuthSetRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);

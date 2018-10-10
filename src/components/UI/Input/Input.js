import React from 'react';

import classes from './Input.css';

const input = (props) => {
    let input = null;
    const inputClasses = [classes.InputElement];
    let errors = [];
    if (props.invalid && props.dirty) {
        inputClasses.push(classes.Invalid);
        if (props.errors.length > 0) {
            errors = props.errors.map(error => {
                return (
                    <p key={error}>{props.validationMessages[error]}</p>
                );
            });
        }
    }

    switch(props.elementType) {
        case 'input':
            input = <input onChange={props.changed} className={inputClasses.join(' ')} {...props.elementConfig} />;
            break;
        case 'textarea':
            input = <textarea onChange={props.changed} className={inputClasses.join(' ')} {...props.elementConfig} />;
            break;
        case 'select':
            input = (
                    <select onChange={props.changed} className={classes.SelectElement} {...props.elementConfig.config} defaultValue=''>
                        {props.elementConfig.options.map(option => {
                            if (option.value === '') {
                                return (
                                 <option key={option.value} value={option.value} disabled>{option.displayName}</option>
                                );
                            }
                            return (
                             <option key={option.value} value={option.value}>{option.displayName}</option>
                            );
                        })}
                    </select>
                );
            break;
        default:
            input = <input onChange={props.changed} className={inputClasses.join(' ')} {...props.elementConfig} />;
    }
    return (
        <div className={classes.Input}>
            <label className={classes.Label} htmlFor={props.elementConfig.id}>{props.elementLabel}</label>
            {input}
            <small className={classes.InputError}>{errors}</small>
        </div>
    )
}

export default input;

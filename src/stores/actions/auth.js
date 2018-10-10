import * as actionTypes from './actionTypes';
import axios from 'axios';

const WEB_API_KEY = 'AIzaSyC7pX1_aBGFMTv3-aPEhsevnh7KfzYwnU8';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        userId: userId
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const auth = (email, password, signUp) => {
    return dispatch => {
        dispatch(authStart());
        let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + WEB_API_KEY;
        if(!signUp) {
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + WEB_API_KEY;
        }
        axios.post(url, {
            email: email,
            password: password,
            returnSecureToken: true
        })
        .then(response => {
            const expiryDate = new Date(Date.now() + (Number(response.data.expiresIn) * 1000) );
            localStorage.setItem('token', response.data.idToken);
            localStorage.setItem('userId', response.data.localId);
            localStorage.setItem('expiresIn', expiryDate);
            dispatch(authSuccess(response.data.idToken, response.data.localId));
            dispatch(authExpired(Number(response.data.expiresIn) * 1000));
        })
        .catch(error => {
            dispatch(authFail(error.response.data.error));
        })
    }
}

export const authExpired = ( time ) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(authLogout());
        }, time );
    }
}

export const authLogout = () => {
    localStorage.clear();
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const authInit = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if(token !== null) {
            const expiresIn = localStorage.getItem('expiresIn');
            if(new Date(expiresIn) >= new Date()) {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId))
                const time = new Date(expiresIn).getTime() - new Date().getTime();
                dispatch(authExpired(time));
            } else {
                dispatch(authLogout())
            }
        } else {
            dispatch(authLogout())
        }
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

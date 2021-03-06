import { parseJSON, checkHttpStatus, createConstants } from '../../utils';
import api from '../../api';

export const AuthcConstants = createConstants(
    'LOGIN_SUCCESS',
    'LOGIN_FAILURE',

    'LOGOUT_SUCCESS',
    'ME_FROM_TOKEN'
);

export function loadUserFromToken() {
    return (dispatch) => {
        const _token = sessionStorage.getItem('token') || '';
        if(_token.length <= 0) return;
        api.authc.loadAccountByToken(_token).then(response => {
            dispatch({
                type: AuthcConstants.ME_FROM_TOKEN,
                payload: {
                    token: _token,
                    user: response.email
                }
            });
        }).catch(error => {
        });
    }
}

export function loginUser(username, password) {
    return (dispatch) => {
        api.authc.login(username, password).then(response => {
            dispatch(loginSuccess(username, response));
        }).catch(error => {
            dispatch(loginFailure(username, error));
        });
    };
}

function loginSuccess(username, response) {
    const token = response.token;

    //store Token to browser session storage
    //If you use localStorage instead of sessionStorage, then this will be persisted across tabs and new windows.
    //sessionStorage just persisted only in current tab
    sessionStorage.setItem('token', token);

    return {
        type: AuthcConstants.LOGIN_SUCCESS,
        payload: {
            token: token,
            user: username
        }
    };
}

function loginFailure(username, error) {
    return {
        type: AuthcConstants.LOGIN_FAILURE,
        payload: {
            user: username,
            error: error
        }
    };
}

export function logoutUser() {
    return (dispatch) => {
        const _token = sessionStorage.getItem('token') || '';
        if(_token.length > 0) {
            api.authc.logout(_token).catch(error => {});
            sessionStorage.removeItem('token');
        }
        dispatch({
            type: AuthcConstants.LOGOUT_SUCCESS
        });
    }
}



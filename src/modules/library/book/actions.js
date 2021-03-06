import { parseJSON, checkHttpStatus, createConstants } from '../../../utils';
import api from '../../../api';

export const FetchBookConstants = createConstants(
    'FETCHING_BOOK_LIST',
    'FETCH_BOOK_LIST_SUCCESS',
    'FETCH_BOOK_LIST_FAILURE',

    'FETCH_BOOK_SUCCESS',
    'FETCH_BOOK_FAILURE'
);

export function fetchBooks(param) {

    return (dispatch) => {
        dispatch(fetchingBooks());
        api.books.list(param).then(response => {
            dispatch(fetchBooksSuccess(response));
        }).catch(error => {
            dispatch(fetchBooksFailure(error));
        });
    };
}

function fetchingBooks() {
    return {
        type: FetchBookConstants.FETCHING_BOOK_LIST,
        payload: {
            fetching: true
        }
    };
}

function fetchBooksSuccess(response) {
    return {
        type: FetchBookConstants.FETCH_BOOK_LIST_SUCCESS,
        payload: {
            books: response.content,
            currentPage: response.number+1,
            totalRecNum: response.totalElements,
            fetching: false
        }
    };
}

function fetchBooksFailure(error) {
    return {
        type: FetchBookConstants.FETCH_BOOK_LIST_FAILURE,
        payload: {
            error: error,
            fetching: false
        }
    };
}

export function fetchSingleBook(id) {
    return (dispatch) => {
        api.books.get(id).then(book => {
            dispatch({type: FetchBookConstants.FETCH_BOOK_SUCCESS, payload: {book: book}});
        }).catch(error => {
            dispatch({type: FetchBookConstants.FETCH_BOOK_FAILURE, payload: {error: error}});
        });
    }
}

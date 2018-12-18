import { curry } from 'ramda';
import PropTypes from 'prop-types';
import { buildShlinkApiClientWithAxios as buildShlinkApiClient } from '../../api/ShlinkApiClientBuilder';

/* eslint-disable padding-line-between-statements, newline-after-var */
export const CREATE_SHORT_URL_START = 'shlink/createShortUrl/CREATE_SHORT_URL_START';
export const CREATE_SHORT_URL_ERROR = 'shlink/createShortUrl/CREATE_SHORT_URL_ERROR';
export const CREATE_SHORT_URL = 'shlink/createShortUrl/CREATE_SHORT_URL';
export const RESET_CREATE_SHORT_URL = 'shlink/createShortUrl/RESET_CREATE_SHORT_URL';
/* eslint-enable padding-line-between-statements, newline-after-var */

export const createShortUrlResultType = PropTypes.shape({
  result: PropTypes.shape({
    shortUrl: PropTypes.string,
  }),
  saving: PropTypes.bool,
  error: PropTypes.bool,
});

const defaultState = {
  result: null,
  saving: false,
  error: false,
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case CREATE_SHORT_URL_START:
      return {
        ...state,
        saving: true,
        error: false,
      };
    case CREATE_SHORT_URL_ERROR:
      return {
        ...state,
        saving: false,
        error: true,
      };
    case CREATE_SHORT_URL:
      return {
        result: action.result,
        saving: false,
        error: false,
      };
    case RESET_CREATE_SHORT_URL:
      return defaultState;
    default:
      return state;
  }
}

export const _createShortUrl = (buildShlinkApiClient, data) => async (dispatch, getState) => {
  dispatch({ type: CREATE_SHORT_URL_START });

  const { selectedServer } = getState();
  const shlinkApiClient = buildShlinkApiClient(selectedServer);

  try {
    const result = await shlinkApiClient.createShortUrl(data);

    dispatch({ type: CREATE_SHORT_URL, result });
  } catch (e) {
    dispatch({ type: CREATE_SHORT_URL_ERROR });
  }
};

export const createShortUrl = curry(_createShortUrl)(buildShlinkApiClient);

export const resetCreateShortUrl = () => ({ type: RESET_CREATE_SHORT_URL });

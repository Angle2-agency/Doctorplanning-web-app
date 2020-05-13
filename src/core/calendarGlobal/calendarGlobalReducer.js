import { Record } from 'immutable'

const {
  CALENDAR_GLOBAL_REQUEST,
  CALENDAR_GLOBAL_SUCCESS,
  CALENDAR_GLOBAL_FAILURE,
} = require('./calendarGlobalActions').constants

const InitialState = Record({
  error: null,
  isFetching: false,
  data: [],
})

const initialState = new InitialState()

/**
 * ## galleryReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
export default function galleryReducer(state = initialState, { payload, type }) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

  switch (type) {
    case CALENDAR_GLOBAL_REQUEST:
      return state.set('isFetching', true).set('error', null)

    case CALENDAR_GLOBAL_SUCCESS:
      return state.set('isFetching', false).set('data', payload.data)

    case CALENDAR_GLOBAL_FAILURE:
      return state.set('isFetching', false).set('error', payload)

    default:
      return state
  }
}

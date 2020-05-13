import { Record } from 'immutable'

const { REHYDRATION_COMPLETED, SET_VERSION } = require('./globalActions').constants

const InitialState = Record({
  version: null,
  rehydrationCompleted: false,
  isFetching: false,
})

const initialState = new InitialState()
/**
 * ## globalReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
export default function globalReducer(state = initialState, { payload, type }) {
  if (!(state instanceof InitialState)) return initialState.merge(state)

  switch (type) {
    case SET_VERSION:
      return state.set('version', payload)

    case REHYDRATION_COMPLETED:
      return state.set('rehydrationCompleted', payload)

    default:
      return state
  }
}

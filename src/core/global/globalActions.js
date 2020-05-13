import keyMirror from 'key-mirror'
import { createActions } from 'redux-actions'

export const constants = keyMirror({
  REHYDRATION_COMPLETED: null,
  SET_VERSION: null,
})

export const { setVersion, rehydrationCompleted } = createActions(
  constants.SET_VERSION,
  constants.REHYDRATION_COMPLETED,
)

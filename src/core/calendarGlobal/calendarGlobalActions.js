import { createActions } from 'redux-actions'
import keyMirror from 'key-mirror'

export const constants = keyMirror({
  CALENDAR_GLOBAL_REQUEST: null,
  CALENDAR_GLOBAL_SUCCESS: null,
  CALENDAR_GLOBAL_FAILURE: null,
})

export const { calendarGlobalRequest, calendarGlobalSuccess, calendarGlobalFailure } = createActions(
  constants.CALENDAR_GLOBAL_REQUEST,
  constants.CALENDAR_GLOBAL_SUCCESS,
  constants.CALENDAR_GLOBAL_FAILURE,
)

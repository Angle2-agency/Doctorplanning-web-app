import { combineReducers } from 'redux'
import global from './global/globalReducer'
import calendarGlobal from './calendarGlobal/calendarGlobalReducer'
import { authentication, iccapi } from './user/userReducer'
import { sync } from './patient/patientGlobalReducer'

/**
 * ## CombineReducers
 *
 * the rootReducer will call each and every reducer with the state and action
 * EVERY TIME there is a basic action
 */

const rootReducer = combineReducers({
  calendarGlobal,
  global,
  authentication,
  sync,
  iccapi,
})

export default rootReducer

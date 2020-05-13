import { userConstants } from './userConstants'

const user = JSON.parse(localStorage.getItem('user'))
const initialState = user
  ? {
      loggedIn: true,
      user,
    }
  : {}

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        loggedIn: false,
        usernameBeingLoggedIn: action.username,
      }
    case userConstants.LOGIN_SUCCESS:
      return {
        loggingIn: false,
        loggedIn: true,
        user: action.user,
        hcp: action.hcp,
        patient: action.patient,
      }
    case userConstants.USER_MODIFIED:
      return Object.assign({}, state, { user: action.user })
    case userConstants.HCP_MODIFIED:
      return Object.assign({}, state, { hcp: action.hcp })
    case userConstants.LOGIN_FAILURE:
      return {
        loggingIn: false,
        loggedIn: false,
      }
    case userConstants.BACKUP_KEY:
      return {
        loggingIn: false,
        loggedIn: false,
        mustBackup: {
          cryptoParty: action.cryptoParty,
          key: action.key,
        },
      }
    case userConstants.LOGOUT:
      return {
        loggingIn: false,
        loggedIn: false,
      }
    default:
      return state
  }
}

export function iccapi(state = {}, action) {
  switch (action.type) {
    case userConstants.ICCAPI_INITIALISED:
      return action.api
    default:
      return state
  }
}

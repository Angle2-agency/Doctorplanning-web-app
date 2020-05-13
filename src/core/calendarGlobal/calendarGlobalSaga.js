import { call, fork, select, take } from 'redux-saga/effects'
import { calendarService } from './calendarService'

const { CRYPTO_AVAILABLE } = require('../user/userConstants').userConstants

const getIccapi = state => state.iccapi
const getUser = state => state.authentication.user
const delay = ms => new Promise(res => setTimeout(res, ms))

function* shareCalendarsWithPatients(marker) {
  const mark = marker.mark
  while (mark === marker.mark) {
    const iccapi = yield select(getIccapi)
    const user = yield select(getUser)
    yield call(calendarService.shareCalendarItemsWithPatients, iccapi, user)
    yield delay(5 * 60 * 1000)
  }
}

/**
 * Watch actions
 */
export default function* calendarGlobalSaga() {
  const marker = { mark: 0 }
  while (true) {
    marker.mark++
    yield take(CRYPTO_AVAILABLE)
    yield fork(shareCalendarsWithPatients, marker)
  }
}

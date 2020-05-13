import { call, put, select, take, fork } from 'redux-saga/effects'

import { patientGlobalActions } from './patientGlobalActions'
const { CRYPTO_AVAILABLE } = require('../user/userConstants').userConstants

const getIccapi = state => state.iccapi
const delay = ms => new Promise(res => setTimeout(res, ms))

function* startSynchronisation(marker) {
  const mark = marker.mark
  while (mark === marker.mark) {
    try {
      yield put(patientGlobalActions.synchronisationStarted())
      const iccapi = yield select(getIccapi)
      yield call(iccapi.sync(iccapi.cryptoicc).bind(iccapi), 1000)
      yield put(patientGlobalActions.synchronisationDone())
    } catch (e) {
      yield put(patientGlobalActions.synchronisationFailed(e))
    }
    yield delay(5 * 60 * 1000)
  }
}

/**
 * Watch actions
 */
export default function* patientGlobalSagas() {
  const marker = { mark: 0 }
  while (true) {
    marker.mark++
    yield take(CRYPTO_AVAILABLE)
    yield fork(startSynchronisation, marker)
  }
}

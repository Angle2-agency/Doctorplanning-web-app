import calendarGlobalSaga from './calendarGlobal/calendarGlobalSaga'
import patientGlobalSaga from './patient/patientGlobalSaga'

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield [calendarGlobalSaga(), patientGlobalSaga()]
}

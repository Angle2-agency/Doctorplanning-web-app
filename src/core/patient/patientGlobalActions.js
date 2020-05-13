import keyMirror from 'key-mirror'

export const constants = keyMirror({
  SYNC_STARTED: null,
  SYNC_DONE: null,
  SYNC_FAILED: null,
})

function synchronisationStarted() {
  return { type: constants.SYNC_STARTED }
}

function synchronisationDone() {
  return { type: constants.SYNC_DONE }
}

function synchronisationFailed(e) {
  return { type: constants.SYNC_FAILED, error: e }
}

export const patientGlobalActions = { synchronisationStarted, synchronisationDone, synchronisationFailed }

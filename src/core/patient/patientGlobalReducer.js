import { constants } from '../patient/patientGlobalActions'

export function sync(
  state = {
    syncing: false,
    synced: false,
  },
  action,
) {
  switch (action.type) {
    case constants.SYNC_STARTED:
      return {
        syncing: true,
        synced: false,
      }
    case constants.SYNC_DONE:
      return {
        syncing: false,
        synced: true,
      }
    case constants.SYNC_FAILED:
      return {
        syncing: false,
        synced: false,
      }
    default:
      return state
  }
}

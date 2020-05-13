// APP CONSTATNS
const app = {
  DEBUG: true,
  MOCK: false,
  APP_NAME: 'Luta',

  API_URL: 'https://backend.svc.icure.cloud/rest/v1',
  API_URL_DEV: 'https://backend.svcacc.icure.cloud/rest/v1',
}
// Priority of the status
export const statusesPriority = {
  critical: 1,
  waiting: 2,
  confirmed: 3,
  pipeline: 4,
}
export const MIN_REPLANNIG_CRITICAL_PERIOD = '1296000000'
export default app

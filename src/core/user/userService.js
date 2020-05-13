import { iccapipouched } from 'icc-api-pouched'
import _ from 'lodash'
import { history } from '../../helpers'

const { DEBUG, API_URL_DEV, API_URL } = require('../constants').default

const API_BASE_URL = DEBUG ? API_URL_DEV : API_URL

function mapHcp(hcp) {
  return _.pick(hcp, [
    'id',
    'publicKey',
    'name',
    'lastName',
    'firstName',
    'gender',
    'civility',
    'nihii',
    'ssin',
    'picture',
    'hcPartyKeys',
  ])
}

function mapPatient(pat) {
  return _.pick(pat, [
    'id',
    'publicKey',
    'lastName',
    'firstName',
    'gender',
    'civility',
    'ssin',
    'picture',
    'hcPartyKeys',
  ])
}

function mapUser(user) {
  return _.pick(user, ['id', 'login', 'healthcarePartyId', 'patientId', 'name', 'properties'])
}

async function loadAssociatedEntities(iccapi, user) {
  if (user.healthcarePartyId) {
    return { hcp: await iccapi.hcpartyicc.getHealthcareParty(user.healthcarePartyId) }
  } else if (user.patientId) {
    return { patient: await iccapi.patienticc.getPatientWithUser(user, user.patientId) }
  } else {
    return {}
  }
}

async function attemptLogin(username, password) {
  const iccapi = new iccapipouched.newIccApiPouched(API_BASE_URL, username, password, {}, 0, {
    patient: [
      'note',
      'firstName',
      'lastName',
      'dateOfBirth',
      'ssin',
      'picture',
      'maidenName',
      'addresses.*.["street","houseNumber","postalCode", "city", "telecoms.*.telecomNumber"]',
    ],
  })
  const user = await iccapi.usericc.getCurrentUser()
  if (!user) {
    throw new Error('Invalid username or password')
  }

  await iccapi.init()

  return {
    api: iccapi,
    user: user,
  }
}

async function updateHcpKey(hcpartyicc, hcpId, publicKey, hcPartyKeys) {
  return await hcpartyicc.modifyHealthcareParty(
    Object.assign(await hcpartyicc.getHealthcareParty(hcpId), { publicKey, hcPartyKeys }),
  )
}

async function updatePatientKey(patienticc, patId, publicKey, hcPartyKeys) {
  return mapPatient(
    await patienticc.modifyPatientRaw(Object.assign(await patienticc.getPatientRaw(patId), { publicKey, hcPartyKeys })),
  )
}

async function checkPrivateKey(cryptoicc, hcpOrPatient) {
  return cryptoicc.checkPrivateKeyValidity(hcpOrPatient)
}

function logout() {
  history.push('/login')
}

export const userService = {
  mapHcp,
  mapPatient,
  mapUser,
  attemptLogin,
  loadAssociatedEntities,
  logout,
  updateHcpKey,
  updatePatientKey,
  checkPrivateKey,
}

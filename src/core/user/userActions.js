import { userConstants } from './userConstants'
import { userService } from './userService'
import { history } from '../../helpers'

function attemptLogin(username, password, target) {
  function loginRequest(username) {
    return { type: userConstants.LOGIN_REQUEST, username }
  }

  function loginSuccess(user, hcp, patient) {
    return {
      type: userConstants.LOGIN_SUCCESS,
      user: userService.mapUser(user),
      hcp: userService.mapHcp(hcp),
      patient: userService.mapPatient(patient),
    }
  }

  function cryptoIsAvailable() {
    return {
      type: userConstants.CRYPTO_AVAILABLE,
    }
  }

  function loginFailure(username) {
    return { type: userConstants.LOGIN_FAILURE, username }
  }

  function apiInitialised(api) {
    return { type: userConstants.ICCAPI_INITIALISED, api }
  }

  function backupKey(cryptoParty, key) {
    return { type: userConstants.BACKUP_KEY, cryptoParty, key }
  }

  function generateCryptoKeys(api, cryptoParty) {
    return async dispatch => {
      const crypto = api.cryptoicc
      const keyPair = await crypto.RSA.generateKeyPair()
      const AESKey = await crypto.AES.generateCryptoKey(true)
      const encryptedAESKey = await crypto.RSA.encrypt(keyPair.publicKey, crypto.utils.hex2ua(AESKey))
      const exportedKeyPairForLocalStorage = await crypto.RSA.exportKeys(keyPair, 'jwk', 'jwk')

      crypto.RSA.storeKeyPair(cryptoParty.id, exportedKeyPairForLocalStorage)

      const exportedKeyPair = await crypto.RSA.exportKeys(keyPair, 'pkcs8', 'spki')
      const publicKey = crypto.utils.ua2hex(exportedKeyPair.publicKey)
      const hcPartyKeys = Object.assign({}, cryptoParty.hcPartyKeys || {})
      hcPartyKeys[cryptoParty.id] = [crypto.utils.ua2hex(encryptedAESKey), crypto.utils.ua2hex(encryptedAESKey)]

      dispatch(backupKey(cryptoParty, crypto.utils.ua2hex(exportedKeyPair.privateKey)))

      return {
        publicKey,
        hcPartyKeys,
      }
    }
  }

  return dispatch => {
    dispatch(loginRequest(username))
    return userService
      .attemptLogin(username, password)
      .then(async ({ api, user }) => {
        dispatch(apiInitialised(api))

        const { hcp, patient } = await userService.loadAssociatedEntities(api, user)

        if (hcp && !hcp.publicKey) {
          const { publicKey, hcPartyKeys } = await dispatch(generateCryptoKeys(api, hcp))
          await userService.updateHcpKey(api.hcpartyicc, hcp.id, publicKey, hcPartyKeys)
        } else if (patient && !patient.publicKey) {
          const { publicKey, hcPartyKeys } = await dispatch(generateCryptoKeys(api, patient))
          await userService.updatePatientKey(api.patienticc, patient.id, publicKey, hcPartyKeys)
        }

        dispatch(loginSuccess(user, hcp, patient))
        if (await userService.checkPrivateKey(api.cryptoicc, hcp || patient)) {
          dispatch(cryptoIsAvailable())
        }
        if (hcp) {
          history.push(target || '/calendar')
        } else if (user.patientId) {
          history.push('/patient_contacts')
        }
      })
      .catch(error => {
        console.log('error while logging in')
        dispatch(loginFailure(error.toString()))
        throw error
      })
  }
}

function userModified(user) {
  return { type: userConstants.USER_MODIFIED, user: userService.mapUser(user) }
}

function hcpModified(hcp) {
  return { type: userConstants.HCP_MODIFIED, hcp: userService.mapHcp(hcp) }
}

function logout() {
  userService.logout()
  return { type: userConstants.LOGOUT }
}

export const userActions = {
  attemptLogin,
  userModified,
  hcpModified,
  logout,
}

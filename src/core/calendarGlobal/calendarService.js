import moment from 'moment'
import _ from 'lodash'

async function shareCalendarItemsWithPatients(iccapi, user) {
  const calendarItems =
    iccapi &&
    user &&
    (await iccapi.calendaritemicc.getCalendarItemsByPeriodAndHcPartyId(
      +moment()
        .subtract(1, 'month')
        .format('YYYYMMDDhhmmss'),
      +moment()
        .add(18, 'months')
        .format('YYYYMMDDhhmmss'),
      user.healthcarePartyId,
    ))

  const pimpedCalendarItems = await Promise.all(
    calendarItems.map(calendarItem =>
      iccapi.cryptoicc
        .extractKeysFromDelegationsForHcpHierarchy(
          user.healthcarePartyId,
          calendarItem.id,
          calendarItem.cryptedForeignKeys,
        )
        .then(({ extractedKeys }) => ({ calendarItem, patientIds: extractedKeys })),
    ),
  )
  const pats = (await iccapi.patienticc.filterByWithUser(user, null, null, 1000, 0, null, null, {
    filter: {
      $type: 'PatientByIdsFilter',
      ids: _.uniqBy(_.compact(_.flatMap(pimpedCalendarItems, k => k.patientIds))),
    },
  })) || { rows: [] }
  const patsMap = _.fromPairs(pats.rows.map(p => [p.id, p]))

  const modCis = await Promise.all(
    pimpedCalendarItems
      .filter(
        pci =>
          pci.patientIds &&
          pci.patientIds.length &&
          !Object.keys(pci.calendarItem.delegations || {}).some(k => pci.patientIds.includes(k)) &&
          pci.patientIds.some(pid => patsMap[pid] && patsMap[pid].publicKey),
      )
      .map(async pci => {
        const pat = pci.patientIds.map(pid => patsMap[pid]).find(x => x && !!x.publicKey)
        const [delSfks, ecKeys] = await Promise.all([
          this.crypto.extractDelegationsSFKs(pci.calendarItem, user.healthcarePartyId || user.patientId),
          this.crypto.extractEncryptionsSKs(pci.calendarItem, user.healthcarePartyId || user.patientId),
        ])
        return await iccapi.cryptoicc.addDelegationsAndEncryptionKeys(
          pat,
          pci.calendarItem,
          user.healthcarePartyId || user.patientId,
          pat.id,
          delSfks[0],
          ecKeys[0],
        )
      }),
  )

  modCis.reduce(async (prev, ci) => {
    await prev
    return iccapi.calendaritemicc.modifyCalendarItem(ci)
  }, Promise.resolve())
}

export const calendarService = {
  shareCalendarItemsWithPatients,
}

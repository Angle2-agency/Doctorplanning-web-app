import { statusesPriority } from '../core/constants'
import _ from 'lodash'
import moment from 'moment'

export function fzmoment(epochOrLongCalendar) {
  if (!epochOrLongCalendar && epochOrLongCalendar !== 0) {
    return null
  }
  if (epochOrLongCalendar >= 18000101 && epochOrLongCalendar < 25400000) {
    return moment('' + epochOrLongCalendar, 'YYYYMMDD')
  } else if (epochOrLongCalendar >= 18000101000000) {
    return moment('' + epochOrLongCalendar, 'YYYYMMDDHHmmss')
  } else {
    return moment(epochOrLongCalendar) // epoch or string
  }
}

export function createCalendarMonthsArr(calendarItems) {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7].map(m =>
    moment()
      .add(m, 'months')
      .format('YYYY-MM'),
  )

  calendarItems.map(ci => {
    const dateFormatted = fzmoment(ci.startTime).format('YYYY-MM')
    if (!arr.find(el => el === dateFormatted)) {
      arr.push(dateFormatted)
    }
    return dateFormatted
  })
  return arr.sort()
}

export function eventFromCalendarItem(ci, patientId, patsMap) {
  const statusCode = ((ci.codes || []).find(c => c.type === 'LUTA-STATUS') || {}).code
  const dosisCode = ((ci.codes || []).find(c => c.type === 'LUTA-DOSIS') || {}).code
  const st = ci.startTime && fzmoment(ci.startTime)
  const et = ci.endTime && fzmoment(ci.endTime)
  const patient = patsMap[patientId]
  const titleForFiltering = statusesPriority[statusCode]

  return {
    key: ci.id,
    title: titleForFiltering,
    status: statusCode,
    dosis: dosisCode,
    date: st && st.format('YYYY-MM-DD'), // For full calendar
    startTime: st,
    endTime: et,
    dateCompleted: false,
    patientId: patientId,
    patient: patient,
    className: `fc-ceil ${statusCode || 'waiting'}`,
  }
}

export function calendarItemFromEvent(e) {
  return {
    id: e.key,
    title: e.title,
    startTime: +e.startTime.format('YYYYMMDDhhmmss'),
    endTime: +e.endTime.format('YYYYMMDDhhmmss'),
    duration: Math.max(0, e.endTime.diff(e.startTime) / 1000),
    codes: _.compact([
      e.status
        ? {
            type: 'LUTA-STATUS',
            version: '1.0',
            code: e.status,
          }
        : null,
      e.dosis
        ? {
            type: 'LUTA-DOSIS',
            version: '1.0',
            code: e.dosis,
          }
        : null,
    ]),
  }
}

export function makeEvents(calendarItemWithPatientIds, patsMap) {
  return calendarItemWithPatientIds
    .map(pci => eventFromCalendarItem(pci.calendarItem, pci.patientIds.find(id => !!patsMap[id]), patsMap))
    .filter(ci => !!ci.date)
}

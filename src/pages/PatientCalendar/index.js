import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
import spriteSrc from '../../assets/images/sprite.svg'
import { determineStatusText } from '../../helpers'

import DOM from './patientCalendar'
import { createCalendarMonthsArr, makeEvents } from '../../helpers/calendarItems'
class PatientCalendar extends React.Component {
  state = {
    calendar: false,
    calendarMonthsArr: null,
    calendarEvents: null,
    allCalendarEvents: null,
    mdlTreatmentVisible: false,
    mdlTreatmentData: null,
  }

  componentDidMount() {
    const id = (this.props.match.params && this.props.match.params.id) || this.props.user.patientId
    this.props.iccapi.patienticc.getPatientWithUser(this.props.user, id).then(p => {
      this.setState({ patient: p })
      this.fetchCalendarData(p)
    })
  }

  patientChanged(p) {
    this.setState({ patient: p })
  }

  createCalendarEvents = async (calendarItems, patient) => {
    //First extract the secret foreign keys and decrypt them to get the patient ids
    const pimpedCalendarItems = await Promise.all(
      calendarItems.map(calendarItem =>
        this.props.iccapi.cryptoicc
          .extractKeysFromDelegationsForHcpHierarchy(
            this.props.user.healthcarePartyId || this.props.user.patientId,
            calendarItem.id,
            calendarItem.cryptedForeignKeys,
          )
          .then(({ extractedKeys }) => ({ calendarItem, patientIds: extractedKeys })),
      ),
    )

    if (this.props.user.healthcarePartyId) {
      // all calendar events
      const pats = (await this.props.iccapi.patienticc.filterByWithUser(
        this.props.user,
        null,
        null,
        1000,
        0,
        null,
        null,
        {
          filter: {
            $type: 'PatientByIdsFilter',
            ids: _.uniqBy(_.compact(_.flatMap(pimpedCalendarItems, k => k.patientIds))),
          },
        },
      )) || { rows: [] }
      const patsMap = _.fromPairs(pats.rows.map(p => [p.id, p]))
      const allCalendarEvents = makeEvents(pimpedCalendarItems, patsMap)
      this.setState({
        allCalendarEvents,
      })
      return makeEvents(pimpedCalendarItems.filter(pci => pci.patientIds.includes(patient.id)), {
        [patient.id]: patient,
      })
    } else {
      const allCalendarEvents = makeEvents(pimpedCalendarItems.filter(pci => pci.patientIds.includes(patient.id)), {
        [patient.id]: patient,
      })
      this.setState({
        allCalendarEvents,
      })
      return allCalendarEvents
    }
    // only current patient calendar events
  }

  async refreshCalendarEvents(calendarItems, patient) {
    const calendarMonthsArr = createCalendarMonthsArr(calendarItems)
    const calendarEvents = await this.createCalendarEvents(calendarItems, patient)
    this.setState({
      calendarMonthsArr,
      calendarEvents,
      calendar: true,
      dateClicked: null,
    })
  }

  fetchCalendarData = async patient => {
    const calendarItems =
      this.props.iccapi &&
      this.props.user &&
      (await this.props.iccapi.calendaritemicc.getCalendarItemsByPeriodAndHcPartyId(
        +moment()
          .startOf('month')
          .format('YYYYMMDDhhmmss'),
        +moment()
          .add(8, 'months')
          .format('YYYYMMDDhhmmss'),
        this.props.user.healthcarePartyId || this.props.user.patientId,
      ))
    this.setState({ calendarItems })
    //Can be done in //
    await this.refreshCalendarEvents(calendarItems, patient)
  }

  handleEventRender = e => {
    const eventDate = +moment(e.event.start)
    let modeOnlyPatientEvent = false
    let dayRender = {}
    const eventsRenderDay = []
    let cellLayout = null
    this.state.calendarEvents.forEach(obj => {
      if (obj.key === e.event._def.extendedProps.key) {
        dayRender = obj
        modeOnlyPatientEvent = true
      }
      if (+moment(obj.date) === eventDate) {
        eventsRenderDay.push(obj)
      }
    })
    if (modeOnlyPatientEvent && eventsRenderDay.length > 0) {
      const cellClassName = dayRender.status
      const statusText = determineStatusText(dayRender.status)
      const eventIcon = dayRender.status === 'pending' || dayRender.status === 'approved' ? 'biotest' : 'injection'
      cellLayout = `
          <div class="dayceil ${cellClassName}">
          <div class="dayceil__content">
            <div class="flex-center">
               <div class="dayceil__icon">
                 <svg class=${`icon icon-${eventIcon}`}>
                   <use xlink:href=${spriteSrc}#icon-${eventIcon} />
                 </svg>
               </div>
              <span class="dayceil__text">${statusText}</span>
            </div>
            </div>
          </div>
          `
    } else {
      const evDate = moment(e.event.start).format('YYYY-MM-DD')
      this.state.allCalendarEvents.forEach(event => {
        if (event.date === evDate) {
          eventsRenderDay.push(event)
        }
      })
      if (eventsRenderDay.length > 0) {
        const plurality = eventsRenderDay.length > 1 ? 's' : ''
        cellLayout = `
          <div class="dayceil dayceil--events day--greyed dayceil--greyed${eventsRenderDay.length}">
          <div class="dayceil__content">
            <div class="flex-center justify-content-end">
              <span class="dayceil__patients">${eventsRenderDay.length}</span>
              <span class="dayceil__text">Patient${plurality}</span>
            </div>
            </div>
          </div>
          `
      }
    }
    e.el.innerHTML = cellLayout
  }
  handleDateClick = arg => {
    const datePicked = +moment(arg.dateStr ? arg.dateStr : arg)
    const dayClickedData = _.find(this.state.calendarEvents, o => +moment(o.date) === datePicked)
    if (dayClickedData) {
      this.setState({
        mdlTreatmentData: [dayClickedData],
        mdlTreatmentVisible: true,
      })
    }
  }
  handleMdlTreatmentCancel = () => {
    this.setState({ mdlTreatmentVisible: false })
  }

  render() {
    this.view = DOM

    return this.view()
  }
}

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    iccapi: state.iccapi,
    user: state.authentication.user,
  }
}

export default connect(mapStateToProps)(PatientCalendar)

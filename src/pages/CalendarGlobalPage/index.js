import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import 'moment/locale/fr'
import DOM from './calendarGlobalPage'
import _ from 'lodash'
import spriteSrc from '../../assets/images/sprite.svg'
import { makeEvents, calendarItemFromEvent, createCalendarMonthsArr } from '../../helpers/calendarItems'

class CalendarGlobalPage extends React.Component {
  state = {
    settingsMode: false,
    selectedStatus: 'all',
    calendarItems: [],
    calendarMonthsArr: [],
    calendarEvents: [],
    calendar: false,
    dateClicked: null,
    mdlEditData: null,
    mdlEditVisible: false,
  }

  componentDidMount() {
    this._mounted = true
    this.fetchCalendarData()
  }
  componentWillUnmount() {
    this._mounted = false
  }
  toggleSettingsMode = () => {
    this.setState({
      settingsMode: !this.state.settingsMode,
    })
  }
  createCalendarEvents = async calendarItems => {
    //First extract the secret foreign keys and decrypt them to get the patient ids
    const pimpedCalendarItems = await Promise.all(
      calendarItems.map(calendarItem =>
        this.props.iccapi.cryptoicc
          .extractKeysFromDelegationsForHcpHierarchy(
            this.props.user.healthcarePartyId,
            calendarItem.id,
            calendarItem.cryptedForeignKeys,
          )
          .then(({ extractedKeys }) => ({ calendarItem, patientIds: extractedKeys })),
      ),
    )
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

    return makeEvents(pimpedCalendarItems, patsMap)
  }

  async refreshCalendarEvents(calendarItems) {
    const calendarMonthsArr = createCalendarMonthsArr(calendarItems)
    const calendarEvents = await this.createCalendarEvents(calendarItems)
    if (this._mounted) {
      this.setState({
        calendarMonthsArr,
        calendarEvents,
        calendar: true,
        dateClicked: null,
      })
    }
  }

  fetchCalendarData = async () => {
    const calendarItems =
      this.props.iccapi &&
      this.props.user &&
      (await this.props.iccapi.calendaritemicc.getCalendarItemsByPeriodAndHcPartyId(
        +moment()
          .subtract(1, 'month')
          .format('YYYYMMDDhhmmss'),
        +moment()
          .add(9, 'months')
          .format('YYYYMMDDhhmmss'),
        this.props.user.healthcarePartyId,
      )).filter(ci => !ci.codes.some(c => c.code === 'bloodtest'))
    if (this._mounted) {
      this.setState({ calendarItems })
    }
    //Can be done in //
    await this.refreshCalendarEvents(calendarItems)
  }

  handleEventRender = e => {
    const eventDate = moment(e.event.start).format('YYYY-MM-DD')
    let dayRender = {}
    const eventsRenderDay = []
    this.state.calendarEvents.forEach(event => {
      if (event.key === e.event._def.extendedProps.key) {
        dayRender = event
      }
      if (event.date === eventDate) {
        eventsRenderDay.push(event)
      }
    })
    if (eventsRenderDay.length > 0) {
      const cellClassName = dayRender.status
      const eventIcon = dayRender.dateCompleted
        ? `<svg class="icon icon-lock">
            <use xlink:href=${spriteSrc}#icon-lock />
          </svg>`
        : ''
      const plurality = eventsRenderDay.length > 1 ? 's' : ''
      const cellLayout = `
        <div class="dayceil dayceil--events ${cellClassName}">
        <div class="dayceil__content">
          <div class="dayceil__event">${eventIcon}</div>
          <div class="flex-center justify-content-end">
            <span class="dayceil__patients">${eventsRenderDay.length}</span>
            <span class="dayceil__text">Patient${plurality}</span>
          </div>
          </div>
        </div>
        `
      e.el.innerHTML = cellLayout
    }
  }
  handleDateClick = arg => {
    const dateClicked = moment(arg.dateStr || (arg.event && arg.event.start), 'YYYY-MM-DD')
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
    // TODO @roman prefer immutable structures everywhere like below
    const endOfDateClicked = dateClicked.clone().add(1, 'day')
    const eventsOnClickedDate = this.state.calendarEvents
      .filter(calEvent => calEvent.startTime && calEvent.startTime.isBetween(dateClicked, endOfDateClicked))
      .map(calEvent => Object.assign({}, calEvent))
    if (eventsOnClickedDate.length > 0) {
      this.setState({
        mdlEditVisible: true,
        dateClicked,
        mdlEditData: eventsOnClickedDate,
      })
    } else {
      this.setState({
        mdlEditVisible: true,
        dateClicked,
        mdlEditData: [
          {
            key: this.props.iccapi.cryptoicc.randomUuid(),
            editEnabled: true,
            status: 'waiting',
            dosis: 'ij1',
            startTime: dateClicked
              .clone()
              .hours(9)
              .minutes(30),
            endTime: dateClicked
              .clone()
              .hours(10)
              .minutes(30),
          },
        ],
      })
    }
  }
  handleMdlEditCancel = () => {
    this.setState({ mdlEditVisible: false, dateClicked: null })
  }

  createCalendarItem = async (ev, daysOffset) => {
    return this.props.iccapi.calendaritemicc.createCalendarItemWithHcParty(
      this.props.user,
      await this.props.iccapi.calendaritemicc.newInstancePatient(
        this.props.user,
        ev.patient,
        calendarItemFromEvent(
          daysOffset
            ? Object.assign({}, ev, {
                startTime: ev.startTime.clone().add(daysOffset, 'days'),
                endTime: ev.endTime.clone().add(daysOffset, 'days'),
              })
            : ev,
        ),
      ),
    )
  }

  updateCalendarData = async newData => {
    const createdAndModified = await Promise.all(
      newData.map(async d => {
        if (d.patientId) {
          return this.props.iccapi.calendaritemicc.modifyCalendarItem(
            Object.assign({}, this.state.calendarItems.find(ci => ci.id === d.key), calendarItemFromEvent(d)),
          )
        } else {
          if (d.dosis === 'ij1234') {
            return [[8, 'ij2'], [16, 'ij3'], [32, 'ij4'], [0, 'ij1']].reduce(async (p, [w, dosis]) => {
              await p
              await this.createCalendarItem(
                Object.assign({}, d, {
                  key: this.props.iccapi.cryptoicc.randomUuid(),
                  dosis: 'bloodtest',
                  status: 'pending',
                }),
                w * 7 - 2 * 7,
              )
              return this.createCalendarItem(
                Object.assign({}, d, { key: w ? this.props.iccapi.cryptoicc.randomUuid() : d.key, dosis: dosis }),
                w * 7,
              )
            }, Promise.resolve(null))
          } else {
            await this.createCalendarItem(
              Object.assign({}, d, {
                key: this.props.iccapi.cryptoicc.randomUuid(),
                dosis: 'bloodtest',
                status: 'pending',
              }),
              -2 * 7,
            )
            return this.createCalendarItem(d, 0)
          }
        }
      }),
    )
    this.setState(state => ({
      calendarItems: state.calendarItems
        .map(ci => createdAndModified.find(newCi => newCi.id === ci.id) || ci)
        .concat(createdAndModified.filter(newCi => !state.calendarItems.some(ci => ci.id === newCi.id))),
    }))
    // Can be done in //
    await this.refreshCalendarEvents(this.state.calendarItems)
  }
  handleSelectStatus = ({ key: val }) => {
    this.setState({ selectedStatus: val })
    this.refreshCalendarEvents(
      this.state.calendarItems.filter(calendarItem =>
        val === 'all' ? true : (calendarItem.codes || []).some(c => c.type === 'LUTA-STATUS' && c.code === val),
      ),
    )
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

export default connect(mapStateToProps)(CalendarGlobalPage)

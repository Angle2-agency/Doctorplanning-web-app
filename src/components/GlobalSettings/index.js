import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Form, Button, Popover, notification } from 'antd'
import moment from 'moment'
import uid from 'uid'
import Icon from '../../elements/Icon'
import _ from 'lodash'
import PopoverLayout from './PopoverLayout'
import { updateData, removeDataItem } from '../../helpers'
import DOM from './globalSettings'

class GlobalSettings extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM

    this.state = {
      visible: false,
      dataConfig: [],
      content: '',
      blockedDates: [],
      popoverNewData: [],
      popoverHasNewData: false,
      reasonOfBlocking: '',
    }
    this.removeDataItem = removeDataItem.bind(this)
    this.updateData = updateData.bind(this)
  }

  componentDidMount() {
    this.setState({
      dataConfig: [
        {
          key: '001',
          heading: 'Vue par défaut:',
          rows: [
            {
              fieldDecorator: 'calendarMode',
              value: 'Année',
              fieldProps: {
                type: 'select',
                style: { width: 226 },
                options: ['Année', 'Une semaine', 'Le jour', 'La lune'],
              },
            },
          ],
        },
        {
          key: '002',
          heading: 'Bloquer tous les jours:',
          rows: [
            {
              fieldDecorator: 'weekdays',
              value: ['Les lundis'],
              fieldProps: {
                type: 'checkboxgroup',
                options: [
                  'Les lundis',
                  'Les mardis',
                  'Les mercredis',
                  'Les jeudis',
                  'Les vendredis',
                  'Les samedis',
                  'Les dimanches',
                ],
              },
              className: 'vertical',
            },
          ],
        },
        {
          key: '003',
          heading: 'Heure de début de journée:',
          rows: [
            {
              fieldDecorator: 'workDayStart',
              value: moment('08:00', 'HH:mm a'),
              fieldProps: {
                type: 'timepicker',
                style: { width: 226 },
                use12Hours: true,
                format: 'h:mm a',
                minuteStep: 15,
                allowClear: false,
              },
            },
          ],
        },
        {
          key: '004',
          heading: 'Heure de fin de journée:',
          rows: [
            {
              fieldDecorator: 'workDayEnd',
              value: moment('18:00', 'HH:mm a'),
              fieldProps: {
                type: 'timepicker',
                style: { width: 226 },
                use12Hours: true,
                format: 'h:mm a',
                minuteStep: 15,
                allowClear: false,
              },
            },
          ],
        },
      ],
      blockedDates: [
        { key: '0004', startTime: '1561276800000', endTime: '1561279500000', reason: 'Jour bloqué' },
        { key: '0005', startTime: '1561876200000', endTime: '1561879800000', reason: 'Jour bloqué' },
        { key: '0006', startTime: '1562221800000', endTime: '1562225400000', reason: 'Jour bloqué' },
        { key: '0007', startTime: '1562221800000', endTime: '1562225400000', reason: 'Jour bloqué' },
        { key: '0008', startTime: '1562301800000', endTime: '1562491800000', reason: 'Jour bloqué' },
        { key: '0009', startTime: '1562308200000', endTime: '1562311800000', reason: 'Jour bloqué' },
        { key: '00010', startTime: '1562394641000', endTime: '1562398241000', reason: 'Jour bloqué' },
        { key: '00011', startTime: '1562913000000', endTime: '1562916600000', reason: 'Jour bloqué' },
        { key: '00012', startTime: '1563181200000', endTime: '1563089400000', reason: 'Jour bloqué' },
        { key: '00013', startTime: '1564822800000', endTime: '1562225400000', reason: 'Jour bloqué' },
        { key: '00014', startTime: '1566541800000', endTime: '1566545400000', reason: 'Jour bloqué' },
        { key: '00015', startTime: '1566714600000', endTime: '1566718200000', reason: 'Jour bloqué' },
        { key: '00016', startTime: '1567146600000', endTime: '1567150200000', reason: 'Jour bloqué' },
      ],
    })
  }

  handleRenderCalendar(currentDate, events) {
    const eventsRenderDay = []
    let cellLayout = null
    let isWholeDayBlocked = false
    const evDate = currentDate.format('YYYY-MM-DD')
    events.forEach(event => {
      if (event.date === evDate) {
        eventsRenderDay.push(event)
      }
    })
    const currentBlockedDates = []
    this.state.blockedDates.forEach(ev => {
      const isBetween = currentDate.isBetween(+ev.startTime, +ev.endTime)
      const isSame = currentDate.isSame(+ev.startTime, 'day') || currentDate.isSame(+ev.endTime, 'day')
      if (isSame || isBetween) {
        currentBlockedDates.push(ev)
      }
    })
    if (currentBlockedDates.length > 0) {
      isWholeDayBlocked = currentBlockedDates.some(item => {
        return +item.endTime - +item.startTime > 86399999
      })
    }
    const arrLength = eventsRenderDay.length
    const plurality = arrLength > 1 ? 's' : ''
    cellLayout = (
      <Popover
        overlayClassName="caldset-popover"
        content={
          <PopoverLayout
            arrLength={arrLength}
            currentBlockedDates={currentBlockedDates}
            currentDate={currentDate}
            isWholeDayBlocked={isWholeDayBlocked}
            popoverNewData={this.state.popoverNewData}
            popoverHasNewData={this.state.popoverHasNewData}
            uniqueKeyForDate={this.state.uniqueKeyForDate}
            generateTagText={this.generateTagText}
            unblockDates={this.unblockDates}
            handleDateTimeChange={this.handleDateTimeChange}
            handleMessageChange={this.handleMessageChange}
            createPopoverTimeRow={this.createPopoverTimeRow}
            removePopoverTimeRow={this.removePopoverTimeRow}
            closePopover={this.closePopover}
            askActionConfirm={this.askActionConfirm}
          />
        }
        visible={this.state[`popover${+currentDate}Visibility`]}
        onVisibleChange={e => {
          this.togglePopover(currentDate)
          this.resetPopoverData(e)
        }}
        placement="rightTop"
        trigger="click"
      >
        <div className={`calendarceil dayceil--greyed${arrLength}`}>
          <div className="dayceil__current-date">{currentDate.format('D')}</div>
          {currentBlockedDates.length > 0 ? (
            <div className="calendarceil__footer">
              <div className="taglock">
                <Icon name="lock" />
                <div className="taglock__text">
                  {isWholeDayBlocked ? (
                    // whole day is blocked
                    <span className="taglock__reason">Jour bloqué</span>
                  ) : (
                    // only timeslot is blocked
                    <div className="taglock__timelist">
                      <span className="taglock__reason">Horaire réduit</span>
                      {currentBlockedDates.map(item => {
                        return (
                          <span key={item.key} className="taglock__time">
                            {moment(+item.startTime).format('Ha') + '-' + moment(+item.endTime).format('Ha')}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
                <Button
                  className="empty"
                  onClick={e => this.askActionConfirm(currentDate, 'unblocking', currentBlockedDates, e)}
                >
                  <Icon name="close" />
                </Button>
              </div>
            </div>
          ) : null}
          {arrLength > 0 ? (
            <div className="calendarceil__footer">
              <span className="calendarceil__patients">{arrLength}</span>
              <span className="calendarceil__text">Patient{plurality}</span>
            </div>
          ) : null}
        </div>
      </Popover>
    )
    return cellLayout
  }

  generateTagText = (start, end) => {
    // if more than 1 day
    const isTimeslot = +end - +start < 86399999
    let dateText = ''
    if (isTimeslot) {
      dateText = moment(+start).format('LL') + ' | ' + moment(+start).format('Ha') + ' - ' + moment(+end).format('Ha')
    } else {
      dateText = moment(+start).format('LL') + ' - ' + moment(+end).format('LL')
    }
    return dateText
  }

  resetPopoverData = e => {
    if (!e) {
      this.setState({
        popoverNewData: [],
        popoverHasNewData: false,
      })
    }
  }

  togglePopover = currentDate => {
    this.setState({
      [`popover${+currentDate}Visibility`]: !this.state[`popover${+currentDate}Visibility`],
    })
  }

  closePopover = currentDate => {
    this.setState({
      [`popover${+currentDate}Visibility`]: false,
    })
  }

  createPopoverTimeRow = currentDate => {
    const newTimerow = {
      key: uid(10),
      startTime: +currentDate.hours(7).minutes(0),
      endTime: +currentDate.hours(8).minutes(0),
      reason: '',
    }
    const newTimeRows = this.state.popoverNewData
    const hasDuplicate = newTimeRows.some(
      item => item.startTime === newTimerow.startTime || item.endTime === newTimerow.endTime,
    )
    if (!hasDuplicate) {
      newTimeRows.push(newTimerow)
      this.setState({
        popoverNewData: newTimeRows,
        popoverHasNewData: true,
      })
    }
  }

  removePopoverTimeRow = key => {
    this.removeDataItem('popoverNewData', key)
  }

  handleDateTimeChange = (e, type, id, currentDate) => {
    const idx = _.findIndex(this.state.popoverNewData, ['key', id])
    if (idx >= 0) {
      this.updateData('popoverNewData', id, type, +e)
    } else {
      const startTime = type === 'startTime' ? +e : +currentDate
      const endTime = type === 'endTime' ? +e : +currentDate
      if (endTime - startTime > 86399999) {
        const newDaterow = {
          key: uid(10),
          startTime,
          endTime,
          reason: '',
        }
        const newDate = this.state.popoverNewData
        newDate.push(newDaterow)
        this.setState({
          popoverNewData: newDate,
          popoverHasNewData: true,
        })
      }
    }
  }

  handleMessageChange = e => {
    this.setState({
      messageValue: e.target.value,
    })
  }

  askActionConfirm = (currentDate, type, currentBlockedDates, e) => {
    if (e) {
      e.stopPropagation()
    }
    this.closePopover(+currentDate)
    let dataWillUpdate
    if (type === 'blocking') {
      dataWillUpdate = this.state.popoverNewData
      dataWillUpdate = _.uniqBy(dataWillUpdate, 'startTime')
      dataWillUpdate = _.uniqBy(dataWillUpdate, 'endTime')
      dataWillUpdate.map(item => (item.reason = this.state.messageValue))
    }
    if (type === 'unblocking') {
      dataWillUpdate = currentBlockedDates
    }
    let datesWillEdit = ''
    const separator = dataWillUpdate.length > 1 ? ', ' : ''
    dataWillUpdate.forEach(item => {
      datesWillEdit += datesWillEdit + this.generateTagText(item.startTime, item.endTime) + separator
    })
    this.setState({
      visible: true,
      datesWillEdit,
      actionType: type,
      newData: dataWillUpdate,
    })
  }

  unblockDates = (e, arr) => {
    if (e) {
      e.stopPropagation()
    }
    let data = this.state.blockedDates
    arr.forEach(item => {
      data = _.filter(data, function(n) {
        return n.key !== item.key
      })
    })
    this.setState({
      blockedDates: data,
    })
    this.closeAskActionConfirm()
    notification.success({
      message: 'Vous avez débloqué la journée avec succès',
    })
  }

  confirmEditing = actionType => {
    if (actionType === 'blocking') {
      const updatedData = [...this.state.blockedDates, ...this.state.newData]
      this.closeAskActionConfirm()
      this.setState({
        blockedDates: updatedData,
      })
      notification.success({
        message: 'Vous avez bloqué la journée avec succès',
      })
    }
    if (actionType === 'unblocking') {
      this.unblockDates(false, this.state.newData)
    }
  }

  closeAskActionConfirm = () => {
    this.setState({
      visible: false,
      datesWillEdit: '',
    })
  }
  render() {
    return this.view(this.props)
  }
}

const GlobalSettingsForm = Form.create({
  name: 'global_settings_form',
})(GlobalSettings)

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GlobalSettingsForm)

import React from 'react'
import { Button, DatePicker, Input, TimePicker } from 'antd'
import moment from 'moment'
import _ from 'lodash'

import Icon from '../../elements/Icon'

const Textarea = Input.TextArea

export default function(props) {
  const {
    arrLength,
    currentBlockedDates,
    currentDate,
    isWholeDayBlocked,
    popoverHasNewData,
    popoverNewData,
    generateTagText,
    uniqueKeyForDate,
    unblockDates,
    handleDateTimeChange,
    handleMessageChange,
    createPopoverTimeRow,
    removePopoverTimeRow,
    closePopover,
    askActionConfirm,
  } = props
  const hasBlockingRange = popoverNewData.some(item => +item.endTime - +item.startTime > 86399999)
  const hasBlockedDates = currentBlockedDates.length > 0
  const getDisabledHours = currentBlockedDates => {
    var hours = []
    currentBlockedDates.forEach(item => {
      const start = moment(+item.startTime).hour()
      const end = moment(+item.endTime).hour()
      for (let i = start; i < end; i++) {
        hours.push(i)
      }
    })
    return _.uniq(hours)
  }

  const header = (
    <div>
      <div className="popover__close">
        <Button className="empty" onClick={() => closePopover(currentDate)}>
          <Icon name="close" />
        </Button>
      </div>
      <h5 className="h-4 text-bold flex-center">
        {arrLength} Patients{' '}
        {hasBlockedDates ? (
          <div className="flex-center">
            <span className="ml-2">|</span>
            <div className="flex-center ml-2">
              <span className="fz-16 flex-center">
                <Icon name="lock" />
              </span>
              <span className="ml-1">Blockque day</span>
            </div>
          </div>
        ) : null}
      </h5>
      <div className="info-message mt-2 mb-1">
        {arrLength > 0 ? (
          <p className="c_red">
            Vous ne pouvez pas bloquer cette journée, car vous devez au préalable reprogrammer les injections. Vous
            pouvez bloquer uniquement le temps disponible
          </p>
        ) : hasBlockedDates ? (
          <p className="lightgrey">
            Ce jour a déjà bloqué, si vous voulez débloquer ce jour, s&apos;il vous plaît cliquez sur le bouton
          </p>
        ) : (
          <p className="lightgrey">
            Vous pouvez bloquer un jour, la durée d&apos;un jour ou d&apos;un jour à l&apos;autre
          </p>
        )}
      </div>
    </div>
  )

  const daterow = (
    <div className="daterow">
      <div className="flex-center">
        <div className="daterow__icon">
          <Icon name="calendar" />
        </div>
        <DatePicker
          defaultValue={currentDate}
          format="D MMM"
          mode="date"
          dropdownClassName="calendar-styled"
          disabled={arrLength > 0 || isWholeDayBlocked || hasBlockedDates ? true : false}
          suffixIcon={<br />}
          allowClear={false}
          showToday={false}
          size="large"
          onChange={e => handleDateTimeChange(e, 'startTime', uniqueKeyForDate, currentDate)}
        />
        <span className="dash"> — </span>
        <DatePicker
          defaultValue={currentDate}
          format="D MMM"
          mode="date"
          dropdownClassName="calendar-styled"
          disabled={arrLength > 0 || isWholeDayBlocked || hasBlockedDates ? true : false}
          suffixIcon={<br />}
          allowClear={false}
          showToday={false}
          size="large"
          onChange={e => handleDateTimeChange(e, 'endTime', uniqueKeyForDate, currentDate)}
        />
      </div>
      <Button
        className="white"
        onClick={() => createPopoverTimeRow(currentDate)}
        disabled={isWholeDayBlocked || hasBlockingRange || hasBlockedDates}
      >
        <Icon name="plus" />
        <span>Temps</span>
      </Button>
    </div>
  )
  const timerows = popoverNewData.map(item => {
    const diff = item.endTime - item.startTime
    const invalidTime = diff < 0
    if (diff < 86399999 && !hasBlockingRange) {
      return (
        <div className={`daterow ${invalidTime ? 'has-error' : null}`} key={item.key}>
          <div className="flex-center">
            <div className="daterow__icon">
              <Icon name="clock" />
            </div>
            <TimePicker
              defaultValue={moment(item.startTime)}
              use12Hours
              format="h:mm a"
              minuteStep={15}
              suffixIcon={<br />}
              allowClear={false}
              size="large"
              disabledHours={() => getDisabledHours(currentBlockedDates)}
              onChange={e => handleDateTimeChange(e, 'startTime', item.key, currentDate)}
            />
            <span className="dash"> — </span>
            <TimePicker
              defaultValue={moment(item.endTime)}
              use12Hours
              format="h:mm a"
              minuteStep={15}
              suffixIcon={<br />}
              allowClear={false}
              size="large"
              disabledHours={() => getDisabledHours(currentBlockedDates)}
              onChange={e => handleDateTimeChange(e, 'endTime', item.key, currentDate)}
            />
          </div>
          <Button className="white" onClick={() => removePopoverTimeRow(item.key)}>
            <Icon name="basket" />
          </Button>
        </div>
      )
    }
    return false
  })
  const tags = (
    <div className="popover__taglock-box">
      {hasBlockedDates
        ? currentBlockedDates.map(item => {
            return (
              <div className="taglock" key={item.key}>
                <Icon name="lock" />
                <div className="taglock__text">{generateTagText(item.startTime, item.endTime)}</div>
                <Button className="empty" onClick={() => askActionConfirm(currentDate, 'unblocking', [item])}>
                  <Icon name="close" />
                </Button>
              </div>
            )
          })
        : null}
    </div>
  )

  const message = (
    <div className="reason-message mt-5 mb-1">
      <p className="lightgrey">Vous devriez définir une raison de blocage du jour</p>
      <div className="textarea-head mt-2">
        <p className="lightgrey">La raison du blocage</p>
      </div>
      <Textarea onChange={handleMessageChange} style={{ minHeight: 113 }} />
    </div>
  )
  const footer = (
    <div className="mt-3 flex-center justify-content-end">
      {hasBlockedDates ? (
        <Button className="green" onClick={() => askActionConfirm(currentDate, 'unblocking', currentBlockedDates)}>
          <span>Débloquer ce jour</span>
        </Button>
      ) : (
        <Button
          className="green"
          disabled={!popoverHasNewData}
          onClick={() => askActionConfirm(currentDate, 'blocking')}
        >
          <span>Bloquer ce jour</span>
        </Button>
      )}
    </div>
  )

  return (
    <div>
      {header}
      {daterow}
      {isWholeDayBlocked ? null : timerows}
      {hasBlockedDates ? tags : null}
      {popoverHasNewData ? message : false}
      {footer}
    </div>
  )
}

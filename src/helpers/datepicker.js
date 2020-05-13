import React from 'react'

export function handleRenderDatePicker(currentDate, today, events) {
  const eventsRenderDay = []
  let cellLayout = null
  const evDate = currentDate.format('YYYY-MM-DD')
  events.forEach(event => {
    if (event.date === evDate) {
      eventsRenderDay.push(event)
    }
  })
  const arrLength = eventsRenderDay.length
  const plurality = arrLength > 1 ? 's' : ''
  cellLayout = (
    <div className={`calendarceil dayceil--greyed${arrLength}`}>
      <div className="dayceil__current-date">{currentDate.format('D')}</div>
      {arrLength > 0 ? (
        <div className="calendarceil__footer">
          <span className="calendarceil__patients">{arrLength}</span>
          <span className="calendarceil__text">Patient{plurality}</span>
        </div>
      ) : null}
    </div>
  )
  return cellLayout
}

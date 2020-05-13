import React from 'react'
import { Row, Col } from 'antd'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

import './calendar-global.css'
import _ from 'lodash'

export default function(props) {
  return (
    <div className="fc-luta fc-luta--enhaced">
      <div className="container-fluid">
        <Row gutter={32}>
          {props.months.map(el => (
            <div key={el}>
              <Col className="gutter-row" span={12}>
                <FullCalendar
                  defaultDate={el}
                  defaultView={'dayGridMonth'}
                  firstDay={1}
                  plugins={[dayGridPlugin, interactionPlugin]}
                  weekends={true}
                  header={{
                    left: '',
                    center: 'title',
                    right: '',
                  }}
                  locale="fr"
                  events={props.events.map(ev => _.pick(ev, ['key', 'title', 'date', 'className']))}
                  eventOrder="title"
                  dateClick={props.handleDateClick}
                  dayRender={props.handleDayRender}
                  eventRender={props.handleEventRender}
                  eventClick={props.handleDateClick}
                  ref={props.ref}
                />
              </Col>
            </div>
          ))}
        </Row>
      </div>
    </div>
  )
}

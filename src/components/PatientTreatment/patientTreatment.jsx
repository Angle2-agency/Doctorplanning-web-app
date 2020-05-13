import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import InfoSinglePatient from '../InfoSinglePatient'

import { Tabs } from 'antd'

import './patient-treatment.css'
import _ from 'lodash'

const { TabPane } = Tabs

export default function(props, patientChanged) {
  return (
    <div className="area-tabbed">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Calendrier de traitement" key="1" className="overflow-y-scroll" style={{ maxHeight: 2480 }}>
          <div className="fc-luta fc-luta--enhaced">
            {props.months.map(el => (
              <div key={el}>
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
                />
              </div>
            ))}
          </div>
        </TabPane>
        {props.user.healthcarePartyId ? (
          <TabPane tab="Information du patient" key="2">
            <InfoSinglePatient patient={props.patient} patientChanged={patientChanged} />
          </TabPane>
        ) : null}
      </Tabs>
    </div>
  )
}

import React from 'react'
import { Spin, Button } from 'antd'
import Layout from '../../components/Layout'
import ContentHead from '../../components/ContentHead'
import SelectStatus from '../../components/SelectStatus'
import CalendarGlobal from '../../components/CalendarGlobal'
import ModalEditCalendar from '../../components/ModalEditCalendar'
import GlobalSettings from '../../components/GlobalSettings'
import Icon from '../../elements/Icon'

import './calendar-global-page.css'

const CalendarGlobalPage = function() {
  const { calendarMonthsArr, calendarEvents, selectedStatus } = this.state
  const selectStatus = (
    <SelectStatus value={selectedStatus} allowAllOption handleSelectStatus={this.handleSelectStatus} />
  )
  const calendarLayout = (
    <div className="global-calendar-wrap">
      {this.state.calendar ? (
        <CalendarGlobal
          months={calendarMonthsArr}
          events={calendarEvents}
          handleDateClick={this.handleDateClick}
          handleDayRender={this.handleDayRender}
          handleEventRender={this.handleEventRender}
        />
      ) : (
        <div className="spinner">
          <Spin size="large" />
        </div>
      )}

      {this.state.mdlEditData ? (
        <ModalEditCalendar
          visible={this.state.mdlEditVisible}
          data={this.state.mdlEditData}
          dateClicked={this.state.dateClicked}
          cancel={this.handleMdlEditCancel}
          updateCalendar={this.updateCalendarData}
        />
      ) : null}
    </div>
  )

  return (
    <Layout title="Vue calendrier globale">
      <ContentHead title="Vue calendrier globale" right={selectStatus}>
        <div style={{ marginRight: 'auto', marginLeft: '24px' }}>
          <Button className="white xl" onClick={this.toggleSettingsMode}>
            <Icon name="edit" />
            {this.state.settingsMode ? <span>Quitter le mode édition</span> : <span>Paramètres de calendrier</span>}
          </Button>
        </div>
      </ContentHead>
      {this.state.settingsMode ? <GlobalSettings events={calendarEvents} /> : calendarLayout}
    </Layout>
  )
}

export default CalendarGlobalPage

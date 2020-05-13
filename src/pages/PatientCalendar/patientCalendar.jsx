import React from 'react'
import { Spin, Row, Col } from 'antd'
import Layout from '../../components/Layout'
import ContentHead from '../../components/ContentHead'
import Schedule from '../../components/Schedule'
import PatientTreatment from '../../components/PatientTreatment'
import PatientModalTreatment from '../../components/PatientModalTreatment'

export default function() {
  const { calendarMonthsArr, calendarEvents, allCalendarEvents } = this.state
  return (
    <Layout title={this.state.patient && `${this.state.patient.firstName} ${this.state.patient.lastName}`}>
      <ContentHead title={this.state.patient && `${this.state.patient.firstName} ${this.state.patient.lastName}`}>
        <div style={{ marginRight: 'auto', marginLeft: '0px' }}>
          <span className="opt-status confirmed small">Confirmé</span>
        </div>
      </ContentHead>
      <div className="fc-luta">
        <div className="container-fluid">
          <Row gutter={16} type="flex">
            <Col span={16}>
              {this.state.calendar ? (
                <PatientTreatment
                  months={calendarMonthsArr}
                  events={allCalendarEvents}
                  user={this.props.user}
                  patient={this.state.patient}
                  patientChanged={this.patientChanged.bind(this)}
                  handleDayRender={this.handleDayRender}
                  handleDateClick={this.handleDateClick}
                  handleEventRender={this.handleEventRender}
                />
              ) : (
                <div className="spinner mt-5">
                  <Spin size="large" />
                </div>
              )}
            </Col>
            <Col span={8}>
              {this.state.calendarEvents ? (
                <Schedule events={calendarEvents} handleDateClick={this.handleDateClick} />
              ) : (
                <div className="spinne mt-5">
                  <Spin size="large" />
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
      {this.state.mdlTreatmentData ? (
        <PatientModalTreatment
          visible={this.state.mdlTreatmentVisible}
          data={this.state.mdlTreatmentData}
          events={allCalendarEvents}
          cancel={this.handleMdlTreatmentCancel}
        />
      ) : null}
    </Layout>
  )
}

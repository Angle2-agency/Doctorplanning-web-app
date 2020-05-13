import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import { MIN_REPLANNIG_CRITICAL_PERIOD } from '../../core/constants'
import 'moment/locale/fr'

import DOM from './patientModalTreatment'

class PatientModalTreatment extends React.Component {
  state = {
    userMode: null,
    data: this.props.data,
    editEnabled: false,
    stepMessage: false,
    stepConfirm: false,
    messageValue: '',
  }
  componentDidMount() {
    this.setState({
      userMode: this.props.user.healthcarePartyId ? 'hcp' : 'patient',
    })
    this.initializeModal()
  }
  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.initializeModal()
    }
  }
  initializeModal = () => {
    this.setState((state, props) => ({
      data: props.data,
    }))
  }
  handleGoStepMessage = () => {
    this.setState({
      stepMessage: true,
    })
  }
  handleGoStepDefault = () => {
    this.setState({
      stepDefault: true,
      stepMessage: false,
      stepConfirm: false,
    })
  }
  handleGoStepConfirm = () => {
    this.setState({
      stepDefault: false,
      stepMessage: false,
      stepConfirm: true,
    })
    if (this.state.messageValue) {
    }
  }
  handleCriticalExceptionCaseWarning = () => {
    this.setState({ criticalExceptionCaseWarning: true })
  }
  handleEditEnabled = () => {
    this.setState({ editEnabled: !this.state.editEnabled })
  }
  handleMessageChange = e => {
    e.persist()
    this.setState({
      messageValue: e.target.value,
    })
  }
  handleConfirmationDuAAA = () => {
    this.setState({
      confirmationDuAAA: !this.state.confirmationDuAAA,
    })
  }
  handleConfirmationDoctor = () => {
    this.setState({
      confirmationDoctor: !this.state.confirmationDoctor,
    })
  }
  handleDateTimeChange = (e, record, index, typeTime, onlyHoursMins) => {
    this.setState(state => {
      const key = `original${typeTime.charAt(0).toUpperCase() + typeTime.slice(1)}`
      return {
        data: state.data.map((r, idx) => {
          if (idx === index) {
            let newTime = moment(e)
            if (onlyHoursMins) {
              newTime = moment(this.state.data[idx].startTime)
                .hour(e.hour())
                .minute(e.minute())
            }
            return Object.assign({ [key]: r[typeTime] || moment(0) }, record, {
              [typeTime]: +newTime,
              dataChanged: true,
            })
          } else {
            return r
          }
        }),
        dataChanged: true,
      }
    })
  }
  getModifiedPieceOfDataAndSetConfirmStepState = cancelIfNoModifiedData => {
    const data = this.state.data.find(d => {
      return (
        d.dataChanged &&
        ((d.originalStartTime && d.originalStartTime !== d.startTime) ||
          (d.originalEndTime && d.originalEndTime !== d.endTime) ||
          (d.originalStatus && d.originalStatus !== d.status)) &&
        !d.dataConfirmed
      )
    })
    if (!data) {
      if (cancelIfNoModifiedData) {
        this.props.cancel()
      }
      return null
    } else {
      this.setState(state => ({
        confirmedData: data,
      }))
      return data
    }
  }
  handleValidateOrCancel = () => {
    const { status, originalStartTime, startTime } = this.state.data[0]
    let success = true
    if (status === 'confirmed' || status === 'waiting') {
      success = this.state.confirmationDuAAA
    }
    if (status === 'pending' || status === 'approved' || status === 'waiting') {
      success = this.state.confirmationDoctor
    }
    if (status === 'critical') {
      // exception case if replanning < 15 days
      const periodCritical = Math.abs(+originalStartTime - +startTime)
      if (periodCritical < MIN_REPLANNIG_CRITICAL_PERIOD) {
        this.getModifiedPieceOfDataAndSetConfirmStepState(true)
        this.setState({
          criticalExceptionCase: true,
        })
        this.handleGoStepMessage()
        return
      }
    }
    if (success) {
      this.getModifiedPieceOfDataAndSetConfirmStepState(true)
      this.handleGoStepConfirm()
    }
  }
  handleSave = () => {
    this.setState(
      state => ({
        data: state.data.map(d => (d === state.confirmedData ? Object.assign({}, d, { dataConfirmed: true }) : d)),
      }),
      () => {
        if (!this.getModifiedPieceOfDataAndSetConfirmStepState(false)) {
          this.handleCancel()
        }
      },
    )
  }
  handleCancel = () => {
    this.props.cancel()
  }
  handleAfterClose = () => {
    this.setState({
      stepMessage: false,
      stepConfirm: false,
      editEnabled: false,
      dataChanged: false,
      confirmationDuAAA: false,
      confirmationDoctor: false,
      messageValue: '',
      criticalExceptionCase: false,
    })
  }
  render() {
    this.view = DOM
    return this.view()
  }
}

PatientModalTreatment.propTypes = {
  actions: PropTypes.object.isRequired,
}

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    user: state.authentication.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({}, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientModalTreatment)

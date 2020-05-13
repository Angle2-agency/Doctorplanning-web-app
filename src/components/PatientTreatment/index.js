import React from 'react'
import DOM from './patientTreatment'

export default class PatientTreatment extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }

  patientChanged(p) {
    this.props.patientChanged && this.props.patientChanged(p)
  }

  render() {
    this.view = DOM
    return this.view(this.props, this.patientChanged.bind(this))
  }
}

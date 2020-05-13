import React from 'react'
import DOM from './patientSettings'

class PatientSettings extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }

  render() {
    return this.view()
  }
}

export default PatientSettings

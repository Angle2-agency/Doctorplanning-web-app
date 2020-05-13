import React from 'react'
import DOM from './patientContacts'

class PatientContact extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }
  render() {
    return this.view()
  }
}

export default PatientContact

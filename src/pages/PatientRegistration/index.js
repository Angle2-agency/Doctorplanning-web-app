import { Component } from 'react'
import DOM from './patientRegistration'

class PatientRegistration extends Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }

  render() {
    return this.view()
  }
}

export default PatientRegistration

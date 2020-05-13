import React from 'react'
import DOM from './myPatientsPage'

class MyPatientsPage extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }

  render() {
    return this.view()
  }
}

export default MyPatientsPage

import React from 'react'
import DOM from './generateReport'

class GenerateReport extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }

  render() {
    return this.view()
  }
}

export default GenerateReport

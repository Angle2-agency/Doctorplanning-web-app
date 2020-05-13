import React from 'react'
import DOM from './confidentiality'

class Confidentiality extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }

  render() {
    return this.view()
  }
}

export default Confidentiality

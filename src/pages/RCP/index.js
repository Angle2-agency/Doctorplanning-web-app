import React from 'react'
import DOM from './rcp'

class RCP extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }

  render() {
    return this.view()
  }
}

export default RCP

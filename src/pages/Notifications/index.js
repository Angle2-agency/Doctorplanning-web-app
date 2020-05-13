import React from 'react'
import DOM from './notifications'

class Notifications extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }

  render() {
    return this.view()
  }
}

export default Notifications

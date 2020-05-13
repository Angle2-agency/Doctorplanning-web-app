import React from 'react'
import DOM from './calendarGlobal'

export default class CalendarGlobal extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
    this.state = {}
  }

  render() {
    this.view = DOM
    return this.view(this.props)
  }
}

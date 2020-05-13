import React from 'react'
import moment from 'moment'
import DOM from './schedule'

export default class Schedule extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
    this.state = {
      scheduleData: [],
    }
  }
  componentDidMount() {
    this.setState({
      scheduleData: this.props.events,
    })
    this.findFirstInjection(this.props.events)
  }
  findFirstInjection = events => {
    let firstInjection = null
    events.forEach(item => {
      if (item.dosis.startsWith('ij')) {
        const itemDate = +moment(+item.startTime)
        firstInjection = !firstInjection ? item.startTime : itemDate > firstInjection ? firstInjection : itemDate
      }
    })
    this.setState({
      firstInjection,
    })
  }
  render() {
    return this.view()
  }
}

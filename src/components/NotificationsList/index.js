import React from 'react'

import DOM from './notificationsList'

export default class NotificationsList extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }

  componentDidMount() {}

  render() {
    return this.view()
  }
}

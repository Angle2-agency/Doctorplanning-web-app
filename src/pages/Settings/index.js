import React from 'react'

import DOM from './settings'

class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }
  render() {
    return this.view()
  }
}

export default Settings

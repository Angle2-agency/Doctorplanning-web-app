import { Component } from 'react'

import DOM from './registration'

class Registration extends Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }

  render() {
    return this.view()
  }
}

export default Registration

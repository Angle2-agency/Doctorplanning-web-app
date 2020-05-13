import React from 'react'
import DOM from './welcome'

class Welcome extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }

  render() {
    return this.view()
  }
}

export default Welcome

import React from 'react'
import DOM from './homePage'

class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }

  render() {
    return this.view()
  }
}

export default HomePage

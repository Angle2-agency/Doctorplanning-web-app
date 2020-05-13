import React from 'react'
import DOM from './bookletRiv'

class BookletRiv extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }

  render() {
    return this.view()
  }
}

export default BookletRiv

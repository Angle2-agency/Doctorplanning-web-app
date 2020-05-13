import React from 'react'

import DOM from './contentHead'

export default class ContentHead extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }

  render() {
    return this.view()
  }
}

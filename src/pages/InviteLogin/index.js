import { Component } from 'react'

import DOM from './inviteLogin'

class InviteLogin extends Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }

  render() {
    return this.view()
  }
}

export default InviteLogin

import { Component } from 'react'
import { connect } from 'react-redux'

import DOM from './login'

class Login extends Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }

  render() {
    if (this.props.mustBackup) {
      // Download backup of the key
      const file = new Blob([this.props.mustBackup.key], { type: 'text/plain' })
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.style = 'display: none'
      const url = window.URL.createObjectURL(file)
      a.href = url
      a.download = `${this.props.mustBackup.cryptoParty.id}.2048.key`
      a.click()
      window.URL.revokeObjectURL(url)
    }

    return this.view()
  }
}

function mapStateToProps(state, ownProps) {
  return {
    mustBackup: state.authentication.mustBackup,
    ...ownProps,
  }
}

export default connect(mapStateToProps)(Login)

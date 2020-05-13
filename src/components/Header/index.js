import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { userActions } from '../../core/user/userActions'
import * as globalActions from '../../core/global/globalActions'

import DOM from './header'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = { importKeyPairVisible: false, forceImportKeyPairVisible: false }
    this.view = DOM
  }
  handleImportKeyPairImportSucceeded() {
    this.setState({ importKeyPairVisible: false, forceImportKeyPairVisible: false })
  }
  handleImportKeyPairImportFailed() {
    //Do nothing
  }
  handleImportKeyPairCancel = () => {
    this.setState({ importKeyPairVisible: false })
  }
  handleLogOut = () => {
    const { actions } = this.props
    actions.logout()
  }
  render() {
    ;(this.props.hcp &&
      this.props.hcp.publicKey &&
      this.props.iccapi.cryptoicc &&
      this.props.iccapi.cryptoicc.checkPrivateKeyValidity(this.props.hcp).then(ok => {
        if (this.state.forceImportKeyPairVisible !== !ok) {
          this.setState({ forceImportKeyPairVisible: !ok })
        }
      })) ||
      (this.props.patient &&
        this.props.patient.publicKey &&
        this.props.iccapi.cryptoicc &&
        this.props.iccapi.cryptoicc.checkPrivateKeyValidity(this.props.patient).then(ok => {
          if (this.state.forceImportKeyPairVisible !== !ok) {
            this.setState({ forceImportKeyPairVisible: !ok })
          }
        }))
    const pic = (this.props.hcp || this.props.patient || {}).picture
    return this.view(this.props, pic ? `data:image/${pic.startsWith('/9j/') ? 'jpeg' : 'png'};base64,${pic}` : '')
  }
}
function mapStateToProps(state, ownProps) {
  return {
    user: state.authentication.user,
    hcp: state.authentication.hcp,
    patient: state.authentication.patient,
    iccapi: state.iccapi,
    ...ownProps,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...globalActions,
        ...userActions,
      },
      dispatch,
    ),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header)

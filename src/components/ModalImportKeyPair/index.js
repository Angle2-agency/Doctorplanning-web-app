import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as globalActions from '../../core/global/globalActions'

import DOM from './modalImportKeyPair'

class ModalImportKeyPair extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      saveEnabled: false,
    }
    this.view = DOM
  }

  handleFile = file => {
    this.setState({
      fileList: [file],
    })

    this.setState({ saveEnabled: true })

    return false
  }
  handleSave = () => {
    this.props.iccapi.cryptoicc
      .loadKeyPairsInBrowserLocalStorage((this.props.hcp || this.props.patient).id, this.state.fileList[0])
      .then(() => this.props.iccapi.cryptoicc.checkPrivateKeyValidity(this.props.hcp || this.props.patient))
      .then(ok => (ok ? this.props.ok() : this.props.ko()))
      .catch(() => this.props.ko())
  }
  handleCancel = () => {
    this.props.cancel()
  }
  render() {
    return this.view(this.props.user.healthcarePartyId || this.props.user.patientId)
  }
}

ModalImportKeyPair.propTypes = {
  actions: PropTypes.object.isRequired,
  global: PropTypes.object.isRequired,
}

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    global: state.global,
    iccapi: state.iccapi,
    user: state.authentication.user,
    hcp: state.authentication.hcp,
    patient: state.authentication.patient,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...globalActions,
      },
      dispatch,
    ),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalImportKeyPair)

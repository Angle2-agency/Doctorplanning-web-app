import { Component } from 'react'
import { userActions } from '../../core/user/userActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { history } from '../../helpers'
import { iccapipouched } from 'icc-api-pouched'
import DOM from './relog'

const { DEBUG, API_URL_DEV, API_URL } = require('../../core/constants').default
const API_BASE_URL = DEBUG ? API_URL_DEV : API_URL

class Relog extends Component {
  constructor(props) {
    super(props)
    this.view = DOM
  }

  render() {
    //Try to relog
    const destination = (((this.props.location || {}).state || {}).from || {}).pathname
    const { actions } = this.props

    iccapipouched
      .loadCurrentUserWithSessionCookie(API_BASE_URL)
      .then(u => {
        if (u && u.applicationTokens && Object.keys(u.applicationTokens).length) {
          actions.attemptLogin(u.id, u.applicationTokens[Object.keys(u.applicationTokens)[0]], destination)
        } else {
          history.push('/')
        }
      })
      .catch(() => history.push('/'))

    return this.view()
  }
}

function mapStateToProps(state, ownProps) {
  return {
    mustBackup: state.authentication.mustBackup,
    ...ownProps,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...userActions,
      },
      dispatch,
    ),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Relog)

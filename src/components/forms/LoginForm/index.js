import PropTypes from 'prop-types'
import { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form } from 'antd'
import { userActions } from '../../../core/user/userActions'

import * as globalActions from '../../../core/global/globalActions'

import DOM from './loginForm'

class LoginForm extends Component {
  static get propTypes() {
    return {
      form: PropTypes.any,
      actions: PropTypes.any,
    }
  }

  constructor(props) {
    super(props)
    this.view = DOM
    this.state = {
      loginFailured: false,
    }
  }
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }
  // ----- Submit Form ----- //
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { actions } = this.props
        const { username, password } = values
        if (username && password) {
          actions.attemptLogin(username, password).catch(e => {
            this.setState({
              loginFailured: true,
            })
          })
        }
      }
    })
  }
  resetLoginFailure() {
    this.setState({
      loginFailured: false,
    })
  }
  render() {
    return this.view()
  }
}

const Login = Form.create({ name: 'login_form' })(LoginForm)

function mapStateToProps(state, ownProps) {
  return {
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
)(Login)

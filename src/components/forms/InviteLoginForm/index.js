import { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form } from 'antd'

import * as globalActions from '../../../core/global/globalActions'

import DOM from './inviteLoginForm'

class InviteLogin extends Component {
  constructor(props) {
    super(props)
    this.view = DOM
    this.state = {
      confirmDirty: false,
    }
  }
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }
  handleConfirmBlur = e => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }
  render() {
    return this.view({ global })
  }
}
const InviteLoginForm = Form.create({ name: 'invite_login__form' })(InviteLogin)

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
      },
      dispatch,
    ),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InviteLoginForm)

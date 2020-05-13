import { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form } from 'antd'

import * as globalActions from '../../../core/global/globalActions'

import DOM from './regForm'

class Reg extends Component {
  constructor(props) {
    super(props)
    this.view = DOM
    this.state = {
      confirmDirty: false,
    }
  }

  // ----- Submit Form ----- //
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
const RegForm = Form.create({ name: 'reg_form' })(Reg)

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
)(RegForm)

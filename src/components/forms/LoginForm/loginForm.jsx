import React from 'react'
import { Form, Input, Button } from 'antd'
import AuthError from '../../../elements/AuthError'

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}
export default function() {
  const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
  const usernameError = isFieldTouched('username') && getFieldError('username')
  const passwordError = isFieldTouched('password') && getFieldError('password')
  return (
    <Form onSubmit={this.handleSubmit} className="login-form" colon={false}>
      {this.state.loginFailured ? <AuthError /> : null}
      <Form.Item label="Nom d'utilisateur" validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: 'Please input your username!' }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Mot de passe" validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please input your Password!' }],
        })(<Input.Password />)}
      </Form.Item>
      <div className="d-flex justify-content-center mt-4">
        <Button htmlType="submit" className="green xl " disabled={hasErrors(getFieldsError())}>
          Login
        </Button>
      </div>
    </Form>
  )
}

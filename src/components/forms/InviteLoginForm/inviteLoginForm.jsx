import React from 'react'
import { Form, Input, Button } from 'antd'

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

export default function() {
  const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
  const emailError = isFieldTouched('email') && getFieldError('email')
  const passwordError = isFieldTouched('password') && getFieldError('password')
  const confirmError = isFieldTouched('confirm') && getFieldError('confirm')
  return (
    <Form onSubmit={this.handleSubmit} colon={false}>
      <Form.Item label="E-mail" validateStatus={emailError ? 'error' : ''} help={emailError || ''}>
        {getFieldDecorator('email', {
          rules: [{ required: true, type: 'email', message: 'Please input your email!' }],
        })(<Input />)}
      </Form.Item>
      <Form.Item
        label="Mot de passe"
        hasFeedback
        validateStatus={passwordError ? 'error' : ''}
        help={passwordError || ''}
      >
        {getFieldDecorator('password', {
          rules: [
            {
              required: true,
              message: 'Please input your password!',
            },
            {
              validator: this.validateToNextPassword,
            },
          ],
        })(<Input.Password />)}
      </Form.Item>
      <Form.Item
        label="Confirmer le mot de passe"
        hasFeedback
        validateStatus={confirmError ? 'error' : ''}
        help={confirmError || ''}
      >
        {getFieldDecorator('confirm', {
          rules: [
            {
              required: true,
              message: 'Please confirm your password!',
            },
            {
              validator: this.compareToFirstPassword,
            },
          ],
        })(<Input.Password onBlur={this.handleConfirmBlur} />)}
      </Form.Item>
      <div className="d-flex justify-content-center mt-5">
        <Button htmlType="submit" className="green md" disabled={hasErrors(getFieldsError())}>
          S&apos;identifier
        </Button>
      </div>
    </Form>
  )
}

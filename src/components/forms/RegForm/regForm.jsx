import React from 'react'
import { Form, Input, Button } from 'antd'

export default function() {
  const { getFieldDecorator } = this.props.form
  return (
    <Form onSubmit={this.handleSubmit} colon={false}>
      <Form.Item label="Nom">
        {getFieldDecorator('firstname', {
          rules: [{ required: true, message: 'Please input your firstname!' }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Prénom ">
        {getFieldDecorator('lastname', {
          rules: [{ required: true, message: 'Please input your lastname!' }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="E-mail">
        {getFieldDecorator('email', {
          rules: [{ required: true, type: 'email', message: 'Please input your email!' }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Téléphone">
        {getFieldDecorator('phone', {
          rules: [{ required: true, message: 'Please input your phone!' }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Mot de passe" hasFeedback>
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
      <Form.Item label="Confirmer le mot de passe" hasFeedback>
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

      <div className="d-flex justify-content-center mt-4">
        <Button htmlType="submit" className="green xl ">
          S&apos;inscrire
        </Button>
      </div>
    </Form>
  )
}

import React from 'react'
import { Form } from 'antd'

import DOM from './modalAddMember'

class ModalAddMember extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataConfig: [],
    }
    this.view = DOM
  }
  componentDidMount() {
    this.props.form.validateFields()
  }
  handleSubmit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const newMember = values
        this.props.addMember(newMember)
        this.setState({
          stepOkMember: true,
        })
      }
    })
  }
  handleCancel = () => {
    this.props.cancel()
  }
  handleAfterClose = () => {
    this.setState({
      stepOkMember: false,
    })
  }
  render() {
    return this.view()
  }
}
const ModalAddMemberForm = Form.create({ name: 'add_member_form' })(ModalAddMember)

export default ModalAddMemberForm

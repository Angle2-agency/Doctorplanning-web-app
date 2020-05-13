import React from 'react'

import DOM from './modalUpdateMember'

class ModalUpdateMember extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataConfig: [],
    }
    this.view = DOM
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

export default ModalUpdateMember

import React from 'react'
import { connect } from 'react-redux'

import DOM from './sidebar'

class Sidebar extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
    this.state = {
      notifications: 0,
    }
  }

  render() {
    return this.view(this.props)
  }
}
function mapStateToProps(state, ownProps) {
  return {
    user: state.authentication.user,
    ...ownProps,
  }
}

export default connect(mapStateToProps)(Sidebar)

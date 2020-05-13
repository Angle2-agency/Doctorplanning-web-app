import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const mapStateToProps = (state, props) => {
  return {
    loggedInAsPatient: state.authentication.loggedIn && state.authentication.user.patientId,
    loggedInAsHcp: state.authentication.loggedIn && state.authentication.user.healthcarePartyId,
    ...props,
  }
}

const PrivateRoute = ({ loggedInAsPatient, loggedInAsHcp, patient, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (loggedInAsPatient && patient) || (loggedInAsHcp && !patient) ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/relog', state: { from: props.location } }} />
      )
    }
  />
)

export default connect(mapStateToProps)(PrivateRoute)

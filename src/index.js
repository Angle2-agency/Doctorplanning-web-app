/* global document:true */

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import svg4everybody from 'svg4everybody'
import { history } from './helpers'
import PrivateRoute from './elements/PrivateRoute'

import HomePage from './pages/HomePage'
import CalendarGlobalPage from './pages/CalendarGlobalPage'
import MyPatientsPage from './pages/MyPatientsPage'
import CreatePatient from './pages/CreatePatient'
import GenerateReport from './pages/GenerateReport'
import MyTeam from './pages/MyTeam'
import CreateMember from './pages/CreateMember'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'
import Login from './pages/Login'
import Relog from './pages/Relog'
import InviteLogin from './pages/InviteLogin'
import PatientLogin from './pages/PatientLogin'
import Registration from './pages/Registration'
import PatientRegistration from './pages/PatientRegistration'
import PatientCalendar from './pages/PatientCalendar'
import PatientSettings from './pages/PatientSettings'
import PatientContacts from './pages/PatientContacts'
import RCP from './pages/RCP'
import Welcome from './pages/Welcome'
import Confidentiality from './pages/Confidentiality'
import BookletRiv from './pages/BookletRiv'
import NotFound from './pages/NotFound'

import 'antd/dist/antd.css'
import './styles/style.css'

/**
 * ## Actions
 *  The necessary actions for dispatching our bootstrap values
 */
import { setVersion } from './core/global/globalActions'

/**
 *  The version of the app but not displayed yet
 */
import pack from '../package.json'

/**
 * ### configureStore
 */
import configureStore from './core/store'

const store = configureStore({})

const VERSION = pack.version

store.dispatch(setVersion(VERSION))

// Svg Polyfill For IE
svg4everybody()
// end Svg Polyfill For IE

const scrollToTop = () => {
  const pusher = document.getElementById('app')
  if (pusher !== null) {
    pusher.scrollIntoView()
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
history.listen((location, action) => {})
ReactDOM.render(
  <Provider store={store}>
    <Router onUpdate={scrollToTop} history={history}>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/login" component={Login} />
        <Route path="/relog" component={Relog} />
        <Route path="/registration" component={Registration} />
        <Route path="/patient_login" component={PatientLogin} />
        <Route path="/invite_login" component={InviteLogin} />
        <Route path="/patient_registration" component={PatientRegistration} />
        <PrivateRoute path="/calendar" exact component={CalendarGlobalPage} />
        <PrivateRoute path="/generate-report" exact component={GenerateReport} />
        <PrivateRoute path="/my-patients/create-new" exact component={CreatePatient} />
        <PrivateRoute path="/my-patients/:id" exact component={PatientCalendar} />
        <PrivateRoute path="/my-patients" exact component={MyPatientsPage} />
        <PrivateRoute path="/my-team/create-new" exact component={CreateMember} />
        <PrivateRoute path="/my-team" exact component={MyTeam} />
        <PrivateRoute path="/settings" exact component={Settings} />
        <PrivateRoute path="/notifications" exact component={Notifications} />
        <PrivateRoute patient path="/patient_calendar" component={PatientCalendar} />
        <PrivateRoute patient path="/patient_settings" component={PatientSettings} />
        <PrivateRoute patient path="/patient_contacts" component={PatientContacts} />
        <PrivateRoute path="/rcp" component={RCP} />
        <PrivateRoute path="/welcome" component={Welcome} />
        <PrivateRoute path="/confidentiality" component={Confidentiality} />
        <PrivateRoute path="/booklet-riv" component={BookletRiv} />
        <PrivateRoute component={NotFound} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root'),
)

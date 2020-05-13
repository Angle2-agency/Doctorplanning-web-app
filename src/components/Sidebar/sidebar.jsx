import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import Icon from '../../elements/Icon'

import './sidebar.css'
export default function(props) {
  const modeDoctor = props.user && props.user.healthcarePartyId
  const menuArrDoctor = [
    { id: '000', name: 'Vue calendrier globale', link: '/calendar' },
    { id: '001', name: 'Générer un rapport', link: '/generate-report' },
    { id: '002', name: 'Mes patients', link: '/my-patients' },
    { id: '003', name: 'Mon équipe de santé', link: '/my-team' },
    { id: '004', name: 'Mes préférences', link: '/settings' },
  ]
  const menuArrPatient = [
    { id: '000', name: 'Calendier de traitement', link: '/patient_calendar' },
    { id: '001', name: 'Mes préférences', link: '/patient_settings' },
    { id: '002', name: "Contact en cas d'urgence", link: '/patient_contacts' },
    { id: '003', name: 'Livret RIV', link: '/booklet-riv' },
  ]
  const menuArr = modeDoctor ? menuArrDoctor : menuArrPatient
  const notications = modeDoctor ? (
    <div className={`sidebar__notification ${+this.state.notifications > 0 ? 'unread' : ''}`}>
      <NavLink to="/notifications" activeClassName="is-active">
        <div className="notification__bell">
          <Icon name="bell" />
        </div>
        <p className="notification__caption">Notifications</p>
        <p className="notification__message">
          Vous avez {this.state.notifications || 0} nouvelles demandes de vos patients
        </p>
      </NavLink>
    </div>
  ) : null

  return (
    <aside className="sidebar">
      <div className="sidebar__head">
        <Link to="/welcome">
          <h3 className="sidebar__title">LutaPlanning</h3>
        </Link>
      </div>
      {notications}
      <ul className="sidebar__menu">
        {menuArr.map(el => (
          <li key={el.id}>
            <NavLink to={el.link} className="menu__link" activeClassName="is-active">
              {el.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  )
}

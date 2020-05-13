import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, Dropdown, Button } from 'antd'
import Icon from '../../elements/Icon'

import './header.css'
import ModalImportKeyPair from '../ModalImportKeyPair'

export default function(props, avatarSrc) {
  const modeDoctor = props.user && props.user.healthcarePartyId
  const sidebarLinkClassName = props.type !== 'no-sidebar' ? 'btn-toggle-sidebar is-active' : 'btn-toggle-sidebar'
  const menuArrDoctor = [
    { id: '000', name: 'Tableau de bord', link: '/calendar', icon: 'table', class: sidebarLinkClassName },
    { id: '001', name: 'Accueil', link: '/welcome' },
    { id: '002', name: 'RCP', link: '/rcp' },
    { id: '003', name: 'Données de sécurité/Bon usage', link: '/confidentiality' },
  ]
  const menuArrPatient = []
  const menuArr = modeDoctor ? menuArrDoctor : menuArrPatient
  const menu = (
    <Menu>
      <Menu.Item>
        <div className="flex-center">
          <div className="profile__pic">
            <img src={avatarSrc} alt="" />
          </div>
          <div className="ml-2">
            {/*TODO: name is not observing change, it needs a refresh to reflect the updated values*/}
            <h6 className="h-6">{props.user && props.user.name}</h6>
            <div className="lightgrey">{props.user && props.user.login}</div>
          </div>
        </div>
      </Menu.Item>
      <Menu.Item onClick={this.handleLogOut}>
        <Button className="btn empty btn-into-dropdown">
          <Icon name="logout" />
          <span>Se déconnecter</span>
        </Button>
      </Menu.Item>
    </Menu>
  )
  return (
    <div className="header">
      <div className="container-fluid-docked-left">
        <div className="header__inner">
          <ul className="header__menu">
            {menuArr.map(el => (
              <li key={el.id} className={el.class}>
                <NavLink to={el.link} className="menu__link" activeClassName="is-active">
                  {el.icon ? <Icon name={el.icon} /> : null}
                  <span>{el.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="header__profile">
            <Link to="/user" className="profile__pic">
              <img src={avatarSrc} alt="Atoms" />
            </Link>
            <Dropdown overlay={menu}>
              <div className="profile__name">
                <span>{props.user && props.user.name}</span>
                <Icon name="arrow-down" />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
      {this.state.importKeyPairVisible || this.state.forceImportKeyPairVisible ? (
        <ModalImportKeyPair
          closable={!this.state.forceImportKeyPairVisible}
          visible={this.state.importKeyPairVisible || this.state.forceImportKeyPairVisible}
          cancel={this.handleImportKeyPairCancel.bind(this)}
          ok={this.handleImportKeyPairImportSucceeded.bind(this)}
          ko={this.handleImportKeyPairImportFailed.bind(this)}
        />
      ) : null}
    </div>
  )
}

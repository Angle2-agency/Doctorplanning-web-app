import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import Helmet from 'react-helmet'

import './home-page.css'
import atomsBg from '../../assets/images/atoms-bg.png'

export default function() {
  return (
    <div className="page-wrap page-home">
      <img src={atomsBg} className="home__bg" alt="Atoms" />
      <Helmet title="Home" />
      <div className="container">
        <div className="home__inner">
          <h1 className="h-1">Bienvenue sur LutaPlanning</h1>
          <p className="home__subtitle">Cliquez sur le bouton correspondant pour accéder à votre compte</p>
          <nav className="home__nav">
            <Link to="/login">
              <Button className="green md">Accès médecins</Button>
            </Link>
            <Link to="/patient_login">
              <Button className="green md">Accès patients</Button>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}

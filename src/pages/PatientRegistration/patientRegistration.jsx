import React from 'react'
import { Link } from 'react-router-dom'
import RegForm from '../../components/forms/RegForm'
import Icon from '../../elements/Icon'
import logoSrc from '../../assets/images/atoms-bg.png'

export default function() {
  return (
    <div className="reg-wrap">
      <Link to="/" className="reg__backlink">
        <Icon name="arrow-left" />
      </Link>
      <div className="reg-container">
        <div className="reg__formwrap">
          <h2 className="h-3 reg__title">
            Inscription sur <span className="c_green">LutaPlanning</span>
          </h2>
          <div className="reg__body">
            <RegForm />
          </div>
          <div className="reg__footer">
            <p className="lightgrey text-center mt-3">
              En vous enregistrant vous acceptez nos conditions <br /> générales d&apos;utilisation
            </p>
          </div>
        </div>
      </div>

      <div className="reg-aside">
        <img className="reg__illustr" src={logoSrc} alt="Luta" />
      </div>
    </div>
  )
}

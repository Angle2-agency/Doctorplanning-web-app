import React from 'react'
import { Link } from 'react-router-dom'
import InviteLoginForm from '../../components/forms/InviteLoginForm'
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
          <div className="mt-5 mb-5">
            <h1 className="h-3 text-center">
              S&apos;identifier sur <span className="c_green">LutaPlanning</span>
            </h1>
          </div>
          <div className="reg__body mt-5">
            <InviteLoginForm />
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

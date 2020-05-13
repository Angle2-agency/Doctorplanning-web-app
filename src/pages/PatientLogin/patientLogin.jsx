import React from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../../components/forms/LoginForm'
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
          <div className="mt-5 mb-1">
            <h1 className="h-2 text-center">LutaPlanning</h1>
          </div>
          <div className="reg__body">
            <LoginForm />
            <div className="mt-1">
              <Link to="#" className="mt-2 d-flex justify-content-center underlined">
                Mot de passe oublié
              </Link>
              <Link to="/patient_registration" className="mt-1 d-flex justify-content-center underlined">
                S&apos;inscricre sur Luta Planning
              </Link>
            </div>
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

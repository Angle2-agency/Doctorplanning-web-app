import React from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../../components/forms/LoginForm'
import Icon from '../../elements/Icon'
import logoSrc from '../../assets/images/atoms-bg.png'
import doCheckMan from '../../assets/images/docheck-man.png'
import doCheckBanner from '../../assets/images/docheck-banner.jpg'

export default function() {
  return (
    <div className="reg-wrap">
      <Link to="/" className="reg__backlink">
        <Icon name="arrow-left" />
      </Link>
      <div className="reg-container">
        <div className="reg__formwrap">
          <div className="docheck-banner">
            <img src={doCheckBanner} alt="Docheck" />
          </div>
          <div className="reg__body">
            <LoginForm />
            <div className="mt-1">
              <Link to="#" className="mt-2 d-flex justify-content-center underlined">
                Mot de passe oublié
              </Link>
              <Link to="/registration" className="mt-1 d-flex justify-content-center underlined">
                S&apos;inscricre sur Luta Planning
              </Link>
            </div>
          </div>
          <div className="reg__footer">
            <div className="flex-center justify-content-center mt-5">
              <p>Se connecter avec</p>
              <Link to="#" className="ml-1">
                <img src={doCheckMan} className="docheck-man" alt="Se connecter avec" />
              </Link>
            </div>
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

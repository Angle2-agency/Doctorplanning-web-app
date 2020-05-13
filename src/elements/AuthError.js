import React from 'react'
import cautionIcon from '../assets/images/caution.svg'

const AuthError = () => (
  <h3 className="reg__error">
    <img src={cautionIcon} alt="Caution" />
    <span>S&apos;il vous plaît entrer des informations d&apos;identification valides</span>
  </h3>
)

export default AuthError

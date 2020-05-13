import React from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../elements/Icon'

import './content-head.css'

export default function() {
  const { title, backlink, children, right } = this.props
  return (
    <div className="content-head">
      <div className="container-fluid">
        <div className="content-head__inner">
          <div className="content-head__left">
            {backlink ? (
              <Link to={backlink}>
                <Icon name="arrow-left" />
              </Link>
            ) : null}
            <span className="h-3">{title}</span>
          </div>
          {children}
          <div className="content-head__actions">{right}</div>
        </div>
      </div>
    </div>
  )
}

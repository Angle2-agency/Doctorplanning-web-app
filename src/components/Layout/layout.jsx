import React from 'react'
import Helmet from 'react-helmet'

import Header from '../Header'
import Sidebar from '../Sidebar'

export default function() {
  const { children, title, type } = this.props
  return (
    <div className={`page-wrap ${type}`}>
      <Helmet title={title} />
      <Header type={type} />
      <div className="d-flex justify-content-between">
        {type !== 'no-sidebar' ? <Sidebar /> : false}
        <main className="main">{children}</main>
      </div>
    </div>
  )
}

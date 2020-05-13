import React from 'react'
import Helmet from 'react-helmet'

const NotFound = () => (
  <div>
    <Helmet title="Not found" />
    <div className="content">
      <div className="">Page not found</div>
      <p>Page your are looking for does not exists.</p>
    </div>
  </div>
)

export default NotFound

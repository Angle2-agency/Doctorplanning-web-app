import React from 'react'
import { Spin } from 'antd'

export default function() {
  return (
    <div className="reg-wrap">
      <div className="spinner centered-in-container">
        <Spin size="large" />
      </div>
    </div>
  )
}

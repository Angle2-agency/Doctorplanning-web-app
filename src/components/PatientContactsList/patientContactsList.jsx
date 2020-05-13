import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Table } from 'antd'

const PatientContactsList = function(props) {
  return (
    <div className="patients-list">
      <div className="container-fluid">
        <div className="patients-list__inner">
          <Table
            className="table-styled"
            columns={props.columns}
            dataSource={this.state.data}
            pagination={false}
            loading={this.state.loading}
          />
          <div className="header__profile">
            <Link to="/user" className="profile__pic" />
          </div>
        </div>
      </div>
    </div>
  )
}
PatientContactsList.propTypes = {
  columns: PropTypes.object.isRequired,
}

export default PatientContactsList

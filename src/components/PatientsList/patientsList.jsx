import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Table, Input } from 'antd'
import SelectStatus from '../SelectStatus'

import './patients-list.css'

const Search = Input.Search

const PatientsList = function(props) {
  return (
    <div className="patients-list">
      <div className="patients-list__actions">
        <div className="container-fluid">
          <div className="flex-center justify-content-between">
            <div>
              <Search placeholder="Recherche" size="large" onChange={this.handleTableSearch} style={{ width: 380 }} />
            </div>
            <SelectStatus allowAllOption handleSelectStatus={this.handleSelectStatus} />
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="patients-list__inner">
          <Table
            className="table-styled"
            columns={props.columns}
            dataSource={this.state.data}
            pagination={false}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
          <div className="header__profile">
            <Link to="/user" className="profile__pic" />
          </div>
        </div>
      </div>
    </div>
  )
}
PatientsList.propTypes = {
  columns: PropTypes.object.isRequired,
}

export default PatientsList

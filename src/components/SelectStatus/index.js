import React from 'react'
import { Select } from 'antd'

const { Option } = Select

const SelectStatus = ({ handleSelectStatus, allowAllOption, hideLabel, value, disabled }) => (
  <div>
    {!hideLabel && <span className="label">Statut</span>}
    <Select
      labelInValue
      defaultValue={{ key: allowAllOption ? 'all' : 'waiting' }}
      value={{ key: value || (allowAllOption ? 'all' : 'waiting') }}
      size="large"
      className="select-opt-status"
      // style={{ width: 136 }}
      disabled={disabled}
      onChange={handleSelectStatus}
    >
      {allowAllOption && (
        <Option value="all" className="opt-status all">
          Tous
        </Option>
      )}
      <Option value="confirmed" className="opt-status confirmed">
        Confirmé
      </Option>
      <Option value="waiting" className="opt-status waiting">
        En attente
      </Option>
      <Option value="critical" className="opt-status critical">
        Critique
      </Option>
      <Option value="pipeline" className="opt-status pipeline">
        Pipeline
      </Option>
    </Select>
  </div>
)
export default SelectStatus

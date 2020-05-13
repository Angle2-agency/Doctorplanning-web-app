import React from 'react'
import { Select } from 'antd'

const { Option } = Select

const SelectInjection = ({ handleSelectInjection, hideLabel, showAddAll, disabled }) => (
  <div>
    {!hideLabel && <span className="label">Dosis</span>}
    <Select
      labelInValue
      defaultValue={{ key: 'ij1' }}
      size="large"
      className="select-opt-dosis"
      disabled={disabled}
      onChange={handleSelectInjection}
    >
      {showAddAll && (
        <Option value="ij1234" className="opt-dosis">
          Ij.1+2+3+4
        </Option>
      )}
      <Option value="ij1" className="opt-dosis">
        Inj. 1
      </Option>
      <Option value="ij2" className="opt-dosis">
        Inj. 2
      </Option>
      <Option value="ij3" className="opt-dosis">
        Inj. 3
      </Option>
      <Option value="ij4" className="opt-dosis">
        Inj. 4
      </Option>
    </Select>
  </div>
)
export default SelectInjection

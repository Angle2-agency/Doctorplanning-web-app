import React from 'react'
import { Input, DatePicker, Select, Radio, Checkbox, TimePicker } from 'antd'
import Icon from './Icon'

const Option = Select.Option

const FormItem = React.forwardRef((props, ref) => {
  switch (props.type) {
    case 'datepicker':
      return <DatePicker size="large" {...props} ref={ref} suffixIcon={<Icon name="calendar" />} />
    case 'timepicker':
      return <TimePicker size="large" {...props} ref={ref} />
    case 'select':
      return (
        <Select {...props} ref={ref} size="large" suffixIcon={<Icon name="arrow-down" />}>
          {props.options.map(option => (
            <Option key={option}>{option}</Option>
          ))}
        </Select>
      )
    case 'radiogroup':
      return (
        <Radio.Group {...props} ref={ref} size="large">
          {props.options.map(option => (
            <Radio key={option}>{option}</Radio>
          ))}
        </Radio.Group>
      )
    case 'checkboxgroup':
      return (
        <Checkbox.Group {...props} ref={ref} size="large">
          {props.options.map(option => (
            <Checkbox key={option}>{option}</Checkbox>
          ))}
        </Checkbox.Group>
      )
    case 'checkbox':
      return (
        <Checkbox {...props} ref={ref} size="large">
          {props.label}
        </Checkbox>
      )
    default:
      return <Input size="large" {...props} ref={ref} />
  }
})
export default FormItem

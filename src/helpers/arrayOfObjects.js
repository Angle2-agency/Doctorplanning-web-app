import _ from 'lodash'

export const updateData = function(arrName, id, fieldName, fieldValue) {
  const data = this.state[arrName]
  const idx = _.findIndex(data, ['key', id])
  const updatedDataItem = data[idx]
  updatedDataItem[fieldName] = fieldValue
  const updatedData = [...data.slice(0, idx), updatedDataItem, ...data.slice(idx + 1)]
  this.setState({
    [arrName]: updatedData,
  })
}
export const removeDataItem = function(arrName, id) {
  const data = this.state[arrName]
  const idx = _.findIndex(data, ['key', id])
  const updatedData = [...data.slice(0, idx), ...data.slice(idx + 1)]
  this.setState({
    [arrName]: updatedData,
  })
}

export const handleConfirmBlur = function(e) {
  const value = e.target.value
  this.setState({ confirmDirty: this.state.confirmDirty || !!value })
}

export const compareToFirstPassword = function(rule, value, callback) {
  const form = this.props.form
  if (value && value !== form.getFieldValue('password')) {
    callback('Two passwords that you enter is inconsistent!')
  } else {
    callback()
  }
}

export const validateToNextPassword = function(rule, value, callback) {
  const form = this.props.form
  if (value && this.state.confirmDirty) {
    form.validateFields(['confirm'], { force: true })
  }
  callback()
}

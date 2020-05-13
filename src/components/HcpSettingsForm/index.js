import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Form } from 'antd'
import { compareToFirstPassword, handleConfirmBlur, validateToNextPassword } from '../../helpers'
import { userActions } from '../../core/user/userActions'

import DOM from './hcpSettingsForm'

class HcpSettings extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM

    this.state = {
      data: [],
      loading: false,
      dataConfig: [],
      fileList: [],
    }
  }

  async componentDidMount() {
    this._mounted = true
    this.setState({ loading: true })
    const currentHealthcareParty = await this.props.iccapi.hcpartyicc.getCurrentHealthcareParty()
    const dataConfig = this.buildDataConfig(currentHealthcareParty)
    if (this._mounted) {
      this.setState({
        dataConfig,
        data: currentHealthcareParty,
        loading: false,
        fileList: currentHealthcareParty.picture
          ? [
              {
                url: `data:image/${currentHealthcareParty.picture.startsWith('/9j/') ? 'jpeg' : 'png'};base64,${
                  currentHealthcareParty.picture
                }`,
                name: 'picture.png',
                status: 'done',
                uid: '1',
              },
            ]
          : [],
      })
    }
  }

  componentWillUnmount() {
    this._mounted = false
  }

  buildDataConfig(healthcareParty) {
    const firstName = (healthcareParty && healthcareParty.firstName) || ''
    const lastName = (healthcareParty && healthcareParty.lastName) || ''
    const phone =
      (healthcareParty &&
        healthcareParty.addresses &&
        healthcareParty.addresses[0] &&
        healthcareParty.addresses[0].telecoms &&
        healthcareParty.addresses[0].telecoms.find(t => t.telecomType === 'phone') &&
        healthcareParty.addresses[0].telecoms.find(t => t.telecomType === 'phone').telecomNumber) ||
      ''
    const email =
      (healthcareParty &&
        healthcareParty.addresses &&
        healthcareParty.addresses[0] &&
        healthcareParty.addresses[0].telecoms &&
        healthcareParty.addresses[0].telecoms.find(t => t.telecomType === 'email') &&
        healthcareParty.addresses[0].telecoms.find(t => t.telecomType === 'email').telecomNumber) ||
      ''
    return [
      {
        key: '001',
        heading: 'Informations générales',
        rows: [
          {
            label: 'Prénom',
            value: firstName,
            fieldDecorator: 'firstName',
            rules: [{ required: true, message: 'Svp, veuillez renseigner votre prénom!' }],
          },
          {
            label: 'Nom',
            value: lastName,
            fieldDecorator: 'lastName',
            rules: [{ required: true, message: 'Svp, veuillez renseigner votre nom!' }],
          },
        ],
      },
      {
        key: '002',
        heading: 'Information sur le compte',
        rows: [
          {
            label: 'Téléphone',
            // TODO: choose telecomType: phone | mobile ?
            value: phone,
            fieldDecorator: 'phone',
            rules: [{ required: true, message: 'Svp, veuillez renseigner votre numéro de téléphone!' }],
          },
          {
            label: 'Adresse mail',
            value: email,
            fieldDecorator: 'email',
            rules: [{ required: true, type: 'email', message: 'Svp, veuillez renseigner votre mail!' }],
          },
        ],
      },
      {
        key: '003',
        heading: 'Mot de passe',
        rows: [
          {
            label: 'Mot de passe actuel',
            value: '**********',
            fieldDecorator: 'currentPassword',
            fieldProps: {
              type: 'password',
            },
            rules: [
              {
                required: true,
                validator: (rule, value, callback) =>
                  !value
                    ? callback('Veuillez remplir votre mot de passe actuel')
                    : this.state.wrongCurrentPassword
                    ? callback('Votre mot de passe actuel est erroné')
                    : callback(),
              },
            ],
          },
          {
            label: 'Nouveu mot de passe',
            fieldDecorator: 'password',
            fieldProps: {
              type: 'password',
            },
            rules: [
              { required: true, message: 'Svp, veuillez renseigner votre nouveau mot de passe!' },
              { validator: validateToNextPassword.bind(this) },
            ],
            className: 'hide-new-confirm-parol',
          },
          {
            label: 'Confirmer le mot de passe',
            fieldDecorator: 'confirm',
            hasFeedback: 'hasFeedback',
            fieldProps: {
              type: 'password',
              onBlur: handleConfirmBlur.bind(this),
            },
            rules: [
              { required: true, message: 'Svp, veuillez confirmer votre nouveau mot de passe!' },
              { validator: compareToFirstPassword.bind(this) },
            ],
            className: 'hide-new-confirm-parol',
          },
        ],
      },
    ]
  }

  handleSubmit = id => {
    const { actions } = this.props
    const key = 'editMode' + id
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ loading: true })

        const currentHealthcareParty = await this.props.iccapi.hcpartyicc.getCurrentHealthcareParty()

        const workAddress = p => {
          let a = p.addresses.find(a => !a.addressType || a.addressType === 'work')
          if (a) {
            return a
          }
          p.addresses.push((a = { addressType: 'work', telecoms: [] }))
          return a
        }

        const telecom = (a, types) => {
          let t = a.telecoms.find(t => t.telecomType && types.includes(t.telecomType))
          if (t) {
            return t
          }
          a.telecoms.push((t = { telecomType: types[0] }))
          return t
        }

        const formKeyActions = {
          firstName: hcp => [true, Object.assign(hcp, { firstName: values['firstName'] })],
          lastName: hcp => [true, Object.assign(hcp, { lastName: values['lastName'] })],
          phone: hcp => {
            telecom(workAddress(hcp), ['phone', 'mobile']).telecomNumber = values['phone']
            return [true, hcp]
          },
          email: hcp => {
            telecom(workAddress(hcp), ['email']).telecomNumber = values['email']
            return [true, hcp]
          },
        }

        const [changed, modifiedHcp] = Object.keys(values).reduce(
          ([previousStatus, hcp], formKey) => {
            const [status, modifiedHcp] = (formKeyActions[formKey] && formKeyActions[formKey](hcp)) || [false, hcp]
            return [previousStatus || status, modifiedHcp]
          },
          [false, Object.assign({}, currentHealthcareParty)],
        )

        let updatedDataConfig = this.state.dataConfig

        if (changed) {
          const healthcarePartyToUpdate = Object.assign(currentHealthcareParty, modifiedHcp)
          const newHealthcareParty = await this.props.iccapi.hcpartyicc.modifyHealthcareParty(healthcarePartyToUpdate)
          actions.hcpModified(newHealthcareParty)
          const expectedName = [
            newHealthcareParty.civility || 'Dr.',
            newHealthcareParty.firstName,
            newHealthcareParty.lastName,
          ]
            .filter(x => x)
            .join(' ')
          const currentUser = await this.props.iccapi.usericc.getCurrentUser()
          if (currentUser.name !== expectedName) {
            const modifiedUser = Object.assign(currentUser, { name: expectedName })
            actions.userModified(await this.props.iccapi.usericc.modifyUser(modifiedUser))
          }
          updatedDataConfig = this.buildDataConfig(newHealthcareParty)
        }

        if (Object.keys(values).includes('password')) {
          //Alternate behaviour for password change because we re-authenticate if it succeeds
          if ('currentPassword' in values && 'confirm' in values && values['password'] === values['confirm']) {
            const currentPasswordMatch = await this.props.iccapi.usericc.checkPassword(values['currentPassword'])

            const newPassword = values['password']
            if (currentPasswordMatch) {
              this.setState({ wrongCurrentPassword: false })
              const currentUser = await this.props.iccapi.usericc.getCurrentUser()
              const modifiedUser = Object.assign(currentUser, { passwordHash: newPassword })
              await this.props.iccapi.usericc.modifyUser(modifiedUser)
              const destination = (((this.props.location || {}).state || {}).from || {}).pathname
              actions.attemptLogin(modifiedUser.login, newPassword, destination)
            } else {
              this.setState({ wrongCurrentPassword: true })
              this.props.form.validateFields(['currentPassword'], { force: true })

              this.setState({
                dataConfig: updatedDataConfig,
                loading: false,
              })
            }
          }
        } else {
          this.setState({
            [key]: false,
            dataConfig: updatedDataConfig,
            loading: false,
          })
        }
      }
    })
  }

  handleEditMode = id => {
    const key = 'editMode' + id
    this.setState({
      [key]: !this.state[key],
    })
  }

  handlePictureRemove = async e => {
    const { actions } = this.props
    try {
      const currentHealthcareParty = await this.props.iccapi.hcpartyicc.getCurrentHealthcareParty()
      const healthcarePartyToUpdate = Object.assign(currentHealthcareParty, { picture: null })
      actions.hcpModified(await this.props.iccapi.hcpartyicc.modifyHealthcareParty(healthcarePartyToUpdate))
    } catch (e) {
      console.error('Could not remove picture.')
      return false
    }
  }

  handlePictureChange = async ({ fileList }) => {
    this.setState({ fileList })
  }

  customPictureUploadRequest = async params => {
    const { actions } = this.props
    const { onSuccess, onError, file, onProgress } = params
    this.setState({
      uploadedImage: '',
    })
    this.loadImageBase64(file)
    try {
      onProgress({ percent: 5 })
      await new Promise(resolve => this.waitUntilImageLoaded(resolve))
      onProgress({ percent: 50 })
      const currentHealthcareParty = await this.props.iccapi.hcpartyicc.getCurrentHealthcareParty()
      onProgress({ percent: 70 })
      const healthcarePartyToUpdate = Object.assign(currentHealthcareParty, { picture: this.state.uploadedImage })
      actions.hcpModified(await this.props.iccapi.hcpartyicc.modifyHealthcareParty(healthcarePartyToUpdate))
      onProgress({ percent: 95 })
      onSuccess()
    } catch (e) {
      onError(e)
    }
  }

  loadImageBase64(file) {
    const reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = () => {
      this.setState({
        uploadedImage: btoa(reader.result),
      })
    }
    reader.onerror = e => {
      console.error(e)
      this.setState({
        uploadedImage: '',
      })
      throw new Error('Error converting file to Base64')
    }
  }

  waitUntilImageLoaded = resolve => {
    setTimeout(() => {
      this.state.uploadedImage ? resolve() : this.waitUntilImageLoaded(resolve)
    }, 50)
  }

  // handleKeyImport = () => {
  //   this.setState({ importKeyPairVisible: true })
  // }

  render() {
    return this.view(this.props)
  }
}

const HcpSettingsForm = Form.create({ name: 'hcp_settings_form' })(HcpSettings)

function mapStateToProps(state, ownProps) {
  return {
    iccapi: state.iccapi,
    ...ownProps,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...userActions,
      },
      dispatch,
    ),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HcpSettingsForm)

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Form } from 'antd'

import DOM from './patientSettingsForm'
import { compareToFirstPassword, handleConfirmBlur, validateToNextPassword } from '../../helpers'

class PatientSettings extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
    this.state = {
      dataConfig: [],
    }
  }

  async componentDidMount() {
    this.setState({ loading: true })
    const currentPatient = await this.props.iccapi.patienticc.getPatientWithUser(
      this.props.user,
      this.props.user.patientId,
    )
    const dataConfig = this.buildDataConfig(currentPatient)

    this.setState({
      dataConfig,
      loading: false,
    })
  }

  handleSubmit = id => {
    const key = 'editMode' + id
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ loading: true })

        const addOrUpdateAddressSlice = (patient, slice, value) => {
          if (!patient.addresses || !patient.addresses[0]) {
            patient.addresses = []
            patient.addresses[0] = {}
          }
          patient.addresses[0][slice] = value
        }

        const addOrUpdateTelecom = (patient, telecomType, telecomNumber) => {
          if (!patient.addresses || !patient.addresses[0]) {
            patient.addresses = []
            patient.addresses[0] = {}
          }
          if (!patient.addresses[0].telecoms) {
            patient.addresses[0].telecoms = []
          }

          if (patient.addresses[0].telecoms.find(t => t.telecomType === telecomType)) {
            patient.addresses[0].telecoms.telecomNumber = telecomNumber
          } else {
            patient.addresses[0].telecoms.push({ telecomNumber: telecomNumber, telecomType: telecomType })
          }
        }

        const patientPropsToModify = {}
        Object.keys(values).forEach(async formKey => {
          const handleTelecom = () => {
            addOrUpdateTelecom(patientPropsToModify, formKey, values[formKey])
          }
          const handleAddress = () => {
            addOrUpdateAddressSlice(patientPropsToModify, formKey, values[formKey])
          }
          const formKeys = {
            firstName: () => {
              Object.assign(patientPropsToModify, { firstName: values[formKey] })
            },
            lastName: () => {
              Object.assign(patientPropsToModify, { lastName: values[formKey] })
            },
            dateOfBirth: () => {
              Object.assign(patientPropsToModify, { dateOfBirth: values[formKey] })
            },
            street: handleAddress,
            houseNumber: handleAddress,
            postboxNumber: handleAddress,
            postalCode: handleAddress,
            city: handleAddress,
            country: handleAddress,
            phone: handleTelecom,
            email: handleTelecom,
            password: async () => {
              if ('currentPassword' in values && 'confirm' in values && values[formKey] === values['confirm']) {
                // TODO: checkPassword error 500 in backend
                const currentPasswordMatch = true // await this.props.iccapi.usericc.checkPassword(values['currentPassword'])
                if (currentPasswordMatch) {
                  const currentUser = await this.props.iccapi.usericc.getCurrentUser()
                  const modifiedUser = Object.assign(currentUser, { passwordHash: values[formKey] })
                  await this.props.iccapi.usericc.modifyUser(modifiedUser)
                }
              }
            },
          }
          return formKeys[formKey] && formKeys[formKey]()
        })
        const currentPatient = await this.props.iccapi.patienticc.getPatientWithUser(
          this.props.user,
          this.props.user.patientId,
        )
        const patientToUpdate = Object.assign(currentPatient, patientPropsToModify)
        const newPatient = await this.props.iccapi.patienticc.modifyPatientWithUser(this.props.user, patientToUpdate)

        const expectedName = newPatient.firstName + ' ' + newPatient.lastName
        const currentUser = await this.props.iccapi.usericc.getCurrentUser()
        if (currentUser.name !== expectedName) {
          const modifiedUser = Object.assign(currentUser, { name: expectedName })
          await this.props.iccapi.usericc.modifyUser(modifiedUser)
        }

        const updatedDataConfig = this.buildDataConfig(newPatient)
        this.setState({
          [key]: false,
          dataConfig: updatedDataConfig,
          loading: false,
        })
      }
    })
  }
  handleEditMode = id => {
    const key = 'editMode' + id
    this.setState({
      [key]: !this.state[key],
    })
  }

  buildDataConfig(patient) {
    const firstName = (patient && patient.firstName) || ''
    const lastName = (patient && patient.lastName) || ''
    const dateOfBirth = (patient && patient.dateOfBirth) || undefined

    const street = (patient && patient.addresses && patient.addresses[0] && patient.addresses[0].street) || ''
    const houseNumber = (patient && patient.addresses && patient.addresses[0] && patient.addresses[0].houseNumber) || ''
    const postboxNumber =
      (patient && patient.addresses && patient.addresses[0] && patient.addresses[0].postboxNumber) || ''
    const postalCode = (patient && patient.addresses && patient.addresses[0] && patient.addresses[0].postalCode) || ''
    const city = (patient && patient.addresses && patient.addresses[0] && patient.addresses[0].city) || ''
    const country = (patient && patient.addresses && patient.addresses[0] && patient.addresses[0].country) || ''

    const phone =
      (patient &&
        patient.addresses &&
        patient.addresses[0] &&
        patient.addresses[0].telecoms &&
        patient.addresses[0].telecoms.find(t => t.telecomType === 'phone') &&
        patient.addresses[0].telecoms.find(t => t.telecomType === 'phone').telecomNumber) ||
      ''
    const email =
      (patient &&
        patient.addresses &&
        patient.addresses[0] &&
        patient.addresses[0].telecoms &&
        patient.addresses[0].telecoms.find(t => t.telecomType === 'email') &&
        patient.addresses[0].telecoms.find(t => t.telecomType === 'email').telecomNumber) ||
      ''

    const dataConfig = [
      {
        key: '001',
        heading: 'Informations générales',
        rows: [
          {
            label: 'Nom',
            value: lastName,
            fieldDecorator: 'lastName',
            rules: [{ required: true, message: 'Svp, veuillez renseigner votre nom!' }],
          },
          {
            label: 'Prénom',
            value: firstName,
            fieldDecorator: 'firstName',
            rules: [{ required: true, message: 'Svp, veuillez renseigner votre prénom!' }],
          },
          {
            label: 'Date de naissance',
            // TODO: put a date picker here and value must be a timestamp
            value: dateOfBirth,
            fieldDecorator: 'dateOfBirth',
            rules: [{ required: true, message: 'Svp, veuillez renseigner votre date de naissance!' }],
          },
        ],
        formActiveElements: null,
      },
      {
        key: '002',
        heading: 'Coordonnées',
        rows: [
          {
            label: 'Rue',
            value: street,
            fieldDecorator: 'street',
            rules: [{ required: true, message: 'Svp, veuillez renseigner votre date de Rue!' }],
          },
          {
            label: 'Numéro',
            value: houseNumber,
            fieldDecorator: 'houseNumber',
            rules: [{ required: true, message: 'Svp, veuillez renseigner votre date de Numéro!' }],
          },
          {
            label: 'Boîte',
            value: postboxNumber,
            fieldDecorator: 'postboxNumber',
            rules: [{ required: false, message: 'Svp, veuillez renseigner votre date de Boîte!' }],
          },
          {
            label: 'Code postal',
            value: postalCode,
            fieldDecorator: 'postalCode',
            rules: [{ required: true, message: 'Svp, veuillez renseigner votre date de Code postal!' }],
          },
          {
            label: 'Ville',
            value: city,
            fieldDecorator: 'city',
            rules: [{ required: true, message: 'Svp, veuillez renseigner votre date de Ville!' }],
          },
          {
            label: 'Pays',
            value: country,
            fieldDecorator: 'country',
            rules: [{ required: true, message: 'Svp, veuillez renseigner votre date de Pays!' }],
          },
          {
            label: 'Téléphone',
            value: phone,
            fieldDecorator: 'phone',
            rules: [{ required: true, message: 'Svp, veuillez renseigner votre date de Téléphone!' }],
          },
          {
            label: 'Adresse mail',
            value: email,
            fieldDecorator: 'email',
            rules: [{ required: true, message: 'Svp, veuillez renseigner votre date de Adresse mail!' }],
          },
        ],
        formActiveElements: null,
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
            rules: [{ required: true, message: 'Svp, veuillez renseigner votre mot de passe actuel!' }],
          },
          {
            label: 'Nouveu mot de passe',
            value: '*************',
            fieldDecorator: 'password',
            fieldProps: {
              type: 'password',
            },
            rules: [
              { required: true, message: 'Svp, veuillez renseigner votre nouveau mot de passe!' },
              { validator: validateToNextPassword.bind(this) },
            ],
          },
          {
            label: 'Confirmer le mot de passe',
            value: '*************',
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
          },
        ],
      },
    ]
    return dataConfig
  }

  render() {
    return this.view(this.props)
  }
}

const PatientSettingsForm = Form.create({ name: 'patient_settings_form' })(PatientSettings)

function mapStateToProps(state, ownProps) {
  return {
    iccapi: state.iccapi,
    user: state.authentication.user,
    ...ownProps,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientSettingsForm)

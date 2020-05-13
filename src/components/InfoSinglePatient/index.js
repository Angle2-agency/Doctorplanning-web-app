import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Form } from 'antd'
import _ from 'lodash'
import { removeDataItem } from '../../helpers'

import DOM from './InfoSinglePatient'

class InfoSinglePatient extends React.Component {
  getMdlAddMemberData(options) {
    return [
      {
        key: '001',
        rows: [
          {
            fieldDecorator: 'membersList',
            className: 'radio-list',
            fieldProps: {
              type: 'radiogroup',
              options: options,
            },
            rules: [
              {
                required: true,
                message: "Veuillez choisir un nouveau membre de l'équipe de soins dans la liste.",
              },
            ],
          },
        ],
      },
    ]
  }

  constructor(props) {
    super(props)
    this.view = DOM
    this.state = {
      dataConfig: [],
      visible: false,
      patientName: 'Michele Morele',
      membersData: [],
      mdlAddMemberVisible: false,
      mdlAddMemberData: this.getMdlAddMemberData([]),
      mdlUpdateMemberVisible: false,
      mdlUpdateMemberActionInfo: null,
    }
    this.removeDataItem = removeDataItem.bind(this)
  }

  componentDidMount() {
    this._mounted = true

    this.props.iccapi.hcpartyicc.listHealthcareParties().then(
      hcps =>
        this._mounted &&
        this.setState({
          mdlAddMemberData: this.getMdlAddMemberData(
            hcps
              ? hcps.rows.map(h => ({
                  value: h.id,
                  label: [h.civility || 'Dr.', h.firstName, h.lastName].filter(x => x).join(' '),
                }))
              : [],
          ),
        }),
    )
    this.buildDataConfig(this.props.patient)
  }

  componentWillUnmount() {
    this._mounted = false
  }

  buildDataConfig(p) {
    p.patientHealthCareParties && p.patientHealthCareParties.length
      ? this.props.iccapi.hcpartyicc
          .getHealthcareParties(p.patientHealthCareParties.map(x => x.healthcarePartyId).join(','))
          .then(
            hcps =>
              this._mounted &&
              this.setState({
                membersData: p.patientHealthCareParties
                  .map(phcp => {
                    const a = p.addresses.find(a => !a.addressType || a.addressType === 'work') || { telecoms: [] }

                    const phoneTelecom = a ? a.telecoms.find(t => t.telecomType === 'phone') || {} : {}
                    const emailTelecom = a ? a.telecoms.find(t => t.telecomType === 'email') || {} : {}

                    const hcp = hcps.find(h => h.id === phcp.healthcarePartyId)
                    return (
                      hcp && {
                        key: hcp.id,
                        name: [hcp.civility || 'Dr.', hcp.firstName, hcp.lastName].filter(x => x).join(' '),
                        email: emailTelecom || '',
                        phone: phoneTelecom || '',
                        clinic: hcp.companyName || '',
                        rights: phcp.type === 'other' ? 'en lecture seule' : 'de modification',
                      }
                    )
                  })
                  .filter(x => x),
              }),
          )
      : this.setState({ membersData: [] })

    const a = p.addresses.find(a => !a.addressType || a.addressType === 'home') || { telecoms: [] }

    const phoneTelecom = a
      ? a.telecoms.find(t => t.telecomType === 'phone') || a.telecoms.find(t => t.telecomType === 'mobile') || {}
      : {}
    const emailTelecom = a ? a.telecoms.find(t => t.telecomType === 'email') || {} : {}

    const dataConfig = [
      {
        key: '001',
        rows: [
          {
            label: 'Nom',
            value: p.lastName,
            fieldDecorator: 'lastName',
            rules: [{ required: true, message: 'Please input your Name!' }],
          },
          {
            label: 'Prénom',
            value: p.firstName,
            fieldDecorator: 'firstName',
            rules: [{ required: true, message: 'Please input your Surname!' }],
          },
          {
            label: 'Date de naissance',
            value: '' + +this.props.iccapi.moment(p.dateOfBirth),
            fieldDecorator: 'dateOfBirth',
            fieldProps: {
              type: 'datepicker',
              format: 'DD/MM/YYYY',
              style: { width: '100%' },
              allowClear: false,
            },
            rules: [{ required: true, message: 'Please type the Date of birth!' }],
          },
          {
            label: 'Adresse du domicile',
            value: a.street,
            fieldDecorator: 'street',
            rules: [{ required: true, message: 'Please input your Surname!' }],
          },
          {
            label: 'Code postal du domicile',
            value: a.postalCode,
            fieldDecorator: 'postalCode',
            rules: [{ required: true, message: 'Please input your Surname!' }],
          },
          {
            label: 'Ville du domicile',
            value: a.city,
            fieldDecorator: 'city',
            rules: [{ required: true, message: 'Please input your Surname!' }],
          },
          {
            label: 'Téléphone',
            value: phoneTelecom.telecomNumber,
            fieldDecorator: 'phone',
            rules: [{ required: true, message: 'Please input your phone!' }],
          },
          {
            label: 'Adresse électronique',
            value: emailTelecom.telecomNumber,
            fieldDecorator: 'email',
            fieldProps: {
              type: 'email',
            },
            rules: [{ required: true, type: 'email', message: 'Please input your email!' }],
          },
        ],
      },
    ]
    this.setState({
      dataConfig,
    })
  }

  saveModifiedPatientAndNotify = async p => {
    const modifiedPatient = await this.props.iccapi.patienticc.modifyPatientWithUser(this.props.user, p)
    this.props.iccapi.sync(p.modified || 0)

    this.buildDataConfig(modifiedPatient)
    this.props.patientChanged && this.props.patientChanged(modifiedPatient)
  }

  handleSubmit = id => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const data = this.state.dataConfig
        const idx = _.findIndex(data, ['key', id])
        const updatedDataItems = data[idx].rows.filter(r =>
          _.some(values, (v, k) => k === r.fieldDecorator && v !== r.value),
        )

        const homeAddress = p => {
          let a = p.addresses.find(a => !a.addressType || a.addressType === 'home')
          if (a) {
            return a
          }
          p.addresses.push((a = { addressType: 'home', telecoms: [] }))
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

        const p = await this.props.iccapi.patienticc.getPatientWithUser(this.props.user, this.props.patient.id)
        updatedDataItems.forEach(r => {
          const val = values[r.fieldDecorator]
          r.fieldDecorator === 'firstName' && (p.firstName = val)
          r.fieldDecorator === 'lastName' && (p.lastName = val)
          r.fieldDecorator === 'dateOfBirth' && (p.dateOfBirth = +this.props.iccapi.moment(+val).format('YYYYMMDD'))
          r.fieldDecorator === 'street' && (homeAddress(p).street = val)
          r.fieldDecorator === 'postalCode' && (homeAddress(p).postalCode = val)
          r.fieldDecorator === 'city' && (homeAddress(p).city = val)
          r.fieldDecorator === 'phone' && (telecom(homeAddress(p), ['mobile', 'phone']).telecomNumber = val)
          r.fieldDecorator === 'email' && (telecom(homeAddress(p), ['email']).telecomNumber = val)
        })

        await this.saveModifiedPatientAndNotify(p)

        const key = 'editMode' + id
        this._mounted &&
          this.setState({
            [key]: !this.state[key],
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
  handleChange = ({ fileList }) => this.setState({ fileList })
  // Modal methods
  handleOpenDeactivation = () => {
    this.setState({
      visible: true,
    })
  }
  handleDeactivatePatient = () => {
    console.log('Patient was deactivated')
    this.setState({
      stepOkDeactivation: true,
    })
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }
  handleAfterClose = () => {
    this.setState({
      stepOkDeactivation: false,
    })
  }
  handleOpenAddMember = () => {
    this.setState({
      mdlAddMemberVisible: true,
    })
  }
  handleMdlAddMemberCancel = () => {
    this.setState({
      mdlAddMemberVisible: false,
    })
  }
  handleAddMember = async member => {
    const p = await this.props.iccapi.patienticc.getPatientWithUser(this.props.user, this.props.patient.id)
    member.membersList.split(',').forEach(id =>
      (p.patientHealthCareParties || (p.patientHealthCareParties = [])).push({
        type: 'doctor',
        healthcarePartyId: id,
      }),
    )
    await this.saveModifiedPatientAndNotify(p)
  }
  handleUpdateMember = (type, record, val) => {
    this.setState({
      mdlUpdateMemberVisible: true,
      mdlUpdateMemberActionInfo: { type, record, val },
    })
  }
  handleMdlUpdateMemberCancel = () => {
    this.setState({
      mdlUpdateMemberVisible: false,
    })
  }
  updateMember = async () => {
    const { type, record } = this.state.mdlUpdateMemberActionInfo
    if (type === 'remove') {
      const p = await this.props.iccapi.patienticc.getPatientWithUser(this.props.user, this.props.patient.id)
      const idx = p.patientHealthCareParties.findIndex(phcp => phcp.healthcarePartyId === record.key)
      if (idx >= 0) {
        p.patientHealthCareParties.splice(idx, 1)
        await this.saveModifiedPatientAndNotify(p)
      }
    }
    // if action was finished successfully
    this.setState({
      mdlUpdateMemberActionInfo: { stepOk: true },
    })
  }
  render() {
    return this.view(this.props)
  }
}
const InfoSinglePatientForm = Form.create({ name: 'info_single_patient_form' })(InfoSinglePatient)

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    iccapi: state.iccapi,
    user: state.authentication.user,
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
)(InfoSinglePatientForm)

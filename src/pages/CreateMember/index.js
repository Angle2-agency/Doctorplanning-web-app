import React from 'react'
import { history } from '../../helpers'
import { connect } from 'react-redux'
import { Form } from 'antd'
import _ from 'lodash'

import DOM from './createMember'

class CreateMember extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
    this.state = {
      dataConfig: [],
      visible: false,
    }
  }

  buildDataConfig(p) {
    const a = (p.addresses && p.addresses.find(a => !a.addressType || a.addressType === 'home')) || { telecoms: [] }

    const phoneTelecom =
      a.telecoms.find(t => t.telecomType === 'phone') || a.telecoms.find(t => t.telecomType === 'mobile') || {}

    const emailTelecom = a.telecoms.find(t => t.telecomType === 'email') || {}

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
          {
            fieldDecorator: 'selectRights',
            fieldProps: {
              type: 'select',
              placeholder: "Sélectionnez les droits d'accès",
              options: ['De modification', 'En lecture seule'],
            },
            rules: [{ required: true, message: "Svp, Choisissez les droits pour le nouveau membre de l'équipe!" }],
          },
        ],
      },
    ]
    this.setState({
      dataConfig,
      patient: p,
    })
  }

  componentDidMount() {
    this.buildDataConfig({})
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
          let a = (p.addresses || (p.addresses = [])).find(a => !a.addressType || a.addressType === 'home')
          if (a) {
            return a
          }
          p.addresses.push((a = { addressType: 'home', telecoms: [] }))
          return a
        }

        const telecom = (a, types) => {
          let t = (a.telecoms || (a.telecoms = [])).find(t => t.telecomType && types.includes(t.telecomType))
          if (t) {
            return t
          }
          a.telecoms.push((t = { telecomType: types[0] }))
          return t
        }
        // to do: change 'Create patient' to 'Create member'
        const p = await this.props.iccapi.patienticc.newInstance(this.props.user, {})
        updatedDataItems.forEach(r => {
          const val = values[r.fieldDecorator]
          if (val) {
            r.fieldDecorator === 'firstName' && (p.firstName = val)
            r.fieldDecorator === 'lastName' && (p.lastName = val)
            r.fieldDecorator === 'phone' && (telecom(homeAddress(p), ['mobile', 'phone']).telecomNumber = val)
            r.fieldDecorator === 'email' && (telecom(homeAddress(p), ['email']).telecomNumber = val)
          }
        })

        const createdMember = await this.props.iccapi.patienticc.createPatientWithUser(this.props.user, p)

        this.buildDataConfig(createdMember)
        this.props.iccapi.sync(p.modified || 0)
        this.handleOpenCreation()
      }
    })
  }
  handleOpenCreation = () => {
    this.setState({
      visible: true,
    })
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    })
    history.push('/my-team')
  }
  render() {
    return this.view(this.props)
  }
}
const CreateMemberForm = Form.create({ name: 'create_member_form' })(CreateMember)

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    iccapi: state.iccapi,
    user: state.authentication.user,
  }
}

export default connect(mapStateToProps)(CreateMemberForm)

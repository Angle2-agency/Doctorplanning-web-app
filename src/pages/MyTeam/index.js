import React from 'react'
import { updateData, removeDataItem } from '../../helpers'
import DOM from './myTeam'

class MyTeamPage extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
    this.state = {
      membersData: [],
      mdlAddMemberVisible: false,
      mdlAddMemberData: [],
      membersDoctors: ['Michele Morel', 'Michelle Lambert', 'Nathan Lambert', 'Alexandre Leroy', 'Fichele Borel'],
      mdlUpdateMemberVisible: false,
      mdlUpdateMemberActionInfo: null,
    }
    this.removeDataItem = removeDataItem.bind(this)
    this.updateData = updateData.bind(this)
  }

  componentDidMount() {
    this.setState({
      membersData: [
        {
          key: '1',
          name: 'Kate Smith',
          email: 'smith@gmail.com',
          phone: '+33 6 786 55 87',
          clinic: 'Nom du centre médical',
          rights: 'De modification',
        },
        {
          key: '2',
          name: 'Emilie Green',
          email: 'green@gmail.com',
          phone: '+33 6 786 55 87',
          clinic: 'Nom du centre médical',
          rights: 'En lecture seule',
        },
        {
          key: '3',
          name: 'Samuel Brown',
          email: 'brown@gmail.com',
          phone: '+33 6 786 55 87',
          clinic: 'Nom du centre médical',
          rights: 'De modification',
        },
      ],
      mdlAddMemberData: [
        {
          key: '001',
          rows: [
            {
              fieldDecorator: 'membersList',
              className: 'radio-list',
              fieldProps: {
                type: 'radiogroup',
                options: this.state.membersDoctors,
              },
              rules: [{ required: true, message: "Svp, choisir un nouveau membre de l'équipe dans la liste!" }],
            },
            {
              fieldDecorator: 'selectRights',
              className: 'd-flex justify-content-center mt-5 mb-1',
              fieldProps: {
                type: 'select',
                style: { width: 270 },
                placeholder: "Sélectionnez les droits d'accès",
                options: ['De modification', 'En lecture seule'],
              },
              rules: [{ required: true, message: "Svp, Choisissez les droits pour le nouveau membre de l'équipe!" }],
            },
          ],
        },
      ],
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
  handleAddMember = member => {
    const newMember = {
      key: '4',
      name: member.membersList,
      email: 'brown@gmail.com',
      phone: '+33 6 786 55 87',
      clinic: 'Nom du centre médical',
      rights: member.selectRights,
    }
    const membersData = this.state.membersData
    membersData.push(newMember)
    this.setState({
      membersData,
    })
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
  updateMember = () => {
    const { type, record, val } = this.state.mdlUpdateMemberActionInfo
    if (type === 'remove') {
      this.removeDataItem('membersData', record.key)
    }
    if (type === 'updateRights') {
      this.updateData('membersData', record.key, 'rights', val)
    }
    // if action was finished successfully
    this.setState({
      mdlUpdateMemberActionInfo: { stepOk: true },
    })
  }

  render() {
    return this.view()
  }
}

export default MyTeamPage

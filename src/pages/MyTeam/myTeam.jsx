import React from 'react'
import { Button, Table, Select } from 'antd'
import Layout from '../../components/Layout'
import ContentHead from '../../components/ContentHead'
import ModalAddMember from '../../components/ModalAddMember'
import ModalUpdateMember from '../../components/ModalUpdateMember'
import Icon from '../../elements/Icon'

const Option = Select.Option

export default function() {
  const membersTableColumns = [
    {
      title: 'Médecin',
      dataIndex: 'name',
      render: name => (
        <div className="flex-center">
          <span className="text-bold">{name}</span>
        </div>
      ),
      sorter: (a, b) => a.name > b.name,
    },
    {
      title: 'Centre medical',
      dataIndex: 'clinic',
      align: 'center',
    },
    {
      title: 'Adresse mail',
      dataIndex: 'email',
      align: 'center',
    },
    {
      title: 'Téléphone',
      dataIndex: 'phone',
      align: 'center',
    },
    {
      title: 'Les droits d’accés',
      dataIndex: 'rights',
      render: (rights, record) => (
        <Select
          defaultValue={rights}
          style={{ width: 167 }}
          size="large"
          onChange={val => this.handleUpdateMember('updateRights', record, val)}
        >
          <Option value="En lecture seule">En lecture seule</Option>
          <Option value="De modification">De modification</Option>
        </Select>
      ),
      align: 'center',
    },
    {
      title: '',
      dataIndex: 'actions',
      render: (actions, record) => (
        <div className="d-flex justify-content-end">
          <Button className="white" onClick={() => this.handleUpdateMember('remove', record)}>
            <Icon name="basket" />
          </Button>
        </div>
      ),
    },
  ]
  const newMemberBtn = (
    <Button className="green ml-3" onClick={this.handleOpenAddMember}>
      <Icon name="plus" />
      <span>Nouveau membre de l&apos;équipe</span>
    </Button>
  )
  return (
    <Layout title="Mon équipe de santé">
      <ContentHead title="Mon équipe de santé" right={newMemberBtn} />
      <div className="container-fluid">
        <section className="settings">
          <Table
            dataSource={this.state.membersData}
            columns={membersTableColumns}
            pagination={false}
            className="table-styled"
          />
        </section>
      </div>
      {this.state.mdlAddMemberData ? (
        <ModalAddMember
          patient={this.state.patientName || ''}
          dataConfig={this.state.mdlAddMemberData}
          visible={this.state.mdlAddMemberVisible}
          cancel={this.handleMdlAddMemberCancel}
          addMember={this.handleAddMember}
        />
      ) : null}
      {this.state.mdlUpdateMemberActionInfo ? (
        <ModalUpdateMember
          visible={this.state.mdlUpdateMemberVisible}
          cancel={this.handleMdlUpdateMemberCancel}
          actionInfo={this.state.mdlUpdateMemberActionInfo}
          updateMember={this.updateMember}
        />
      ) : null}
    </Layout>
  )
}

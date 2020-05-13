import React from 'react'
import moment from 'moment'
import { Row, Col, Button, Form, Table, Modal, Popover } from 'antd'
import FormItem from '../../elements/FormItem'
import ModalAddMember from '../ModalAddMember'
import ModalUpdateMember from '../../components/ModalUpdateMember'
import Icon from '../../elements/Icon'
import cautionIcon from '../../assets/images/caution.svg'
import successOk from '../../assets/images/success-ok.svg'

export default function() {
  const { getFieldDecorator } = this.props.form
  const membersTableColumns = [
    {
      title: 'Médecin',
      dataIndex: 'name',
      render: (name, r) => (
        <div className="flex-center">
          <Popover
            overlayClassName="popup-styled"
            content={
              <ul className="popup-styled__list">
                {r.phone ? (
                  <li className="flex-center">
                    <Icon name="phone-in-circle" />
                    <span className="ml-1">{r.phone}</span>
                  </li>
                ) : null}
                {r.email ? (
                  <li className="flex-center">
                    <Icon name="email-in-circle" />
                    <span className="ml-1">{r.email}</span>
                  </li>
                ) : null}
              </ul>
            }
          >
            <span>
              <Icon name="info" />
            </span>
          </Popover>
          <span className="ml-1">{name}</span>
        </div>
      ),
    },
    {
      title: 'Centre medical',
      dataIndex: 'clinic',
    },
    {
      title: 'Les droits d’accés',
      dataIndex: 'rights',
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

  const stepAskDeactivation = (
    <div>
      <div className="modal-confirm__head">
        <img src={cautionIcon} alt="caution" />
      </div>
      <div>
        <div className="modal-confirm__body">
          <h3 className="h-3 mt-3">Voulez-vous vraiment désactiver le profil de Michele Morel?</h3>
        </div>
        <div className="text-center mt-5">
          <div className="mt-2">
            <Button className="green xxl" onClick={this.handleDeactivatePatient}>
              <span>Oui, désactiver</span>
            </Button>
          </div>
          <div className="mt-2">
            <Button className="transparent md" onClick={this.handleCancel}>
              <span className="underlined">Annuler</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
  const stepOkDeactivation = (
    <div>
      <div className="modal-confirm__head">
        <img src={successOk} alt="caution" />
      </div>
      <div className="modal-confirm__body">
        <h3 className="h-3 mt-3">Profile de Michele Morel a été désactivé avec succès</h3>
      </div>
      <div className="flex-center justify-content-center mt-3">
        <Button className="green md" onClick={this.handleCancel}>
          <span>Ok</span>
        </Button>
      </div>
    </div>
  )
  return (
    <div>
      <div className="settings-listing">
        <Form onSubmit={this.handleSubmit} colon={false}>
          {this.state.dataConfig.map(el => (
            <section key={el.key} className="settings">
              <div className="settings__header">
                <Row type="flex" gutter={24}>
                  <Col span={24}>
                    <div className="h-4 text-bold">{el.heading}</div>
                  </Col>
                </Row>
              </div>
              <div className="settings__body">
                {el.rows.map((row, i) => (
                  <div key={el.key + i} className="settings__body-row">
                    {this.state['editMode' + el.key] ? (
                      <Form.Item label={row.label} {...row.hasFeedback}>
                        {getFieldDecorator(row.fieldDecorator, {
                          rules: row.rules,
                          initialValue:
                            row.fieldProps && row.fieldProps.type === 'datepicker' ? moment(+row.value) : row.value,
                        })(<FormItem {...row.fieldProps} />)}
                      </Form.Item>
                    ) : (
                      <Row type="flex" gutter={0}>
                        <Col span={8}>
                          <span className="c_grey">{row.label}</span>
                        </Col>
                        <Col span={16}>
                          {row.fieldProps && row.fieldProps.type === 'datepicker'
                            ? moment(+row.value).format('LL')
                            : row.value}
                        </Col>
                      </Row>
                    )}
                  </div>
                ))}
              </div>
              <div className="settings__footer">
                {this.state['editMode' + el.key] ? (
                  <div className="flex-center">
                    <Button className="transparent sm" onClick={() => this.handleEditMode(el.key)}>
                      <span className="underlined">Annuler</span>
                    </Button>
                    <Button type="submit" className="green sm" onClick={() => this.handleSubmit(el.key)}>
                      Sauvegarder
                    </Button>
                  </div>
                ) : (
                  <div className="flex-center">
                    <Button className="white" onClick={this.handleOpenDeactivation}>
                      <span>Désactiver le patient</span>
                    </Button>
                    <Button className="green ml-3" onClick={() => this.handleEditMode(el.key)}>
                      <Icon name="edit" />
                      <span>Modifier</span>
                    </Button>
                  </div>
                )}
              </div>
            </section>
          ))}
          <section className="settings">
            <div className="settings__header">
              <div className="h-4 text-bold">Équipe de santé</div>
            </div>
            <div className="settings__body">
              <Table
                dataSource={this.state.membersData}
                columns={membersTableColumns}
                pagination={false}
                className="table-styled2"
              />
            </div>
            <div className="settings__footer">
              <Button className="green ml-3" onClick={this.handleOpenAddMember}>
                <Icon name="plus" />
                <span>Ajouter un médecin</span>
              </Button>
            </div>
          </section>
        </Form>
      </div>
      <Modal
        centered
        width={560}
        footer={null}
        visible={this.state.visible}
        onCancel={this.handleCancel}
        afterClose={this.handleAfterClose}
      >
        {this.state.stepOkDeactivation ? stepOkDeactivation : stepAskDeactivation}
      </Modal>
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
    </div>
  )
}

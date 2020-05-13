import React from 'react'
import { Modal, Table, Checkbox, Button } from 'antd'
import { Link } from 'react-router-dom'
import successIcon from '../../assets/images/success-calendar.svg'
import Icon from '../../elements/Icon'

const ModalEditCalendar = function({ columns }) {
  return (
    <Modal
      centered
      width={this.state.mdlWidth}
      footer={null}
      visible={this.props.visible}
      onCancel={this.handleCancel}
      afterClose={this.handleAfterClose}
    >
      {!this.state.confirmVisible ? (
        <div className="ml1">
          <h3 className="h-3">{this.state.dateReadable}</h3>
          <Table
            className="table-styled table-modal"
            columns={columns}
            dataSource={this.state.data}
            pagination={false}
            onChange={this.handleTableChange}
          />
          <div className="flex-center justify-content-between">
            <Checkbox onChange={this.handleDateCompleted} checked={this.state.dateClosedForAppointments}>
              Marquer ce jour comme complet
            </Checkbox>
            <div className="flex-center">
              <Button className="bordered" onClick={this.handleCreateAppoinment}>
                <Icon name="plus" />
                <span>Ajouter un rendez-vous</span>
              </Button>
              <Button
                className={`${this.state.dataChanged ? 'green' : 'white'} md ml-3`}
                onClick={this.handleValidateOrCancel}
              >
                <span>{this.state.dataChanged ? 'Sauvegarder' : 'Retour'}</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="ml2">
          <div className="modal-confirm__head">
            <img src={successIcon} alt="Success" />
          </div>
          <div className="modal-confirm__body">
            <div className="mt-5">{this.state.confirmMessage}</div>
            <h3 className="h-3 mt-3">
              {this.state.confirmedData.patient.firstName} {this.state.confirmedData.patient.lastName}
            </h3>
            <Link to="/user" className="link-highlighted mt-4">
              Télécharger le bon de commande
            </Link>
          </div>
          <div className="modal-confirm__footer">
            <Checkbox onChange={this.handleConfirmCheck} checked={!this.state.submitDisabled}>
              Confirmation du AAA
            </Checkbox>
            <Button className="green md" disabled={this.state.submitDisabled} onClick={this.handleSave}>
              <span>Ok</span>
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default ModalEditCalendar

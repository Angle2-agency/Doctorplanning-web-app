import React from 'react'
import { Modal, Button } from 'antd'
import successOk from '../../assets/images/success-ok.svg'
import cautionIcon from '../../assets/images/caution.svg'

export default function() {
  const { actionInfo, updateMember } = this.props
  const stepUpdatingMember = (
    <div>
      <div className="modal-confirm__head">
        <img src={cautionIcon} alt="caution" />
      </div>
      <div>
        <div className="modal-confirm__body">
          <h3 className="h-3 mt-3">
            {actionInfo.type === 'remove' ? 'Voulez-vous vraiment supprimer' : 'Changer un accès pour'} <br /> Michelle
            Lambert?
          </h3>
        </div>
        <div className="text-center mt-5">
          <div className="mt-2">
            <Button className="green xxl" onClick={() => updateMember()}>
              <span>Oui, supprimer</span>
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
  const stepOkMember = (
    <div>
      <div className="modal-confirm__head">
        <img src={successOk} alt="succsess" />
      </div>
      <div className="modal-confirm__body">
        <h3 className="h-3 mt-4">
          Michele Morel{' '}
          {actionInfo.type === 'remove' ? (
            <span>
              a bien été supprimé <br /> de la liste
            </span>
          ) : (
            <span>
              a bien été supprimé <br /> de la liste
            </span>
          )}
        </h3>
      </div>
      <div className="flex-center justify-content-center mt-5">
        <Button className="green md mt-1" onClick={this.handleCancel}>
          <span>Ok</span>
        </Button>
      </div>
    </div>
  )
  return (
    <Modal
      centered
      width={560}
      footer={null}
      visible={this.props.visible}
      onCancel={this.props.cancel}
      afterClose={this.handleAfterClose}
    >
      {this.props.actionInfo.stepOk ? stepOkMember : stepUpdatingMember}
    </Modal>
  )
}

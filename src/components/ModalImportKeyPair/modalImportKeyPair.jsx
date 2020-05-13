import React from 'react'
import { Modal, Upload, Button } from 'antd'
import cautionIcon from '../../assets/images/caution.svg'
import Icon from '../../elements/Icon'

const ModalImportKeyPair = function(id) {
  return (
    <Modal
      centered
      closable={this.props.closable}
      width={560}
      footer={null}
      visible={this.props.visible}
      onCancel={this.handleCancel}
      afterClose={this.handleAfterClose}
    >
      <div className="modal-confirm__head">
        <img src={cautionIcon} alt="caution" />
      </div>
      <div className="modal-confirm__body">
        <h3 className="h-3 mt-3">Pour utiliser le système, veuillez télécharger votre clé privée</h3>
        <div className="mt-4 text-center">
          <Upload beforeUpload={this.handleFile}>
            <Button className="white">
              <Icon name="upload" />
              <span>Charger la clef {id.substr(0, 8)}</span>
            </Button>
          </Upload>
        </div>
      </div>
      <div className="d-flex justify-content-center mt-5">
        <Button className="green md" disabled={this.state.submitDisabled} onClick={this.handleSave}>
          <span>Ok</span>
        </Button>
      </div>
    </Modal>
  )
}

export default ModalImportKeyPair

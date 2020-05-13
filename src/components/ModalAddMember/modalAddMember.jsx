import React from 'react'
import { Link } from 'react-router-dom'
import { Modal, Button, Form } from 'antd'
import FormItem from '../../elements/FormItem'
import successOk from '../../assets/images/success-ok.svg'

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

export default function() {
  const { getFieldDecorator, getFieldsError } = this.props.form
  const stepChoosingMember = (
    <div>
      {this.props.patient ? (
        <h3 className="h-3 mt-3 mb-4 text-center">
          Affecter un nouveau médecin <br /> à {this.props.patient}
        </h3>
      ) : (
        <div className="text-center">
          <h3 className="h-3 mt-3">Choisir un nouveau membre de l&apos;équipe dans la liste</h3>
          <p className="fz-16 mt-2">ou créer un nouveau membre</p>
        </div>
      )}
      <Form onSubmit={this.handleSubmit} colon={false}>
        {this.props.dataConfig.map(el => (
          <section key={el.key} className="mt-4 mb-1">
            {el.rows.map((row, i) => (
              <div key={el.key + i}>
                <Form.Item label={row.label} className={row.className}>
                  {getFieldDecorator(row.fieldDecorator, {
                    rules: row.rules,
                  })(<FormItem {...row.fieldProps} />)}
                </Form.Item>
              </div>
            ))}
          </section>
        ))}
        <div className="d-flex justify-content-center mt-5 mb-4">
          {this.props.patient ? null : (
            <Link to="/my-team/create-new" className="btn white md">
              <span>Créer un nouveau</span>
            </Link>
          )}
          <Button
            type="submit"
            className={`green ${this.props.patient ? 'xl' : 'md ml-3'}`}
            disabled={hasErrors(getFieldsError())}
            onClick={this.handleSubmit}
          >
            <span>Ajouter</span>
          </Button>
        </div>
      </Form>
    </div>
  )
  const stepOkMember = (
    <div>
      <div className="modal-confirm__head">
        <img src={successOk} alt="succsess" />
      </div>
      <div className="modal-confirm__body">
        <p className="mt-5 fz-16">
          Vous avez ajouté avec succès un nouveau <br /> membre de l&apos;équipe
        </p>
        <h3 className="h-3 mt-2">Michelle Lambert</h3>
      </div>
      <div className="flex-center justify-content-center mt-5">
        <Button className="green md mt-2" onClick={this.handleCancel}>
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
      {this.state.stepOkMember ? stepOkMember : stepChoosingMember}
    </Modal>
  )
}

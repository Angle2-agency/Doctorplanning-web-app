import React from 'react'
import Layout from '../../components/Layout'
import ContentHead from '../../components/ContentHead'
import { Button, Form, Modal } from 'antd'
import FormItem from '../../elements/FormItem'
import successOk from '../../assets/images/success-ok.svg'

export default function() {
  const { getFieldDecorator } = this.props.form
  return (
    <Layout title="Créer un nouveau membre d'équipe">
      <ContentHead title="Créer un nouveau membre d'équipe" backlink="/my-patients" />
      <div className="patients-list__actions">
        <div className="container-fluid">
          <div className="flex-center justify-content-center">
            <h4 className="h-4 text-bold">S&apos;il vous plaît créer un nouveau membre de l&apos;équipe ci-dessous</h4>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="crete-patient-form">
          <Form onSubmit={this.handleSubmit} colon={false}>
            {this.state.dataConfig.map(el => (
              <section key={el.key} className="settings">
                {el.rows.map((row, i) => (
                  <div key={el.key + i} className="settings__body-row">
                    <Form.Item label={row.label} {...row.hasFeedback}>
                      {getFieldDecorator(row.fieldDecorator, {
                        rules: row.rules,
                      })(<FormItem {...row.fieldProps} />)}
                    </Form.Item>
                  </div>
                ))}
                <p className="mt-5 text-center">
                  Un nouveau membre de l&apos;équipe recevra un initiale lien vers l&apos;accès LutaPlanning
                </p>
                <div className="mt-3 text-center">
                  <Button type="submit" className="green lg" onClick={() => this.handleSubmit(el.key)}>
                    Envoyer une invitation
                  </Button>
                </div>
              </section>
            ))}
          </Form>
        </div>
      </div>
      <Modal
        centered
        width={560}
        footer={null}
        visible={this.state.visible}
        onCancel={this.handleCancel}
        afterClose={this.handleAfterClose}
      >
        <div>
          <div className="modal-confirm__head">
            <img src={successOk} alt="caution" />
          </div>
          <div className="modal-confirm__body">
            <p className="mt-5">Vous avez ajouté avec succès un nouveau membre de l&apos;équipe</p>
            <h3 className="h-3 mt-3">
              {this.state.patient && this.state.patient.firstName} {this.state.patient && this.state.patient.lastName}
            </h3>
          </div>
          <div className="flex-center justify-content-center mt-5">
            <Button className="green md mt-2" onClick={this.handleCancel}>
              <span>Ok</span>
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}

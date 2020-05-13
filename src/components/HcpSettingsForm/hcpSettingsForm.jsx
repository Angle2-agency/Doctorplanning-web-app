import React from 'react'
import { Button, Col, Form, Row, Upload } from 'antd'
import FormItem from '../../elements/FormItem'
import Icon from '../../elements/Icon'

export default function() {
  const { fileList } = this.state
  const { getFieldDecorator } = this.props.form
  const uploadButton = (
    <div className="userAvatar__upload-btn">
      <Icon name="user" />
      <div className="ant-upload-text">Envoyer la photo</div>
    </div>
  )
  return (
    <Row type="flex" gutter={64}>
      <Col span={24} xl={16}>
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
                            initialValue: row.value,
                          })(<FormItem {...row.fieldProps} />)}
                        </Form.Item>
                      ) : (
                        <Row type="flex" gutter={0} className={row.className}>
                          <Col span={8}>
                            <span className="c_grey">{row.label}</span>
                          </Col>
                          <Col span={16}>{row.value}</Col>
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
                    <Button className="white" onClick={() => this.handleEditMode(el.key)}>
                      <Icon name="edit" />
                      <span>Modifier</span>
                    </Button>
                  )}
                </div>
              </section>
            ))}
          </Form>
          <section className="settings">
            <div className="settings__header">
              <Row type="flex" gutter={24}>
                <Col span={24}>
                  <div className="h-4 text-bold">Votre clé privée</div>
                </Col>
              </Row>
            </div>
            <div className="settings__body">
              <div className="settings__body-row">
                <Row type="flex" gutter={0}>
                  <Col span={8}>
                    <span className="c_grey">Clé privée</span>
                  </Col>
                  <Col span={16}>
                    <div className="flex-center justify-content-end">
                      <Button className="empty" onClick={this.handleDownloadKey}>
                        <Icon name="upload" />
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="settings__footer">
              {/* <Button className="white" onClick={this.handleKeyImport}>
                <span>Importer la clef privée</span>
              </Button> */}
              <Button className="white ml-2" onClick={this.handleDemandNewKey}>
                <span>Télécharger un nouveau</span>
              </Button>
            </div>
          </section>
        </div>
      </Col>
      <Col span={24} xl={8}>
        <div className="userAvatar">
          <Upload
            accept=".png,.jpg,.jpeg"
            listType="picture-card"
            fileList={fileList}
            showUploadList={{ showPreviewIcon: false }}
            customRequest={this.customPictureUploadRequest}
            onChange={this.handlePictureChange}
            onRemove={this.handlePictureRemove}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </div>
      </Col>
    </Row>
  )
}

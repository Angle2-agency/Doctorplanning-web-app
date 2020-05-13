import React from 'react'
import { Button, Col, Form, Row } from 'antd'

import Icon from '../../elements/Icon'
import FormItem from '../../elements/FormItem'

export default function() {
  const { getFieldDecorator } = this.props.form
  return (
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
                    <Row type="flex" gutter={0}>
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
    </div>
  )
}

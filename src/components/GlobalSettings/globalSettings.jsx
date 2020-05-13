import React from 'react'
import { Row, Col, Button, Form, Calendar, Modal } from 'antd'
import FormItem from '../../elements/FormItem'
import Icon from '../../elements/Icon'
import cautionIcon from '../../assets/images/caution.svg'

export default function() {
  const { getFieldDecorator } = this.props.form
  const { events } = this.props
  return (
    <div className="container-fluid">
      <div style={{ maxWidth: 952 }}>
        <section className="section">
          <Form onSubmit={this.handleSubmit} colon={false}>
            {this.state.dataConfig.map(el => (
              <section key={el.key} className="caldset__section">
                <Row type="flex" justify="center" gutter={24}>
                  <Col span={8}>
                    <div className="caldset__heading">{el.heading}</div>
                  </Col>
                  <Col span={15}>
                    <div className="">
                      {el.rows.map((row, i) => (
                        <div key={el.key + i} className="">
                          <Form.Item label={row.label} className={row.className}>
                            {getFieldDecorator(row.fieldDecorator, {
                              rules: row.rules,
                              initialValue: row.value,
                            })(<FormItem {...row.fieldProps} />)}
                          </Form.Item>
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              </section>
            ))}
            <div className="caldset__footer">
              <Button type="submit" className="green md" onClick={this.handleSubmit}>
                Sauvegarder
              </Button>
            </div>
          </Form>
        </section>
        <section className="section">
          <h3 className="section__title h-3">Blocage des jours calendaires</h3>
          <Calendar
            fullscreen={false}
            className="calendar-settings"
            dateFullCellRender={date => this.handleRenderCalendar(date, events)}
            headerRender={({ value, type, onChange }) => {
              return (
                <div className="cald__header">
                  <Button className="empty btn-prev-month" onClick={() => onChange(value.clone().subtract(1, 'month'))}>
                    <Icon name="arrow-down" />
                  </Button>
                  <div className="cald__header-date">
                    <span className="text-bold">{value.format('MMMM')}</span>
                    <span> {value.format('YYYY')}</span>
                  </div>
                  <Button className="empty btn-next-month" onClick={() => onChange(value.clone().add(1, 'month'))}>
                    <Icon name="arrow-down" className="arrow-left" />
                  </Button>
                </div>
              )
            }}
          />
          <h3 className="section__title h-3">Jours déjà bloqués</h3>
          <div className="tags-wrap overflow-y-scroll">
            {this.state.blockedDates.map(item => {
              return (
                <div className="taglock" key={item.key}>
                  <Icon name="lock" />
                  <div className="taglock__text">{this.generateTagText(item.startTime, item.endTime)}</div>
                  <Button className="empty" onClick={e => this.unblockDates(e, [item])}>
                    <Icon name="close" />
                  </Button>
                </div>
              )
            })}
          </div>
        </section>
      </div>
      <Modal centered width={560} footer={null} visible={this.state.visible} onCancel={this.closeAskActionConfirm}>
        <div>
          <div className="modal-confirm__head">
            <img src={cautionIcon} alt="caution" />
          </div>
          <div>
            <div className="modal-confirm__body">
              <h3 className="h-3 mt-3">
                {this.state.actionType === 'blocking'
                  ? 'Voulez-vous vraiment bloquer le'
                  : 'Êtes-vous vraiment envie de débloquer le'}
                <br /> {this.state.datesWillEdit}?
              </h3>
            </div>
            <div className="text-center mt-5">
              <div className="mt-5">
                <Button className="green lg" onClick={e => this.confirmEditing(this.state.actionType)}>
                  <span>Confirmer</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

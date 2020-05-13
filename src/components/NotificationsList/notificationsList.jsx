import React from 'react'
import { Link } from 'react-router-dom'
import { Checkbox, Select } from 'antd'
import Icon from '../../elements/Icon'

import './notifications-list.css'

const Option = Select.Option
const notifArr = [
  { id: '001', date: "Aujourd'hui, 6 Avril 2019", quantity: 4 },
  { id: '002', date: 'Hier, 5 avril 2019', quantity: 2 },
  { id: '003', date: 'Il y a 2 jours, 4 avril 2019', quantity: 3 },
  { id: '004', date: '1 avril 2019', quantity: 5 },
  { id: '005', date: '1 avril 2019', quantity: 1 },
]
export default function() {
  const filterSelect = (
    <div>
      <span className="label">Filter</span>
      <Select defaultValue="today" size="large" className="" style={{ width: 152 }} onChange={this.handleSelectFilter}>
        <Option value="today">Aujourd&apos;hui</Option>
        <Option value="2">Filter 2</Option>
        <Option value="3">Filter 3</Option>
      </Select>
    </div>
  )
  const createList = quantity => {
    let list = []
    for (let i = 0; i < quantity; i++) {
      list.push(
        <div className="notif" key={i}>
          <div className="notif__icon">
            <Icon name="confirmed" />
          </div>
          <div className="notif__content">
            <div>
              Vous avez confirmé <span className="text-bold">l&apos;injection №3</span> à venir le{' '}
              <span className="text-bold">08 juillet 2019</span>
            </div>
            <div className="notif__user">
              <Link to="">Frédéric Bonnet</Link>
              <div className="opt-status confirmed">Confirmé</div>
            </div>
          </div>
          <div className="notif-action">
            <span className="notif__date">6 Avril 2019 à 11.00 </span>
            <Checkbox onChange={this.handleNotifCheck} />
          </div>
        </div>,
      )
    }
    return list
  }
  return (
    <div className="notiflist">
      <div className="notiflist__inner">
        {notifArr.map((item, idx) => (
          <section className="notiflist__section" key={item.id}>
            <div className="notiflist__header">
              <h4 className="h-4">{item.date}</h4>
              {idx === 0 ? filterSelect : null}
            </div>
            <div className="notiflist__body">{createList(item.quantity)}</div>
          </section>
        ))}
      </div>
    </div>
  )
}

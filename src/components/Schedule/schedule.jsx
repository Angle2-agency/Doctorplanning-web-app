import React from 'react'
import Icon from '../../elements/Icon'
import moment from 'moment'
import './schedule.css'

export default function() {
  return (
    <div className="schedule">
      <div className="schedule__title">
        <h5 className="h-5 text-bold">Traitement en vue ligne du temps</h5>
      </div>
      <div className="schedule__inner">
        <div className="schedule__timetrack"></div>
        <div className="schedule__injections">
          {this.state.scheduleData.map((item, idx) => (
            <div className="schedule__inj-section" key={idx}>
              {item.dosis.startsWith('ij') ? (
                <div
                  className={`inj inj--secondary ${item.status}`}
                  onClick={() => this.props.handleDateClick(item.date)}
                >
                  <div className="inj__icon">
                    <Icon name="biotest" />
                  </div>
                  <div className="inj__descr">
                    <h6>Bilan biologique</h6>
                    <p>{moment(+item.startTime).format('LL')}</p>
                  </div>
                </div>
              ) : (
                <div
                  className={`inj inj--primary ${item.status}`}
                  onClick={() => this.props.handleDateClick(item.date)}
                >
                  <div className="inj__timestep--main">
                    S{Math.floor((+item.startTime - +this.state.firstInjection) / 604800000)}
                  </div>
                  <div className="inj__icon">
                    <Icon name="injection" />
                  </div>
                  <div className="inj__descr">
                    <h6>Injection N°{item.dosis ? item.dosis.replace('ij', '') : '?'} </h6>
                    <p>
                      {moment(+item.startTime).format('LL')} | {moment(+item.startTime).format('h:mm')}-
                      {moment(+item.endTime).format('h:mm')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

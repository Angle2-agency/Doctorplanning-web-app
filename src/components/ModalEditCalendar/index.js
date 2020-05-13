import React from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { DatePicker, TimePicker, Select, Button } from 'antd'
import moment from 'moment'
import 'moment/locale/fr'
import * as globalActions from '../../core/global/globalActions'
import Icon from '../../elements/Icon'
import DOM from './modalEditCalendar'
import { dedup } from '../../core/utils/search'
import SelectStatus from '../SelectStatus'
import SelectInjection from '../SelectInjection'
import _ from 'lodash'

const Option = Select.Option

class ModalEditCalendar extends React.Component {
  state = {
    data: [],
    mdlWidth: 1024,
    confirmVisible: false,
    dataChanged: false,
    dateReadable: null,
    submitDisabled: true,
    dateClosedForAppointments: false,
    patients: [],
    dedupPatientSearch: {},
  }
  componentDidMount() {
    this.initializeModal()
  }
  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.initializeModal()
    }
  }
  initializeModal = () => {
    const dateReadable = moment(this.props.dateClicked).format('LL')
    this.setState((state, props) => ({
      data: props.data,
      dateReadable,
    }))
  }
  handleCreateAppoinment = () => {
    const recordInvalid = this.state.data.find(d => {
      return !d.patient
    })
    if (!recordInvalid) {
      this.setState({
        data: [
          ...this.state.data,
          {
            key: this.props.iccapi.cryptoicc.randomUuid(),
            editEnabled: true,
            status: 'waiting',
            dosis: 'ij1',
            startTime: moment()
              .hours(9)
              .minutes(30),
            endTime: moment()
              .hours(10)
              .minutes(30),
          },
        ],
      })
    } else {
      this.updateData(recordInvalid.key, 'hasNameError', 'has-error')
    }
  }
  handlePatientSearch = value => {
    dedup(value, 300, this.state.dedupPatientSearch, value =>
      this.props.iccapi
        .search(value, 100)
        .then(patients =>
          this.setState({ patients: _.uniqBy(patients, p => p.id).map(p => Object.assign({}, p, { key: p.id })) }),
        ),
    ).catch(() => {
      console.log('Search skipped')
    })
  }
  handleSelectPatient = (value, record, index) => {
    this.updateData(record.key, 'hasNameError', '')
    this.props.iccapi.patienticc.getPatientWithUser(this.props.user, value.key).then(p => {
      this.setState(state => {
        return {
          data: state.data.map((r, idx) =>
            idx === index
              ? Object.assign({}, record, {
                  patient: p,
                  title: `${p.firstName || ''} ${p.lastName || ''}`,
                  dataChanged: true,
                })
              : r,
          ),
          dataChanged: true,
        }
      })
    })
  }
  handleSelectStatus = (value, record, index) => {
    this.setState(state => {
      return {
        data: state.data.map((r, idx) =>
          idx === index
            ? Object.assign({ originalStatus: r.status || 'none' }, record, { status: value.key, dataChanged: true })
            : r,
        ),
        dataChanged: true,
      }
    })
  }
  handleSelectInjection = (value, record, index) => {
    value.key &&
      this.setState(state => {
        return {
          data: state.data.map((r, idx) =>
            idx === index
              ? Object.assign({ originalDosis: r.dosis || '-' }, record, {
                  dosis: value.key,
                  dataChanged: true,
                })
              : r,
          ),
          dataChanged: true,
        }
      })
  }
  handleDateTimeChange = (e, record, index, typeTime, onlyHoursMins) => {
    this.setState(state => {
      const key = `original${typeTime.charAt(0).toUpperCase() + typeTime.slice(1)}`
      return {
        data: state.data.map((r, idx) => {
          if (idx === index) {
            let newTime = moment(e)
            if (onlyHoursMins) {
              newTime = moment(this.state.data[idx].startTime)
                .hour(e.hour())
                .minute(e.minute())
            }
            return Object.assign({ [key]: r[typeTime] || moment(0) }, record, {
              [typeTime]: newTime,
              dataChanged: true,
            })
          } else {
            return r
          }
        }),
        dataChanged: true,
      }
    })
  }
  handlePatientEdit = (record, index) => {
    const recordInvalid = this.state.data.find((d, i) => {
      return !d.patient && i === index
    })
    if (!recordInvalid) {
      this.setState(state => {
        return {
          data: state.data.map((r, idx) =>
            idx === index ? Object.assign({}, record, { editEnabled: !r.editEnabled }) : r,
          ),
        }
      })
    } else {
      this.removeDataItem(recordInvalid.key)
    }
  }
  getModifiedPieceOfDataAndSetConfirmStepState = cancelIfNoModifiedData => {
    const data = this.state.data.find(d => {
      return (
        d.dataChanged &&
        (!d.patientId ||
          (d.originalStartTime && !d.originalStartTime.isSame(d.startTime)) ||
          (d.originalEndTime && !d.originalEndTime.isSame(d.endTime)) ||
          (d.originalStatus && d.originalStatus !== d.status) ||
          (d.originalDosis && d.originalDosis !== d.dosis)) &&
        !d.dataConfirmed
      )
    })
    if (!data) {
      if (cancelIfNoModifiedData) {
        this.props.cancel()
      }
      return null
    } else {
      this.setState(state => ({
        confirmVisible: true,
        mdlWidth: 560,
        confirmedData: data,
        confirmMessage: !data.patientId ? (
          <p>{`${this.props.user.name} a créé l'événement.`}</p>
        ) : (
          _.compact([
            data.originalStartTime && !data.originalStartTime.isSame(data.startTime) ? (
              <p key={'1'}>{`${this.props.user.name} a replanifié l'événement.`}</p>
            ) : null,
            data.originalEndTime && !data.originalEndTime.isSame(data.originalEndTime) ? (
              <p key={'1'}>{`${this.props.user.name} a changé la durée de l'événement.`}</p>
            ) : null,
            data.originalStatus && data.originalStatus !== data.status ? (
              <p key={'2'}>{`${this.props.user.name} a changé le statut de l'événement.`}</p>
            ) : null,
            data.originalDosis && data.originalDosis !== data.dosis ? (
              <p key={'3'}>{`${this.props.user.name} a changé le numéro de dose de l'événement.`}</p>
            ) : null,
          ])
        ),
      }))
      return data
    }
  }
  updateData = (id, fieldName, fieldValue) => {
    const data = this.state.data
    const idx = _.findIndex(data, ['key', id])
    const updatedDataItem = data[idx]
    updatedDataItem[fieldName] = fieldValue
    const updatedData = [...data.slice(0, idx), updatedDataItem, ...data.slice(idx + 1)]
    this.setState({
      data: updatedData,
    })
  }
  removeDataItem = id => {
    const data = this.state.data
    const idx = _.findIndex(data, ['key', id])
    const updatedData = [...data.slice(0, idx), ...data.slice(idx + 1)]
    this.setState({
      data: updatedData,
    })
  }
  handleValidateOrCancel = () => {
    const recordInvalid = this.state.data.find(d => {
      return d.dataChanged && !d.patient && !d.dataConfirmed
    })
    if (!recordInvalid) {
      this.getModifiedPieceOfDataAndSetConfirmStepState(true)
    } else {
      this.updateData(recordInvalid.key, 'hasNameError', 'has-error')
    }
  }
  handleConfirmCheck = () => {
    this.setState({ submitDisabled: !this.state.submitDisabled, dataChanged: true })
  }
  handleDateCompleted = () => {
    this.setState({ dateClosedForAppointments: !this.state.dateClosedForAppointments, dataChanged: true })
  }
  handleSave = () => {
    this.setState(
      state => ({
        data: state.data.map(d => (d === state.confirmedData ? Object.assign({}, d, { dataConfirmed: true }) : d)),
      }),
      () => {
        if (!this.getModifiedPieceOfDataAndSetConfirmStepState(false)) {
          this.props.updateCalendar(this.state.data.filter(d => d.dataChanged && d.dataConfirmed))
          this.props.cancel()
        }
      },
    )
  }
  handleCancel = () => {
    this.props.cancel()
  }
  handleAfterClose = () => {
    // TODO @roman Make this go away
    this.setState({
      mdlWidth: 1024,
      confirmVisible: false,
      dataChanged: false,
      submitDisabled: true,
      dateClosedForAppointments: false,
    })
    this.props.cancel()
  }
  render() {
    const columns = [
      {
        title: 'Nom du patient',
        dataIndex: 'patient',
        render: (patient, record, index) =>
          !!record.patientId ? (
            <Link to={`/my-patients/:${record.key}`} className="link">
              {patient.firstName} {patient.lastName}
            </Link>
          ) : (
            <Select
              showSearch
              labelInValue
              value={{
                key: (patient && patient.id) || '',
              }}
              placeholder={'Chercher un patient'}
              style={{ width: 160 }}
              defaultActiveFirstOption={false}
              showArrow={false}
              size="large"
              disabled={!record.editEnabled}
              filterOption={false}
              className={record.hasNameError}
              onSearch={this.handlePatientSearch}
              onChange={value => this.handleSelectPatient(value, record, index)}
              notFoundContent={null}
            >
              {this.state.patients.map(p => (
                <Option key={p.id}>{p.firstName + ' ' + p.lastName}</Option>
              ))}
            </Select>
          ),
      },
      {
        title: 'Statut',
        dataIndex: 'status',
        render: (status, record, index) => {
          return (
            <SelectStatus
              hideLabel
              value={status}
              disabled={!record.editEnabled}
              handleSelectStatus={value => this.handleSelectStatus(value, record, index)}
            />
          )
        },
      },
      {
        title: 'N°injection',
        dataIndex: 'dosis',
        render: (dosis, record, index) => {
          return (
            <SelectInjection
              hideLabel
              showAddAll={!record.patientId}
              value={`${dosis}`}
              handleSelectInjection={value => this.handleSelectInjection(value, record, index)}
              disabled={!record.editEnabled}
              style={{ width: 100 }}
            />
          )
        },
      },
      {
        title: 'Date d’injection',
        dataIndex: 'date',
        render: (m, record, index) => {
          return (
            <div className={`edit-table-timestamp ${record.editEnabled ? 'is-active' : ''}`}>
              <DatePicker
                style={{ width: 110 }}
                defaultValue={moment(record.startTime)
                  .clone()
                  .hours(0)
                  .minutes(0)}
                format="LL"
                disabled={!record.editEnabled}
                placeholder="Select date"
                suffixIcon={false}
                allowClear={false}
                onChange={e => this.handleDateTimeChange(e, record, index, 'startTime')}
              />
            </div>
          )
        },
        align: 'center',
      },
      {
        title: 'Début',
        dataIndex: 'startTime',
        render: (m, record, index) => {
          return (
            <div className={`edit-table-timestamp ${record.editEnabled ? 'is-active' : ''}`}>
              <TimePicker
                defaultValue={moment(m, 'HH:mm a')}
                use12Hours
                format="h:mm a"
                minuteStep={15}
                suffixIcon={<br />}
                allowClear={false}
                style={{ width: 80 }}
                disabled={!record.editEnabled}
                onChange={e => this.handleDateTimeChange(e, record, index, 'startTime', 'onlyHoursMins')}
              />
            </div>
          )
        },
        align: 'center',
        width: '88',
        className: 'table-timepicker-ceil',
      },
      {
        title: 'Fin',
        dataIndex: 'endTime',
        render: (m, record, index) => {
          return (
            <div className={`edit-table-timestamp ${record.editEnabled ? 'is-active' : ''}`}>
              <TimePicker
                defaultValue={moment(m, 'HH:mm a')}
                use12Hours
                format="h:mm a"
                minuteStep={15}
                disabledHours={e => [1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23, 24]}
                suffixIcon={<br />}
                allowClear={false}
                style={{ width: 80 }}
                disabled={!record.editEnabled}
                onChange={e => this.handleDateTimeChange(e, record, index, 'endTime', 'onlyHoursMins')}
              />
            </div>
          )
        },
        align: 'center',
        width: '88',
        className: 'table-timepicker-ceil endTime',
      },
      {
        title: '',
        dataIndex: 'actions',
        key: 'actions',
        render: (btn, record, index) => (
          <div className="text-right">
            <Button className="transparent" onClick={() => this.handlePatientEdit(record, index)}>
              <Icon name="edit" />
              <span className="underlined ml-2">{record.editEnabled ? 'Annuler' : 'Modifier'}</span>
            </Button>
          </div>
        ),
      },
    ]

    this.view = DOM

    return this.view({ columns })
  }
}

ModalEditCalendar.propTypes = {
  actions: PropTypes.object.isRequired,
  global: PropTypes.object.isRequired,
}

function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    global: state.global,
    iccapi: state.iccapi,
    user: state.authentication.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        ...globalActions,
      },
      dispatch,
    ),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalEditCalendar)

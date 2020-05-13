import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Highlighter from 'react-highlight-words'
import 'moment/locale/fr'

import DOM from './patientsList'
import { dedup } from '../../core/utils/search'
import _ from 'lodash'
import moment from 'moment'

class PatientsList extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
    this.state = {
      data: [],
      loading: false,
      searchText: '',
      filteredInfo: '',
      sortedInfo: null,
      dedupPatientSearch: {},
    }
  }

  componentDidMount() {
    this._mounted = true
    this.fetch()
  }
  componentWillUnmount() {
    this._mounted = false
  }
  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    })
    this.fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    })
  }

  searchPatients = async text => {
    this.setState({ loading: true })
    return (this.props.iccapi ? this.props.iccapi.search(text || '', text ? 1000 : 100) : Promise.resolve([])).then(
      async patients => {
        this.setState({
          loading: false,
          data: _.uniqBy(patients, p => p.id).map(p => Object.assign({}, p, { key: p.id })),
          searchText: text,
        })

        const calendarItems =
          this.props.iccapi &&
          this.props.user &&
          (await this.props.iccapi.calendaritemicc.getCalendarItemsByPeriodAndHcPartyId(
            +moment(),
            +moment()
              .add(3, 'months')
              .format('YYYYMMDDhhmmss'),
            this.props.user.healthcarePartyId,
          ))

        const nextCalendarItemPerPatient = (await Promise.all(
          (calendarItems || []).map(calendarItem =>
            this.props.iccapi.cryptoicc
              .extractKeysFromDelegationsForHcpHierarchy(
                this.props.user.healthcarePartyId,
                calendarItem.id,
                calendarItem.cryptedForeignKeys,
              )
              .then(({ extractedKeys }) => Object.assign({}, calendarItem, { patientIds: extractedKeys })),
          ),
        )).reduce((acc, ci) => {
          ci.patientIds.forEach(pid => (acc[pid] = !acc[pid] || ci.startTime < acc[pid].startTime ? ci : acc[pid]))
          return acc
        }, {})

        if (this._mounted) {
          this.setState(state => ({
            data: state.data
              .map(p => Object.assign({}, p, { event: nextCalendarItemPerPatient[p.id] || p.event }))
              .map(p =>
                Object.assign(p, {
                  status: p.event && ((p.event.codes || []).find(c => c.type === 'LUTA-STATUS') || {}).code,
                }),
              ),
          }))
        }
      },
    )
  }

  fetch = (params = {}) => this.searchPatients()

  handleTableSearch = e =>
    dedup(e.target.value, 300, this.state.dedupPatientSearch, this.searchPatients.bind(this)).catch(() => {
      console.log('Search skipped')
    })

  handleSelectStatus = value => {
    if (value === 'all') {
      this.setState({ filteredInfo: null })
    } else {
      this.setState({ filteredInfo: { status: [value] } })
    }
  }
  handleTimeslotChange(value) {
    console.log(`selected ${value}`)
  }

  render() {
    let { sortedInfo } = this.state
    sortedInfo = sortedInfo || {}
    const columns = [
      {
        title: 'Nom du patient',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => {
          if (a.lastName < b.lastName) {
            return -1
          }
          if (a.lastName > b.lastName) {
            return 1
          }
          return 0
        },
        sortOrder: sortedInfo.columnKey === 'lastName' && sortedInfo.order,
        render: (lastName, record) => (
          <Link to={`/my-patients/${record.id}`} className="link">
            <Highlighter
              highlightStyle={{ backgroundColor: '#8bbe44', padding: 0 }}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={lastName.toString()}
            />
          </Link>
        ),
      },
      {
        title: 'Prénom du patient',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => {
          if (a.firstName < b.firstName) {
            return -1
          }
          if (a.firstName > b.firstName) {
            return 1
          }
          return 0
        },
        sortOrder: sortedInfo.columnKey === 'firstName' && sortedInfo.order,
        render: (firstName, record) => (
          <Link to={`/my-patients/${record.id}`} className="link">
            <Highlighter
              highlightStyle={{ backgroundColor: '#8bbe44', padding: 0 }}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={firstName.toString()}
            />
          </Link>
        ),
      },
      {
        title: 'Statut',
        dataIndex: 'status',
        render: status => <div className={`opt-status ${status}`}>{status}</div>,
      },
      {
        title: "N° de l'injection",
        dataIndex: 'doze',
        /*key: 'doze',
                sorter: (a, b) => a.doze.value - b.doze.value,
                sortOrder: sortedInfo.columnKey === 'doze' && sortedInfo.order,
                render: doze => <div>{doze.text}</div>*/
      },
      {
        title: 'Date et heure d’injection',
        dataIndex: 'event.startTime',
        sorter: (a, b) =>
          this.props.iccapi.moment(a.startTime).format('x') - this.props.iccapi.moment(b.startTime).format('x'),
        sortOrder: sortedInfo.columnKey === 'timestamp' && sortedInfo.order,
        render: timestamp => <div>{(this.props.iccapi.moment(timestamp) || { format: () => '' }).format('LL')} </div>,
      },
      {
        title: 'Téléphone',
        dataIndex: 'addresses',
        key: 'addresses',
        render: items =>
          items[0] && items[0].telecoms
            ? items[0].telecoms.map((phone, i) => <div key={i}>{phone.telecomNumber ? phone.telecomNumber : null}</div>)
            : null,
      },
    ]
    return this.view({ columns })
  }
}
function mapStateToProps(state, ownProps) {
  return {
    iccapi: state.iccapi,
    user: state.authentication.user,
    ...ownProps,
  }
}

export default connect(mapStateToProps)(PatientsList)

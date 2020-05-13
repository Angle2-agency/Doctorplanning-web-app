import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import 'moment/locale/fr'

import DOM from './patientContactsList'

class PatientContactsList extends React.Component {
  constructor(props) {
    super(props)
    this.view = DOM
    this.state = {
      data: [],
      loading: false,
      searchText: '',
    }
  }

  componentDidMount() {
    this.fetchContacts()
  }

  fetchContacts = () => {
    const data = [
      {
        key: '1',
        staff: 'Kate Smith',
        hospital: 'XXX',
        email: 'smith@gmail.com',
        addresses: '+33 6 786 55 87',
      },
      {
        key: '2',
        staff: 'Emilie Green',
        hospital: 'XXX',
        email: 'green@gmail.com',
        addresses: '+33 6 786 55 87',
      },
      {
        key: '3',
        staff: 'Samuel Brown',
        hospital: 'XXX',
        email: 'brown@gmail.com',
        addresses: '+33 6 786 55 87',
      },
    ]
    this.setState({
      loading: false,
      data: data,
    })
  }

  render() {
    const columns = [
      {
        title: 'Médecin',
        dataIndex: 'staff',
        key: 'staff',
        render: staff => (
          <Link to="/user" className="link">
            {staff}
          </Link>
        ),
      },
      {
        title: 'Centre medical',
        dataIndex: 'hospital',
      },
      {
        title: 'Addresse mail',
        dataIndex: 'email',
      },
      {
        title: 'Téléphone',
        dataIndex: 'addresses',
        key: 'addresses',
      },
    ]
    return this.view({ columns })
  }
}
function mapStateToProps(state, ownProps) {
  return {
    iccapi: state.iccapi,
    ...ownProps,
  }
}

export default connect(mapStateToProps)(PatientContactsList)

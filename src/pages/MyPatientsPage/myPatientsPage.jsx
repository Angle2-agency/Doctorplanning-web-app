import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import Layout from '../../components/Layout'
import ContentHead from '../../components/ContentHead'
import PatientsList from '../../components/PatientsList'
import Icon from '../../elements/Icon'

import './my-patients-page.css'

export default function() {
  const contentHeadRight = (
    <div className="flex-center">
      <Button className="white lg">
        <span>Générer un raport</span>
      </Button>
      <Link to="/my-patients/create-new" className="btn green lg">
        <Icon name="plus" />
        <span>Nouveau patient</span>
      </Link>
    </div>
  )
  return (
    <Layout title="Mes patients">
      <ContentHead title="Mes patients" backlink="/calendar" right={contentHeadRight} />
      <PatientsList />
    </Layout>
  )
}

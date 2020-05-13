import React from 'react'
import Layout from '../../components/Layout'
import ContentHead from '../../components/ContentHead'
import PatientContactsList from '../../components/PatientContactsList'

export default function() {
  return (
    <Layout title="Livret RIV" type="no-sidebar">
      <ContentHead title="Contact en cas d'urgence" />
      <PatientContactsList />
    </Layout>
  )
}

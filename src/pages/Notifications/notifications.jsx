import React from 'react'
import Layout from '../../components/Layout'
import ContentHead from '../../components/ContentHead'
import NotificationsList from '../../components/NotificationsList'

export default function() {
  return (
    <Layout title="Mises à jour importantes">
      <ContentHead title="Mises à jour importantes" backlink="/calendar" />
      <NotificationsList />
    </Layout>
  )
}

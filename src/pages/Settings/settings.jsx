import React from 'react'
import { Tabs } from 'antd'
import Layout from '../../components/Layout'
import ContentHead from '../../components/ContentHead'
import HcpSettingsForm from '../../components/HcpSettingsForm'
// import GlobalSettings from '../../components/GlobalSettings'

const TabPane = Tabs.TabPane

export default function() {
  return (
    <Layout title="Mes préférences">
      <ContentHead title="Mes préférences" />
      <div className="container-fluid">
        <div className="mt-5 mb-5">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Mon profil" key="1">
              <HcpSettingsForm />
            </TabPane>
            <TabPane tab="Paramètres de calendrier" key="2">
              {/* need data for this component */}
              {/* <GlobalSettings /> */}
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Layout>
  )
}

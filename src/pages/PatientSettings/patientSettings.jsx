import React from 'react'
import { Tabs, Row, Col } from 'antd'
import Layout from '../../components/Layout'
import ContentHead from '../../components/ContentHead'
import PatientSettingsForm from '../../components/PatientSettingsForm'

const { TabPane } = Tabs

export default function() {
  return (
    <Layout title="Mes préférences">
      <ContentHead title="Mes préférences" />
      <div className="container-fluid">
        <div className="mt-5 mb-5">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Mon profil" key="1">
              <Row type="flex" gutter={24}>
                <Col span={24} xl={16}>
                  <PatientSettingsForm />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Layout>
  )
}

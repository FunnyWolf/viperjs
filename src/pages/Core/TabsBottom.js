import React, { Fragment } from 'react'
import { Col, Row, Tabs } from 'antd-v5'
import {
  CloudDownloadOutlined,
  CodeOutlined,
  CustomerServiceOutlined,
  DeploymentUnitOutlined,
  FilterOutlined,
  FolderOpenOutlined,
  FundViewOutlined,
  KeyOutlined,
  MonitorOutlined,
  OpenAIOutlined,
  RadarChartOutlined,
  RobotOutlined,
  SettingOutlined,
  SisternodeOutlined,
} from '@ant-design/icons'
import { formatText } from '@/utils/locales'
import { RealTimeJobsMemo, RealTimeModuleResultMemo, RealTimeNoticesMemo, TaskQueueTagMemo } from '@/pages/Core/RealTimeCard'
import { PayloadAndHandlerMemo } from '@/pages/Core/PayloadAndHandler'
import { IPFilterMemo } from '@/pages/Core/IPFilter'
import { WebDeliveryMemo } from '@/pages/Core/WebDelivery'
import { FileMsfMemo } from '@/pages/Core/FileMsf'
import { NetworkMemo } from '@/pages/Core/Network'
import { AutoRobotMemo, BotScan, ProxyHttpScanMemo } from '@/pages/Core/RunModule'
import { MsfSocksMemo } from '@/pages/Core/MsfSocks'
import { CredentialMemo } from '@/pages/Core/Credential'
import { MsfconsoleMemo } from '@/pages/Core/MsfConsoleXTerm'
import { SystemSettingMemo } from '@/pages/Core/SystemSetting'
import { VGPTMemo } from '@/pages/Core/GPT'
import { useLocalStorageState } from 'ahooks'

const { TabPane } = Tabs;
export const TabsBottom = () => {
  const [viperDebugFlag, setViperDebugFlag] = useLocalStorageState('viper-debug-flag', false)
  console.log('TabsBottom');
  let payloadandhandlerRef = React.createRef();
  let webDeliveryRef = React.createRef();
  let filemsfRef = React.createRef();
  let ipfileterRef = React.createRef();
  const tabActiveOnChange = activeKey => {
    switch (activeKey) {
      case 'MsfConsole':
        break;
      case 'MsfSocks':
        break;
      case 'FileMsf':
        if (filemsfRef.current === null) {
        } else {
          filemsfRef.current.updateData();
        }
        break;
      case 'Credential':
        break;
      case 'LazyLoader':
        break;
      case 'PayloadAndHandler':
        if (payloadandhandlerRef.current === null) {
        } else {
          payloadandhandlerRef.current.updateData();
        }
        break;
      case 'WebDelivery':
        if (webDeliveryRef.current === null) {
        } else {
          webDeliveryRef.current.updateData();
        }
        break;
      case 'IPFilter':
        if (ipfileterRef.current === null) {
        } else {
          ipfileterRef.current.updateData();
        }
        break;
      case 'SystemSetting':
        break;
      default:
    }
  };

  const tabPanedivSytle = {
    marginLeft: '-8px', marginRight: '-8px',
  };
  const tabPanespanSytle = {
    marginLeft: '-6px',
  };

  return (<Fragment>
    <Tabs
      type="card" size="small" onChange={tabActiveOnChange}
    >
      <TabPane
        tab={<div style={tabPanedivSytle}>
          <FundViewOutlined/>
          <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.Notices')}</span>
        </div>}
        key="Notices"
      >
        <Row gutter={0}>
          <Col span={13}>
            <RealTimeModuleResultMemo/>
          </Col>
          <Col span={11}>
            <RealTimeNoticesMemo/>
          </Col>
        </Row>
      </TabPane>
      <TabPane
        tab={<div style={tabPanedivSytle}>
          <TaskQueueTagMemo/>
          <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.JobList')}</span>
        </div>}
        key="JobList"
      >
        <RealTimeJobsMemo/>
      </TabPane>
      <TabPane
        tab={<div style={tabPanedivSytle}>
          <CustomerServiceOutlined/>
          <span
            style={tabPanespanSytle}>{formatText('app.hostandsession.tab.PayloadAndHandler')}</span>
        </div>}
        key="PayloadAndHandler"
      >
        <PayloadAndHandlerMemo onRef={payloadandhandlerRef}/>
      </TabPane>
      <TabPane
        tab={<div style={tabPanedivSytle}>
          <FilterOutlined/>
          <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.IPFilter')}</span>
        </div>}
        key="IPFilter"
      >
        <IPFilterMemo onRef={ipfileterRef}/>
      </TabPane>
      <TabPane
        tab={<div style={tabPanedivSytle}>
          <CloudDownloadOutlined/>
          <span style={tabPanespanSytle}>WebDelivery</span>
        </div>}
        key="WebDelivery"
      >
        <WebDeliveryMemo onRef={webDeliveryRef}/>
      </TabPane>
      <TabPane
        tab={<div style={tabPanedivSytle}>
          <FolderOpenOutlined/>
          <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.FileMsf')}</span>
        </div>}
        key="FileMsf"
      >
        <FileMsfMemo onRef={filemsfRef}/>
      </TabPane>
      <TabPane
        tab={<div style={tabPanedivSytle}>
          <DeploymentUnitOutlined/>
          <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.Network')}</span>
        </div>}
        key="Network"
      >
        <NetworkMemo/>
      </TabPane>
      <TabPane
        tab={<div style={tabPanedivSytle}>
          <RobotOutlined/>
          <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.AutoRobot')}</span>
        </div>}
        key="AutoRobot"
      >
        <AutoRobotMemo/>
      </TabPane>
      <TabPane
        tab={<div style={tabPanedivSytle}>
          <SisternodeOutlined/>
          <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.MsfSocks')}</span>
        </div>}
        key="MsfSocks"
      >
        <MsfSocksMemo/>
      </TabPane>
      <TabPane
        tab={<div style={tabPanedivSytle}>
          <KeyOutlined/>
          <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.Credential')}</span>
        </div>}
        key="Credential"
      >
        <CredentialMemo/>
      </TabPane>
      <TabPane
        tab={<div style={tabPanedivSytle}>
          <CodeOutlined/>
          <span style={tabPanespanSytle}>MSFCONSOLE</span>
        </div>}
        key="MsfConsole"
        // forceRender
      >
        <MsfconsoleMemo/>
      </TabPane>
      <TabPane
        tab={<div style={tabPanedivSytle}>
          <OpenAIOutlined/>
          <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.VGPT')}</span>
        </div>}
        key="VGPT"
      >
        <VGPTMemo/>
      </TabPane>
      <TabPane
        tab={<div style={tabPanedivSytle}>
          <RadarChartOutlined/>
          <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.BotScan')}</span>
        </div>}
        key="BotScan"
      >
        <BotScan/>
      </TabPane>
      <TabPane
        tab={<div style={tabPanedivSytle}>
          <MonitorOutlined/>
          <span
            style={tabPanespanSytle}>{formatText('app.hostandsession.tab.passivescan')}</span>
        </div>}
        key="ProxyHttpScan"
      >
        <ProxyHttpScanMemo/>
      </TabPane>
      <TabPane
        tab={<div style={tabPanedivSytle}>
          <SettingOutlined/>
          <span
            style={tabPanespanSytle}>{formatText('app.hostandsession.tab.SystemSetting')}</span>
        </div>}
        key="SystemSetting"
      >
        <SystemSettingMemo/>
      </TabPane>
    </Tabs>
  </Fragment>);
};

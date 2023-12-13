import React, { useEffect, useRef } from 'react'
import { useModel, useRequest } from 'umi'
import { useInterval } from 'ahooks'
import {
  deleteNoticesAPI,
  deleteWebNoticesAPI,
  getCoreCurrentUserAPI,
  getCoreUUIDJsonAPI,
  getWebdatabaseProjectAPI,
  postCoreNoticesAPI,
} from '@/services/apiv1'

import {
  AlertOutlined, BellOutlined,
  CustomerServiceOutlined, GlobalOutlined, ScanOutlined, SettingOutlined,
} from '@ant-design/icons'

import { Button, Input, Modal, Select, Space, Tabs, Typography } from 'antd'
import GridContent from '@/components/PageHeaderWrapper/GridContent'

import { IPDomainMemo } from '@/pages/Core/IPDomain'

import { SystemSettingMemo } from '@/pages/Core/SystemSetting'
import { getToken } from '@/utils/authority'
import { formatText } from '@/utils/locales'
import { HostIP } from '@/config'
import { ProjectButton } from '@/pages/Core/Project'
import styles from '@/utils/utils.less'
import { SwapOutlined } from '@ant-design/icons'
import { PortScan } from '@/pages/Core/RunModule'
import { RunWebModuleMemo } from '@/pages/Core/WebModule'
import { RealTimeJobsMemo, TaskQueueTagMemo } from '@/pages/Core/RealTimeCard'
import { WebRealTimeJobsMemo } from '@/pages/Core/WebRealtimeJobs'
import { Fragment, memo, useState } from 'react'
import { DocIcon, MyIcon } from '@/pages/Core/Common'
import { getLocale } from '@@/plugin-locale/localeExports'
import { BackTop, Card, Col, List, Popover, Row, Tag } from '_antd@4.24.14@antd'
import { cssCalc } from '@/utils/utils'
import moment from 'moment/moment'
import {
  DeleteOutlined, SearchOutlined, VerticalAlignTopOutlined,
} from '@ant-design/icons'
import ReactJson from 'react-json-view'

const { Text } = Typography
const { Paragraph } = Typography
const { Option } = Select
const ButtonGroup = Button.Group
const { Search, TextArea } = Input
const { TabPane } = Tabs
const { confirm } = Modal
let protocol = 'ws://'
let webHost = HostIP + ':8002'
if (process.env.NODE_ENV === 'production') {
  webHost = location.hostname + (location.port ? `:${location.port}` : '')
  protocol = 'wss://'
}
const WebMain = props => {
  console.log('WebMain')
  useEffect(() => {
  }, [])

  return (<GridContent>
    <TabsBottom/>
  </GridContent>)
}

const TabsOptions = () => {
  const [noticeModalVisible, setNoticeModalVisible] = useState(false)
  return <><Space
    style={{
      paddingTop: 1, paddingBottom: 2,
    }}>
    <Button icon={<BellOutlined/>}
            onClick={() => setNoticeModalVisible(true)}
    />
    <ProjectButton/>
  </Space>
    <Modal
      // style={{ top: 20 }}
      width="40vw"
      bodyStyle={{ padding: '0px 0px 0px 0px' }}
      destroyOnClose
      visible={noticeModalVisible}
      footer={null}
      closable={false}
      onCancel={() => setNoticeModalVisible(false)}
    >
      <WebNoticesMemo/>
    </Modal>
  </>
}

const TabsBottom = () => {
  console.log('TabsBottom')
  const {
    setHeatbeatsocketalive, setWebModuleOptions,
  } = useModel('HostAndSessionModel', model => ({
    setHeatbeatsocketalive: model.setHeatbeatsocketalive,
    setWebModuleOptions: model.setWebModuleOptions,
  }))

  const {
    setWebjobList, setWebTaskResultList, setWebTaskResultListActive, setNotices,
  } = useModel('WebMainModel', model => ({
    setNotices: model.setNotices,
    setWebjobList: model.setWebjobList,
    setWebTaskResultList: model.setWebTaskResultList,
    setWebTaskResultListActive: model.setWebTaskResultListActive,
  }))

  let ipdomainRef = React.createRef()
  const tabActiveOnChange = activeKey => {
    switch (activeKey) {
      case 'IPDomain':
        if (ipdomainRef.current === null) {
        } else {
          ipdomainRef.current.updateData()
        }
        break
      case 'SystemSetting':
        break
      default:
    }
  }

  const tabPanedivSytle = {
    // marginLeft: '-6px', marginRight: '-6px',
  }
  const tabPanespanSytle = {
    // marginLeft: '-4px',
  }

  const listCurrentUserReq = useRequest(getCoreCurrentUserAPI, {
    manual: true, onSuccess: (result, params) => {
    }, onError: (error, params) => {
    },
  })

  const urlpatterns = '/ws/v1/websocket/websync/?'
  const urlargs = `&token=${getToken()}`
  const socketUrl = protocol + webHost + urlpatterns + urlargs

  const ws = useRef(null)

  const initWebSync = () => {
    try {
      listCurrentUserReq.run()
      ws.current = new WebSocket(socketUrl)
    } catch (error) {
      return
    }

    ws.current.onopen = () => {
      setHeatbeatsocketalive(true)
    }
    ws.current.onclose = CloseEvent => {
      setHeatbeatsocketalive(false)
    }
    ws.current.onerror = ErrorEvent => {
      setHeatbeatsocketalive(false)
    }
    ws.current.onmessage = event => {
      const response = JSON.parse(event.data)

      const { module_options } = response
      const { module_options_update } = response

      const { jobs_update } = response
      const { jobs } = response

      const { task_result_update } = response
      const { task_result } = response

      const { notices_update } = response
      const { notices } = response

      if (module_options_update) {
        setWebModuleOptions(
          module_options.filter(item => item.BROKER.indexOf('web') === 0))
      }

      if (jobs_update) {
        setWebjobList(jobs)
      }

      if (task_result_update) {
        setWebTaskResultList(task_result)
        setWebTaskResultListActive(task_result)
      }

      if (notices_update) {
        setNotices(notices)
      }
    }
  }

  const websyncmonitor = () => {
    if (ws.current !== undefined && ws.current !== null &&
      ws.current.readyState === WebSocket.OPEN) {
    } else {
      try {
        ws.current.close()
      } catch (error) {
      }
      try {
        ws.current = null
      } catch (error) {
      }
      initWebSync()
    }
  }
  useInterval(() => websyncmonitor(), 3000)
  useEffect(() => {
    initWebSync()
    return () => {
      try {
        ws.current.close()
      } catch (error) {
      }
      try {
        ws.current = null
      } catch (error) {
      }
    }
  }, [])

  return (<Tabs
    tabBarExtraContent={<TabsOptions/>}
    type="card"
    onChange={tabActiveOnChange}
  >
    <TabPane
      tab={<div style={tabPanedivSytle}>
        <GlobalOutlined/>
        <span style={tabPanespanSytle}>{formatText(
          'app.webmain.tab.ipdomain')}</span>
      </div>}
      key="IPDomain"
    >
      <div
        style={{
          marginTop: -16,
        }}
      >
        <IPDomainMemo onRef={ipdomainRef}/>
      </div>
    </TabPane>
    <TabPane
      tab={<div style={tabPanedivSytle}>
        <ScanOutlined/>
        <span style={tabPanespanSytle}>{formatText(
          'app.webmain.tab.webscan')}</span>
      </div>}
      key="WebScan"
    >
      <div
        style={{
          marginTop: -16,
        }}
      >
        <RunWebModuleMemo/>
      </div>
    </TabPane>
    <TabPane
      tab={<div style={tabPanedivSytle}>
        <TaskQueueTagMemo/>
        <span style={tabPanespanSytle}>{formatText(
          'app.hostandsession.tab.JobList')}</span>
      </div>}
      key="JobList"
    >
      <WebRealTimeJobsMemo/>
    </TabPane>
    <TabPane
      tab={<div style={tabPanedivSytle}>
        <SettingOutlined/>
        <span
          style={tabPanespanSytle}>{formatText(
          'app.hostandsession.tab.SystemSetting')}</span>
      </div>}
      key="SystemSetting"
    >
      <SystemSettingMemo/>
    </TabPane>
  </Tabs>)
}
const KeyToUserIcon = {
  '0': 'icon-yuanxingbaoshi',
  '1': 'icon-sanjiaobaoshi',
  '2': 'icon-shuidibaoshi',
  '3': 'icon-liujiaobaoshi',
  '4': 'icon-lingxingbaoshi',
  '5': 'icon-duojiaobaoshi',
}
const WebNotices = () => {
  console.log('RealTimeNotices')

  const { notices, setNotices } = useModel('WebMainModel', model => ({
    notices: model.notices, setNotices: model.setNotices,
  }))
  const [refresh, setRefresh] = useState(false)
  useInterval(() => setRefresh(!refresh), 60000)
  const {
    resizeUpHeight, resizeDownHeight, setResizeDownHeight,
  } = useModel('Resize', model => ({
    resizeUpHeight: model.resizeUpHeight,
    resizeDownHeight: model.resizeDownHeight,
    setResizeDownHeight: model.setResizeDownHeight,
  }))

  const userIconLarge = key => {
    return (<MyIcon
      type={KeyToUserIcon[key]}
      style={{
        padding: '0px 0px 0px 0px', fontSize: '16px',
      }}
    />)
  }

  const NoticesList = props => {
    const getContent = item => {
      const content = item[getLocale()]
      if (item.level === 0) {
        return (<Text style={{ color: '#49aa19', wordBreak: 'break-all' }}>
          {content}
        </Text>)
      }
      if (item.level === 1) {
        return (<Text style={{ color: '#13a8a8', wordBreak: 'break-all' }}>
          {content}
        </Text>)
      }
      if (item.level === 2) {
        return (<Text type="warning" style={{ wordBreak: 'break-all' }}>
          {content}
        </Text>)
      }
      if (item.level === 3) {
        return (<Text type="danger" style={{ wordBreak: 'break-all' }}>
          {content}
        </Text>)
      }
      if (item.level === 4) {
        return (<Text mark style={{ wordBreak: 'break-all' }}>
          {content}
        </Text>)
      }
      if (item.level === 5) {
        // 提醒
        return (<Text style={{ color: '#642ab5', wordBreak: 'break-all' }}>
          {content}
        </Text>)
      }
      if (item.level === 6) {
        return (<Space>
          {userIconLarge(item.userkey)}
          <Text style={{ color: '#cb2b83', wordBreak: 'break-all' }}>
            {'>'} {content}
          </Text>
        </Space>)
      }
      return (<Text type="warning" style={{ wordBreak: 'break-all' }}>
        {content}
      </Text>)
    }
    return (<List
      id="noticescard"
      style={{
        overflow: 'auto',
        maxHeight: cssCalc(`${resizeDownHeight} - 30px`),
        minHeight: cssCalc(`${resizeDownHeight} - 30px`),
      }}
      split={false}
      size="small"
      bordered
      itemLayout="horizontal"
      dataSource={props.notices}
      renderItem={item => (<List.Item style={{ padding: '0px 0px 0px 0px' }}>
        <div
          style={{
            display: 'inline', marginTop: 0, marginBottom: 0,
          }}
        >
          <Tag
            color="cyan"
            style={{
              marginLeft: -1, marginRight: 4, textAlign: 'center',
            }}
          >
            {moment(item.time * 1000).format('MM-DD HH:mm:ss')}
          </Tag>
          {getContent(item)}
        </div>
      </List.Item>)}
    >
      <BackTop
        style={{
          top: cssCalc(`${resizeUpHeight} + 112px`), right: 24,
        }}
        target={() => document.getElementById('noticescard')}
      >
        <div
          style={{
            height: 40,
            width: 40,
            lineHeight: '40px',
            borderRadius: 4,
            backgroundColor: 'rgba(64, 64, 64, 0.6)',
            color: '#fff',
            textAlign: 'center',
            fontSize: 14,
          }}
        >
          <VerticalAlignTopOutlined/>
        </div>
      </BackTop>
    </List>)
  }

  const deleteNoticesReq = useRequest(deleteWebNoticesAPI, {
    manual: true, onSuccess: (result, params) => {
      setNotices([])
    }, onError: (error, params) => {
    },
  })

  return (<Fragment>
    {/*<DocIcon url="https://www.yuque.com/vipersec/help/vdbhlm"/>*/}
    <Row
      // style={{ marginTop: -16 }}
    >
      <Col span={4}>
        <Button icon={<DeleteOutlined/>} block danger
                onClick={() => deleteNoticesReq.run()}>
          {formatText('app.core.clear')}
        </Button>
      </Col>
    </Row>
    <NoticesList notices={notices}/>
  </Fragment>)
}

export const WebNoticesMemo = memo(WebNotices)

export default WebMain

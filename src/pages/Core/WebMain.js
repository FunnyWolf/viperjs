import React, { useEffect, useRef } from 'react'
import { useModel, useRequest } from 'umi'
import { useInterval } from 'ahooks'
import { getCoreCurrentUserAPI, getWebdatabaseProjectAPI } from '@/services/apiv1'

import { CustomerServiceOutlined, GlobalOutlined, ScanOutlined, SettingOutlined } from '@ant-design/icons'

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
import { RunPortScanModuleMemo } from '@/pages/Core/WebModule'

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
    return <Space
      style={{
          paddingTop: 1,
          paddingBottom: 2,
      }}>
        <Button icon={<SwapOutlined/>}>切换</Button>
        <ProjectButton/>
    </Space>
}

const TabsBottom = () => {
    console.log('TabsBottom')
    const {
        setHeatbeatsocketalive,
        setWebModuleOptions,
    } = useModel('HostAndSessionModel', model => ({
        setHeatbeatsocketalive: model.setHeatbeatsocketalive,
        setWebModuleOptions: model.setWebModuleOptions,
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
            if (module_options_update) {
                setWebModuleOptions(module_options.filter(item => item.BROKER.indexOf('web') === 0))
            }
        }
    }

    const websyncmonitor = () => {
        if (ws.current !== undefined && ws.current !== null && ws.current.readyState === WebSocket.OPEN) {
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
              <span style={tabPanespanSytle}>{formatText('app.webmain.tab.ipdomain')}</span>
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
              <span style={tabPanespanSytle}>{formatText('app.webmain.tab.webscan')}</span>
          </div>}
          key="WebScan"
        >
            <RunPortScanModuleMemo/>
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
    </Tabs>)
}

export default WebMain

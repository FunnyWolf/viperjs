import React, { useEffect, useRef } from 'react'
import { useModel, useRequest } from 'umi'
import { useInterval } from 'ahooks'
import { getCoreCurrentUserAPI } from '@/services/apiv1'

import { CustomerServiceOutlined, SettingOutlined } from '@ant-design/icons'

import { Button, Input, Modal, Select, Space, Tabs, Typography } from 'antd'
import GridContent from '@/components/PageHeaderWrapper/GridContent'

import { IPDomainMemo } from '@/pages/Core/IPDomain'

import { SystemSettingMemo } from '@/pages/Core/SystemSetting'
import { getToken } from '@/utils/authority'
import { formatText } from '@/utils/locales'
import { HostIP } from '@/config'
import { ProjectButton } from '@/pages/Core/Project'
import styles from '@/utils/utils.less'

const { Text } = Typography
const { Paragraph } = Typography
const { Option } = Select
const ButtonGroup = Button.Group
const { Search, TextArea } = Input
const { TabPane } = Tabs
const { confirm } = Modal
//websocket连接地址设置
let protocol = 'ws://'
let webHost = HostIP + ':8002'
if (process.env.NODE_ENV === 'production') {
    webHost = location.hostname + (location.port ? `:${location.port}` : '')
    protocol = 'wss://'
}

const WebMain = props => {
    console.log('HostAndSession')
    const {
        setHeatbeatsocketalive, heatbeatsocketalive,
    } = useModel('HostAndSessionModel', model => ({
        setHeatbeatsocketalive: model.setHeatbeatsocketalive, heatbeatsocketalive: model.heatbeatsocketalive,
    }))

    const {
        ipdomains, setIPDomains,
    } = useModel('WebMainModel', model => ({
        ipdomains: model.ipdomains, setIPDomains: model.setIPDomains,
    }))

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
            const { ipdomains_update } = response
            const { ipdomains } = response
            if (ipdomains_update) {
                setIPDomains(ipdomains)
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

    return (<GridContent>
        <TabsBottom/>
    </GridContent>)
}

const TabsOptions = () => {
    const operations = <Space style={{
        paddingTop: -2, paddingBottom: 4,
    }}><ProjectButton/></Space>
    return operations
}

const TabsBottom = () => {
    console.log('TabsBottom')
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
        marginLeft: '-6px', marginRight: '-6px',
    }
    const tabPanespanSytle = {
        marginLeft: '-4px',
    }

    return (<Tabs
      tabBarExtraContent={<TabsOptions/>}
      style={{ margin: 4 }}
      type="card"
      onChange={tabActiveOnChange}
    >
        <TabPane
          tab={<div style={tabPanedivSytle}>
              <CustomerServiceOutlined/>
              <span
                style={tabPanespanSytle}>
                            {formatText('app.webmain.tab.ipdomain')}
                        </span>
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

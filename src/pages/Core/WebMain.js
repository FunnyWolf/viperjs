import React, {
    Fragment, memo, useCallback, useEffect, useRef, useState,
} from 'react'
import {
    formatMessage, FormattedMessage, getLocale, setLocale, useModel, useRequest,
} from 'umi'
import {
    AutoRobotMemo, BotScan, PostModuleMemo, ProxyHttpScanMemo, RunModuleMemo,
} from '@/pages/Core/RunModule'
import {
    useInterval, useLocalStorageState, useSessionStorageState,
} from 'ahooks'
import {
    deleteCoreHostAPI,
    deleteMsgrpcFileSessionAPI,
    deleteMsgrpcPortFwdAPI,
    deleteMsgrpcRouteAPI,
    deleteMsgrpcSessionAPI,
    deleteMsgrpcSessionioAPI,
    deleteMsgrpcTransportAPI,
    deletePostlateralPortserviceAPI,
    deletePostlateralVulnerabilityAPI,
    getCoreCurrentUserAPI,
    getCoreHostInfoAPI,
    getMsgrpcFileSessionAPI,
    getMsgrpcPortFwdAPI,
    getMsgrpcRouteAPI,
    getMsgrpcSessionAPI,
    getMsgrpcTransportAPI,
    getPostlateralPortserviceAPI,
    getPostlateralVulnerabilityAPI,
    getPostmodulePostModuleResultAPI,
    postMsgrpcFileSessionAPI,
    postMsgrpcPortFwdAPI,
    postMsgrpcRouteAPI,
    postMsgrpcSessionioAPI,
    postMsgrpcTransportAPI,
    postPostmodulePostModuleActuatorAPI,
    putCoreHostAPI,
    putMsgrpcFileSessionAPI,
    putMsgrpcSessionAPI,
    putMsgrpcSessionioAPI,
    putMsgrpcTransportAPI,
} from '@/services/apiv1'

import {
    ArrowRightOutlined,
    ArrowUpOutlined,
    BugOutlined,
    CaretRightOutlined,
    CheckOutlined,
    CloseCircleOutlined,
    CloudDownloadOutlined,
    CloudOutlined,
    CodeOutlined,
    ContactsOutlined,
    CustomerServiceOutlined,
    DashboardOutlined,
    DeleteOutlined,
    DeliveredProcedureOutlined,
    DeploymentUnitOutlined,
    DesktopOutlined,
    DownOutlined,
    ExclamationCircleOutlined,
    FolderAddOutlined,
    FolderOpenOutlined,
    FundViewOutlined,
    GatewayOutlined,
    HomeOutlined,
    InteractionOutlined,
    KeyOutlined,
    LaptopOutlined,
    MonitorOutlined,
    NodeIndexOutlined,
    PartitionOutlined,
    PlayCircleOutlined,
    PlusOutlined,
    ProfileOutlined,
    PushpinOutlined,
    QuestionOutlined,
    RadarChartOutlined,
    RestOutlined,
    RetweetOutlined,
    RightOutlined,
    RobotOutlined,
    SearchOutlined,
    SettingOutlined,
    SisternodeOutlined,
    StopOutlined,
    SubnodeOutlined,
    SwapLeftOutlined,
    SwapOutlined,
    SwapRightOutlined,
    SyncOutlined,
    UploadOutlined,
    UpOutlined,
    WindowsOutlined,
    MinusOutlined,
    AlignLeftOutlined,
    QuestionCircleOutlined,
    VerticalAlignMiddleOutlined,
    ColumnHeightOutlined,
} from '@ant-design/icons'

import {
    Avatar,
    Button,
    Card,
    Checkbox,
    Col,
    Descriptions,
    Dropdown,
    Form,
    Input,
    InputNumber,
    Menu,
    Modal,
    Popconfirm,
    Popover,
    Radio,
    Row,
    Select,
    Space,
    Table,
    Tabs,
    Tag,
    Tooltip,
    Typography,
} from 'antd'
import copy from 'copy-to-clipboard'
import GridContent from '@/components/PageHeaderWrapper/GridContent'
import moment from 'moment'
import {
    RealTimeJobsMemo,
    RealTimeModuleResultMemo,
    RealTimeNoticesMemo,
    TaskQueueTagMemo,
} from '@/pages/Core/RealTimeCard'
import { IPDomainMemo } from '@/pages/Core/IPDomain'
import { PayloadAndHandlerMemo } from '@/pages/Core/PayloadAndHandler'
import { WebDeliveryMemo } from '@/pages/Core/WebDelivery'
import {
    DocIconInDiv,
    DocIconInDivSessionIO,
    host_type_to_avatar_table,
    MyIcon,
    SidTag,
} from '@/pages/Core/Common'
import { SystemSettingMemo } from '@/pages/Core/SystemSetting'
import { MsfSocksMemo } from '@/pages/Core/MsfSocks'
import { CredentialMemo } from '@/pages/Core/Credential'
import { getToken } from '@/utils/authority'
import styles from '@/utils/utils.less'
import { NetworkMemo, NetworkWindowMemo } from '@/pages/Core/Network'
import ReactJson from 'react-json-view'
import NewWindow from 'rc-new-window'
import MsfConsoleXTermMemo, {
    MsfconsoleMemo,
} from '@/pages/Core/MsfConsoleXTerm'
import { cssCalc, Upheight } from '@/utils/utils'
import {
    formatText,
    getOptionDesc,
    getOptionTag,
    getSessionlocate,
    manuali18n,
    msgsuccess,
} from '@/utils/locales'
import { IPFilterMemo } from '@/pages/Core/IPFilter'
import { HostIP } from '@/config'

const { Text } = Typography
const { Paragraph } = Typography
const { Option } = Select
const ButtonGroup = Button.Group
const { Search, TextArea } = Input
const { TabPane } = Tabs
const { confirm } = Modal
import { Resizable } from 're-resizable'
import { math } from 'polished'
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
        setHeatbeatsocketalive: model.setHeatbeatsocketalive,
        heatbeatsocketalive: model.heatbeatsocketalive,
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

    return (<GridContent>
        <TabsBottom />
    </GridContent>)
}

const TabsOptions = () => {
    const handleChange = (value) => {
        console.log(`selected ${value}`)
    }
    const operations = <Space.Compact
        style={{
            paddingTop: 0,
            paddingBottom: 2,
        }}
    >
        <Select
            defaultValue="lucy"
            style={{ width: 160 }}
            onChange={handleChange}
            options={[
                {
                    value: 'jack',
                    label: 'Jack',
                },
                {
                    value: 'lucy',
                    label: 'Lucy',
                },
            ]}
        />
        <Button icon={<SettingOutlined />} />
    </Space.Compact>
    return operations
}

const TabsBottom = () => {
    console.log('TabsBottom')
    let ipdomainRef = React.createRef()
    const tabActiveOnChange = activeKey => {
        switch (activeKey) {
            case 'MsfConsole':
                break
            case 'MsfSocks':
                break
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

    return (
        <Tabs
            tabBarExtraContent={<TabsOptions />}
            style={{ margin: 4 }}
            type="card"
            onChange={tabActiveOnChange}
        >
            <TabPane
                tab={
                    <div style={tabPanedivSytle}>
                        <CustomerServiceOutlined />
                        <span
                            style={tabPanespanSytle}>
                            {formatText('app.webmain.tab.ipdomain')}
                        </span>
                    </div>
                }
                key="IPDomain"
            >
                <div
                    style={{
                        marginTop: -16,
                    }}
                >
                    <IPDomainMemo onRef={ipdomainRef} />
                </div>
            </TabPane>
            <TabPane
                tab={<div style={tabPanedivSytle}>
                    <SettingOutlined />
                    <span
                        style={tabPanespanSytle}>{formatText(
                        'app.hostandsession.tab.SystemSetting')}</span>
                </div>}
                key="SystemSetting"
            >
                <SystemSettingMemo />
            </TabPane>
        </Tabs>)
}

export default WebMain

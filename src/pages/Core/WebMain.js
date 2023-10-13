import React, {
    Fragment,
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import {
    formatMessage,
    FormattedMessage,
    getLocale,
    setLocale,
    useModel,
    useRequest,
} from 'umi'
import {
    AutoRobotMemo,
    BotScan,
    PostModuleMemo,
    ProxyHttpScanMemo,
    RunModuleMemo,
} from '@/pages/Core/RunModule'
import {
    useInterval,
    useLocalStorageState,
    useSessionStorageState,
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
import { IPDomainMemo} from '@/pages/Core/IPDomain'
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
        setProxyHttpScanModuleOptions,
        setBotModuleOptions,
        setPostModuleOptions,
        setHostAndSessionList,
        setHeatbeatsocketalive,
        setTaskQueueLength,
        setJobList,
        setPostModuleResultHistory,
        setPostModuleResultHistoryActive,
        setNotices,
        setBotWaitList,
        setNetworkData,
        setModuleOptions,
    } = useModel('HostAndSessionModel', model => ({
        setProxyHttpScanModuleOptions: model.setProxyHttpScanModuleOptions,
        setBotModuleOptions: model.setBotModuleOptions,
        setPostModuleOptions: model.setPostModuleOptions,
        setHeatbeatsocketalive: model.setHeatbeatsocketalive,
        taskQueueLength: model.taskQueueLength,
        setTaskQueueLength: model.setTaskQueueLength,
        setHostAndSessionList: model.setHostAndSessionList,
        setNetworkData: model.setNetworkData,
        setJobList: model.setJobList,
        setPostModuleResultHistory: model.setPostModuleResultHistory,
        setPostModuleResultHistoryActive: model.setPostModuleResultHistoryActive,
        setNotices: model.setNotices,
        setBotWaitList: model.setBotWaitList,
        setModuleOptions: model.setModuleOptions,
    }))

    const listCurrentUserReq = useRequest(getCoreCurrentUserAPI, {
        manual: true, onSuccess: (result, params) => {
        }, onError: (error, params) => {
        },
    })

    const urlpatterns = '/ws/v1/websocket/heartbeat/?'
    const urlargs = `&token=${getToken()}`
    const socketUrl = protocol + webHost + urlpatterns + urlargs

    const ws = useRef(null)

    const initHeartBeat = () => {
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
            const { task_queue_length } = response

            const { hosts_sorted_update } = response
            const { hosts_sorted } = response

            const { network_data_update } = response
            const { network_data } = response

            const { result_history_update } = response
            const { result_history } = response

            const { notices_update } = response
            const { notices } = response

            const { jobs_update } = response
            const { jobs } = response

            const { bot_wait_list_update } = response
            const { bot_wait_list } = response

            const { module_options } = response
            const { module_options_update } = response

            setTaskQueueLength(task_queue_length)

            if (hosts_sorted_update) {
                setHostAndSessionList(hosts_sorted)
            }

            if (network_data_update) {
                setNetworkData(network_data)
            }

            if (jobs_update) {
                setJobList(jobs)
            }
            if (result_history_update) {
                setPostModuleResultHistory(result_history)
                setPostModuleResultHistoryActive(result_history)
            }
            if (notices_update) {
                setNotices(notices)
            }
            if (bot_wait_list_update) {
                setBotWaitList(bot_wait_list)
            }

            if (module_options_update) {
                setPostModuleOptions(module_options.filter(
                    item => item.BROKER.indexOf('post') === 0))
                setBotModuleOptions(module_options.filter(
                    item => item.BROKER.indexOf('bot') === 0))
                setProxyHttpScanModuleOptions(module_options.filter(
                    item => item.BROKER.indexOf('proxy') === 0))
            }
        }
    }

    const heartbeatmonitor = () => {
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
            initHeartBeat()
        }
    }
    useInterval(() => heartbeatmonitor(), 3000)
    useEffect(() => {
        initHeartBeat()
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

const TabsBottom = () => {
    console.log('TabsBottom')
    let ipdomainRef = React.createRef()
    let payloadandhandlerRef = React.createRef()
    let webDeliveryRef = React.createRef()
    let filemsfRef = React.createRef()
    let ipfileterRef = React.createRef()
    const tabActiveOnChange = activeKey => {
        switch (activeKey) {
            case 'MsfConsole':
                break
            case 'MsfSocks':
                break
            case 'FileMsf':
                if (filemsfRef.current === null) {
                } else {
                    filemsfRef.current.updateData()
                }
                break
            case 'Credential':
                break
            case 'LazyLoader':
                break
            case 'PayloadAndHandler':
                if (payloadandhandlerRef.current === null) {
                } else {
                    payloadandhandlerRef.current.updateData()
                }
                break
            case 'WebDelivery':
                if (webDeliveryRef.current === null) {
                } else {
                    webDeliveryRef.current.updateData()
                }
                break
            case 'IPFilter':
                if (ipfileterRef.current === null) {
                } else {
                    ipfileterRef.current.updateData()
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

    return (<Fragment>
        <Tabs
            // style={{ marginTop: 4, marginRight: 1, marginLeft: 1 }}
            type="card" onChange={tabActiveOnChange}>
            <TabPane
                tab={<div style={tabPanedivSytle}>
                    <CustomerServiceOutlined />
                    <span
                        style={tabPanespanSytle}>{formatText(
                        'app.webmain.tab.ipdomain')}</span>
                </div>}
                key="IPDomain"
            >
                <IPDomainMemo onRef={ipdomainRef} />
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
        </Tabs>
    </Fragment>)
}

export default WebMain

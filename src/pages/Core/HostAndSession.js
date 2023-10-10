import React, { Fragment, memo, useCallback, useEffect, useRef, useState } from 'react'
import { formatMessage, FormattedMessage, getLocale, setLocale, useModel, useRequest } from 'umi'
import { AutoRobotMemo, BotScan, PostModuleMemo, ProxyHttpScanMemo, RunModuleMemo } from '@/pages/Core/RunModule'
import { useInterval, useLocalStorageState, useSessionStorageState } from 'ahooks'
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
    RealTimeJobsMemo, RealTimeModuleResultMemo, RealTimeNoticesMemo, TaskQueueTagMemo,
} from '@/pages/Core/RealTimeCard'
import { FileMsfMemo, FileMsfModal } from '@/pages/Core/FileMsf'
import { PayloadAndHandlerMemo } from '@/pages/Core/PayloadAndHandler'
import { WebDeliveryMemo } from '@/pages/Core/WebDelivery'
import { DocIconInDiv, DocIconInDivSessionIO, host_type_to_avatar_table, MyIcon, SidTag } from '@/pages/Core/Common'
import { SystemSettingMemo } from '@/pages/Core/SystemSetting'
import { MsfSocksMemo } from '@/pages/Core/MsfSocks'
import { CredentialMemo } from '@/pages/Core/Credential'
import { getToken } from '@/utils/authority'
import styles from '@/utils/utils.less'
import { NetworkMemo, NetworkWindowMemo } from '@/pages/Core/Network'
import ReactJson from 'react-json-view'
import NewWindow from 'rc-new-window'
import MsfConsoleXTermMemo, { MsfconsoleMemo } from '@/pages/Core/MsfConsoleXTerm'
import { cssCalc, Upheight } from '@/utils/utils'
import { formatText, getOptionDesc, getOptionTag, getSessionlocate, manuali18n, msgsuccess } from '@/utils/locales'
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

const HostAndSession = props => {
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
                setPostModuleOptions(module_options.filter(item => item.BROKER.indexOf('post') === 0))
                setBotModuleOptions(module_options.filter(item => item.BROKER.indexOf('bot') === 0))
                setProxyHttpScanModuleOptions(module_options.filter(item => item.BROKER.indexOf('proxy') === 0))
            }
        }
    }

    const heartbeatmonitor = () => {
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
        <FloatingButtons />
        <HostAndSessionCard />
        <TabsBottom />
    </GridContent>)
}

const HostAndSessionCard = () => {
    console.log('HostAndSessionCard')
    const {
        hostAndSessionList,
        setHostAndSessionActive,
        heatbeatsocketalive,
        onlyShowSessionModel,
    } = useModel('HostAndSessionModel', model => ({
        hostAndSessionList: model.hostAndSessionList,
        setHostAndSessionActive: model.setHostAndSessionActive,
        heatbeatsocketalive: model.heatbeatsocketalive,
        onlyShowSessionModel: model.onlyShowSessionModel,
    }))
    const {
        resizeUpHeight,
    } = useModel('Resize', model => ({
        resizeUpHeight: model.resizeUpHeight,
    }))
    const sessionActiveInit = {
        id: -1,
        type: 'meterpreter',
        session_host: '127.0.0.1',
        tunnel_local: null,
        tunnel_peer_ip: null,
        tunnel_peer_locate_zh: null,
        tunnel_peer_locate_en: null,
        tunnel_peer_asn: null,
        tunnel_peer: null,
        via_exploit: null,
        via_payload: null,
        info: null,
        user: null,
        os: null,
        os_short: null,
        arch: null,
        comm_channel_session: null,
        platform: null,
        fromnow: 0,
        available: 0,
        isadmin: null,
        pid: -1,
        job_info: {
            job_id: -1, PAYLOAD: null, LPORT: null, LHOST: null, RHOST: null,
        },
    }

    const [sessionIOModalVisable, setSessionIOModalVisable] = useState(false)
    const [routeModalVisable, setRouteModalVisable] = useState(false)
    const [portFwdModalVisable, setPortFwdModalVisable] = useState(false)
    const [transportModalVisable, setTransportModalVisable] = useState(false)
    const [sessionInfoModalVisable, setSessionInfoModalVisable] = useState(false)
    const [hostRunningInfoModalVisable, setHostRunningInfoModalVisable] = useState(false)
    const [hostInfoModalVisable, setHostInfoModalVisable] = useState(false)
    const [portServiceModalVisable, setPortServiceModalVisable] = useState(false)
    const [vulnerabilityModalVisable, setVulnerabilityModalVisable] = useState(false)
    const [fileSessionModalVisable, setFileSessionModalVisable] = useState(false)
    const [runModuleModalVisable, setRunModuleModalVisable] = useState(false)
    const [updateHostModalVisable, setUpdateHostModalVisable] = useState(false)

    const [expandedRowKeys, setExpandedRowKeys] = useLocalStorageState('hostandsessioncard-expandedkeys', [])

    const closeTransportModel = useCallback(() => {
        setTransportModalVisable(false)
    }, [])

    const destoryHostReq = useRequest(deleteCoreHostAPI, {
        manual: true, onSuccess: (result, params) => {
        }, onError: (error, params) => {
        },
    })

    const destorySessionReq = useRequest(deleteMsgrpcSessionAPI, {
        manual: true, onSuccess: (result, params) => {
        }, onError: (error, params) => {
        },
    })

    const setActiveHostAndSession = item => {
        const tmp = JSON.parse(JSON.stringify(item))
        if (item.session === null || item.session === undefined || item.session instanceof Array) {
            tmp.session = sessionActiveInit
        }
        setHostAndSessionActive(tmp)
    }

    const SessionMenu = record => {
        const onClick = ({ key }) => {
            console.log(key)
            switch (key) {
                case 'HostRuningInfo':
                    setActiveHostAndSession(record)
                    setHostRunningInfoModalVisable(true)
                    break
                case 'SessionInfo':
                    setActiveHostAndSession(record)
                    setSessionInfoModalVisable(true)
                    break
                case 'FileSession':
                    setActiveHostAndSession(record)
                    setFileSessionModalVisable(true)
                    break
                case 'SessionIO':
                    setActiveHostAndSession(record)
                    setSessionIOModalVisable(true)
                    break
                case 'Route':
                    setActiveHostAndSession(record)
                    setRouteModalVisable(true)
                    break
                case 'PortFwd':
                    setActiveHostAndSession(record)
                    setPortFwdModalVisable(true)
                    break
                case 'Transport':
                    setActiveHostAndSession(record)
                    setTransportModalVisable(true)
                    break
                case 'DestorySession':
                    confirm({
                        title: manuali18n('确认删除Session', 'Confirm to delete session'),
                        icon: <ExclamationCircleOutlined />,
                        content: null,
                        mask: false,
                        maskClosable: true,
                        okButtonProps: {
                            style: {
                                width: 100,
                            },
                        },
                        onOk() {
                            destorySessionReq.run({ sessionid: record.session.id })
                        },
                    })
                    break
                default:
                    console.log('unknow command')
            }
        }
        return <Menu onClick={onClick}>
            <Menu.Item icon={<ContactsOutlined />} key="SessionInfo">
                <FormattedMessage id="app.hostandsession.session.SessionInfo" />
            </Menu.Item>
            <Menu.Item icon={<DesktopOutlined />} key="FileSession">
                <FormattedMessage id="app.hostandsession.session.FileSession" />
            </Menu.Item>
            <Menu.Item icon={<PartitionOutlined />} key="Route">
                <FormattedMessage id="app.hostandsession.session.Route" />
            </Menu.Item>
            <Menu.Item icon={<SwapOutlined />} key="PortFwd">
                <FormattedMessage id="app.hostandsession.session.PortFwd" />
            </Menu.Item>
            <Menu.Item icon={<NodeIndexOutlined />} key="Transport">
                <FormattedMessage id="app.hostandsession.session.Transport" />
            </Menu.Item>
            <Menu.Item icon={<CodeOutlined />} key="SessionIO">
                <FormattedMessage id="app.hostandsession.session.SessionIO" />
            </Menu.Item>
            <Menu.Item icon={<DashboardOutlined />} key="HostRuningInfo">
                <FormattedMessage id="app.hostandsession.session.HostRuningInfo" />
            </Menu.Item>
            <Menu.Item icon={<CloseCircleOutlined style={{ color: 'red' }} />} danger key="DestorySession">
                <FormattedMessage id="app.hostandsession.session.DestorySession" />
            </Menu.Item>
        </Menu>
    }

    const HostMenu = record => {
        const onClick = ({ key, domEvent }) => {
            domEvent.stopPropagation()
            switch (key) {
                case 'HostInfo':
                    setActiveHostAndSession(record)
                    setHostInfoModalVisable(true)
                    break
                case 'PortService':
                    setActiveHostAndSession(record)
                    setPortServiceModalVisable(true)
                    break
                case 'Vulnerability':
                    setActiveHostAndSession(record)
                    setVulnerabilityModalVisable(true)
                    break
                case 'DestoryHost':
                    destoryHostReq.run({ ipaddress: record.ipaddress })
                    break
                default:
                    console.log('unknow command')
            }
        }

        return (<Menu onClick={onClick}>
            <Menu.Item icon={<ProfileOutlined />} key="HostInfo">
                <FormattedMessage id="app.hostandsession.host.HostInfo" />
            </Menu.Item>
            <Menu.Item icon={<InteractionOutlined />} key="PortService">
                <FormattedMessage id="app.hostandsession.host.PortService" />
            </Menu.Item>
            <Menu.Item icon={<BugOutlined />} key="Vulnerability">
                <FormattedMessage id="app.hostandsession.host.Vulnerability" />
            </Menu.Item>
            <Menu.Item icon={<DeleteOutlined style={{ color: 'red' }} />} danger key="DestoryHost">
                <FormattedMessage id="app.hostandsession.host.DestoryHost" />
            </Menu.Item>
        </Menu>)
    }

    const handleExpand = (expanded, key) => {
        if (!expanded && expandedRowKeys.includes(key)) {
            expandedRowKeys.forEach((t, i) => {
                if (t === key) expandedRowKeys.splice(i, 1)
            })
        } else if (!expandedRowKeys.includes(key)) expandedRowKeys.push(key)
        setExpandedRowKeys(expandedRowKeys)
    }

    const hostAndSessionTableColumns = [{
        //模块按钮
        dataIndex: 'ipaddress', width: 104, render: (text, record) => {
            return (<Button
                onClick={(e) => {
                    e.stopPropagation()
                    setRunModuleModalVisable(true)
                    setActiveHostAndSession(record)
                }}
                style={{
                    marginLeft: -24, width: 104, backgroundColor: '#15395b', textAlign: 'center', cursor: 'pointer',
                }}
                size="small"
            >
                <CaretRightOutlined />
            </Button>)
        },
    }, {
        //主机标签按钮
        dataIndex: 'ipaddress', width: 88, render: (text, record) => {
            return (<div
                onClick={(e) => {
                    e.stopPropagation()
                    setActiveHostAndSession(record)
                    setUpdateHostModalVisable(true)
                }}
            >
                {host_type_to_avatar_table[record.tag]}
            </div>)
        },
    }, {
        //主机ip地址按钮
        dataIndex: 'ipaddress', width: 168, ellipsis: true, render: (text, record) => {
            return (<Dropdown
                overlay={() => {
                    return HostMenu(record)
                }}
                trigger={['contextMenu', 'click']}
            >
                <Tag
                    color="gold"
                    style={{
                        width: 160, textAlign: 'center', cursor: 'pointer',
                    }}
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                >
                    <strong>{record.ipaddress}</strong>
                </Tag>
            </Dropdown>)
        },
    },

        {
            //session信息
            dataIndex: 'ipaddress', render: (text, record) => {
                const heartbeatTags = []
                record.session.forEach(session => {

                    // 心跳标签
                    const timepass = session.fromnow
                    let heartbeat = null

                    if (timepass <= 60) {
                        heartbeat = (<Tag
                            key={session.id}
                            color="green"
                            style={{
                                width: 72, textAlign: 'center', cursor: 'pointer',
                            }}
                        >
                            {timepass + 's'}
                        </Tag>)
                    } else if (60 < timepass && timepass <= 90) {
                        heartbeat = (<Tag
                            key={session.id}
                            color="orange"
                            style={{
                                width: 72, textAlign: 'center', cursor: 'pointer',
                            }}
                        >
                            {timepass + 's'}
                        </Tag>)
                    } else if (90 < timepass && timepass <= 999) {
                        heartbeat = (<Tag
                            key={session.id}
                            color="orange"
                            style={{
                                width: 72, textAlign: 'center', cursor: 'pointer',
                            }}
                        >
                            {timepass + 's'}
                        </Tag>)
                    } else {
                        heartbeat = (<Tag
                            key={session.id}
                            color="red"
                            style={{
                                width: 72, textAlign: 'center', cursor: 'pointer',
                            }}
                        >999s</Tag>)
                    }
                    heartbeatTags.push(heartbeat)
                })
                return (<div
                    style={{
                        display: 'flex', cursor: 'pointer',
                    }}
                >{heartbeatTags}
                </div>)
            },
        }, {
            //备注展示
            dataIndex: 'ipaddress', width: 200, render: (text, record) => {
                return (<div
                    style={{
                        display: 'flex', cursor: 'pointer',
                    }}
                    onClick={(e) => {
                        e.stopPropagation()
                        setActiveHostAndSession(record)
                        setUpdateHostModalVisable(true)
                    }}
                >
                    <Text
                        className={styles.comment}
                    >
                        {record.comment}
                    </Text>
                </div>)
            },
        },

    ]

    const sessionRowRender = hostRecord => {
        const sessionTableColumns = [{
            dataIndex: 'ipaddress', width: 128, render: (text, sessionRecord) => {
                const session = sessionRecord

                const hostwithsession = JSON.parse(JSON.stringify(hostRecord)) // deep copy
                hostwithsession.session = session

                return (<Button
                    onClick={() => {
                        setRunModuleModalVisable(true)
                        setActiveHostAndSession(hostwithsession)
                    }}
                    style={{
                        width: 104, backgroundColor: '#274916', textAlign: 'center', cursor: 'pointer',
                    }}
                    size="small"
                >
                    <CaretRightOutlined />
                </Button>)
            },
        }, {
            title: 'Session', render: (text, sessionRecord) => {
                const session = sessionRecord

                // 心跳标签
                const timepass = session.fromnow
                let heartbeat = null

                if (timepass <= 60) {
                    heartbeat = (<Tag
                        color="green"
                        style={{
                            width: 72, textAlign: 'center', cursor: 'pointer',
                        }}
                    >
                        {timepass + 's'}
                    </Tag>)
                } else if (60 < timepass && timepass <= 99) {
                    heartbeat = (<Tag
                        color="orange"
                        style={{
                            width: 72, textAlign: 'center', cursor: 'pointer',
                        }}
                    >
                        {timepass + 's'}
                    </Tag>)
                } else if (99 < timepass && timepass <= 999) {
                    heartbeat = (<Tag
                        color="orange"
                        style={{
                            width: 72, textAlign: 'center', cursor: 'pointer',
                        }}
                    >
                        {timepass + 's'}
                    </Tag>)
                } else {
                    heartbeat = (<Tooltip title={timepass + 's'} placement="left">
                        <Tag
                            color="red"
                            style={{
                                width: 72, textAlign: 'center', cursor: 'pointer',
                            }}
                        >999s</Tag>
                    </Tooltip>)
                }

                // sessionid
                const sessionidTag = (<Tooltip title={'SID ' + session.id} placement="bottomLeft">
                    <Tag
                        color="purple"
                        style={{
                            minWidth: 48, marginLeft: -6, textAlign: 'center', cursor: 'pointer',
                        }}
                    >
                        <strong>{session.id}</strong>
                    </Tag>
                </Tooltip>)

                const pidTag = session.pid === null ? null : (<Tooltip
                    mouseEnterDelay={1}
                    placement="bottomLeft"
                    title={<span>Pid {session.pid}</span>}
                >
                    <Tag
                        color="magenta"
                        style={{
                            // width: 64,
                            marginLeft: -6, textAlign: 'center', cursor: 'pointer',
                        }}
                    >
                        <span>{session.pid}</span>
                    </Tag>
                </Tooltip>)


                const connectTag = (
                    <Tooltip mouseEnterDelay={1} placement="bottomLeft" title={session.tunnel_peer_locate_en}>
                        <Tag
                            color="cyan"
                            style={{
                                textAlign: 'center', marginLeft: -6, cursor: 'pointer',
                            }}
                        >
                            {session.tunnel_local}{' <- '}{session.tunnel_peer} {getSessionlocate(session)}
                        </Tag>
                    </Tooltip>)

                // arch
                const archTag = session.arch === 'x64' ? (<Tag
                    color="geekblue"
                    style={{
                        cursor: 'pointer', marginLeft: -6,
                    }}
                >
                    {session.arch}
                </Tag>) : (<Tag
                    color="volcano"
                    style={{
                        cursor: 'pointer', marginLeft: -6,
                    }}
                >
                    {session.arch}
                </Tag>)

                // os标签
                const os_tag = session.platform === 'windows' ? (
                    <Tooltip mouseEnterDelay={1} placement="bottomLeft" title={session.os}>
                        <Tag
                            color="blue"
                            style={{
                                marginLeft: -6, cursor: 'pointer',
                            }}
                        >
                            <div>
                                <MyIcon
                                    type="icon-windows"
                                    style={{
                                        marginBottom: 0, marginRight: 4, fontSize: '14px',
                                    }}
                                />
                                {session.os_short}
                            </div>
                        </Tag>
                    </Tooltip>) : (<Tooltip mouseEnterDelay={0.5} placement="right" title={session.os}>
                    <Tag
                        color="magenta"
                        style={{
                            marginLeft: -6, cursor: 'pointer',
                        }}
                    >
                        <div>
                            <MyIcon
                                type="icon-linux"
                                style={{
                                    fontSize: '14px', marginRight: 4,
                                }}
                            />
                            {session.os_short}
                        </div>
                    </Tag>
                </Tooltip>)

                // user标签
                let user = null
                if (session.available === true && session.isadmin === true) {
                    user = (<Tooltip mouseEnterDelay={1} placement="bottomLeft" title={session.info}>
                        <Tag
                            color="orange"
                            style={{
                                marginLeft: -6, cursor: 'pointer',
                            }}
                        >
                            <div>{session.info}</div>
                        </Tag>
                    </Tooltip>)
                } else {
                    user = (<Tooltip mouseEnterDelay={1} placement="bottomLeft" title={session.info}>
                        <Tag
                            style={{
                                marginLeft: -6, cursor: 'pointer',
                            }}
                        >
                            <div>{session.info}</div>
                        </Tag>
                    </Tooltip>)
                }
                // handler标签
                const jobidTagTooltip = (
                    <span>{session.job_info.PAYLOAD} {session.job_info.LHOST}{' '}{session.job_info.RHOST} {session.job_info.LPORT}{' '}</span>)
                const jobidTag = (<Tooltip mouseEnterDelay={0.5} placement="bottomLeft" title={jobidTagTooltip}>
                    <Tag
                        color="lime"
                        style={{
                            minWidth: 48, marginLeft: -6, textAlign: 'center', cursor: 'pointer',
                        }}
                    >
                        <span>{session.job_info.job_id}</span>
                    </Tag>
                </Tooltip>)


                const commTag = session.comm_channel_session === null ? null : (<Tag
                    color="gold"
                    style={{
                        cursor: 'pointer', marginLeft: -6,
                    }}
                ><SubnodeOutlined /><span style={{ fontWeight: 'bold' }}>{session.comm_channel_session}</span>
                </Tag>)


                const hostwithsession = JSON.parse(JSON.stringify(hostRecord)) // deep copy
                hostwithsession.session = session
                // SubnodeOutlined
                return (<Dropdown
                    overlay={() => SessionMenu(hostwithsession)}
                    trigger={['contextMenu', 'click']}
                    placement="bottomLeft"
                >
                    <div
                        style={{
                            display: 'flex', cursor: 'pointer',
                        }}
                    >
                        {heartbeat}
                        {sessionidTag}
                        {jobidTag}
                        {connectTag}
                        {archTag}
                        {os_tag}
                        {user}
                        {pidTag}
                        {commTag}
                    </div>
                </Dropdown>)
            },
        }]

        return <Table
            loading={!heatbeatsocketalive}
            dataSource={hostRecord.session}
            style={{ marginLeft: 23 }}
            size="small"
            columns={sessionTableColumns}
            rowKey={item => item.id}
            pagination={false}
            showHeader={false}
            locale={{ emptyText: null }}
        />
    }

    return (<Fragment>
        <a target="_blank" href="https://www.yuque.com/vipersec/help/cr9w1rgb3pyvvnt1">
            <QuestionCircleOutlined
                style={{
                    fontSize: 16,
                    top: cssCalc(`${resizeUpHeight} - 28px`),
                    right: 20,
                    position: 'absolute',
                    zIndex: 100,
                }} />
        </a>
        {/*<Resizable*/}
        {/*    enable={{*/}
        {/*        top: false,*/}
        {/*        right: false,*/}
        {/*        bottom: true,*/}
        {/*        left: false,*/}
        {/*        topRight: false,*/}
        {/*        bottomRight: false,*/}
        {/*        bottomLeft: false,*/}
        {/*        topLeft: false*/}
        {/*    }}*/}
        {/*    size={{ height: cssCalc(`${Upheight}`) }}*/}
        {/*    onResizeStop={(e, direction, ref, d) => {*/}
        {/*        console.log(direction);*/}
        {/*        console.log(d.height);*/}
        {/*        if (d.height < 0) {*/}
        {/*            setResizeUpHeight(`- ${-d.height}px`);*/}
        {/*            setResizeDownHeight(`+ ${-d.height}px`);*/}
        {/*        } else {*/}
        {/*            setResizeUpHeight(`+ ${d.height}px`);*/}
        {/*            setResizeDownHeight(`- ${d.height}px`);*/}
        {/*        }*/}
        {/*    }}*/}
        {/*>*/}
        <Table
            loading={!heatbeatsocketalive}
            dataSource={onlyShowSessionModel ? hostAndSessionList.map(record => {
                if (record.session.length > 0 || record.ipaddress === '255.255.255.255') {
                    return { ...record }
                }
                return null
            }).filter(record => !!record) : hostAndSessionList}
            columns={hostAndSessionTableColumns}
            expandable={{
                onExpand: (expanded, record) => {
                    handleExpand(expanded, record.ipaddress)
                },
                expandedRowKeys: expandedRowKeys,
                expandRowByClick: true,
                expandedRowRender: sessionRowRender,
                rowExpandable: record => record.session.length > 0,
                expandIcon: ({ expanded, onExpand, record }) => null,
            }}

            scroll={{ y: cssCalc(`${resizeUpHeight}`) }}
            style={{
                overflow: 'auto', minHeight: cssCalc(`${resizeUpHeight}`), maxHeight: cssCalc(`${resizeUpHeight}`),
            }}
            rowKey="ipaddress"
            size="small"
            locale={{ emptyText: null }}
            pagination={false}
            showHeader={false}
        />
        {/*</Resizable>*/}
        <Modal
            mask={false}
            style={{ top: 32 }}
            width="90vw"
            destroyOnClose
            visible={runModuleModalVisable}
            onCancel={() => setRunModuleModalVisable(false)}
            footer={null}
            bodyStyle={{ padding: '0px 0px 0px 0px' }}
        >
            <RunModuleMemo closeModel={() => setRunModuleModalVisable(false)} />
        </Modal>
        <Modal
            style={{ top: 32 }}
            width="70vw"
            destroyOnClose
            visible={sessionInfoModalVisable}
            onCancel={() => setSessionInfoModalVisable(false)}
            footer={null}
            bodyStyle={{ padding: '8px 8px 8px 8px' }}
        >
            <SessionInfoMemo />
        </Modal>
        <Modal
            style={{ top: 32 }}
            width="80vw"
            destroyOnClose
            visible={fileSessionModalVisable}
            onCancel={() => setFileSessionModalVisable(false)}
            footer={null}
            bodyStyle={{ padding: '8px 0px 0px 0px' }}
        >
            <FileSessionMemo />
        </Modal>
        <Modal
            title={formatText('app.hostandsession.session.Route')}
            style={{ top: 32 }}
            width="70vw"
            destroyOnClose
            visible={routeModalVisable}
            onCancel={() => setRouteModalVisable(false)}
            footer={null}
            bodyStyle={{ padding: '0px 0px 16px 0px' }}
        >
            <MsfRouteMemo />
        </Modal>
        <Modal
            title={formatText('app.hostandsession.session.PortFwd')}
            style={{ top: 32 }}
            width="80vw"
            destroyOnClose
            visible={portFwdModalVisable}
            onCancel={() => setPortFwdModalVisable(false)}
            footer={null}
            bodyStyle={{ padding: '0px 0px 16px 0px' }}
        >
            <PortFwdMemo />
        </Modal>
        <Modal
            title={formatText('app.hostandsession.session.Transport')}
            style={{ top: 32 }}
            width="80vw"
            destroyOnClose
            visible={transportModalVisable}
            onCancel={() => setTransportModalVisable(false)}
            footer={null}
            bodyStyle={{ padding: '0px 0px 16px 0px' }}
        >
            <TransportMemo closeModal={closeTransportModel} />
        </Modal>
        <Modal
            style={{ top: 32 }}
            width="70vw"
            destroyOnClose
            visible={sessionIOModalVisable}
            onCancel={() => setSessionIOModalVisable(false)}
            footer={null}
            bodyStyle={{ padding: '0px 0px 0px 0px' }}
        >
            <SessionIOMemo />
        </Modal>
        <Modal
            style={{ top: 32 }}
            width="80vw"
            destroyOnClose
            visible={hostRunningInfoModalVisable}
            onCancel={() => setHostRunningInfoModalVisable(false)}
            footer={null}
            bodyStyle={{ padding: '8px 8px 8px 8px' }}
        >
            <HostRunningInfoMemo />
        </Modal>
        <Modal
            title={formatText('app.hostandsession.host.HostInfo')}
            style={{ top: 32 }}
            width="50vw"
            destroyOnClose
            visible={hostInfoModalVisable}
            onCancel={() => setHostInfoModalVisable(false)}
            footer={null}
            bodyStyle={{ padding: '8px 8px 8px 8px' }}
        >
            <HostInfoMemo />
        </Modal>
        <Modal
            title={formatText('app.hostandsession.host.PortService')}
            style={{ top: 32 }}
            width="70vw"
            destroyOnClose
            visible={portServiceModalVisable}
            onCancel={() => setPortServiceModalVisable(false)}
            footer={null}
            bodyStyle={{ padding: '0px 8px 0px 8px' }}
        >
            <PortServiceMemo />
        </Modal>
        <Modal
            title={formatText('app.hostandsession.host.Vulnerability')}
            style={{ top: 32 }}
            width="70vw"
            destroyOnClose
            visible={vulnerabilityModalVisable}
            onCancel={() => setVulnerabilityModalVisable(false)}
            footer={null}
            bodyStyle={{ padding: '0px 0px 0px 0px' }}
        >
            <VulnerabilityMemo />
        </Modal>
        <Modal
            style={{
                position: 'absolute', left: '320px', top: 48,
            }}
            bodyStyle={{ padding: '0px 0px 0px 0px' }}
            destroyOnClose
            visible={updateHostModalVisable}
            footer={null}
            mask={false}
            onCancel={() => setUpdateHostModalVisable(false)}
        >
            <UpdateHostMemo closeModal={() => setUpdateHostModalVisable(false)} />
        </Modal>
    </Fragment>)
}

const TabsBottom = () => {
    console.log('TabsBottom')
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
        marginLeft: '-6px', marginRight: '-6px',
    }
    const tabPanespanSytle = {
        marginLeft: '-4px',
    }

    return (<Fragment>
        <Tabs style={{ marginTop: 4, marginRight: 1, marginLeft: 1 }} type="card" onChange={tabActiveOnChange}>
            <TabPane
                tab={<div style={tabPanedivSytle}>
                    <FundViewOutlined />
                    <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.Notices')}</span>
                </div>}
                key="Notices"
            >
                <Row gutter={0}>
                    <Col span={13}>
                        <RealTimeModuleResultMemo />
                    </Col>
                    <Col span={11}>
                        <RealTimeNoticesMemo />
                    </Col>
                </Row>
            </TabPane>
            <TabPane
                tab={<div style={tabPanedivSytle}>
                    <TaskQueueTagMemo />
                    <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.JobList')}</span>
                </div>}
                key="JobList"
            >
                <RealTimeJobsMemo />
            </TabPane>
            <TabPane
                tab={<div style={tabPanedivSytle}>
                    <CustomerServiceOutlined />
                    <span
                        style={tabPanespanSytle}>{formatText('app.hostandsession.tab.PayloadAndHandler')}</span>
                </div>}
                key="PayloadAndHandler"
            >
                <PayloadAndHandlerMemo onRef={payloadandhandlerRef} />
            </TabPane>
            <TabPane
                tab={<div style={tabPanedivSytle}>
                    <StopOutlined />
                    <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.IPFilter')}</span>
                </div>}
                key="IPFilter"
            >
                <IPFilterMemo onRef={ipfileterRef} />
            </TabPane>
            <TabPane
                tab={<div style={tabPanedivSytle}>
                    <CloudDownloadOutlined />
                    <span style={tabPanespanSytle}>WebDelivery</span>
                </div>}
                key="WebDelivery"
            >
                <WebDeliveryMemo onRef={webDeliveryRef} />
            </TabPane>
            <TabPane
                tab={<div style={tabPanedivSytle}>
                    <FolderOpenOutlined />
                    <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.FileMsf')}</span>
                </div>}
                key="FileMsf"
            >
                <FileMsfMemo onRef={filemsfRef} />
            </TabPane>
            <TabPane
                tab={<div style={tabPanedivSytle}>
                    <DeploymentUnitOutlined />
                    <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.Network')}</span>
                </div>}
                key="Network"
            >
                <NetworkMemo />
            </TabPane>
            <TabPane
                tab={<div style={tabPanedivSytle}>
                    <RobotOutlined />
                    <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.AutoRobot')}</span>
                </div>}
                key="AutoRobot"
            >
                <AutoRobotMemo />
            </TabPane>
            <TabPane
                tab={<div style={tabPanedivSytle}>
                    <SisternodeOutlined />
                    <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.MsfSocks')}</span>
                </div>}
                key="MsfSocks"
            >
                <MsfSocksMemo />
            </TabPane>
            <TabPane
                tab={<div style={tabPanedivSytle}>
                    <KeyOutlined />
                    <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.Credential')}</span>
                </div>}
                key="Credential"
            >
                <CredentialMemo />
            </TabPane>
            <TabPane
                tab={<div style={tabPanedivSytle}>
                    <CodeOutlined />
                    <span style={tabPanespanSytle}>MSFCONSOLE</span>
                </div>}
                key="MsfConsole"
                // forceRender
            >
                <MsfconsoleMemo />
            </TabPane>
            <TabPane
                tab={<div style={tabPanedivSytle}>
                    <RadarChartOutlined />
                    <span style={tabPanespanSytle}>{formatText('app.hostandsession.tab.BotScan')}</span>
                </div>}
                key="BotScan"
            >
                <BotScan />
            </TabPane>
            <TabPane
                tab={<div style={tabPanedivSytle}>
                    <MonitorOutlined />
                    <span
                        style={tabPanespanSytle}>{formatText('app.hostandsession.tab.passivescan')}</span>
                </div>}
                key="ProxyHttpScan"
            >
                <ProxyHttpScanMemo />
            </TabPane>
            <TabPane
                tab={<div style={tabPanedivSytle}>
                    <SettingOutlined />
                    <span
                        style={tabPanespanSytle}>{formatText('app.hostandsession.tab.SystemSetting')}</span>
                </div>}
                key="SystemSetting"
            >
                <SystemSettingMemo />
            </TabPane>
        </Tabs>
    </Fragment>)
}


const FloatingButtons = () => {
    const [showMsfconsoleWindow, setShowMsfconsoleWindow] = useState(false)
    const [showNetworkWindow, setShowNetworkWindow] = useState(false)
    const [onlyShowSession, setOnlyShowSession] = useLocalStorageState('only-show-session', false)
    const { onlyShowSessionModel, setOnlyShowSessionModel } = useModel('HostAndSessionModel', model => ({
        onlyShowSessionModel: model.onlyShowSessionModel, setOnlyShowSessionModel: model.setOnlyShowSessionModel,
    }))
    const {
        resizeUpHeight, setResizeUpHeight, setResizeDownHeight,
    } = useModel('Resize', model => ({
        setResizeUpHeight: model.setResizeUpHeight,
        resizeUpHeight: model.resizeUpHeight,
        setResizeDownHeight: model.setResizeDownHeight,
    }))

    const LangSwitch = () => {
        const lang = getLocale()
        if (lang === 'en-US') {
            return <Button
                style={{ width: 40 }}
                onClick={() => setLocale('zh-CN', true)}>
                <div style={{ marginLeft: -4 }}>中</div>
            </Button>
        } else {
            return <Button
                style={{ width: 40 }}
                onClick={() => setLocale('en-US', true)}>
                <div style={{ marginLeft: -4 }}>En</div>
            </Button>
        }
    }

    return <Fragment>
        {showNetworkWindow ? <NewWindow
            height={window.innerHeight / 10 * 8}
            width={window.innerWidth / 10 * 8}
            title={formatText('app.hostandsession.tab.Network')}
            onClose={() => setShowNetworkWindow(false)}
        >
            <NetworkWindowMemo />
        </NewWindow> : null}
        {showMsfconsoleWindow ? <NewWindow
            height={window.innerHeight / 10 * 6}
            width={window.innerWidth / 10 * 6}
            title="MSFCONSOLE"
            onClose={() => setShowMsfconsoleWindow(false)}
        >
            <MsfConsoleXTermMemo />
        </NewWindow> : null}
        <Space
            direction="vertical"
            style={{
                top: 8, right: 8, position: 'fixed', zIndex: 100,
            }}
        >
            <LangSwitch />
            {showMsfconsoleWindow ? <Button
                style={{ width: 40 }}
                danger
                onClick={() => setShowMsfconsoleWindow(!showMsfconsoleWindow)}
                icon={<CodeOutlined />}
            /> : <Button
                style={{ width: 40 }}
                onClick={() => setShowMsfconsoleWindow(!showMsfconsoleWindow)}
                icon={<CodeOutlined />}
            />}
            {showNetworkWindow ? <Button
                style={{ width: 40 }}
                danger
                onClick={() => setShowNetworkWindow(!showNetworkWindow)}
                icon={<DeploymentUnitOutlined />}
            /> : <Button
                style={{ width: 40 }}
                onClick={() => setShowNetworkWindow(!showNetworkWindow)}
                icon={<DeploymentUnitOutlined />}
            />}
            {onlyShowSessionModel ? <Button
                style={{ width: 40 }}
                onClick={() => {
                    setOnlyShowSession(!onlyShowSessionModel)
                    setOnlyShowSessionModel(!onlyShowSessionModel)
                    // location.reload();
                }}
                icon={<MinusOutlined />}
            /> : <Button
                style={{ width: 40 }}
                onClick={() => {
                    setOnlyShowSession(!onlyShowSession)
                    setOnlyShowSessionModel(!onlyShowSession)
                }}
                icon={<AlignLeftOutlined />}
            />}
            {resizeUpHeight === '28vh' ? <Button
                style={{ width: 40 }}
                onClick={() => {
                    setResizeUpHeight('48vh')
                    setResizeDownHeight(`100vh - 44px - 48vh`)
                }}
                icon={<ColumnHeightOutlined />}
            /> : <Button
                style={{ width: 40 }}
                onClick={() => {
                    setResizeUpHeight('28vh')
                    setResizeDownHeight(`100vh - 44px - 28vh`)
                }}
                icon={<VerticalAlignMiddleOutlined />}
            />}
        </Space>
    </Fragment>
}

const SessionInfo = () => {
    console.log('SessionInfo')
    const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
        hostAndSessionActive: model.hostAndSessionActive,
    }))
    const [sessionInfoActive, setSessionInfoActive] = useState({
        sessionid: -1,
        whoami: null,
        is_system: false,
        is_admin: false,
        is_in_admin_group: false,
        is_in_domain: false,
        is_uac_enable: false,
        uac_level: 0,
        integrity: 'low',

        pid: -1,
        pname: null,
        ppath: null,
        puser: null,
        parch: null,
        processes: [],
        load_powershell: false,
        load_python: false,

        domain: null,

        type: 'meterpreter',
        session_host: null,
        tunnel_local: null,
        tunnel_peer: null,
        tunnel_peer_ip: null,
        tunnel_peer_locate_zh: null,
        tunnel_peer_locate_en: null,
        tunnel_peer_asn: null,
        via_exploit: null,
        via_payload: null,
        info: null,
        user: null,
        arch: null,
        platform: null,
        fromnow: 0,
        computer: null,
        os: null,
        os_short: null,
    })
    const [processes, setProcesses] = useState([])

    const initListSessionInfoReq = useRequest(() => getMsgrpcSessionAPI({ sessionid: hostAndSessionActive.session.id }), {
        onSuccess: (result, params) => {
            setSessionInfoActive(result)
            setProcesses(result.processes)
        }, onError: (error, params) => {
        },
    })

    const updateSessionInfoReq = useRequest(putMsgrpcSessionAPI, {
        manual: true, onSuccess: (result, params) => {
            setSessionInfoActive(result)
            setProcesses(result.processes)
        }, onError: (error, params) => {
        },
    })

    const integrity_to_tag = {
        low: <Tag color="volcano">{formatText('app.hostandsession.low')}</Tag>,
        medium: <Tag color="orange">{formatText('app.hostandsession.medium')}</Tag>,
        high: <Tag color="green">{formatText('app.hostandsession.high')}</Tag>,
        system: <Tag color="green">{formatText('app.hostandsession.system')}</Tag>,
    }

    const is_in_admin_group_to_tag = flag => {
        if (flag === null) {
            return <Tag>{formatText('app.hostandsession.unknown')}</Tag>
        } else if (flag === true) {
            return <Tag color="green">{formatText('app.hostandsession.yes')}</Tag>
        } else if (flag === false) {
            return <Tag color="volcano">{formatText('app.hostandsession.no')}</Tag>
        }
    }
    const uac_to_tag = {
        '-1': <Tag color="red">{formatText('app.hostandsession.unknown')}</Tag>,
        '0': <Tag color="green">{formatText('app.hostandsession.close')}</Tag>,
        '1': <Tag color="magenta">{formatText('app.hostandsession.alwaysnotify')}</Tag>,
        '2': <Tag color="magenta">{formatText('app.hostandsession.alwaysnotify')}</Tag>,
        '3': <Tag color="magenta">{formatText('app.hostandsession.alwaysnotify')}</Tag>,
        '4': <Tag color="magenta">{formatText('app.hostandsession.alwaysnotify')}</Tag>,
        '5': <Tag color="orange">{formatText('app.hostandsession.default')}</Tag>,
    }
    const processColumns = [{
        title: 'PID', dataIndex: 'pid', width: 80, sorter: (a, b) => a.pid >= b.pid,
    }, {
        title: 'PPID', dataIndex: 'ppid', width: 80, sorter: (a, b) => a.ppid >= b.ppid,
    }, {
        title: 'NAME', dataIndex: 'name', sorter: (a, b) => a.name >= b.name,
    }, {
        title: 'PATH', dataIndex: 'path',
    }, {
        title: 'USER', dataIndex: 'user', sorter: (a, b) => a.user >= b.user,
    }, {
        title: 'ARCH', width: 64, dataIndex: 'arch', sorter: (a, b) => a.arch >= b.arch,
    }, {
        dataIndex: 'operation', width: 80, render: (text, record) => (<Popover
            style={{ width: '50vw' }}
            arrowPointAtCenter
            placement="left"
            content={<PostModuleMemo
                loadpath="MODULES.DefenseEvasion_ProcessInjection_ProcessHandle"
                hostAndSessionActive={hostAndSessionActive}
                initialValues={{ PID: record.pid }}
            />}
            title={formatText('app.hostandsession.processoper')}
            trigger="click"
        >
            <a>{formatText('app.hostandsession.processoper')}</a>
        </Popover>),
    }]

    const os_tag_new = sessionInfoActive.platform === 'windows' ? (<Tag color="blue" style={{ marginLeft: -6 }}>
        <MyIcon
            type="icon-windows"
            style={{
                marginBottom: 0, marginRight: 4, marginLeft: -2, fontSize: '14px',
            }}
        />
        {sessionInfoActive.os}
    </Tag>) : (<Tag color="magenta" style={{ marginLeft: -6 }}>
        <MyIcon
            type="icon-linux"
            style={{
                fontSize: '14px', marginRight: 4, marginLeft: -2,
            }}
        />
        {sessionInfoActive.os}
    </Tag>)

    const fromnowTime = (moment().unix() - sessionInfoActive.fromnow) * 1000

    const handleProcessesSearch = text => {
        const reg = new RegExp(text, 'gi')
        const afterFilterList = sessionInfoActive.processes.map(record => {
            let pid = false
            let ppid = false
            let name = false
            let path = false
            try {
                pid = record.pid.toString().match(reg)
                ppid = record.ppid.toString().match(reg)
                name = record.name.match(reg)
                path = record.path.match(reg)
            } catch (error) {
            }
            if (pid || ppid || name || path) {
                return { ...record }
            }
            return null
        }).filter(record => !!record)
        setProcesses(afterFilterList)
    }

    const commTag = sessionInfoActive.comm_channel_session === null ? null : (<Tag
        color="gold"
        style={{
            cursor: 'pointer', marginLeft: -6,
        }}
    ><SubnodeOutlined /><span>{sessionInfoActive.comm_channel_session}</span>
    </Tag>)
    return (<Fragment>
        <DocIconInDiv url="https://www.yuque.com/vipersec/help/pf5bz1" />
        <Tabs defaultActiveKey="sessioninfo" size="small">
            <TabPane tab={formatText('app.hostandsession.session.SessionInfo')} key="sessioninfo">
                <Descriptions
                    style={{ marginTop: -8, width: '100%' }}
                    size="small"
                    column={12}
                    bordered
                    loading={initListSessionInfoReq.loading || updateSessionInfoReq.loading}
                >
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.heartbeat')} span={4}>
                        <Tag color="cyan">{moment(fromnowTime).format('YYYY-MM-DD HH:mm')}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="ID" span={4}>
                        {SidTag(sessionInfoActive.sessionid)}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.hostip')} span={8}>
                        <strong style={{ color: '#d8bd14' }}>{sessionInfoActive.session_host}</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Arch" span={4}>
                        {sessionInfoActive.arch}
                    </Descriptions.Item>
                    <Descriptions.Item label="OS" span={8}>
                        {os_tag_new}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.adminright')} span={4}>
                        {sessionInfoActive.is_admin ? (
                            <Tag color="green">{formatText('app.hostandsession.yes')}</Tag>) : (
                            <Tag color="volcano">{formatText('app.hostandsession.no')}</Tag>)}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.localadmin')} span={4}>
                        {is_in_admin_group_to_tag(sessionInfoActive.is_in_admin_group)}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.user')} span={4}>
                        {sessionInfoActive.user}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.is_uac_enable')} span={4}>
                        {sessionInfoActive.is_uac_enable ? (
                            <Tag color="magenta">{formatText('app.core.open')}</Tag>) : (
                            <Tag color="green">{formatText('app.core.close')}</Tag>)}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.uac_level')} span={4}>
                        {uac_to_tag[sessionInfoActive.uac_level.toString()]}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.integrity')} span={4}>
                        {sessionInfoActive.integrity === null ? (
                            <Tag>未知</Tag>) : (integrity_to_tag[sessionInfoActive.integrity])}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.is_in_domain')} span={4}>
                        {sessionInfoActive.is_in_domain ? (
                            <Tag color="lime">{formatText('app.hostandsession.yes')}</Tag>) : (
                            <Tag color="magenta">{formatText('app.hostandsession.no')}</Tag>)}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.domain')} span={4}>
                        {sessionInfoActive.domain}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.computer')} span={4}>
                        {sessionInfoActive.computer}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.tunnel_peer')} span={4}>
                        {sessionInfoActive.tunnel_peer}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.tunnel_local')} span={4}>
                        {sessionInfoActive.tunnel_local}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.comm_channel_session')}
                                       span={4}>
                        {commTag}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.tunnel_peer_locate')}
                                       span={12}>
                        {getSessionlocate(sessionInfoActive)}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.via_exploit')} span={6}>
                        {sessionInfoActive.via_exploit}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.via_payload')} span={6}>
                        {sessionInfoActive.via_payload}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.load_powershell')}
                                       span={6}>
                        {sessionInfoActive.load_powershell ? (
                            <Tag color="lime">{formatText('app.hostandsession.sessioninfo.loaded')}</Tag>) : (
                            <Tag>{formatText('app.hostandsession.sessioninfo.unload')}</Tag>)}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.load_python')} span={6}>
                        {sessionInfoActive.load_python ?
                            <Tag color="lime">{formatText('app.hostandsession.sessioninfo.loaded')}</Tag> :
                            <Tag>{formatText('app.hostandsession.sessioninfo.unload')}</Tag>}
                    </Descriptions.Item>
                </Descriptions>
                <Space style={{ marginTop: 8 }}>
                    <Button
                        type="primary"
                        icon={<SyncOutlined />}
                        loading={updateSessionInfoReq.loading || initListSessionInfoReq.loading}
                        onClick={() => updateSessionInfoReq.run({ sessionid: hostAndSessionActive.session.id })}
                    >
                        {formatText('app.hostandsession.sessioninfo.update')}
                    </Button>
                </Space>
            </TabPane>
            <TabPane tab={formatText('app.hostandsession.sessioninfo.processes')} key="processes">
                <Input
                    allowClear
                    prefix={<SearchOutlined />}
                    style={{ width: '100%', marginTop: -8 }}
                    placeholder="PID/PPID/NAME/PATH"
                    onChange={e => {
                        handleProcessesSearch(e.target.value)
                    }}
                />
                <Table
                    style={{
                        marginTop: '8px',
                    }}
                    columns={processColumns}
                    dataSource={processes}
                    pagination={false}
                    scroll={{ y: '40vh' }}
                    size="small"
                />
                <Descriptions
                    style={{ marginTop: 8, width: '100%' }}
                    size="small"
                    column={12}
                    bordered
                    loading={updateSessionInfoReq.loading || initListSessionInfoReq.loading}
                >
                    <Descriptions.Item label="PID" span={4}>
                        {sessionInfoActive.pid}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.pname')} span={4}>
                        {sessionInfoActive.pname}
                    </Descriptions.Item>
                    <Descriptions.Item label={formatText('app.hostandsession.sessioninfo.ppath')} span={4}>
                        {sessionInfoActive.ppath}
                    </Descriptions.Item>
                </Descriptions>
                <Space style={{ marginTop: 8 }}>
                    <Button
                        type="primary"
                        icon={<SyncOutlined />}
                        loading={updateSessionInfoReq.loading || initListSessionInfoReq.loading}
                        onClick={() => updateSessionInfoReq.run({ sessionid: hostAndSessionActive.session.id })}
                    >
                        {formatText('app.hostandsession.sessioninfo.update')}
                    </Button>
                </Space>
            </TabPane>
        </Tabs>
    </Fragment>)
}

const SessionInfoMemo = memo(SessionInfo)

const SessionIO = () => {
    console.log('SessionIO')
    const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
        hostAndSessionActive: model.hostAndSessionActive,
    }))
    const [sessionIOOutput, setSessionIOOutput] = useState('')
    const [shellInput, setShellInput] = useState('')

    const updateSessionioReq = useRequest(putMsgrpcSessionioAPI, {
        manual: true, onSuccess: (result, params) => {
            if (result.buffer !== sessionIOOutput) {
                setSessionIOOutput(result.buffer)
                document.getElementById('sessionIOPre').scrollTop = document.getElementById('sessionIOPre').scrollHeight
            }
        }, onError: (error, params) => {
        },
    })

    if (hostAndSessionActive.session.id !== -1) {
        useInterval(() => updateSessionioReq.run({
            ipaddress: hostAndSessionActive.ipaddress, sessionid: hostAndSessionActive.session.id,
        }), 3000)
    }

    const initUpdateSessionioReq = useRequest(() => putMsgrpcSessionioAPI({
        ipaddress: hostAndSessionActive.ipaddress, sessionid: hostAndSessionActive.session.id,
    }), {
        onSuccess: (result, params) => {
            if (result.buffer !== sessionIOOutput) {
                setSessionIOOutput(result.buffer)
                document.getElementById('sessionIOPre').scrollTop = document.getElementById('sessionIOPre').scrollHeight
            }
        }, onError: (error, params) => {
        },
    })

    const createSessionioReq = useRequest(postMsgrpcSessionioAPI, {
        manual: true, onSuccess: (result, params) => {
            if (result.buffer !== sessionIOOutput) {
                setSessionIOOutput(result.buffer)
                setShellInput('')
                document.getElementById('sessionIOPre').scrollTop = document.getElementById('sessionIOPre').scrollHeight
            }
        }, onError: (error, params) => {
        },
    })

    const onCreateSessionio = input => {
        if (input === null || input === '') {
        } else {
            createSessionioReq.run({
                ipaddress: hostAndSessionActive.ipaddress, sessionid: hostAndSessionActive.session.id, input: input,
            })
        }
    }

    const destorySessionioReq = useRequest(deleteMsgrpcSessionioAPI, {
        manual: true, onSuccess: (result, params) => {
            setSessionIOOutput('')
        }, onError: (error, params) => {
        },
    })
    const sessiondisabled = hostAndSessionActive.session.id === -1

    return (<Card
        bodyStyle={{
            padding: '0px 0px 0px 0px', backgroundColor: '#000',
        }}
    >
        <DocIconInDivSessionIO url="https://www.yuque.com/vipersec/help/rwuako" />
        <pre id="sessionIOPre"
             style={{
                 padding: '0 0 0 0',
                 overflowX: 'hidden',
                 maxHeight: cssCalc('80vh - 32px'),
                 minHeight: cssCalc('80vh - 32px'),
                 whiteSpace: 'pre-wrap',
                 background: '#000',
                 marginBottom: 8,
             }}
        >
        {sessionIOOutput}
      </pre>
        <Space>
            <Button type="primary" size="small" onClick={() => onCreateSessionio('help')}>
                {formatText('app.hostandsession.sessionio.help')}
            </Button>
            <Button size="small" onClick={() => onCreateSessionio('keyscan_start')}>
                {formatText('app.hostandsession.sessionio.keyscan_start')}
            </Button>
            <Button size="small" onClick={() => onCreateSessionio('keyscan_dump')}>
                {formatText('app.hostandsession.sessionio.keyscan_dump')}
            </Button>
            <Button size="small" onClick={() => onCreateSessionio('keyscan_stop')}>
                {formatText('app.hostandsession.sessionio.keyscan_stop')}
            </Button>
            <Button size="small" onClick={() => onCreateSessionio('screenshot')}>
                {formatText('app.hostandsession.sessionio.screenshot')}
            </Button>
            <Button size="small" onClick={() => onCreateSessionio('webcam_snap')}>
                {formatText('app.hostandsession.sessionio.webcam_snap')}
            </Button>
            <Button size="small" onClick={() => onCreateSessionio('idletime')}>
                {formatText('app.hostandsession.sessionio.idletime')}
            </Button>
        </Space>
        <Space style={{ marginTop: 4 }}>
            <Button size="small" onClick={() => onCreateSessionio('sysinfo')}>
                SystemInfo
            </Button>
            <Button size="small" onClick={() => onCreateSessionio('hashdump')}>
                hashdump
            </Button>
            <Button size="small" onClick={() => onCreateSessionio('getsystem')}>
                {formatText('app.hostandsession.sessionio.getsystem')}
            </Button>
            <Button size="small" onClick={() => onCreateSessionio('load unhook')}>
                {formatText('app.hostandsession.sessionio.loadunhook')}
            </Button>
            <Button size="small" onClick={() => onCreateSessionio('load powershell')}>
                {formatText('app.hostandsession.sessionio.loadpowershell')}
            </Button>
            <Button size="small" onClick={() => onCreateSessionio('load python')}>
                {formatText('app.hostandsession.sessionio.loadpython')}
            </Button>
            <Button size="small" onClick={() => onCreateSessionio('python_reset')}>
                {formatText('app.hostandsession.sessionio.python_reset')}
            </Button>
        </Space>
        <Row style={{ marginTop: 8 }} gutter={8}>
            <Col xs={24} sm={20}>
                <Input
                    style={{ width: '100%', backgroundColor: '#000' }}
                    disabled={sessiondisabled}
                    placeholder=""
                    value={shellInput}
                    prefix={<Fragment>meterpreter<RightOutlined /></Fragment>}
                    onPressEnter={() => onCreateSessionio(shellInput)}
                    onChange={e => {
                        setShellInput(e.target.value)
                    }}
                />
            </Col>
            <Col xs={24} sm={4}>
                <Button
                    danger
                    block
                    icon={<DeleteOutlined />}
                    onClick={() => destorySessionioReq.run({ ipaddress: hostAndSessionActive.ipaddress })}
                >
                    {formatText('app.core.clear')}
                </Button>
            </Col>
        </Row>
    </Card>)
}

const SessionIOMemo = memo(SessionIO)

const MsfRoute = () => {
    console.log('MsfRoute')
    const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
        hostAndSessionActive: model.hostAndSessionActive,
    }))
    const [routeActive, setRouteActive] = useState([])
    const [autoRouteCheck, setAutoRouteCheck] = useState(false)

    const initListRouteReq = useRequest(() => getMsgrpcRouteAPI({ sessionid: hostAndSessionActive.session.id }), {
        onSuccess: (result, params) => {
            setRouteActive(result.route)
        }, onError: (error, params) => {
        },
    })
    const listRouteReq = useRequest(getMsgrpcRouteAPI, {
        manual: true, onSuccess: (result, params) => {
            setRouteActive(result.route)
        }, onError: (error, params) => {
        },
    })

    const createRouteReq = useRequest(postMsgrpcRouteAPI, {
        manual: true, onSuccess: (result, params) => {
            listRouteReq.run({ sessionid: hostAndSessionActive.session.id })
        }, onError: (error, params) => {
        },
    })

    const onCreateRoute = values => {
        createRouteReq.run({
            ...values, sessionid: hostAndSessionActive.session.id, autoroute: autoRouteCheck,
        })
    }

    const destoryRouteReq = useRequest(deleteMsgrpcRouteAPI, {
        manual: true, onSuccess: (result, params) => {
            listRouteReq.run({ sessionid: hostAndSessionActive.session.id })
        }, onError: (error, params) => {
        },
    })

    const onDestoryRoute = record => {
        destoryRouteReq.run({
            sessionid: record.session, subnet: record.subnet, netmask: record.netmask,
        })
    }
    const paginationProps = {
        simple: true, pageSize: 5,
    }

    return (<Fragment>
        <DocIconInDiv url="https://www.yuque.com/vipersec/help/rm3dgw" />
        <Table
            style={{
                overflow: 'auto', minHeight: cssCalc('45vh'), maxHeight: cssCalc('45vh'),
            }}
            size="small"
            rowKey="subnet"
            pagination={paginationProps}
            dataSource={routeActive}
            loading={listRouteReq.loading || destoryRouteReq.loading}
            columns={[{
                title: formatText('app.hostandsession.msfroute.subnet'), dataIndex: 'subnet', key: 'subnet',
            }, {
                title: formatText('app.hostandsession.msfroute.netmask'), dataIndex: 'netmask', key: 'netmask',
            }, {
                dataIndex: 'operation',
                width: 64,
                render: (text, record) => (<a style={{ color: 'red' }} onClick={() => onDestoryRoute(record)}>
                    {formatText('app.core.delete')}
                </a>),
            }]}
        />
        <Form
            style={{
                marginLeft: 16, marginTop: 8,
            }}
            layout="inline"
            onFinish={onCreateRoute}
            initialValues={{
                autoroute: false, netmask: '255.255.255.0',
            }}
        >
            <Form.Item
                label={formatText('app.hostandsession.msfroute.auto')}
                name="autoroute"
                valuePropName="checked">
                <Checkbox onChange={e => setAutoRouteCheck(e.target.checked)} />
            </Form.Item>
            <Form.Item
                label={formatText('app.hostandsession.msfroute.subnet')}
                name="subnet"
                rules={[{
                    required: !autoRouteCheck, message: formatText('app.hostandsession.msfroute.subnet.rule'),
                }]}
            >
                <Input style={{ width: 240 }} disabled={autoRouteCheck}
                       placeholder={formatText('app.hostandsession.msfroute.subnet.rule')} />
            </Form.Item>
            <Form.Item
                label={formatText('app.hostandsession.msfroute.netmask')}
                name="netmask"
                rules={[{
                    required: !autoRouteCheck, message: formatText('app.hostandsession.msfroute.netmask.rule'),
                }]}
            >
                <Input style={{ width: 240 }} disabled={autoRouteCheck}
                       placeholder={formatText('app.hostandsession.msfroute.netmask.rule')} />
            </Form.Item>
            <Form.Item>
                <Button
                    loading={createRouteReq.loading}
                    icon={<PlusOutlined />}
                    type="primary"
                    htmlType="submit"
                >
                    {formatText('app.core.add')}
                </Button>
            </Form.Item>
            <Form.Item>
                <Button
                    block
                    icon={<SyncOutlined />}
                    onClick={() => listRouteReq.run({ sessionid: hostAndSessionActive.session.id })}
                    loading={listRouteReq.loading}
                >
                    {formatText('app.core.refresh')}
                </Button>
            </Form.Item>
        </Form>
    </Fragment>)
}

const MsfRouteMemo = memo(MsfRoute)

const PortFwd = () => {
    console.log('PortFwd')
    const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
        hostAndSessionActive: model.hostAndSessionActive,
    }))
    const [portFwdActive, setPortFwdActive] = useState([])

    const initListPortFwdReq = useRequest(() => getMsgrpcPortFwdAPI({ sessionid: hostAndSessionActive.session.id }), {
        onSuccess: (result, params) => {
            setPortFwdActive(result)
        }, onError: (error, params) => {
        },
    })

    const listPortFwdReq = useRequest(getMsgrpcPortFwdAPI, {
        manual: true, onSuccess: (result, params) => {
            setPortFwdActive(result)
        }, onError: (error, params) => {
        },
    })

    const createPortFwdReq = useRequest(postMsgrpcPortFwdAPI, {
        manual: true, onSuccess: (result, params) => {
            listPortFwdReq.run({ sessionid: hostAndSessionActive.session.id })
        }, onError: (error, params) => {
        },
    })

    const onCreatePortFwdForward = values => {
        createPortFwdReq.run({
            ...values, sessionid: hostAndSessionActive.session.id, type: 'Forward',
        })
    }
    const onCreatePortFwdReverse = values => {
        createPortFwdReq.run({
            ...values, sessionid: hostAndSessionActive.session.id, type: 'Reverse',
        })
    }

    const destoryPortFwdReq = useRequest(deleteMsgrpcPortFwdAPI, {
        manual: true, onSuccess: (result, params) => {
            listPortFwdReq.run({ sessionid: hostAndSessionActive.session.id })
        }, onError: (error, params) => {
        },
    })

    return (<Fragment>
        <DocIconInDiv url="https://www.yuque.com/vipersec/help/gbgk7g" />
        <Table
            style={{
                overflow: 'auto', minHeight: cssCalc('30vh'), maxHeight: cssCalc('30vh'),
            }}
            size="small"
            rowKey="local"
            pagination={false}
            dataSource={portFwdActive}
            loading={listPortFwdReq.loading || destoryPortFwdReq.loading}
            columns={[{
                title: formatText('app.msfsocks.portfwd.type'),
                dataIndex: 'type',
                key: 'type',
                width: '10%',
                render: (text, record) => {
                    if (record.type === 'Forward') {
                        return (<Tag color="cyan">{formatText('app.msfsocks.portfwd.type.forword')}</Tag>)
                    }
                    return (<Tag color="geekblue">{formatText('app.msfsocks.portfwd.type.reverse')}</Tag>)
                },
            }, {
                title: formatText('app.msfsocks.portfwd.local'),
                dataIndex: 'local',
                key: 'local',
                render: (text, record) => {
                    if (record.type === 'Forward') {
                        return (<div>
                            <Tag style={{ marginRight: 8 }} color="green">
                                {formatText('app.msfsocks.portfwd.listen')}
                            </Tag>
                            <span>{`${record.lhost}:${record.lport}`}</span>
                        </div>)
                    }
                    return (<div>
                        <Tag style={{ marginRight: 8 }} color="gold">
                            {formatText('app.msfsocks.portfwd.target')}
                        </Tag>
                        <span>{`${record.lhost}:${record.lport}`}</span>
                    </div>)
                },
            }, {
                title: formatText('app.msfsocks.portfwd.remote'),
                dataIndex: 'remote',
                key: 'remote',
                render: (text, record) => {
                    if (record.type === 'Forward') {
                        return (<div>
                            <Tag style={{ marginRight: 8 }} color="gold">
                                {formatText('app.msfsocks.portfwd.target')}
                            </Tag>
                            <span>{`${record.rhost}:${record.rport}`}</span>
                        </div>)
                    }
                    return (<div>
                        <Tag style={{ marginRight: 8 }} color="green">
                            {formatText('app.msfsocks.portfwd.listen')}
                        </Tag>
                        <span>{`${record.rhost}:${record.rport}`}</span>
                    </div>)
                },
            }, {
                title: formatText('app.msfsocks.portfwd.tip'),
                dataIndex: 'remote',
                key: 'remote',
                render: (text, record) => {
                    return (<div>
                        <span>{`${record.tip}`}</span>
                    </div>)
                },
            }, {
                dataIndex: 'operation',
                width: '10%',
                render: (text, record) => (<a style={{ color: 'red' }} onClick={() => destoryPortFwdReq.run(record)}>
                    {formatText('app.core.delete')}
                </a>),
            }]}
        />
        <Row style={{ marginTop: 8 }}>
            <Tabs defaultActiveKey="Forward" size="small">
                <TabPane
                    tab={<span><SwapRightOutlined />{formatText('app.msfsocks.portfwd.type.forword')}</span>}
                    key="Forward"
                >
                    <Form style={{ marginLeft: 16 }} layout="inline" onFinish={onCreatePortFwdForward}>
                        <Form.Item
                            label={formatText('app.hostandsession.portfwd.forword.lport')}
                            name="lport"
                            rules={[{
                                required: true,
                                message: formatText('app.hostandsession.portfwd.forword.lport.rule'),
                            }]}
                        >
                            <InputNumber style={{ width: 120 }}
                                         placeholder={formatText('app.hostandsession.portfwd.forword.lport.ph')} />
                        </Form.Item>
                        <Form.Item
                            label={formatText('app.hostandsession.portfwd.forword.rhost')}
                            name="rhost"
                            rules={[{
                                required: true,
                                message: formatText('app.hostandsession.portfwd.forword.rhost.rule'),
                            }]}
                        >
                            <Input style={{ width: 160 }}
                                   placeholder={formatText('app.hostandsession.portfwd.forword.rhost.ph')} />
                        </Form.Item>
                        <Form.Item
                            label={formatText('app.hostandsession.portfwd.forword.rport')}
                            name="rport"
                            rules={[{
                                required: true,
                                message: formatText('app.hostandsession.portfwd.forword.rport.rule'),
                            }]}
                        >
                            <InputNumber style={{ width: 120 }}
                                         placeholder={formatText('app.hostandsession.portfwd.forword.rport.ph')} />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                htmlType="submit"
                                loading={createPortFwdReq.loading}
                            >
                                {formatText('app.core.add')}
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                block
                                icon={<SyncOutlined />}
                                onClick={() => listPortFwdReq.run({ sessionid: hostAndSessionActive.session.id })}
                                loading={listPortFwdReq.loading}
                            >
                                {formatText('app.core.refresh')}
                            </Button>
                        </Form.Item>
                    </Form>
                    <Paragraph
                        style={{ marginLeft: 16, marginTop: 16 }}
                        ellipsis={{
                            rows: 3, expandable: true,
                        }}
                    >
                        {formatText('app.hostandsession.portfwd.forword.doc.1')}
                        <br />
                        {formatText('app.hostandsession.portfwd.forword.doc.2')}
                    </Paragraph>
                </TabPane>
                <TabPane
                    tab={<span><SwapLeftOutlined />{formatText('app.msfsocks.portfwd.type.reverse')}</span>}
                    key="Reverse"
                >
                    <Form style={{ marginLeft: 16 }} layout="inline" onFinish={onCreatePortFwdReverse}>
                        <Form.Item
                            label={formatText('app.hostandsession.portfwd.reverse.lhost')}
                            name="lhost"
                            rules={[{
                                required: true,
                                message: formatText('app.hostandsession.portfwd.reverse.lhost.rule'),
                            }]}
                        >
                            <Input style={{ width: 160 }}
                                   placeholder={formatText('app.hostandsession.portfwd.reverse.lhost.ph')} />
                        </Form.Item>
                        <Form.Item
                            label={formatText('app.hostandsession.portfwd.reverse.lport')}
                            name="lport"
                            rules={[{
                                required: true,
                                message: formatText('app.hostandsession.portfwd.reverse.lport.rule'),
                            }]}
                        >
                            <InputNumber style={{ width: 120 }}
                                         placeholder={formatText('app.hostandsession.portfwd.reverse.lport.ph')} />
                        </Form.Item>
                        <Form.Item
                            label={formatText('app.hostandsession.portfwd.reverse.rport')}
                            name="rport"
                            rules={[{
                                required: true,
                                message: formatText('app.hostandsession.portfwd.reverse.rport.rule'),
                            }]}
                        >
                            <InputNumber style={{ width: 120 }}
                                         placeholder={formatText('app.hostandsession.portfwd.reverse.rport.ph')} />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                loading={createPortFwdReq.loading}
                                type="primary"
                                htmlType="submit"
                                icon={<PlusOutlined />}
                            >
                                {formatText('app.core.add')}
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                block
                                icon={<SyncOutlined />}
                                onClick={() => listPortFwdReq.run({ sessionid: hostAndSessionActive.session.id })}
                                loading={listPortFwdReq.loading}
                            >
                                {formatText('app.core.refresh')}
                            </Button>
                        </Form.Item>
                    </Form>
                    <Paragraph
                        style={{ marginLeft: 16, marginTop: 16 }}
                        ellipsis={{
                            rows: 3, expandable: true,
                        }}
                    >
                        {formatText('app.hostandsession.portfwd.reverse.doc.1')}
                        <br />
                        {formatText('app.hostandsession.portfwd.reverse.doc.2')}
                        <br />
                        {formatText('app.hostandsession.portfwd.reverse.doc.3')}
                    </Paragraph>
                </TabPane>
            </Tabs>
        </Row>
    </Fragment>)
}

const PortFwdMemo = memo(PortFwd)

const Transport = props => {
    console.log('Transport')
    const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
        hostAndSessionActive: model.hostAndSessionActive,
    }))
    const { closeModal } = props
    const [session_exp, setSession_exp] = useState(0)
    const [transports, setTransports] = useState([])
    const [handlers, setHandlers] = useState([])

    const initListTransportReq = useRequest(() => getMsgrpcTransportAPI({ sessionid: hostAndSessionActive.session.id }), {
        onSuccess: (result, params) => {
            setSession_exp(result.session_exp)
            setTransports(result.transports)
            setHandlers(result.handlers)
        }, onError: (error, params) => {
        },
    })

    const listTransportReq = useRequest(getMsgrpcTransportAPI, {
        manual: true, onSuccess: (result, params) => {
            setSession_exp(result.session_exp)
            setTransports(result.transports)
            setHandlers(result.handlers)
        }, onError: (error, params) => {
        },
    })

    const createTransportReq = useRequest(postMsgrpcTransportAPI, {
        manual: true, onSuccess: (result, params) => {
            listTransportReq.run({ sessionid: hostAndSessionActive.session.id })
        }, onError: (error, params) => {
        },
    })

    const onCreateTransport = values => {
        createTransportReq.run({ ...values, sessionid: hostAndSessionActive.session.id })
    }

    const updateTransportReq = useRequest(putMsgrpcTransportAPI, {
        manual: true, onSuccess: (result, params) => {
            closeModal()
        }, onError: (error, params) => {
        },
    })

    const onUpdateTransport = action => {
        updateTransportReq.run({ action, sessionid: hostAndSessionActive.session.id, type: 'Reverse' })
    }

    const onSleepSession = values => {
        updateTransportReq.run({
            action: 'sleep', ...values, sessionid: hostAndSessionActive.session.id,
        })
    }

    const destoryTransportReq = useRequest(deleteMsgrpcTransportAPI, {
        manual: true, onSuccess: (result, params) => {
            listPortFwdReq.run({ sessionid: hostAndSessionActive.session.id })
        }, onError: (error, params) => {
        },
    })

    const onDestoryTransport = record => {
        destoryTransportReq.run({
            ...record, sessionid: hostAndSessionActive.session.id,
        })
    }

    const expandedRowRender = record => (<Descriptions size="small" column={3} bordered>
        {record.proxy_host !== null && record.proxy_host !== undefined ? (
            <Descriptions.Item label="Proxy Host">{record.proxy_host}</Descriptions.Item>) : null}
        {record.proxy_user !== null && record.proxy_user !== undefined ? (
            <Descriptions.Item label="Proxy User">{record.proxy_user}</Descriptions.Item>) : null}
        {record.proxy_pass !== null && record.proxy_pass !== undefined ? (
            <Descriptions.Item label="Proxy Pass">{record.proxy_pass}</Descriptions.Item>) : null}
        {record.ua !== null && record.ua !== undefined ? (
            <Descriptions.Item label="User Agent">{record.ua}</Descriptions.Item>) : null}
        {record.cert_hash !== null && record.cert_hash !== undefined ? (
            <Descriptions.Item label="Cert Hash">{record.cert_hash}</Descriptions.Item>) : null}
    </Descriptions>)

    const selectOptions = []
    for (const oneselect of handlers) {
        if (oneselect.value.includes('rc4')) {
            // rc4类传输协议无法使用
        } else {
            selectOptions.push(<Option value={oneselect.value}>{getOptionTag(oneselect)}</Option>)
        }
    }
    const time_exp = moment().unix() + session_exp

    return (<Fragment>
        <DocIconInDiv url="https://www.yuque.com/vipersec/help/xvarma" />
        <Table
            style={{
                overflow: 'auto', minHeight: cssCalc('45vh'), maxHeight: cssCalc('45vh'),
            }}
            size="small"
            rowKey="url"
            pagination={false}
            dataSource={transports}
            loading={initListTransportReq.loading || listTransportReq.loading || createTransportReq.loading || updateTransportReq.loading || destoryTransportReq.loading}
            expandedRowRender={expandedRowRender}
            columns={[{
                dataIndex: 'active', width: 32, render: (text, record) => {
                    if (record.active === true) {
                        return (<Avatar
                            shape="square"
                            size={20}
                            style={{ backgroundColor: '#1890ff' }}
                            icon={<CheckOutlined />}
                        />)
                    } else {
                        return null
                    }
                },
            }, {
                title: 'URL', dataIndex: 'url', key: 'url', ellipsis: true, render: (text, record) => {
                    if (text.startsWith('tcp://')) {
                        return <span style={{ color: 'orange' }}>{text}</span>
                    } else if (text.startsWith('http://')) {
                        return <span style={{ color: 'red' }}>{text}</span>
                    } else if (text.startsWith('https://')) {
                        return <span style={{ color: 'green' }}>{text}</span>
                    } else {
                        return <span>{text}</span>
                    }
                },
            }, {
                title: formatText('app.hostandsession.transport.comm_timeout'),
                dataIndex: 'comm_timeout',
                width: 108,
                render: (text, record) => {
                    return <span>{text} s</span>
                },
            }, {
                title: formatText('app.hostandsession.transport.retry_total'),
                dataIndex: 'retry_total',
                width: 108,
                render: (text, record) => {
                    return <span>{text}</span>
                },
            }, {
                title: formatText('app.hostandsession.transport.retry_wait'),
                dataIndex: 'retry_wait',
                width: 108,
                render: (text, record) => {
                    return <span>{text} s</span>
                },
            }, {
                title: formatText('app.hostandsession.transport.session_exp'),
                dataIndex: 'session_exp',
                width: 136,
                render: (text, record) => {
                    return (<Tag
                        color="cyan"
                    >
                        {moment(time_exp * 1000).format('YYYY-MM-DD HH:mm')}
                    </Tag>)
                },
            }, {
                dataIndex: 'operation', width: 56, render: (text, record) => {
                    if (record.active) {
                        return null
                    }

                    return (<a style={{ color: 'red' }} onClick={() => onDestoryTransport(record)}>
                        {formatText('app.core.delete')}
                    </a>)
                },
            }]}
        />
        <Form
            style={{
                marginLeft: 16, marginTop: 8, display: 'flex',
            }}
            layout="inline"
            onFinish={onCreateTransport}
            initialValues={{}}
        >
            <Form.Item
                label={formatText('app.hostandsession.transport.handler')}
                name="handler"
                rules={[{ required: true, message: formatText('app.hostandsession.transport.handler.rule') }]}
            >
                <Select
                    allowClear
                    style={{
                        width: 'calc(40vw)',
                    }}
                >
                    {selectOptions}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button
                    loading={createTransportReq.loading}
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                >
                    {formatText('app.core.add')}
                </Button>
            </Form.Item>
            <Form.Item>
                <Popconfirm
                    title={formatText('app.hostandsession.transport.update.tip')}
                    onConfirm={() => onUpdateTransport('prev')}
                >
                    <Button loading={updateTransportReq.loading} danger icon={<UpOutlined />}>
                        {formatText('app.hostandsession.transport.update')}
                    </Button>
                </Popconfirm>
            </Form.Item>
            <Form.Item>
                <Popconfirm
                    title={formatText('app.hostandsession.transport.update.tip')}
                    onConfirm={() => onUpdateTransport('next')}
                >
                    <Button loading={updateTransportReq.loading} danger icon={<DownOutlined />}>
                        {formatText('app.hostandsession.transport.update')}
                    </Button>
                </Popconfirm>
            </Form.Item>
            <Form.Item>
                <Button
                    block
                    icon={<SyncOutlined />}
                    onClick={() => listTransportReq.run({ sessionid: hostAndSessionActive.session.id })}
                    loading={listTransportReq.loading}
                >
                    {formatText('app.core.refresh')}
                </Button>
            </Form.Item>
        </Form>
        <Form
            style={{
                marginLeft: 16, marginTop: 8, display: 'flex',
            }}
            layout="inline"
            onFinish={onSleepSession}
            initialValues={{}}
        >
            <Form.Item name="sleep"
                       rules={[{ required: true, message: formatText('app.hostandsession.transport.sleep.rule') }]}
                       label={formatText('app.hostandsession.transport.sleep')}>
                <Select style={{ width: 120 }}>
                    <Option value={60}>{formatText('app.hostandsession.transport.1min')}</Option>
                    <Option value={60 * 60}>{formatText('app.hostandsession.transport.1hour')}</Option>
                    <Option value={60 * 60 * 6}>{formatText('app.hostandsession.transport.6hour')}</Option>
                    <Option value={60 * 60 * 12}>{formatText('app.hostandsession.transport.12hour')}</Option>
                    <Option value={60 * 60 * 24}>{formatText('app.hostandsession.transport.24hour')}</Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button
                    loading={updateTransportReq.loading}
                    danger
                    htmlType="submit"
                    icon={<RestOutlined />}
                >
                    {formatText('app.hostandsession.transport.sleep')}
                </Button>
            </Form.Item>
        </Form>
    </Fragment>)
}

const TransportMemo = memo(Transport)

const FileSession = () => {
    console.log('FileSession')
    const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
        hostAndSessionActive: model.hostAndSessionActive,
    }))

    const [fileSessionListActive, setFileSessionListActive] = useSessionStorageState(`filesession-${hostAndSessionActive.session.id}`, {
        path: null, entries: [],
    })


    // const [fileSessionListActive, setFileSessionListActive] = useState({
    //   path: null,
    //   entries: [],
    // });

    const [fileSessionInputPathActive, setFileSessionInputPathActive] = useState(fileSessionListActive.path)

    const createPostModuleActuatorReq = useRequest(postPostmodulePostModuleActuatorAPI, {
        manual: true, onSuccess: (result, params) => {
        }, onError: (error, params) => {
        },
    })

    const listFileSessionReq = useRequest(getMsgrpcFileSessionAPI, {
        manual: true, onSuccess: (result, params) => {
            setFileSessionListActive(result)
            try {
                setFileSessionInputPathActive(result.path)
            } catch (e) {
            }
        }, onError: (error, params) => {
        },
    })

    useEffect(() => {
        if (fileSessionListActive.path === null) {
            listFileSessionReq.run({ sessionid: hostAndSessionActive.session.id, operation: 'pwd' })
        }
    }, [])

    const onListFileSession = (sessionid, operation, filepath = null, dirpath = '/') => {
        if (operation === 'pwd') {
            listFileSessionReq.run({ sessionid, operation })
        } else if (operation === 'list') {
            listFileSessionReq.run({ sessionid, operation, dirpath })
        } else if (operation === 'download') {
            createPostModuleActuatorReq.run({
                ipaddress: hostAndSessionActive.ipaddress,
                loadpath: 'MODULES.FileSessionDownloadModule',
                sessionid: sessionid,
                custom_param: JSON.stringify({ SESSION_FILE: filepath }),
            })
        }
    }

    const listFileSessionRunReq = useRequest(getMsgrpcFileSessionAPI, {
        manual: true, onSuccess: (result, params) => {
        }, onError: (error, params) => {
        },
    })

    const onListFileSessionRun = (sessionid, operation, filepath = null, arg = '') => {
        if (operation === 'run') {
            listFileSessionRunReq.run({ sessionid, operation, filepath, arg })
        }
    }

    const copytoclipboard = filedata => {
        copy(filedata)
        msgsuccess('已拷贝到剪切板', 'Copyed to clipboard')
    }

    const updateFileSessionReq = useRequest(putMsgrpcFileSessionAPI, {
        manual: true, onSuccess: (result, params) => {
        }, onError: (error, params) => {
        },
    })

    const onUpdateFileSession = values => {
        updateFileSessionReq.run({
            sessionid: values.sessionid, filepath: values.filepath, filedata: values.filedata,
        })
    }

    const listFileSessionCatReq = useRequest(getMsgrpcFileSessionAPI, {
        manual: true, onSuccess: (result, params) => {
            Modal.info({
                icon: null,
                title: result.reason,
                mask: false,
                bodyStyle: { padding: 8 },
                style: { top: 32 },
                width: '70%',
                closable: true,
                footer: null,
                content: (<Form preserve={false} onFinish={onUpdateFileSession}>
                    <Form.Item name="filedata" initialValue={result.data}>
                        <TextArea
                            autoSize={{ minRows: 5, maxRows: 25 }}
                        />
                    </Form.Item>
                    <Space style={{ marginBottom: 0 }}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={updateFileSessionReq.loading}>
                                {formatMessage({ id: 'app.hostandsession.filesession.update' })}
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                onClick={() => copytoclipboard(result.data)}>
                                {formatMessage({ id: 'app.hostandsession.filesession.copy' })}
                            </Button>
                        </Form.Item>
                        <Form.Item name="sessionid" initialValue={hostAndSessionActive.session.id} />
                        <Form.Item name="filepath" initialValue={result.reason} />
                    </Space>
                </Form>),
                onOk() {
                },
            })
        }, onError: (error, params) => {
        },
    })

    const onListFileSessionCat = (sessionid, filepath = null) => {
        listFileSessionCatReq.run({ sessionid, operation: 'cat', filepath })
    }

    const onListFileSessionCd = (sessionid, operation, dirpath = '/') => {
        listFileSessionRunReq.run({ sessionid, operation, dirpath })
    }

    const createFileSessionReq = useRequest(postMsgrpcFileSessionAPI, {
        manual: true, onSuccess: (result, params) => {
            onListFileSession(hostAndSessionActive.session.id, 'list', null, fileSessionListActive.path)
        }, onError: (error, params) => {
        },
    })

    const onCreateFileSession = (sessionid, operation, dirpath = '/') => {
        if (operation === 'create_dir') {
            createFileSessionReq.run({ sessionid, operation, dirpath })
        }
    }

    const destoryFileSessionReq = useRequest(deleteMsgrpcFileSessionAPI, {
        manual: true, onSuccess: (result, params) => {
            onListFileSession(hostAndSessionActive.session.id, 'list', null, fileSessionListActive.path)
        }, onError: (error, params) => {
        },
    })

    const onDestoryFileSession = (record, operation) => {
        const sessionid = hostAndSessionActive.session.id
        if (operation === 'destory_dir') {
            destoryFileSessionReq.run({ sessionid, operation, dirpath: record.absolute_path })
        } else if (operation === 'destory_file') {
            destoryFileSessionReq.run({ sessionid, operation, filepath: record.absolute_path })
        }
    }

    const formLayout = {
        labelCol: { span: 0 }, wrapperCol: { span: 24 },
    }
    const tailLayout = {
        wrapperCol: { offset: 0, span: 24 },
    }

    return (<Fragment>

        <Row>
            <Space style={{ display: 'flex' }}>
                <ButtonGroup>
                    <Tooltip placement="bottom" mouseEnterDelay={0.3}
                             title={formatText('app.hostandsession.filesession.root')}>
                        <Button
                            style={{ marginLeft: 8, width: 56 }}
                            icon={<DesktopOutlined />}
                            onClick={() => onListFileSession(hostAndSessionActive.session.id, 'list', null, '/')}
                        />
                    </Tooltip>
                    <Tooltip placement="bottom" title={formatText('app.hostandsession.filesession.pwd')}>
                        <Button
                            style={{ width: 56 }}
                            icon={<HomeOutlined />}
                            onClick={() => onListFileSession(hostAndSessionActive.session.id, 'pwd')}
                        />
                    </Tooltip>
                    <Tooltip placement="bottom" mouseEnterDelay={0.3}
                             title={formatText('app.hostandsession.filesession.uppath')}>
                        <Button
                            style={{ width: 56 }}
                            onClick={() => onListFileSession(hostAndSessionActive.session.id, 'list', null, `${fileSessionListActive.path}/..`)}
                            icon={<ArrowUpOutlined />}
                        />
                    </Tooltip>
                </ButtonGroup>
                <Search
                    style={{
                        width: 'calc(80vw - 560px)',
                    }}
                    prefix={<FolderOpenOutlined />}
                    placeholder={formatText('app.hostandsession.filesession.path.rule')}
                    onChange={event => setFileSessionInputPathActive(event.target.value)}
                    value={fileSessionInputPathActive}
                    onSearch={value => onListFileSession(hostAndSessionActive.session.id, 'list', null, value)}
                    enterButton={<Button
                        loading={listFileSessionReq.loading}
                        type="primary"
                        htmlType="submit"
                        icon={<ArrowRightOutlined />}
                    />}
                />
                <Tooltip placement="bottom" mouseEnterDelay={0.3}
                         title={formatText('app.hostandsession.filesession.reloadpwd')}>
                    <Button
                        loading={listFileSessionReq.loading}
                        style={{ width: 56 }}
                        onClick={() => onListFileSession(hostAndSessionActive.session.id, 'list', null, fileSessionListActive.path)}
                        icon={<SyncOutlined />}
                    />
                </Tooltip>
                <Tooltip placement="bottom" mouseEnterDelay={0.3}
                         title={formatText('app.hostandsession.filesession.cdpwd')}>
                    <Button
                        loading={listFileSessionRunReq.loading}
                        style={{ width: 56 }}
                        onClick={() => onListFileSessionCd(hostAndSessionActive.session.id, 'cd', fileSessionListActive.path)}
                        icon={<PushpinOutlined />}
                    />
                </Tooltip>
                <Popover
                    title={formatText('app.hostandsession.filesession.mkdir.name')}
                    placement="bottomRight"
                    content={<Search
                        style={{ width: '300px' }}
                        enterButton={formatText('app.hostandsession.filesession.mk')}
                        size="default"
                        onSearch={value => onCreateFileSession(hostAndSessionActive.session.id, 'create_dir', `${fileSessionListActive.path}/${value}`)}
                    />}
                    trigger="click"
                >
                    <Button
                        loading={createFileSessionReq.loading}
                        style={{ width: 56 }}
                        disabled={hostAndSessionActive.session.id === -1}
                        icon={<FolderAddOutlined />}
                    />
                </Popover>
                <Popover
                    placement="bottomRight"
                    overlayStyle={{ padding: '0px 0px 0px 0px' }}
                    content={<FileMsfModal
                        hostAndSessionActive={hostAndSessionActive}
                        dirpath={fileSessionListActive.path}
                    />}
                    trigger="click"
                >
                    <Button
                        type="primary"
                        style={{ width: 56 }}
                        disabled={hostAndSessionActive.session.id === -1}
                        icon={<UploadOutlined />}
                    />
                </Popover>
            </Space>
        </Row>
        <Row>
            <DocIconInDiv url="https://www.yuque.com/vipersec/help/gaas8e" />
            <Table
                style={{
                    marginTop: '8px',
                    minHeight: cssCalc('80vh - 40px'),
                    maxHeight: cssCalc('80vh - 40px'),
                    width: '80vw',
                }}
                scroll={{ y: 'calc(80vh - 40px)' }}
                size="small"
                rowKey="name"
                pagination={false}
                dataSource={fileSessionListActive.entries}
                loading={createPostModuleActuatorReq.loading || listFileSessionReq.loading || listFileSessionRunReq.loading || updateFileSessionReq.loading || listFileSessionCatReq.loading || createFileSessionReq.loading || destoryFileSessionReq.loading}
                onRow={record => ({
                    onDoubleClick: event => {
                        if (record.type === 'directory' || record.type === 'fixed' || record.type === 'remote') {
                            onListFileSession(hostAndSessionActive.session.id, 'list', null, record.absolute_path)
                        }
                    },
                })}
                columns={[{
                    title: formatText('app.hostandsession.filesession.type'),
                    dataIndex: 'type',
                    key: 'type',
                    width: 56,
                    sorter: {
                        compare: (a, b) => {
                            return a.type.length - b.type.length
                        }, multiple: 4,
                    },
                    render: (text, record) => {
                        if (text === 'file') {
                            return (<div style={{ textAlign: 'center' }}>
                                <MyIcon type="icon-wenjian1" style={{ fontSize: '22px' }} />
                            </div>)
                        }
                        if (text === 'directory') {
                            return (<div style={{ textAlign: 'center' }}>
                                <MyIcon type="icon-wenjian" style={{ fontSize: '26px' }} />
                            </div>)
                        }
                        if (text === 'fixed') {
                            return (<div style={{ textAlign: 'center' }}>
                                <MyIcon type="icon-yingpan" style={{ fontSize: '26px' }} />
                            </div>)
                        }
                        if (text === 'remote') {
                            return (<div style={{ textAlign: 'center' }}>
                                <MyIcon type="icon-zhichixiezaiguazai" style={{ fontSize: '26px' }} />
                            </div>)
                        }

                        if (text === 'cdrom') {
                            return (<div style={{ textAlign: 'center' }}>
                                <MyIcon type="icon-CD" style={{ fontSize: '22px' }} />
                            </div>)
                        }
                        return (<div style={{ textAlign: 'center' }}>
                            <MyIcon type="icon-unknow" style={{ fontSize: '22px' }} />
                        </div>)
                    },
                }, {
                    title: formatText('app.hostandsession.filesession.name'),
                    dataIndex: 'name',
                    key: 'name',
                    sorter: {
                        compare: (a, b) => a.name.localeCompare(b.name), multiple: 3,
                    },
                    ellipsis: true,
                    render: (text, record) => {
                        if (text === 'file') {
                            return <span>{text}</span>
                        }
                        if (text === 'directory') {
                            return <span>{text}</span>
                        }
                        if (text === 'fixed') {
                            return <span>{text}</span>
                        }
                        if (text === 'cdrom') {
                            return <span>{text}</span>
                        }
                        return <span>{text}</span>
                    },
                }, {
                    title: formatText('app.hostandsession.filesession.format_mode'),
                    dataIndex: 'format_mode',
                    key: 'format_mode',
                    width: 160,
                }, {
                    title: formatText('app.hostandsession.filesession.format_size'),
                    dataIndex: 'format_size',
                    key: 'format_size',
                    width: 96,
                    sorter: {
                        compare: (a, b) => a.size - b.size, multiple: 2,
                    },
                }, {
                    title: formatText('app.hostandsession.filesession.mtime'),
                    dataIndex: 'mtime',
                    key: 'mtime',
                    width: 136,
                    sorter: {
                        compare: (a, b) => a.mtime - b.mtime, multiple: 2,
                    },
                    render: (text, record) => (
                        <Tag color="cyan">{moment(record.mtime * 1000).format('YYYY-MM-DD HH:mm')}</Tag>),
                }, {
                    dataIndex: 'operation', width: 226, render: (text, record) => {
                        if (record.type === 'directory') {
                            // 文件夹打开类操作
                            return (<div style={{ textAlign: 'center' }}>
                                <Space size="middle">
                                    <a
                                        onClick={() => onListFileSession(hostAndSessionActive.session.id, 'list', null, record.absolute_path)}
                                    >{formatText('app.hostandsession.filesession.open')}</a>
                                    <a style={{ visibility: 'Hidden' }}>{formatText('app.hostandsession.filesession.holder')}</a>
                                    <a style={{ visibility: 'Hidden' }}>{formatText('app.hostandsession.filesession.exec')}</a>
                                    <Popconfirm
                                        placement="topRight"
                                        title={formatText('app.hostandsession.filesession.destory_dir.tip')}
                                        onConfirm={() => onDestoryFileSession(record, 'destory_dir')}
                                    >
                                        <a style={{ color: 'red' }}>{formatText('app.core.delete')}</a>
                                    </Popconfirm>
                                </Space>
                            </div>)
                        }
                        if (record.type === 'fixed' || record.type === 'remote') {
                            // 文件夹打开类操作
                            return (<div style={{ textAlign: 'center' }}>
                                <a
                                    onClick={() => onListFileSession(hostAndSessionActive.session.id, 'list', null, record.absolute_path)}
                                >{formatText('app.core.open')}
                                </a>
                            </div>)
                        }
                        if (record.type === 'file') {
                            // 文件类操作
                            return (<div style={{ textAlign: 'center' }}>
                                <Space size="middle">
                                    <a
                                        onClick={() => onListFileSession(hostAndSessionActive.session.id, 'download', record.absolute_path, null)}
                                    >{formatText('app.hostandsession.filesession.download')}</a>
                                    {record.cat_able === true ? (<a
                                        style={{ color: 'green' }}
                                        onClick={() => onListFileSessionCat(hostAndSessionActive.session.id, record.absolute_path)}
                                    >{formatText('app.hostandsession.filesession.view')}</a>) : (
                                        <a style={{ visibility: 'Hidden' }}>{formatText('app.hostandsession.filesession.holder2')}</a>)}
                                    <Popover
                                        placement="left"
                                        title={formatText('app.hostandsession.filesession.args')}
                                        content={<Form
                                            style={{
                                                width: '50vw',
                                            }}
                                            onFinish={values => onListFileSessionRun(hostAndSessionActive.session.id, 'run', record.absolute_path, values.args)}
                                        >
                                            <Form.Item name="args" {...formLayout}>
                                                <TextArea />
                                            </Form.Item>
                                            <Form.Item {...tailLayout}>
                                                <Button
                                                    icon={<PlayCircleOutlined />}
                                                    block
                                                    type="primary"
                                                    htmlType="submit"
                                                    loading={listFileSessionRunReq.loading}
                                                >{formatText('app.hostandsession.filesession.exec')}</Button>
                                            </Form.Item>
                                        </Form>}
                                        trigger="click"
                                    >
                                        <a style={{ color: '#faad14' }}>{formatText('app.hostandsession.filesession.exec')}</a>
                                    </Popover>
                                    <Popconfirm
                                        placement="topRight"
                                        title={formatText('app.hostandsession.filesession.destory_file.tip')}
                                        onConfirm={() => onDestoryFileSession(record, 'destory_file')}
                                    >
                                        <a style={{ color: 'red' }}>{formatText('app.core.delete')}</a>
                                    </Popconfirm>
                                </Space>
                            </div>)
                        }
                    },
                }]}
            />
        </Row>
    </Fragment>)
}

const FileSessionMemo = memo(FileSession)

const HostRuningInfo = () => {
    console.log('HostRuningInfo')
    const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
        hostAndSessionActive: model.hostAndSessionActive,
    }))
    const [hostAndSessionBaseInfo, setHostAndSessionBaseInfo] = useState({
        Computer: null,
        OS: null,
        ARCH: null,
        DOMAIN: null,
        LoggedOnUsers: null,
        PROCESSES: [],
        NETSTAT: [],
        ARP: [],
        INTERFACE: [],
        private_ipaddress: [],
        public_ipaddress: [],
        interface_ipaddress: [],
        useful_processes: [],
        UPDATE_TIME: 0,
    })
    const initListHostInfoReq = useRequest(() => getPostmodulePostModuleResultAPI({
        ipaddress: hostAndSessionActive.ipaddress, loadpath: 'MODULES.HostBaseInfoModule',
    }), {
        onSuccess: (result, params) => {
            try {
                const resultJson = JSON.parse(result.result)
                resultJson.UPDATE_TIME = result.update_time
                setHostAndSessionBaseInfo(resultJson)
            } catch (e) {
                console.error(e)
            }
        }, onError: (error, params) => {
        },
    })
    const listHostInfoReq = useRequest(getPostmodulePostModuleResultAPI, {
        manual: true, onSuccess: (result, params) => {
            try {
                const resultJson = JSON.parse(result.result)
                resultJson.UPDATE_TIME = result.update_time
                setHostAndSessionBaseInfo(resultJson)
            } catch (e) {
                console.error(e)
            }
        }, onError: (error, params) => {
        },
    })

    const onListHostInfo = record => {
        listHostInfoReq.run({ ipaddress: record.ipaddress, loadpath: 'MODULES.HostBaseInfoModule' })
    }

    const updateHostInfoReq = useRequest(postPostmodulePostModuleActuatorAPI, {
        manual: true, onSuccess: (result, params) => {
        }, onError: (error, params) => {
        },
    })

    const onUpdateHostInfo = () => {
        updateHostInfoReq.run({
            ipaddress: hostAndSessionActive.ipaddress,
            loadpath: 'MODULES.HostBaseInfoModule',
            sessionid: hostAndSessionActive.session.id,
        })
    }

    const processColumns = [{
        title: 'PID', dataIndex: 'pid', width: 64, sorter: (a, b) => a.pid >= b.pid,
    }, {
        title: 'NAME', dataIndex: 'name',
    }, {
        title: 'PATH', dataIndex: 'path',
    }, {
        title: 'USER', dataIndex: 'user',
    }, {
        title: 'ARCH', width: 48, dataIndex: 'arch',
    }]
    const usefulProcessColumns = [{
        title: formatText('app.hostandsession.hostruninginfo.usefulProcess.tag'),
        dataIndex: 'process',
        render: (text, record) => <span>{getOptionTag(record)}</span>,
    }, {
        title: formatText('app.hostandsession.hostruninginfo.usefulProcess.desc'),
        dataIndex: 'process',
        render: (text, record) => <span>{getOptionDesc(record)}</span>,
    }, {
        title: 'PID', dataIndex: 'process',

        render: (text, record) => <span>{record.process.pid}</span>,
    }, {
        title: 'NAME', dataIndex: 'process',

        render: (text, record) => <span>{record.process.name}</span>,
    }, {
        title: 'PATH', dataIndex: 'process', render: (text, record) => <span>{record.process.path}</span>,
    }, {
        title: 'USER', dataIndex: 'process', render: (text, record) => <span>{record.process.user}</span>,
    }, {
        title: 'ARCH', dataIndex: 'process', render: (text, record) => <span>{record.process.arch}</span>,
    }]
    const netstatColumns = [{
        title: 'protocol', dataIndex: 'protocol', width: 60,
    }, {
        title: 'local_addr', dataIndex: 'local_addr', width: 60, sorter: (a, b) => a.local_addr >= b.local_addr,
    }, {
        title: 'remote_addr', dataIndex: 'remote_addr', width: 60, sorter: (a, b) => a.remote_addr >= b.remote_addr,
    }, {
        title: 'state', dataIndex: 'state', width: 60, sorter: (a, b) => a.state >= b.state,
    }, {
        title: 'pid_name', dataIndex: 'pid_name', width: 60, sorter: (a, b) => a.pid_name >= b.pid_name,
    }]
    const arpColumns = [{
        title: 'ip_addr', dataIndex: 'ip_addr',
    }, {
        title: 'mac_addr', dataIndex: 'mac_addr',
    }, {
        title: 'interface', dataIndex: 'interface',
    }]
    const interfaceColumns = [{
        title: 'Name', dataIndex: 'Name',
    }, {
        title: 'Hardware MAC', dataIndex: 'Hardware MAC',
    }, {
        title: 'IP/Mask', dataIndex: 'IPv4', render: (text, record) => {
            let allstr = ''
            for (const ippair of record.IPv4) {
                allstr = `${allstr} ${ippair['IPv4 Address']} / ${ippair['IPv4 Netmask']}`
            }
            return <span>{allstr}</span>
        },
    }]

    return (<Fragment>
        <DocIconInDiv url="https://www.yuque.com/vipersec/help/og2q4cq4iye386xa" />
        <Row>
            <ButtonGroup>
                <Button
                    type="primary"
                    icon={<SyncOutlined />}
                    onClick={() => onListHostInfo(hostAndSessionActive)}
                    loading={listHostInfoReq.loading}
                >{formatText('app.hostandsession.hostruninginfo.list')}</Button>
                <Button
                    icon={<RetweetOutlined />}
                    loading={updateHostInfoReq.loading}
                    onClick={() => onUpdateHostInfo()}
                    disabled={hostAndSessionActive.session === undefined || hostAndSessionActive.session === null || hostAndSessionActive.session.id === undefined || hostAndSessionActive.session.id === -1}
                >{formatText('app.hostandsession.hostruninginfo.update')}</Button>
            </ButtonGroup>
            {hostAndSessionBaseInfo.UPDATE_TIME === 0 || hostAndSessionBaseInfo.UPDATE_TIME === undefined ? (<Tag
                style={{
                    marginLeft: 16,
                }}
                color="red"
            >{formatText('app.hostandsession.hostruninginfo.unupdate')}</Tag>) : (<Tag
                style={{
                    marginLeft: 16,
                }}
                color="cyan"
            >
                {moment(hostAndSessionBaseInfo.UPDATE_TIME * 1000).format('YYYY-MM-DD HH:mm')}
            </Tag>)}
        </Row>
        <Row>
            <Tabs
                size="small"
                defaultActiveKey="1"
                style={{
                    minHeight: '80vh',
                }}
            >
                <TabPane tab={<span>{formatText('app.hostandsession.hostruninginfo.baseinfo')}</span>} key="1">
                    <Descriptions size="small" column={1} bordered>
                        <Descriptions.Item label={formatText('app.hostandsession.hostruninginfo.Computer')}>
                            {hostAndSessionBaseInfo.Computer}
                        </Descriptions.Item>
                        <Descriptions.Item label={formatText('app.hostandsession.hostruninginfo.OS')}>
                            {hostAndSessionBaseInfo.OS} {hostAndSessionBaseInfo.ARCH}
                        </Descriptions.Item>
                        <Descriptions.Item label="DOMAIN">{hostAndSessionBaseInfo.DOMAIN}</Descriptions.Item>
                        <Descriptions.Item label={formatText('app.hostandsession.hostruninginfo.LoggedOnUsers')}>
                            {hostAndSessionBaseInfo.LoggedOnUsers}
                        </Descriptions.Item>
                    </Descriptions>
                </TabPane>
                <TabPane tab={formatText('app.hostandsession.hostruninginfo.networkcard')} key="8">
                    <Table
                        style={{
                            overflow: 'auto',
                            marginTop: '-16px',
                            minHeight: cssCalc('80vh'),
                            maxHeight: cssCalc('80vh'),
                            minWidth: cssCalc('80vw - 16px'),
                            maxWidth: cssCalc('80vw - 16px'),
                        }}
                        columns={interfaceColumns}
                        dataSource={hostAndSessionBaseInfo.INTERFACE}
                        pagination={false}
                        rowKey="Name"
                        size="small"
                        expandRowByClick
                    />
                </TabPane>
                <TabPane tab={formatText('app.hostandsession.hostruninginfo.listen_address')} key="10">
                    <Table
                        style={{
                            overflow: 'auto',
                            marginTop: '-16px',
                            minHeight: cssCalc('80vh'),
                            maxHeight: cssCalc('80vh'),
                            minWidth: cssCalc('80vw - 16px'),
                            maxWidth: cssCalc('80vw - 16px'),
                        }}
                        columns={netstatColumns}
                        dataSource={hostAndSessionBaseInfo.listen_address}
                        pagination={false}
                        size="small"
                    />
                </TabPane>
                <TabPane tab={formatText('app.hostandsession.hostruninginfo.public_ipaddress')} key="5">
                    <Table
                        style={{
                            overflow: 'auto',
                            marginTop: '-16px',
                            minHeight: cssCalc('80vh'),
                            maxHeight: cssCalc('80vh'),
                            minWidth: cssCalc('80vw - 16px'),
                            maxWidth: cssCalc('80vw - 16px'),
                        }}
                        columns={netstatColumns}
                        dataSource={hostAndSessionBaseInfo.public_ipaddress}
                        pagination={false}
                        size="small"
                    />
                </TabPane>
                <TabPane tab={formatText('app.hostandsession.hostruninginfo.private_ipaddress')} key="6">
                    <Table
                        style={{
                            overflow: 'auto',
                            marginTop: '-16px',
                            minHeight: cssCalc('80vh'),
                            maxHeight: cssCalc('80vh'),
                            minWidth: cssCalc('80vw - 16px'),
                            maxWidth: cssCalc('80vw - 16px'),
                        }}
                        columns={netstatColumns}
                        dataSource={hostAndSessionBaseInfo.private_ipaddress}
                        pagination={false}
                        size="small"
                    />
                </TabPane>
                <TabPane tab={formatText('app.hostandsession.hostruninginfo.ARP')} key="7">
                    <Table
                        style={{
                            overflow: 'auto',
                            marginTop: '-16px',
                            minHeight: cssCalc('80vh'),
                            maxHeight: cssCalc('80vh'),
                            minWidth: cssCalc('80vw - 16px'),
                            maxWidth: cssCalc('80vw - 16px'),
                        }}
                        columns={arpColumns}
                        dataSource={hostAndSessionBaseInfo.ARP}
                        pagination={false}
                        size="small"
                    />
                </TabPane>
                <TabPane tab={formatText('app.hostandsession.hostruninginfo.useful_processes')} key="9">
                    <Table
                        style={{
                            overflow: 'auto',
                            marginTop: '-16px',
                            minHeight: cssCalc('80vh'),
                            maxHeight: cssCalc('80vh'),
                            minWidth: cssCalc('80vw - 16px'),
                            maxWidth: cssCalc('80vw - 16px'),
                        }}
                        scroll={{ x: 'calc(70vw - 16px)' }}
                        columns={usefulProcessColumns}
                        dataSource={hostAndSessionBaseInfo.useful_processes}
                        pagination={false}
                        size="small"
                    />
                </TabPane>
                <TabPane tab={formatText('app.hostandsession.hostruninginfo.NETSTAT')} key="4">
                    <Table
                        style={{
                            overflow: 'auto',
                            marginTop: '-16px',
                            minHeight: cssCalc('80vh'),
                            maxHeight: cssCalc('80vh'),
                            minWidth: cssCalc('80vw - 16px'),
                            maxWidth: cssCalc('80vw - 16px'),
                        }}
                        columns={netstatColumns}
                        dataSource={hostAndSessionBaseInfo.NETSTAT}
                        pagination={false}
                        size="small"
                    />
                </TabPane>
                <TabPane tab={formatText('app.hostandsession.hostruninginfo.PROCESSES')} key="2">
                    <Table
                        style={{
                            overflow: 'auto',
                            marginTop: '-16px',
                            minHeight: cssCalc('80vh'),
                            maxHeight: cssCalc('80vh'),
                            minWidth: cssCalc('80vw - 16px'),
                            maxWidth: cssCalc('80vw - 16px'),
                        }}
                        columns={processColumns}
                        dataSource={hostAndSessionBaseInfo.PROCESSES}
                        pagination={false}
                        size="small"
                    />
                </TabPane>
            </Tabs>
        </Row>
    </Fragment>)
}
const HostRunningInfoMemo = memo(HostRuningInfo)

const HostInfo = () => {
    console.log('HostInfo')
    const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
        hostAndSessionActive: model.hostAndSessionActive,
    }))
    const [hostinfo, setHostInfo] = useState({})
    useRequest(() => getCoreHostInfoAPI({ ipaddress: hostAndSessionActive.ipaddress }), {
        onSuccess: (result, params) => {
            setHostInfo(result)
        }, onError: (error, params) => {
        },
    })

    return (<Card
        style={{
            overflow: 'auto', minHeight: cssCalc('100vh - 160px'), maxHeight: cssCalc('100vh - 160px'),
        }}
        bodyStyle={{ padding: '0px 0px 0px 0px' }}
    >
        <DocIconInDiv url="https://www.yuque.com/vipersec/help/bp9nso" />
        <ReactJson
            src={hostinfo}
            theme="colors"
            displayDataTypes={false}
            displayObjectSize={false}
        />
    </Card>)
}

const HostInfoMemo = memo(HostInfo)


const PortService = () => {
    console.log('PortService')
    const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
        hostAndSessionActive: model.hostAndSessionActive,
    }))
    const [portServiceActive, setPortServiceActive] = useState([])

    const initListPortServiceReq = useRequest(() => getPostlateralPortserviceAPI({ ipaddress: hostAndSessionActive.ipaddress }), {
        onSuccess: (result, params) => {
            setPortServiceActive(result)
        }, onError: (error, params) => {
        },
    })
    const listPortServiceReq = useRequest(getPostlateralPortserviceAPI, {
        manual: true, onSuccess: (result, params) => {
            setPortServiceActive(result)
        }, onError: (error, params) => {
        },
    })

    const destoryPortServiceReq = useRequest(deletePostlateralPortserviceAPI, {
        manual: true, onSuccess: (result, params) => {
            listPortServiceReq.run({ ipaddress: hostAndSessionActive.ipaddress })
        }, onError: (error, params) => {
        },
    })

    const onDestoryPortService = record => {
        destoryPortServiceReq.run({ ipaddress: record.ipaddress, port: record.port })
    }
    const paginationProps = {
        simple: true, pageSize: 5,
    }

    return (<Fragment>
        <DocIconInDiv url="https://www.yuque.com/vipersec/help/bis8h3" />
        <Table
            size="small"
            rowKey="port"
            pagination={paginationProps}
            dataSource={portServiceActive}
            loading={listPortServiceReq.loading || initListPortServiceReq.loading}
            columns={[{
                title: formatText('app.hostandsession.portservice.port'),
                dataIndex: 'port',
                key: 'port',
                width: '10%',
            }, {
                title: formatText('app.hostandsession.portservice.service'),
                dataIndex: 'service',
                key: 'service',
                width: '15%',
            }, {
                title: formatText('app.hostandsession.portservice.banner'), dataIndex: 'banner', key: 'banner',
            }, {
                title: formatText('app.core.updatetime'),
                dataIndex: 'update_time',
                key: 'update_time',
                width: 136,
                render: (text, record) => (
                    <Tag color="cyan">{moment(record.update_time * 1000).format('YYYY-MM-DD HH:mm')}</Tag>),
            }, {
                dataIndex: 'operation',
                width: 48,
                render: (text, record) => (<a onClick={() => onDestoryPortService(record)} style={{ color: 'red' }}>
                    {formatText('app.core.delete')}
                </a>),
            }]}
        /></Fragment>)
}
const PortServiceMemo = memo(PortService)

const Vulnerability = () => {
    console.log('Vulnerability')
    const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
        hostAndSessionActive: model.hostAndSessionActive,
    }))
    const [vulnerabilityActive, setVulnerabilityActive] = useState([])

    const initListVulnerabilityeReq = useRequest(() => getPostlateralVulnerabilityAPI({ ipaddress: hostAndSessionActive.ipaddress }), {
        onSuccess: (result, params) => {
            setVulnerabilityActive(result)
        }, onError: (error, params) => {
        },
    })
    const listVulnerabilityReq = useRequest(getPostlateralVulnerabilityAPI, {
        manual: true, onSuccess: (result, params) => {
            setVulnerabilityActive(result)
        }, onError: (error, params) => {
        },
    })

    const destoryVulnerabilityReq = useRequest(deletePostlateralVulnerabilityAPI, {
        manual: true, onSuccess: (result, params) => {
            listVulnerabilityReq.run({ ipaddress: hostAndSessionActive.ipaddress })
        }, onError: (error, params) => {
        },
    })

    const onDestoryVulnerability = record => {
        destoryVulnerabilityReq.run({ id: record.id })
    }

    const paginationProps = {
        simple: true, pageSize: 5,
    }

    return (<Fragment><DocIconInDiv url="https://www.yuque.com/vipersec/help/rgv5wy" />
        <Table
            size="small"
            rowKey="source_module_name"
            pagination={paginationProps}
            dataSource={vulnerabilityActive}
            loading={listVulnerabilityReq.loading || initListVulnerabilityeReq.loading}
            columns={[{
                title: formatText('app.hostandsession.Vulnerability.source_module_name'),
                dataIndex: 'source_module_name',
                key: 'source_module_name',
            }, {
                title: formatText('app.hostandsession.Vulnerability.desc'),
                dataIndex: 'desc',
                key: 'desc', // width: '15%',
            }, {
                title: formatText('app.core.updatetime'),
                dataIndex: 'update_time',
                key: 'update_time',
                width: 136,
                render: (text, record) => (
                    <Tag color="cyan">{moment(record.update_time * 1000).format('YYYY-MM-DD HH:mm')}</Tag>),
            }, {
                dataIndex: 'operation',
                width: 48,
                render: (text, record) => (<a onClick={() => onDestoryVulnerability(record)} style={{ color: 'red' }}>
                    {formatText('app.core.delete')}
                </a>),
            }]}
        /></Fragment>)
}
const VulnerabilityMemo = memo(Vulnerability)

const UpdateHost = props => {
    console.log('UpdateHost')
    const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
        hostAndSessionActive: model.hostAndSessionActive,
    }))
    const updateHostReq = useRequest(putCoreHostAPI, {
        manual: true, onSuccess: (result, params) => {
            props.closeModal()
        }, onError: (error, params) => {
        },
    })

    const onUpdateHost = values => {
        updateHostReq.run(values)
    }

    const formLayout = {
        labelCol: { span: 0 }, wrapperCol: { span: 24 },
    }
    const tailLayout = {
        wrapperCol: { offset: 0, span: 24 },
    }
    const hostTypeToAvatar = {
        ad_server: (<Avatar shape="square" style={{ backgroundColor: '#177ddc' }} icon={<WindowsOutlined />} />),
        pc: <Avatar shape="square" style={{ backgroundColor: '#49aa19' }} icon={<LaptopOutlined />} />,
        web_server: (<Avatar shape="square" style={{ backgroundColor: '#13a8a8' }} icon={<CloudOutlined />} />),
        cms: <Avatar shape="square" style={{ backgroundColor: '#d84a1b' }} icon={<BugOutlined />} />,
        firewall: (<Avatar shape="square" style={{ backgroundColor: '#d87a16' }} icon={<GatewayOutlined />} />),
        other: (<Avatar shape="square" style={{ backgroundColor: '#bfbfbf' }} icon={<QuestionOutlined />} />),
    }

    return (<Card>
        <Form
            style={{
                width: '440px',
            }}
            initialValues={{
                ipaddress: hostAndSessionActive.ipaddress,
                tag: hostAndSessionActive.tag,
                comment: hostAndSessionActive.comment,
            }}
            onFinish={onUpdateHost}
        >
            <Form.Item
                label={<span>ipaddress</span>}
                name="ipaddress"
                rules={[{ required: true }]}
                style={{ display: 'None' }}
                {...formLayout}
            >
                <span>{hostAndSessionActive.ipaddress}</span>
            </Form.Item>
            <Form.Item
                name="tag"
                {...formLayout}>
                <Radio.Group>
                    <Radio value="ad_server">{hostTypeToAvatar.ad_server}</Radio>
                    <Radio value="pc">{hostTypeToAvatar.pc}</Radio>
                    <Radio value="web_server">{hostTypeToAvatar.web_server}</Radio>
                    <Radio value="cms">{hostTypeToAvatar.cms}</Radio>
                    <Radio value="firewall">{hostTypeToAvatar.firewall}</Radio>
                    <Radio value="other">{hostTypeToAvatar.other}</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                name="comment"
                rules={[{ message: formatText('app.hostandsession.updatehost.comment.rule'), max: 20 }]}
                {...formLayout}
            >
                <Input placeholder={formatText('app.hostandsession.updatehost.comment.rule')} />
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button
                    icon={<DeliveredProcedureOutlined />}
                    block
                    type="primary"
                    htmlType="submit"
                    loading={updateHostReq.loading}
                >{formatText('app.core.update')}</Button>
            </Form.Item>
        </Form>
    </Card>)
}
const UpdateHostMemo = memo(UpdateHost)

export const sessionTagList = session => {
    if (session === null || session === undefined || session.id === -1) {
        return null
    }
    const timepass = session.fromnow

    let heartbeat = null

    if (timepass <= 60) {
        heartbeat = (<Tag
            color="green"
            style={{
                width: 72, textAlign: 'center', cursor: 'pointer',
            }}
        >
            {timepass + 's'}
        </Tag>)
    } else if (60 < timepass <= 90) {
        heartbeat = (<Tag
            color="orange"
            style={{
                width: 72, textAlign: 'center', cursor: 'pointer',
            }}
        >
            {timepass + 's'}
        </Tag>)
    } else if (90 < timepass <= 999) {
        heartbeat = (<Tag
            color="orange"
            style={{
                width: 72, textAlign: 'center', cursor: 'pointer',
            }}
        >
            {timepass + 's'}
        </Tag>)
    } else {
        heartbeat = (<Tooltip title={timepass + 's'} placement="left">
            <Tag
                color="red"
                style={{
                    width: 72, textAlign: 'center', cursor: 'pointer',
                }}
            >999s</Tag>
        </Tooltip>)
    }

    // sessionid
    const sessionidTag = (<Tag
        color="purple"
        style={{
            width: 40, marginLeft: -6, textAlign: 'center', cursor: 'pointer',
        }}
    >
        <strong>{session.id}</strong>
    </Tag>)

    // 连接标签
    const connecttooltip = (<span>
      {' '}
        {getSessionlocate(session)} {session.tunnel_peer} {'-> '}
        {session.tunnel_local}
    </span>)
    const connectTag = (<Tooltip mouseEnterDelay={1} placement="right" title={connecttooltip}>
        <Tag
            color="cyan"
            style={{
                width: 120, textAlign: 'center', marginLeft: -6, cursor: 'pointer',
            }}
        >
            {session.tunnel_peer_ip}
        </Tag>
    </Tooltip>)
    // handler标签
    const jobidTagTooltip = (<span>
      {session.job_info.PAYLOAD} {session.job_info.LHOST}{' '}
        {session.job_info.RHOST} {session.job_info.LPORT}{' '}
    </span>)
    const jobidTag = (<Tooltip mouseEnterDelay={1} placement="bottomLeft" title={jobidTagTooltip}>
        <Tag
            color="lime"
            style={{
                width: 40, marginLeft: -6, textAlign: 'center', cursor: 'pointer',
            }}
        >
            <strong>{session.job_info.job_id}</strong>
        </Tag>
    </Tooltip>)
    // arch
    const archTag = session.arch === 'x64' ? (<Tag
        color="geekblue"
        style={{
            cursor: 'pointer', marginLeft: -6,
        }}
    >
        {session.arch}
    </Tag>) : (<Tag
        color="volcano"
        style={{
            cursor: 'pointer', marginLeft: -6,
        }}
    >
        {session.arch}
    </Tag>)

    // os标签
    const os_tag_new = session.platform === 'windows' ? (
        <Tooltip mouseEnterDelay={1} placement="right" title={session.os}>
            <Tag
                color="blue"
                style={{
                    marginLeft: -6, cursor: 'pointer',
                }}
            >
                <div>
                    <MyIcon
                        type="icon-windows"
                        style={{
                            marginBottom: 0, marginRight: 4, fontSize: '14px',
                        }}
                    />
                    {session.os_short}
                </div>
            </Tag>
        </Tooltip>) : (<Tooltip mouseEnterDelay={1} placement="right" title={session.os}>
        <Tag
            color="magenta"
            style={{
                marginLeft: -6, cursor: 'pointer',
            }}
        >
            <div>
                <MyIcon
                    type="icon-linux"
                    style={{
                        fontSize: '14px', marginRight: 4,
                    }}
                />
                {session.os_short}
            </div>
        </Tag>
    </Tooltip>)

    // user标签
    let user = null
    if (session.available === true && session.isadmin === true) {
        user = (<Tooltip mouseEnterDelay={1} placement="right" title={session.info}>
            <Tag
                color="gold"
                style={{
                    marginLeft: -6, cursor: 'pointer',
                }}
            >
                <div>{session.info}</div>
            </Tag>
        </Tooltip>)
    } else {
        user = (<Tooltip mouseEnterDelay={1} placement="right" title={session.info}>
            <Tag
                style={{
                    marginLeft: -6, cursor: 'pointer',
                }}
            >
                <div>{session.info}</div>
            </Tag>
        </Tooltip>)
    }

    const commTag = session.comm_channel_session === null ? null : (<Tag
        color="gold"
        style={{
            cursor: 'pointer', marginLeft: -6,
        }}
    ><SubnodeOutlined /><span>{session.comm_channel_session}</span>
    </Tag>)
    return <Fragment>
        {heartbeat}
        {sessionidTag}
        {connectTag}
        {jobidTag}
        {archTag}
        {os_tag_new}
        {user}
        {commTag}
    </Fragment>
}


export default HostAndSession

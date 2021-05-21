import React, { Fragment, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useModel, useRequest } from 'umi';
import { useControllableValue, useInterval, useLocalStorageState } from 'ahooks';
import {
  deleteCoreHostAPI,
  deleteMsgrpcFileSessionAPI,
  deleteMsgrpcJobAPI,
  deleteMsgrpcPortFwdAPI,
  deleteMsgrpcRouteAPI,
  deleteMsgrpcSessionAPI,
  deleteMsgrpcSessionioAPI,
  deleteMsgrpcTransportAPI,
  deleteNoticesAPI,
  deletePostlateralPortserviceAPI,
  deletePostlateralVulnerabilityAPI,
  deletePostModuleAutoAPI,
  deletePostmodulePostModuleResultHistoryAPI,
  getCoreCurrentUserAPI,
  getCoreSettingAPI,
  getMsgrpcFileSessionAPI,
  getMsgrpcPortFwdAPI,
  getMsgrpcRouteAPI,
  getMsgrpcSessionAPI,
  getMsgrpcTransportAPI,
  getPostlateralPortserviceAPI,
  getPostlateralVulnerabilityAPI,
  getPostModuleAutoAPI,
  getPostmodulePostModuleConfigAPI,
  getPostmodulePostModuleResultAPI,
  postCoreNoticesAPI,
  postCoreSettingAPI,
  postMsgrpcFileSessionAPI,
  postMsgrpcPortFwdAPI,
  postMsgrpcRouteAPI,
  postMsgrpcSessionioAPI,
  postMsgrpcTransportAPI,
  postPostModuleAutoAPI,
  postPostmodulePostModuleActuatorAPI,
  putCoreHostAPI,
  putMsgrpcFileSessionAPI,
  putMsgrpcSessionAPI,
  putMsgrpcSessionioAPI,
  putMsgrpcTransportAPI,
} from '@/services/apiv1';
import '@ant-design/compatible/assets/index.css';
import {
  ArrowRightOutlined,
  ArrowUpOutlined,
  BugOutlined,
  CaretRightOutlined,
  CheckOutlined,
  ClearOutlined,
  CloseCircleOutlined,
  CloudOutlined,
  CodeOutlined,
  ContactsOutlined,
  CustomerServiceOutlined,
  DeleteOutlined,
  DeliveredProcedureOutlined,
  DesktopOutlined,
  DownOutlined,
  FieldTimeOutlined,
  FolderAddOutlined,
  FolderOpenOutlined,
  FundViewOutlined,
  GatewayOutlined,
  GroupOutlined,
  HomeOutlined,
  InteractionOutlined,
  KeyOutlined,
  LaptopOutlined,
  MailOutlined,
  MinusOutlined,
  NodeIndexOutlined,
  PartitionOutlined,
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
  ShareAltOutlined,
  SisternodeOutlined,
  SwapLeftOutlined,
  SwapOutlined,
  SwapRightOutlined,
  SyncOutlined,
  UploadOutlined,
  UpOutlined,
  VerticalAlignTopOutlined,
  WindowsOutlined,
} from '@ant-design/icons';

import {
  Avatar,
  BackTop,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Dropdown,
  Form,
  Input,
  InputNumber,
  List,
  Menu,
  message,
  Modal,
  Popconfirm,
  Popover,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd';

import copy from 'copy-to-clipboard';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import './xterm.css';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import moment from 'moment';
import { FileMsfMemo, FileMsfModal } from '@/pages/Core/FileMsf';
import PayloadAndHandler, { PayloadAndHandlerMemo } from '@/pages/Core/PayloadAndHandler';
import MuitHosts, { MuitHostsMemo } from '@/pages/Core/MuitHosts';
import { host_type_to_avatar_table, MyIcon, SidTag } from '@/pages/Core/Common';
import SystemSetting, { SystemSettingMemo } from '@/pages/Core/SystemSetting';
import { BotScan, PostModuleMemo, RunAutoModuleMemo, RunModuleMemo } from '@/pages/Core/RunModule';
import { MsfSocksMemo } from '@/pages/Core/MsfSocks';
import LazyLoader, { LazyLoaderMemo } from '@/pages/Core/LazyLoader';
import Credential, { CredentialMemo } from '@/pages/Core/Credential';
import { getToken } from '@/utils/authority';
import styles from './HostAndSession.less';
import NetworkMemo from '@/pages/Core/Network';

const { Text } = Typography;
const { Paragraph } = Typography;
const { Option } = Select;
const ButtonGroup = Button.Group;
const { Search, TextArea } = Input;
const { TabPane } = Tabs;

//websocket连接地址设置
let webHost = '127.0.0.1:8002';
let protocol = 'ws://';
if (process.env.NODE_ENV === 'production') {
  webHost = location.hostname + (location.port ? `:${location.port}` : '');
  protocol = 'wss://';
} else {
  webHost = '127.0.0.1:8002';
  protocol = 'ws://';
}
console.log(protocol);
console.log(webHost);
const inputItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const HostAndSession = props => {
  console.log('HostAndSession');
  const {
    setBotModuleConfigList,
    setPostModuleConfigListStateAll,
    setHostAndSessionList,
    setHeatbeatsocketalive,
    setTaskQueueLength,
    setJobList,
    setPostModuleResultHistory,
    setPostModuleResultHistoryActive,
    setNotices,
    setBotWaitList,
    setNetworkData,
  } = useModel('HostAndSessionModel', model => ({
    setBotModuleConfigList: model.setBotModuleConfigList,
    setPostModuleConfigListStateAll: model.setPostModuleConfigListStateAll,
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
  }));

  //初始化postmoduleconfig信息
  const initListPostModuleConfigReq = useRequest(getPostmodulePostModuleConfigAPI, {
    onSuccess: (result, params) => {
      setPostModuleConfigListStateAll(result.filter(item => item.BROKER.indexOf('post') === 0));
      setBotModuleConfigList(result.filter(item => item.BROKER.indexOf('bot') === 0));
    },
    onError: (error, params) => {
    },
  });

  const listCurrentUserReq = useRequest(getCoreCurrentUserAPI, {
    manual: true,
    onSuccess: (result, params) => {
    },
    onError: (error, params) => {
    },
  });

  const urlpatterns = '/ws/v1/websocket/heartbeat/?';
  const urlargs = `&token=${getToken()}`;
  const socketUrl = protocol + webHost + urlpatterns + urlargs;

  const ws = useRef(null);

  const initHeartBeat = () => {
    try {
      listCurrentUserReq.run();
      ws.current = new WebSocket(socketUrl);
    } catch (error) {
      return;
    }

    ws.current.onopen = () => {
      setHeatbeatsocketalive(true);
    };
    ws.current.onclose = CloseEvent => {
      setHeatbeatsocketalive(false);
    };
    ws.current.onerror = ErrorEvent => {
      setHeatbeatsocketalive(false);
    };
    ws.current.onmessage = event => {
      const response = JSON.parse(event.data);
      const { task_queue_length } = response;

      const { hosts_sorted_update } = response;
      const { hosts_sorted } = response;

      const { network_data_update } = response;
      const { network_data } = response;

      const { result_history_update } = response;
      const { result_history } = response;

      const { notices_update } = response;
      const { notices } = response;

      const { jobs_update } = response;
      const { jobs } = response;

      const { bot_wait_list_update } = response;
      const { bot_wait_list } = response;
      setTaskQueueLength(task_queue_length);

      if (hosts_sorted_update) {
        setHostAndSessionList(hosts_sorted);
      }

      if (network_data_update) {
        setNetworkData(network_data);
      }

      if (jobs_update) {
        setJobList(jobs);
      }
      if (result_history_update) {
        setPostModuleResultHistory(result_history);
        setPostModuleResultHistoryActive(result_history);
      }
      if (notices_update) {
        setNotices(notices);
      }
      if (bot_wait_list_update) {
        setBotWaitList(bot_wait_list);
      }
    };
  };

  const heartbeatmonitor = () => {
    if (
      ws.current !== undefined &&
      ws.current !== null &&
      ws.current.readyState === WebSocket.OPEN
    ) {
    } else {
      try {
        ws.current.close();
      } catch (error) {
      }
      try {
        ws.current = null;
      } catch (error) {
      }
      initHeartBeat();
    }
  };
  useInterval(() => heartbeatmonitor(), 3000);
  useEffect(() => {
    initHeartBeat();
    return () => {
      try {
        ws.current.close();
      } catch (error) {
      }
      try {
        ws.current = null;
      } catch (error) {
      }
    };
  }, []);

  return (
    <GridContent>
      <HostAndSessionCard />
      <TabsBottom />
    </GridContent>
  );
};

const HostAndSessionCard = () => {
  console.log('HostAndSessionCard');
  const { hostAndSessionList, setHostAndSessionActive, heatbeatsocketalive } = useModel(
    'HostAndSessionModel',
    model => ({
      hostAndSessionList: model.hostAndSessionList,
      setHostAndSessionActive: model.setHostAndSessionActive,
      heatbeatsocketalive: model.heatbeatsocketalive,
    }),
  );
  const sessionActiveInit = {
    id: -1,
    type: 'meterpreter',
    session_host: '请选择Session',
    tunnel_local: null,
    tunnel_peer_ip: null,
    tunnel_peer_locate: null,
    tunnel_peer_asn: null,
    tunnel_peer: null,
    via_exploit: null,
    via_payload: null,
    info: null,
    user: null,
    os: null,
    os_short: null,
    arch: null,
    platform: null,
    fromnow: 0,
    available: 0,
    isadmin: null,
    pid: -1,
    job_info: {
      job_id: -1,
      PAYLOAD: null,
      LPORT: null,
      LHOST: null,
      RHOST: null,
    },
  };

  const [sessionIOModalVisable, setSessionIOModalVisable] = useState(false);
  const [routeModalVisable, setRouteModalVisable] = useState(false);
  const [portFwdModalVisable, setPortFwdModalVisable] = useState(false);
  const [transportModalVisable, setTransportModalVisable] = useState(false);
  const [sessionInfoModalVisable, setSessionInfoModalVisable] = useState(false);
  const [hostInfoModalVisable, setHostInfoModalVisable] = useState(false);
  const [portServiceModalVisable, setPortServiceModalVisable] = useState(false);
  const [vulnerabilityModalVisable, setVulnerabilityModalVisable] = useState(false);
  const [fileSessionModalVisable, setFileSessionModalVisable] = useState(false);
  const [runModuleModalVisable, setRunModuleModalVisable] = useState(false);
  const [updateHostModalVisable, setUpdateHostModalVisable] = useState(false);

  const closeTransportModel = useCallback(() => {
    setTransportModalVisable(false);
  }, []);

  const destoryHostReq = useRequest(deleteCoreHostAPI, {
    manual: true,
    onSuccess: (result, params) => {
    },
    onError: (error, params) => {
    },
  });

  const destorySessionReq = useRequest(deleteMsgrpcSessionAPI, {
    manual: true,
    onSuccess: (result, params) => {
    },
    onError: (error, params) => {
    },
  });

  const setActiveHostAndSession = item => {
    const tmp = JSON.parse(JSON.stringify(item));
    if (item.session === null || item.session === undefined) {
      tmp.session = sessionActiveInit;
    }
    setHostAndSessionActive(tmp);
  };

  const SessionMenu = record => {
    const onClick = ({ key }) => {
      switch (key) {
        case 'SessionInfo':
          setActiveHostAndSession(record);
          setSessionInfoModalVisable(true);
          break;
        case 'FileSession':
          setActiveHostAndSession(record);
          setFileSessionModalVisable(true);
          break;
        case 'SessionIO':
          setActiveHostAndSession(record);
          setSessionIOModalVisable(true);
          break;
        case 'Route':
          setActiveHostAndSession(record);
          setRouteModalVisable(true);
          break;
        case 'PortFwd':
          setActiveHostAndSession(record);
          setPortFwdModalVisable(true);
          break;
        case 'Transport':
          setActiveHostAndSession(record);
          setTransportModalVisable(true);
          break;
        case 'DestorySession':
          destorySessionReq.run({ sessionid: record.session.id });
          break;
        default:
          console.log('unknow command');
      }
    };

    return (
      <Menu style={{ width: 104 }} onClick={onClick}>
        <Menu.Item key='SessionInfo'>
          <ContactsOutlined />
          权限信息
        </Menu.Item>
        <Menu.Item key='FileSession'>
          <DesktopOutlined />
          文件管理
        </Menu.Item>
        <Menu.Item key='Route'>
          <PartitionOutlined />
          内网路由
        </Menu.Item>
        <Menu.Item key='PortFwd'>
          <SwapOutlined />
          端口转发
        </Menu.Item>
        <Menu.Item key='Transport'>
          <NodeIndexOutlined />
          传输协议
        </Menu.Item>
        <Menu.Item key='SessionIO'>
          <CodeOutlined />
          命令终端
        </Menu.Item>
        <Menu.Item key='DestorySession'>
          <CloseCircleOutlined style={{ color: 'red' }} />
          <span style={{ color: 'red' }}>删除权限</span>
        </Menu.Item>
      </Menu>
    );
  };
  const HostMenu = record => {
    const onClick = ({ key }) => {
      switch (key) {
        case 'HostInfo':
          setActiveHostAndSession(record);
          setHostInfoModalVisable(true);
          break;
        case 'PortService':
          setActiveHostAndSession(record);
          setPortServiceModalVisable(true);
          break;
        case 'Vulnerability':
          setActiveHostAndSession(record);
          setVulnerabilityModalVisable(true);
          break;
        case 'DestoryHost':
          destoryHostReq.run({ ipaddress: record.ipaddress });
          break;
        default:
          console.log('unknow command');
      }
    };

    return (
      <Menu style={{ width: 104 }} onClick={onClick}>
        <Menu.Item key='HostInfo'>
          <ProfileOutlined />
          主机信息
        </Menu.Item>
        <Menu.Item key='PortService'>
          <InteractionOutlined />
          开放端口
        </Menu.Item>
        <Menu.Item key='Vulnerability'>
          <BugOutlined />
          已知漏洞
        </Menu.Item>
        <Menu.Item key='DestoryHost'>
          <DeleteOutlined style={{ color: 'red' }} />
          <span style={{ color: 'red' }}>删除主机</span>
        </Menu.Item>
      </Menu>
    );
  };
  return (
    <Fragment>
      <Table
        loading={!heatbeatsocketalive}
        className={styles.hostandsessionTable}
        rowKey='order_id'
        size='small'
        locale={{ emptyText: null }}
        pagination={false}
        dataSource={hostAndSessionList}
        showHeader={false}
        columns={[
          {
            dataIndex: 'ipaddress',
            width: 120,
            render: (text, record) => {
              return (
                <Button
                  onClick={() => {
                    setRunModuleModalVisable(true);
                    setActiveHostAndSession(record);
                  }}
                  style={{
                    width: 96,
                    backgroundColor: '#15395b',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                  size='small'
                >
                  <CaretRightOutlined />
                </Button>
              );
            },
          },
          {
            dataIndex: 'ipaddress',
            width: 144,
            render: (text, record) => (
              <div
                style={{
                  display: 'flex',
                  cursor: 'pointer',
                }}
              >
                <Dropdown overlay={() => HostMenu(record)} trigger={['contextMenu', 'click']}>
                  <Tag
                    color='gold'
                    style={{
                      width: 120,
                      textAlign: 'center',
                      marginRight: 4,
                      cursor: 'pointer',
                    }}
                  >
                    <strong>{record.ipaddress}</strong>
                  </Tag>
                </Dropdown>
              </div>
            ),
          },
          {
            title: 'Session',
            render: (text, record) => {
              if (record.session === null || record.session === undefined) {
                return null;
              }
              // 心跳标签
              const fromnowTime = (moment().unix() - record.session.fromnow) * 1000;
              const timepass = record.session.fromnow;
              let heartbeat = null;

              if (timepass <= 60) {
                heartbeat = (
                  <Tooltip title={timepass + 's'} placement='left'>
                    <Tag
                      color='green'
                      style={{
                        width: 72,
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      {timepass + 's'}
                    </Tag>
                  </Tooltip>
                );
              } else if (60 < timepass && timepass <= 90) {
                heartbeat = (
                  <Tooltip title={timepass + 's'} placement='left'>
                    <Tag
                      color='orange'
                      style={{
                        width: 72,
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      {timepass + 's'}
                    </Tag>
                  </Tooltip>
                );
              } else {
                heartbeat = (
                  <Tooltip title={timepass + 's'} placement='left'>
                    <Tag
                      color='red'
                      style={{
                        width: 72,
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      {moment(fromnowTime).fromNow()}
                    </Tag>
                  </Tooltip>
                );
              }

              // sessionid
              const sessionidTag = (
                <Tag
                  color='purple'
                  style={{
                    minWidth: 48,
                    marginLeft: -6,
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <strong>{record.session.id}</strong>
                </Tag>
              );

              // sessionid
              const pidTag = (
                <Tooltip
                  mouseEnterDelay={1}
                  placement='bottomLeft'
                  title={<span>Pid {record.session.pid}</span>}
                >
                  <Tag
                    color='magenta'
                    style={{
                      // width: 64,
                      marginLeft: -6,
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{record.session.pid}</span>
                  </Tag>
                </Tooltip>
              );

              // 连接标签
              const connecttooltip = (
                <div>
                  {record.session.tunnel_local}
                  {' <- '}
                  {record.session.tunnel_peer} {record.session.tunnel_peer_locate}
                </div>
              );
              const connectTag = (
                <Tooltip mouseEnterDelay={1} placement='bottomLeft' title={connecttooltip}>
                  <Tag
                    color='cyan'
                    style={{
                      width: 120,
                      textAlign: 'center',
                      marginLeft: -6,
                      cursor: 'pointer',
                    }}
                  >
                    {record.session.tunnel_peer_ip}
                  </Tag>
                </Tooltip>
              );

              // arch
              const archTag =
                record.session.arch === 'x64' ? (
                  <Tag
                    color='geekblue'
                    style={{
                      cursor: 'pointer',
                      marginLeft: -6,
                    }}
                  >
                    {record.session.arch}
                  </Tag>
                ) : (
                  <Tag
                    color='volcano'
                    style={{
                      cursor: 'pointer',
                      marginLeft: -6,
                    }}
                  >
                    {record.session.arch}
                  </Tag>
                );

              // os标签
              const os_tag =
                record.session.platform === 'windows' ? (
                  <Tooltip mouseEnterDelay={1} placement='bottomLeft' title={record.session.os}>
                    <Tag
                      color='blue'
                      style={{
                        marginLeft: -6,
                        cursor: 'pointer',
                      }}
                    >
                      <div className={styles.sessionOSTextOverflow}>
                        <MyIcon
                          type='icon-windows'
                          style={{
                            marginBottom: 0,
                            marginRight: 4,
                            fontSize: '14px',
                          }}
                        />
                        {record.session.os_short}
                      </div>
                    </Tag>
                  </Tooltip>
                ) : (
                  <Tooltip mouseEnterDelay={1} placement='right' title={record.session.os}>
                    <Tag
                      color='magenta'
                      style={{
                        marginLeft: -6,
                        cursor: 'pointer',
                      }}
                    >
                      <div className={styles.sessionOSTextOverflow}>
                        <MyIcon
                          type='icon-linux'
                          style={{
                            fontSize: '14px',
                            marginRight: 4,
                          }}
                        />
                        {record.session.os_short}
                      </div>
                    </Tag>
                  </Tooltip>
                );

              // user标签
              let user = null;
              if (record.session.available === true && record.session.isadmin === true) {
                user = (
                  <Tooltip mouseEnterDelay={1} placement='bottomLeft' title={record.session.info}>
                    <Tag
                      color='orange'
                      style={{
                        marginLeft: -6,
                        cursor: 'pointer',
                      }}
                    >
                      <div className={styles.sessionInfoTextOverflow}>{record.session.info}</div>
                    </Tag>
                  </Tooltip>
                );
              } else {
                user = (
                  <Tooltip mouseEnterDelay={1} placement='bottomLeft' title={record.session.info}>
                    <Tag
                      style={{
                        marginLeft: -6,
                        cursor: 'pointer',
                      }}
                    >
                      <div className={styles.sessionInfoTextOverflow}>{record.session.info}</div>
                    </Tag>
                  </Tooltip>
                );
              }
              // handler标签
              const jobidTagTooltip = (
                <span>
                    {record.session.job_info.PAYLOAD} {record.session.job_info.LHOST}{' '}
                  {record.session.job_info.RHOST} {record.session.job_info.LPORT}{' '}
                  </span>
              );
              const jobidTag = (
                <Tooltip mouseEnterDelay={1} placement='bottomLeft' title={jobidTagTooltip}>
                  <Tag
                    color='lime'
                    style={{
                      minWidth: 48,
                      marginLeft: -6,
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{record.session.job_info.job_id}</span>
                  </Tag>
                </Tooltip>
              );

              return (
                <Dropdown
                  overlay={() => SessionMenu(record)}
                  trigger={['contextMenu', 'click']}
                  placement='bottomLeft'
                >
                  <div
                    style={{
                      display: 'flex',
                      cursor: 'pointer',
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
                  </div>
                </Dropdown>
              );
            },
          },
          {
            dataIndex: 'ipaddress',
            width: 240,
            render: (text, record) => (
              <div
                style={{
                  display: 'flex',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setActiveHostAndSession(record);
                  setUpdateHostModalVisable(true);
                }}
              >
                <Text
                  className={styles.percent}
                  ellipsis={{
                    rows: 1,
                    tooltip: true,
                  }}
                >
                  {record.comment}
                </Text>
              </div>
            ),
          },
          {
            dataIndex: 'ipaddress',
            width: 64,
            render: (text, record) => (
              <div
                style={{
                  display: 'flex',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setActiveHostAndSession(record);
                  setUpdateHostModalVisable(true);
                }}
              >
                {host_type_to_avatar_table[record.tag]}
              </div>
            ),
          },
        ]}
      />
      <Modal
        mask={false}
        style={{ top: 32 }}
        width='90vw'
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
        width='70vw'
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
        width='80vw'
        destroyOnClose
        visible={fileSessionModalVisable}
        onCancel={() => setFileSessionModalVisable(false)}
        footer={null}
        bodyStyle={{ padding: '8px 0px 0px 0px' }}
      >
        <FileSessionMemo />
      </Modal>

      <Modal
        title='内网路由'
        style={{ top: 32 }}
        width='70vw'
        destroyOnClose
        visible={routeModalVisable}
        onCancel={() => setRouteModalVisable(false)}
        footer={null}
        bodyStyle={{ padding: '0px 0px 16px 0px' }}
      >
        <MsfRouteMemo />
      </Modal>

      <Modal
        title='端口转发'
        style={{ top: 32 }}
        width='80vw'
        destroyOnClose
        visible={portFwdModalVisable}
        onCancel={() => setPortFwdModalVisable(false)}
        footer={null}
        bodyStyle={{ padding: '0px 0px 16px 0px' }}
      >
        <PortFwdMemo />
      </Modal>

      <Modal
        title='传输协议'
        style={{ top: 32 }}
        width='80vw'
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
        width='70vw'
        destroyOnClose
        visible={sessionIOModalVisable}
        onCancel={() => setSessionIOModalVisable(false)}
        footer={null}
        bodyStyle={{ padding: '8px 8px 8px 8px' }}
      >
        <SessionIOMemo />
      </Modal>

      <Modal
        style={{ top: 32 }}
        width='80vw'
        destroyOnClose
        visible={hostInfoModalVisable}
        onCancel={() => setHostInfoModalVisable(false)}
        footer={null}
        bodyStyle={{ padding: '8px 8px 8px 8px' }}
      >
        <HostInfoMemo />
      </Modal>

      <Modal
        title='开放端口'
        style={{ top: 32 }}
        width='70vw'
        destroyOnClose
        visible={portServiceModalVisable}
        onCancel={() => setPortServiceModalVisable(false)}
        footer={null}
        bodyStyle={{ padding: '0px 8px 0px 8px' }}
      >
        <PortServiceMemo />
      </Modal>

      <Modal
        title='漏洞信息'
        style={{ top: 32 }}
        width='70vw'
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
          top: 32,
          left: 'calc(20vw)',
        }}
        width='548px'
        bodyStyle={{ padding: '0px 0px 0px 0px' }}
        destroyOnClose
        visible={updateHostModalVisable}
        footer={null}
        mask={false}
        onCancel={() => setUpdateHostModalVisable(false)}
      >
        <UpdateHostMemo closeModal={() => setUpdateHostModalVisable(false)} />
      </Modal>
    </Fragment>
  );
};

const Msfconsole = props => {
  console.log('Msfconsole');
  const fitAddon = useRef(new FitAddon());
  const msfConsoleTerm = useRef(null);
  const wsmsf = useRef(null);

  useImperativeHandle(props.onRef, () => {
    return {
      autoInit: () => {
        try {
        } catch (error) {
          console.error(error);
        }
      },
    };
  });

  useEffect(() => {
    initMsfconsole();
    return () => {
      try {
        wsmsf.current.close();
        msfConsoleTerm.current.close();
        msfConsoleTerm.current.dispose();
      } catch (error) {
      }
    };
  }, []);

  const clearConsole = () => {
    msfConsoleTerm.current.clear();
  };
  const resetBackendConsole = () => {
    const sendMessage = { status: 0, cmd: 'reset' };
    const sendData = JSON.stringify(sendMessage);
    wsmsf.current.send(sendData);
  };

  const initMsfconsole = () => {
    const urlargs = `&token=${getToken()}`;
    const urlpatternsMsf = '/ws/v1/websocket/msfconsole/?';
    const socketUrlMsf = protocol + webHost + urlpatternsMsf + urlargs;
    wsmsf.current = new WebSocket(socketUrlMsf);

    wsmsf.current.onopen = () => {
      if (msfConsoleTerm.current === null) {
        msfConsoleTerm.current = new Terminal({
          allowTransparency: true,
          useStyle: true,
          cursorBlink: true,
        });

        msfConsoleTerm.current.attachCustomKeyEventHandler(e => {
          if (e.keyCode === 39 || e.keyCode === 37) {
            return false;
          }
          if (e.keyCode === 45 || e.keyCode === 36) {
            return false;
          }
          return true;
        });
      }

      msfConsoleTerm.current.open(document.getElementById('msfconsole_terminal'));
      msfConsoleTerm.current.loadAddon(fitAddon.current);
      fitAddon.current.fit();

      msfConsoleTerm.current.onData(data => {
        const sendMessage = { status: 0, data };
        const sendData = JSON.stringify(sendMessage);
        wsmsf.current.send(sendData);
      });
      msfConsoleTerm.current.onSelectionChange(e => {
        if (msfConsoleTerm.current.hasSelection()) {
          copy(msfConsoleTerm.current.getSelection());
        }
      });

      const firstMessage = { status: 0, data: '\r' };
      const firstData = JSON.stringify(firstMessage);
      wsmsf.current.send(firstData);
    };

    wsmsf.current.onclose = CloseEvent => {
      try {
        msfConsoleTerm.current.close();
        msfConsoleTerm.current.dispose();
      } catch (error) {
      }
    };

    wsmsf.current.onmessage = event => {
      const recv_message = JSON.parse(event.data);
      msfConsoleTerm.current.write(recv_message.data);
    };
  };

  return (
    <Card style={{ marginTop: -16 }} bodyStyle={{ padding: '0px 0px 0px 0px' }} bordered>
      <div className={styles.msfconsolediv} id='msfconsole_terminal'>
        <Space
          style={{
            top: 16,
            right: 16,
            position: 'absolute',
            zIndex: 10000,
          }}
          direction='vertical'
        >
          <Button
            style={{
              backgroundColor: 'rgba(40,40,40,0.7)',
            }}
            size='large'
            onClick={() => clearConsole()}
            icon={<ClearOutlined />}
          />
          <Button
            style={{
              backgroundColor: 'rgba(40,40,40,0.7)',
            }}
            size='large'
            icon={<InteractionOutlined />}
            onClick={() => resetBackendConsole()}
          />
        </Space>
      </div>
    </Card>
  );
};

const MsfconsoleMemo = memo(Msfconsole);

const TaskQueueTag = () => {
  console.log('TaskQueueTag');
  const { taskQueueLength } = useModel('HostAndSessionModel', model => ({
    taskQueueLength: model.taskQueueLength,
  }));
  if (taskQueueLength > 0) {
    return (
      <Badge
        showZero
        style={{
          marginTop: -4,
          marginLeft: -4,
          marginRight: 10,
          color: '#73d13d',
          backgroundColor: '#092b00',
          boxShadow: '0 0 0 1px #237804 inset',
        }}
        count={taskQueueLength}
      />
    );
  } else {
    return <FieldTimeOutlined />;
  }
};
const TaskQueueTagMemo = memo(TaskQueueTag);

const TabsBottom = () => {
  console.log('TabsBottom');
  let filemsfRef = React.createRef();
  let consoleRef = React.createRef();
  const [viperDebugFlag, setViperDebugFlag] = useLocalStorageState('viper-debug-flag', false);
  const tabActiveOnChange = activeKey => {
    switch (activeKey) {
      case 'msfconsole':
        if (consoleRef.current === null) {
        } else {
          consoleRef.current.autoInit();
        }
        break;
      case 'Socks':
        break;
      case 'filemsf':
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
        break;
      case 'MuitHosts':
        break;
      case 'SystemSetting':
        break;
      default:
    }
  };

  return (
    <Fragment>
      <Tabs style={{ marginTop: 4 }} type='card' onChange={tabActiveOnChange}>
        <TabPane
          tab={
            <div>
              <FundViewOutlined />
              实时输出
            </div>
          }
          key='notices'
        >
          <Row gutter={0}>
            <Col span={14}>
              <RealTimeModuleResultMemo />
            </Col>
            <Col span={10}>
              <RealTimeNoticesMemo />
            </Col>
          </Row>
        </TabPane>
        <TabPane
          tab={
            <span>
              <TaskQueueTagMemo />
              任务列表
            </span>
          }
          key='JobList'
        >
          <RealTimeJobsMemo />
        </TabPane>
        <TabPane
          tab={
            <span>
              <CustomerServiceOutlined />
              监听载荷
            </span>
          }
          key='PayloadAndHandler'
        >
          <PayloadAndHandlerMemo />
        </TabPane>
        <TabPane
          tab={
            <span>
              <FolderOpenOutlined />
              文件列表
            </span>
          }
          key='filemsf'
        >
          <FileMsfMemo onRef={filemsfRef} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <ShareAltOutlined />
              网络拓扑
            </span>
          }
          key='Network'
        >
          <NetworkMemo />
        </TabPane>
        <TabPane
          tab={
            <span>
              <RobotOutlined />
              自动编排
            </span>
          }
          key='AutoRobot'
        >
          <AutoRobotMemo />
        </TabPane>
        <TabPane
          tab={
            <span>
              <SisternodeOutlined />
              内网代理
            </span>
          }
          key='Socks'
        >
          <MsfSocksMemo />
        </TabPane>
        <TabPane
          tab={
            <span>
              <GroupOutlined />
              主机列表
            </span>
          }
          key='MuitHosts'
        >
          <MuitHostsMemo />
        </TabPane>
        <TabPane
          tab={
            <span>
              <KeyOutlined />
              凭证列表
            </span>
          }
          key='Credential'
        >
          <CredentialMemo />
        </TabPane>
        {viperDebugFlag ? (
          <TabPane
            tab={
              <span>
                <MailOutlined />
                钓鱼管理
              </span>
            }
            key='LazyLoader'
          >
            <LazyLoaderMemo />
          </TabPane>
        ) : null}
        <TabPane
          tab={
            <span>
              <RadarChartOutlined />
              全网扫描
            </span>
          }
          key='BotScan'
        >
          <BotScan />
        </TabPane>
        <TabPane
          tab={
            <span>
              <CodeOutlined />
              CONSOLE
            </span>
          }
          key='msfconsole'
          // forceRender
        >
          <MsfconsoleMemo onRef={consoleRef} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <SettingOutlined />
              平台设置
            </span>
          }
          key='SystemSetting'
        >
          <SystemSettingMemo />
        </TabPane>
      </Tabs>
    </Fragment>
  );
};

const PostModuleInfoContent = postModuleConfig => {
  const platform = postModuleConfig.PLATFORM;
  const platformCom = [];
  for (let i = 0; i < platform.length; i++) {
    if (platform[i].toLowerCase() === 'windows') {
      platformCom.push(<Tag color='green'>{platform[i]}</Tag>);
    } else {
      platformCom.push(<Tag color='magenta'>{platform[i]}</Tag>);
    }
  }

  const permissions = postModuleConfig.PERMISSIONS;
  const permissionsCom = [];
  for (let i = 0; i < permissions.length; i++) {
    if (['system', 'root'].indexOf(permissions[i].toLowerCase()) >= 0) {
      permissionsCom.push(<Tag color='volcano'>{permissions[i]}</Tag>);
    } else if (['administrator'].indexOf(permissions[i].toLowerCase()) >= 0) {
      permissionsCom.push(<Tag color='orange'>{permissions[i]}</Tag>);
    } else {
      permissionsCom.push(<Tag color='lime'>{permissions[i]}</Tag>);
    }
  }

  const references = postModuleConfig.REFERENCES;
  const referencesCom = [];
  for (let i = 0; i < references.length; i++) {
    referencesCom.push(
      <div>
        <a href={references[i]} target='_blank'>
          {references[i]}
        </a>
      </div>,
    );
  }

  const readme = postModuleConfig.README;
  const readmeCom = [];
  for (let i = 0; i < readme.length; i++) {
    readmeCom.push(
      <div>
        <a href={readme[i]} target='_blank'>
          {readme[i]}
        </a>
      </div>,
    );
  }

  const attcks = postModuleConfig.ATTCK;
  const attckCom = [];
  for (let i = 0; i < attcks.length; i++) {
    attckCom.push(<Tag color='gold'>{attcks[i]}</Tag>);
  }

  const authors = postModuleConfig.AUTHOR;
  const authorCom = [];
  for (let i = 0; i < authors.length; i++) {
    authorCom.push(<Tag color='lime'>{authors[i]}</Tag>);
  }

  return (
    <Descriptions
      size='small'
      style={{
        padding: '0 0 0 0',
        marginRight: 8,
      }}
      column={8}
      bordered
    >
      <Descriptions.Item label='名称' span={8}>
        {postModuleConfig.NAME}
      </Descriptions.Item>
      <Descriptions.Item label='作者' span={4}>
        {authorCom}
      </Descriptions.Item>
      <Descriptions.Item label='TTPs' span={4}>
        {attckCom}
      </Descriptions.Item>
      <Descriptions.Item label='适用系统' span={4}>
        {platformCom}
      </Descriptions.Item>
      <Descriptions.Item label='适用权限' span={4}>
        {permissionsCom}
      </Descriptions.Item>
      <Descriptions.Item label='使用文档' span={8}>
        {readmeCom}
      </Descriptions.Item>
      <Descriptions.Item label='参考链接' span={8}>
        {referencesCom}
      </Descriptions.Item>
      <Descriptions.Item span={8} label='简介'>
        <pre>{postModuleConfig.DESC}</pre>
      </Descriptions.Item>
    </Descriptions>
  );
};

const RealTimeJobs = () => {
  console.log('RealTimeJobs');
  const { jobList, setJobList } = useModel('HostAndSessionModel', model => ({
    jobList: model.jobList,
    setJobList: model.setJobList,
  }));

  const destoryJobReq = useRequest(deleteMsgrpcJobAPI, {
    manual: true,
    onSuccess: (result, params) => {
      const { uuid } = result;
      setJobList(jobList.filter(item => item.uuid !== uuid));
    },
    onError: (error, params) => {
    },
  });

  const onDestoryJob = record => {
    destoryJobReq.run({ uuid: record.uuid, job_id: record.job_id, broker: record.broker });
  };

  return (
    <Table
      style={{ marginTop: -16 }}
      className={styles.jobListTable}
      size='small'
      rowKey='job_id'
      pagination={false}
      dataSource={jobList}
      bordered
      columns={[
        {
          title: '开始时间',
          dataIndex: 'time',
          key: 'time',
          width: 80,
          render: (text, record) => <Tag color='cyan'>{moment(record.time * 1000).fromNow()}</Tag>,
        },
        {
          title: '模块',
          dataIndex: 'moduleinfo',
          key: 'moduleinfo',
          width: 240,
          render: (text, record) => (
            <Popover
              placement='right'
              content={PostModuleInfoContent(record.moduleinfo)}
              trigger='click'
            >
              <a>{record.moduleinfo.NAME}</a>
            </Popover>
          ),
        },
        {
          title: 'SID',
          dataIndex: 'time',
          key: 'time',
          width: 48,
          render: (text, record) => {
            return SidTag(record.moduleinfo._sessionid);
          },
        },
        {
          title: '参数',
          dataIndex: 'moduleinfo',
          key: 'moduleinfo',
          render: (text, record) => {
            const component = [];
            for (const key in record.moduleinfo._custom_param) {
              const item = record.moduleinfo._custom_param[key];
              component.push(
                <span>
                  {' '}
                  <strong>{key}: </strong>
                  {item}{' '}
                </span>,
              );
            }
            return <Fragment>{component}</Fragment>;
          },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: 48,
          render: (text, record) => (
            <a style={{ color: 'red' }} onClick={() => onDestoryJob(record)}>
              删除
            </a>
          ),
        },
      ]}
    />
  );
};

const RealTimeJobsMemo = memo(RealTimeJobs);

const RealTimeModuleResult = () => {
  console.log('RealTimeModuleResult');
  const {
    postModuleResultHistory,
    setPostModuleResultHistory,
    postModuleResultHistoryActive,
    setPostModuleResultHistoryActive,
  } = useModel('HostAndSessionModel', model => ({
    postModuleResultHistory: model.postModuleResultHistory,
    setPostModuleResultHistory: model.setPostModuleResultHistory,
    postModuleResultHistoryActive: model.postModuleResultHistoryActive,
    setPostModuleResultHistoryActive: model.setPostModuleResultHistoryActive,
  }));

  const [text, setText] = useState('');

  const [refresh, setRefresh] = useState(false);
  useInterval(() => setRefresh(!refresh), 60000);

  const handlePostModuleResultHistorySearch = text => {
    const reg = new RegExp(text, 'gi');
    const afterFilterList = postModuleResultHistory
      .map(record => {
        let moduleNameMatch = false;
        let resultMatch = false;
        let optsMatch = false;
        let hostMatch = false;
        const optsStr = JSON.stringify(record.opts);
        try {
          moduleNameMatch = record.module_name.match(reg);
          resultMatch = record.result.match(reg);
          optsMatch = optsStr.match(reg);
          hostMatch = record.ipaddress.match(reg);
        } catch (error) {
        }

        if (moduleNameMatch || resultMatch || optsMatch || hostMatch) {
          return { ...record };
        }
        return null;
      })
      .filter(record => !!record);
    setPostModuleResultHistoryActive(afterFilterList);
  };

  const postModuleOpts = opts => {
    let optStr = '';
    for (const key in opts) {
      optStr = `${optStr}  ${key}: ${opts[key]}`;
    }
    return <div className={styles.moduleresultoptions}>{optStr}</div>;
  };

  const deletePostModuleResultHistoryReq = useRequest(deletePostmodulePostModuleResultHistoryAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setPostModuleResultHistory([]);
      setPostModuleResultHistoryActive([]);
    },
    onError: (error, params) => {
    },
  });

  return (
    <Fragment>
      <Row style={{ marginTop: -16 }}>
        <Col span={21}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            style={{ width: '100%' }}
            placeholder=' 主机IP/模块/参数/结果'
            value={text}
            onChange={e => {
              setText(e.target.value);
              handlePostModuleResultHistorySearch(e.target.value);
            }}
          />
        </Col>
        <Col span={3}>
          <Tooltip mouseEnterDelay={0.3} title='清空结果'>
            <Button
              block
              danger
              onClick={() => deletePostModuleResultHistoryReq.run()}
              icon={<DeleteOutlined />}
            >
              清空
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <List
        id='moduleresultlist'
        bordered
        className={styles.moduleresultlist}
        itemLayout='vertical'
        size='small'
        dataSource={postModuleResultHistoryActive}
        renderItem={item => (
          <List.Item key={item.id} style={{ padding: '4px 0px 0px 4px' }}>
            <div>
              <Tooltip title={moment(item.update_time * 1000).format('YYYY-MM-DD HH:mm:ss')}>
                <Tag style={{ width: '68px' }} color='cyan'>
                  {moment(item.update_time * 1000).fromNow()}
                </Tag>
              </Tooltip>
              <strong
                style={{
                  color: '#642ab5',
                }}
              >
                {item.module_name}
              </strong>
              <strong
                style={{
                  color: '#d8bd14',
                  width: 120,
                  marginLeft: 8,
                }}
              >
                {item.ipaddress}
              </strong>
            </div>
            <div
              style={{
                marginTop: 0,
              }}
            >
              {postModuleOpts(item.opts)}
            </div>
            <Row>
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    overflowX: 'hidden',
                    padding: '0 0 0 0',
                    marginTop: 2,
                    marginBottom: 2,
                  }}
                >
                  {item.result}
                </pre>
            </Row>
          </List.Item>
        )}
      >
        <BackTop
          style={{
            right: 'calc(41vw + 32px)',
          }}
          target={() => document.getElementById('moduleresultlist')}
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
            <VerticalAlignTopOutlined />
          </div>
        </BackTop>
      </List>

    </Fragment>
  );
};

const RealTimeModuleResultMemo = memo(RealTimeModuleResult);

const KeyToUserIcon = {
  '0': 'icon-yuanxingbaoshi',
  '1': 'icon-sanjiaobaoshi',
  '2': 'icon-shuidibaoshi',
  '3': 'icon-liujiaobaoshi',
  '4': 'icon-lingxingbaoshi',
  '5': 'icon-duojiaobaoshi',
};

// 单独独立出来是为了不丢失焦点
const UserInput = props => {
  const [text, onInputChange] = useControllableValue(
    {},
    {
      defaultValue: '',
    },
  );
  const userIcon = key => {
    return (
      <MyIcon
        type={KeyToUserIcon[key]}
        style={{
          padding: '0px 0px 0px 0px',
          marginBottom: 0,
          marginTop: 0,
          marginLeft: -4,
          marginRight: 4,
          fontSize: '18px',
        }}
      />
    );
  };
  const getUserIconKey = () => {
    let key = '0';
    if (localStorage.getItem('UserIcon') === null) {
      localStorage.setItem('UserIcon', '0');
    } else {
      key = localStorage.getItem('UserIcon');
    }
    return key;
  };
  const [iconkey, setIconkey] = useState(getUserIconKey());
  const PrefixIcon = () => {
    const onChange = e => {
      console.log('radio checked', e.target.value);
      setIconkey(e.target.value);
      localStorage.setItem('UserIcon', e.target.value);
    };
    return (
      <Popover
        content={
          <Radio.Group onChange={onChange} value={getUserIconKey()}>
            <Radio value='0'>{userIcon('0')}</Radio>
            <Radio value='1'>{userIcon('1')}</Radio>
            <Radio value='2'>{userIcon('2')}</Radio>
            <Radio value='3'>{userIcon('3')}</Radio>
            <Radio value='4'>{userIcon('4')}</Radio>
            <Radio value='5'>{userIcon('5')}</Radio>
          </Radio.Group>
        }
        trigger='click'
      >
        {userIcon(iconkey)}
      </Popover>
    );
  };

  return (
    <Input
      style={{ width: '100%' }}
      placeholder='发送消息'
      value={text}
      prefix={<PrefixIcon />}
      onPressEnter={() => {
        props.createNotice({ userkey: iconkey, content: text });
        onInputChange('');
      }}
      onChange={e => onInputChange(e.target.value)}
    />
  );
};

const RealTimeNotices = () => {
  console.log('RealTimeNotices');
  const { notices, setNotices } = useModel('HostAndSessionModel', model => ({
    notices: model.notices,
    setNotices: model.setNotices,
  }));
  const [refresh, setRefresh] = useState(false);
  useInterval(() => setRefresh(!refresh), 60000);

  const userIconLarge = key => {
    return (
      <MyIcon
        type={KeyToUserIcon[key]}
        style={{
          fontSize: '18px',
        }}
      />
    );
  };

  const NoticesList = props => {
    const getContent = item => {
      if (item.level === 0) {
        return (
          <Text style={{ color: '#49aa19' }} className={styles.wordBreakClass}>
            {item.content}
          </Text>
        );
      }
      if (item.level === 1) {
        return (
          <Text style={{ color: '#13a8a8' }} className={styles.wordBreakClass}>
            {item.content}
          </Text>
        );
      }
      if (item.level === 2) {
        return (
          <Text type='warning' className={styles.wordBreakClass}>
            {item.content}
          </Text>
        );
      }
      if (item.level === 3) {
        return (
          <Text type='danger' className={styles.wordBreakClass}>
            {item.content}
          </Text>
        );
      }
      if (item.level === 4) {
        return (
          <Text mark className={styles.wordBreakClass}>
            {item.content}
          </Text>
        );
      }
      if (item.level === 5) {
        // 提醒
        return (
          <Text style={{ color: '#642ab5' }} className={styles.wordBreakClass}>
            {item.content}
          </Text>
        );
      }
      if (item.level === 6) {
        // 用户输入
        return (
          <Text style={{ color: '#cb2b83' }} className={styles.wordBreakClass}>
            <Space>
              {userIconLarge(item.userkey)}
              {item.content}
              {userIconLarge(item.userkey)}
            </Space>
          </Text>
        );
      }
      return (
        <Text type='warning' className={styles.wordBreakClass}>
          {item.content}
        </Text>
      );
    };
    return (
      <List
        id='noticescard'
        className={styles.noticelist}
        split={false}
        size='small'
        bordered
        itemLayout='horizontal'
        dataSource={props.notices}
        renderItem={item => (
          <List.Item style={{ padding: '0px 0px 0px 0px' }}>
            <div
              style={{
                display: 'inline',
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              <Tooltip title={moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss')}>
                <Tag
                  color='cyan'
                  style={{
                    marginLeft: -1,
                    width: 68,
                    marginRight: 4,
                  }}
                >
                  {moment(item.time * 1000).fromNow()}
                </Tag>
              </Tooltip>
              {getContent(item)}
            </div>
          </List.Item>
        )}
      >
        <BackTop
          style={{
            right: 24,
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
            <VerticalAlignTopOutlined />
          </div>
        </BackTop>
      </List>
    );
  };
  const createNoticeReq = useRequest(postCoreNoticesAPI, {
    manual: true,
    onSuccess: (result, params) => {
      // notices.unshift(result);
      // setNotices(notices);
    },
    onError: (error, params) => {
    },
  });

  const deleteNoticesReq = useRequest(deleteNoticesAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setNotices([]);
    },
    onError: (error, params) => {
    },
  });

  return (
    <Fragment>
      <Row style={{ marginTop: -16 }}>
        <Col span={20}>
          <UserInput createNotice={params => createNoticeReq.run(params)} />
        </Col>
        <Col span={4}>
          <Tooltip mouseEnterDelay={0.3} title='清空日志'>
            <Button icon={<DeleteOutlined />} block danger onClick={() => deleteNoticesReq.run()}>
              清空
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <NoticesList notices={notices} />
    </Fragment>
  );
};

const RealTimeNoticesMemo = memo(RealTimeNotices);

const SessionInfo = () => {
  console.log('SessionInfo');
  const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
    hostAndSessionActive: model.hostAndSessionActive,
  }));
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
    tunnel_peer_locate: null,
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
  });
  const initListSessionInfoReq = useRequest(
    () => getMsgrpcSessionAPI({ sessionid: hostAndSessionActive.session.id }),
    {
      onSuccess: (result, params) => {
        setSessionInfoActive(result);
      },
      onError: (error, params) => {
      },
    },
  );

  const updateSessionInfoReq = useRequest(putMsgrpcSessionAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSessionInfoActive(result);
    },
    onError: (error, params) => {
    },
  });

  const integrity_to_tag = {
    low: <Tag color='volcano'>低</Tag>,
    medium: <Tag color='orange'>中</Tag>,
    high: <Tag color='green'>高</Tag>,
    system: <Tag color='green'>高</Tag>,
  };
  const is_in_admin_group_to_tag = flag => {
    if (flag === null) {
      return <Tag>未知</Tag>;
    } else if (flag === true) {
      return <Tag color='green'>是</Tag>;
    } else if (flag === false) {
      return <Tag color='volcano'>否</Tag>;
    }
  };
  const uac_to_tag = {
    '-1': <Tag color='red'>未知</Tag>,
    '0': <Tag color='green'>关闭</Tag>,
    '1': <Tag color='magenta'>总是通知</Tag>,
    '2': <Tag color='magenta'>总是通知</Tag>,
    '3': <Tag color='magenta'>总是通知</Tag>,
    '4': <Tag color='magenta'>总是通知</Tag>,
    '5': <Tag color='orange'>默认</Tag>,
  };
  const processColumns = [
    {
      title: 'PID',
      dataIndex: 'pid',
      width: 80,
      sorter: (a, b) => a.pid >= b.pid,
    },
    {
      title: 'PPID',
      dataIndex: 'ppid',
      width: 80,
      sorter: (a, b) => a.ppid >= b.ppid,
    },
    {
      title: 'NAME',
      dataIndex: 'name',
      sorter: (a, b) => a.name >= b.name,
    },
    {
      title: 'PATH',
      dataIndex: 'path',
    },
    {
      title: 'USER',
      dataIndex: 'user',
      sorter: (a, b) => a.user >= b.user,
    },
    {
      title: 'ARCH',
      width: 80,
      dataIndex: 'arch',
      sorter: (a, b) => a.arch >= b.arch,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 60,
      render: (text, record) => (
        <Popover
          style={{ width: '50vw' }}
          arrowPointAtCenter
          placement='left'
          content={
            <PostModuleMemo
              loadpath='MODULES.DefenseEvasion_ProcessInjection_ProcessHandle'
              hostAndSessionActive={hostAndSessionActive}
              initialValues={{ PID: record.pid }}
            />
          }
          title='操作进程'
          trigger='click'
        >
          <a>操作</a>
        </Popover>
      ),
    },
  ];

  const os_tag_new =
    sessionInfoActive.platform === 'windows' ? (
      <Tag color='blue' style={{ marginLeft: -6 }}>
        <MyIcon
          type='icon-windows'
          style={{
            marginBottom: 0,
            marginRight: 4,
            marginLeft: -2,
            fontSize: '14px',
          }}
        />
        {sessionInfoActive.os}
      </Tag>
    ) : (
      <Tag color='magenta' style={{ marginLeft: -6 }}>
        <MyIcon
          type='icon-linux'
          style={{
            fontSize: '14px',
            marginRight: 4,
            marginLeft: -2,
          }}
        />
        {sessionInfoActive.os}
      </Tag>
    );

  const fromnowTime = (moment().unix() - sessionInfoActive.fromnow) * 1000;
  return (
    <Fragment>
      <Tabs defaultActiveKey='sessioninfo' size='small'>
        <TabPane tab='权限信息' key='sessioninfo'>
          <Descriptions
            style={{ marginTop: -16, width: '100%' }}
            size='small'
            column={12}
            bordered
            loading={initListSessionInfoReq.loading || updateSessionInfoReq.loading}
          >
            <Descriptions.Item label='心跳' span={4}>
              <Tag color='cyan'>{moment(fromnowTime).fromNow()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label='ID' span={4}>
              {SidTag(sessionInfoActive.sessionid)}
            </Descriptions.Item>
            <Descriptions.Item label='主机IP' span={8}>
              <strong style={{ color: '#d8bd14' }}>{sessionInfoActive.session_host}</strong>
            </Descriptions.Item>
            <Descriptions.Item label='Arch' span={4}>
              {sessionInfoActive.arch}
            </Descriptions.Item>
            <Descriptions.Item label='OS' span={8}>
              {os_tag_new}
            </Descriptions.Item>
            <Descriptions.Item label='管理员权限' span={4}>
              {sessionInfoActive.is_admin ? (
                <Tag color='green'>是</Tag>
              ) : (
                <Tag color='volcano'>否</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label='本地管理员组' span={4}>
              {is_in_admin_group_to_tag(sessionInfoActive.is_in_admin_group)}
            </Descriptions.Item>
            <Descriptions.Item label='用户' span={4}>
              {sessionInfoActive.user}
            </Descriptions.Item>
            <Descriptions.Item label='UAC状态' span={4}>
              {sessionInfoActive.is_uac_enable ? (
                <Tag color='magenta'>打开</Tag>
              ) : (
                <Tag color='green'>关闭</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label='UAC等级' span={4}>
              {uac_to_tag[sessionInfoActive.uac_level.toString()]}
            </Descriptions.Item>
            <Descriptions.Item label='完整性' span={4}>
              {sessionInfoActive.integrity === null ? (
                <Tag>未知</Tag>
              ) : (
                integrity_to_tag[sessionInfoActive.integrity]
              )}
            </Descriptions.Item>
            <Descriptions.Item label='域用户' span={4}>
              {sessionInfoActive.is_in_domain ? (
                <Tag color='lime'>是</Tag>
              ) : (
                <Tag color='magenta'>否</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label='域' span={4}>
              {sessionInfoActive.domain}
            </Descriptions.Item>
            <Descriptions.Item label='主机名' span={4}>
              {sessionInfoActive.computer}
            </Descriptions.Item>
            <Descriptions.Item label='Powershell插件' span={6}>
              {sessionInfoActive.load_powershell ? (
                <Tag color='lime'>已加载</Tag>
              ) : (
                <Tag>未加载</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label='Python插件' span={6}>
              {sessionInfoActive.load_python ? <Tag color='lime'>已加载</Tag> : <Tag>未加载</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label='远程端口' span={6}>
              {sessionInfoActive.tunnel_peer}
            </Descriptions.Item>
            <Descriptions.Item label='本地端口' span={6}>
              {sessionInfoActive.tunnel_local}
            </Descriptions.Item>
            <Descriptions.Item label='地理信息' span={6}>
              {sessionInfoActive.tunnel_peer_locate}
            </Descriptions.Item>
            <Descriptions.Item label='运营商' span={6}>
              {sessionInfoActive.tunnel_peer_asn}
            </Descriptions.Item>
            <Descriptions.Item label='模块' span={6}>
              {sessionInfoActive.via_exploit}
            </Descriptions.Item>
            <Descriptions.Item label='载荷' span={6}>
              {sessionInfoActive.via_payload}
            </Descriptions.Item>
          </Descriptions>
          <Space style={{ marginTop: 8 }}>
            <Button
              type='primary'
              icon={<SyncOutlined />}
              loading={updateSessionInfoReq.loading || initListSessionInfoReq.loading}
              onClick={() =>
                updateSessionInfoReq.run({ sessionid: hostAndSessionActive.session.id })
              }
            >
              更新信息
            </Button>
          </Space>
        </TabPane>
        <TabPane tab='进程列表' key='processes'>
          <Table
            className={styles.processesTable}
            columns={processColumns}
            dataSource={sessionInfoActive.processes}
            pagination={false}
            scroll={{ y: '40vh' }}
            size='small'
          />
          <Descriptions
            style={{ marginTop: 8, width: '100%' }}
            size='small'
            column={12}
            bordered
            loading={updateSessionInfoReq.loading || initListSessionInfoReq.loading}
          >
            <Descriptions.Item label='PID' span={4}>
              {sessionInfoActive.pid}
            </Descriptions.Item>
            <Descriptions.Item label='进程' span={4}>
              {sessionInfoActive.pname}
            </Descriptions.Item>
            <Descriptions.Item label='进程路径' span={4}>
              {sessionInfoActive.ppath}
            </Descriptions.Item>
          </Descriptions>
          <Space style={{ marginTop: 8 }}>
            <Button
              type='primary'
              icon={<SyncOutlined />}
              loading={updateSessionInfoReq.loading || initListSessionInfoReq.loading}
              onClick={() =>
                updateSessionInfoReq.run({ sessionid: hostAndSessionActive.session.id })
              }
            >
              更新信息
            </Button>
          </Space>
        </TabPane>
      </Tabs>
    </Fragment>
  );
};

const SessionInfoMemo = memo(SessionInfo);

const SessionIO = () => {
  console.log('SessionIO');
  const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
    hostAndSessionActive: model.hostAndSessionActive,
  }));
  const [sessionIOOutput, setSessionIOOutput] = useState('');
  const [shellInput, setShellInput] = useState('');

  const updateSessionioReq = useRequest(putMsgrpcSessionioAPI, {
    manual: true,
    onSuccess: (result, params) => {
      if (result.buffer !== sessionIOOutput) {
        setSessionIOOutput(result.buffer);
        document.getElementById('sessionIOPre').scrollTop = document.getElementById(
          'sessionIOPre',
        ).scrollHeight;
      }
    },
    onError: (error, params) => {
    },
  });

  if (hostAndSessionActive.session.id !== -1) {
    useInterval(
      () =>
        updateSessionioReq.run({
          ipaddress: hostAndSessionActive.ipaddress,
          sessionid: hostAndSessionActive.session.id,
        }),
      3000,
    );
  }

  const initUpdateSessionioReq = useRequest(
    () =>
      putMsgrpcSessionioAPI({
        ipaddress: hostAndSessionActive.ipaddress,
        sessionid: hostAndSessionActive.session.id,
      }),
    {
      onSuccess: (result, params) => {
        if (result.buffer !== sessionIOOutput) {
          setSessionIOOutput(result.buffer);
          document.getElementById('sessionIOPre').scrollTop = document.getElementById(
            'sessionIOPre',
          ).scrollHeight;
        }
      },
      onError: (error, params) => {
      },
    },
  );

  const createSessionioReq = useRequest(postMsgrpcSessionioAPI, {
    manual: true,
    onSuccess: (result, params) => {
      if (result.buffer !== sessionIOOutput) {
        setSessionIOOutput(result.buffer);
        setShellInput('');
        document.getElementById('sessionIOPre').scrollTop = document.getElementById(
          'sessionIOPre',
        ).scrollHeight;
      }
    },
    onError: (error, params) => {
    },
  });

  const onCreateSessionio = input => {
    createSessionioReq.run({
      ipaddress: hostAndSessionActive.ipaddress,
      sessionid: hostAndSessionActive.session.id,
      input: input,
    });
  };

  const destorySessionioReq = useRequest(deleteMsgrpcSessionioAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSessionIOOutput('');
    },
    onError: (error, params) => {
    },
  });
  const sessiondisabled = hostAndSessionActive.session.id === -1;

  return (
    <Fragment>
      <pre id='sessionIOPre' className={styles.sessioniopre}>
        {sessionIOOutput}
      </pre>
      <Row>
        <Button type='primary' size='small' onClick={() => onCreateSessionio('help')}>
          显示帮助
        </Button>
        <Button size='small' onClick={() => onCreateSessionio('keyscan_start')}>
          开始键盘记录
        </Button>
        <Button size='small' onClick={() => onCreateSessionio('keyscan_dump')}>
          获取键盘记录
        </Button>
        <Button size='small' onClick={() => onCreateSessionio('keyscan_stop')}>
          关闭键盘记录
        </Button>
        <Button size='small' onClick={() => onCreateSessionio('screenshot')}>
          屏幕截图
        </Button>
        <Button size='small' onClick={() => onCreateSessionio('idletime')}>
          用户离开时间
        </Button>
      </Row>
      <Row>
        <Button size='small' onClick={() => onCreateSessionio('sysinfo')}>
          SystemInfo
        </Button>
        <Button size='small' onClick={() => onCreateSessionio('hashdump')}>
          hashdump
        </Button>
        <Button size='small' onClick={() => onCreateSessionio('getsystem')}>
          获取系统权限
        </Button>
        <Button size='small' onClick={() => onCreateSessionio('load unhook')}>
          加载Unhook插件
        </Button>
        <Button size='small' onClick={() => onCreateSessionio('load powershell')}>
          加载Powershell插件
        </Button>
        <Button size='small' onClick={() => onCreateSessionio('load python')}>
          加载Python插件
        </Button>
        <Button size='small' onClick={() => onCreateSessionio('python_reset')}>
          重置Python插件
        </Button>
      </Row>
      <Row style={{ marginTop: 8 }} gutter={8}>
        <Col xs={24} sm={20}>
          <Input
            style={{ width: '100%' }}
            disabled={sessiondisabled}
            placeholder=''
            value={shellInput}
            prefix={<RightOutlined />}
            onPressEnter={() => onCreateSessionio(shellInput)}
            onChange={e => {
              setShellInput(e.target.value);
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
            清空
          </Button>
        </Col>
      </Row>
    </Fragment>
  );
};

const SessionIOMemo = memo(SessionIO);

const MsfRoute = () => {
  console.log('MsfRoute');
  const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
    hostAndSessionActive: model.hostAndSessionActive,
  }));
  const [routeActive, setRouteActive] = useState([]);
  const [autoRouteCheck, setAutoRouteCheck] = useState(false);

  const initListRouteReq = useRequest(
    () => getMsgrpcRouteAPI({ sessionid: hostAndSessionActive.session.id }),
    {
      onSuccess: (result, params) => {
        setRouteActive(result.route);
      },
      onError: (error, params) => {
      },
    },
  );
  const listRouteReq = useRequest(getMsgrpcRouteAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setRouteActive(result.route);
    },
    onError: (error, params) => {
    },
  });

  const createRouteReq = useRequest(postMsgrpcRouteAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listRouteReq.run({ sessionid: hostAndSessionActive.session.id });
    },
    onError: (error, params) => {
    },
  });

  const onCreateRoute = values => {
    createRouteReq.run({
      ...values,
      sessionid: hostAndSessionActive.session.id,
      autoroute: autoRouteCheck,
    });
  };

  const destoryRouteReq = useRequest(deleteMsgrpcRouteAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listRouteReq.run({ sessionid: hostAndSessionActive.session.id });
    },
    onError: (error, params) => {
    },
  });

  const onDestoryRoute = record => {
    destoryRouteReq.run({
      sessionid: record.session,
      subnet: record.subnet,
      netmask: record.netmask,
    });
  };
  const paginationProps = {
    simple: true,
    pageSize: 5,
  };

  return (
    <Fragment>
      <Table
        className={styles.sessionNetTable}
        // width="70vw"
        size='small'
        rowKey='subnet'
        pagination={paginationProps}
        dataSource={routeActive}
        loading={listRouteReq.loading || destoryRouteReq.loading}
        columns={[
          {
            title: '子网',
            dataIndex: 'subnet',
            key: 'subnet',
          },
          {
            title: '掩码',
            dataIndex: 'netmask',
            key: 'netmask',
          },
          {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => (
              <a style={{ color: 'red' }} onClick={() => onDestoryRoute(record)}>
                删除
              </a>
            ),
          },
        ]}
      />
      <Form
        style={{
          marginLeft: 16,
          marginTop: 8,
        }}
        layout='inline'
        onFinish={onCreateRoute}
        initialValues={{
          autoroute: false,
          netmask: '255.255.255.0',
        }}
      >
        <Form.Item label={<span>自动</span>} name='autoroute' valuePropName='checked'>
          <Checkbox onChange={e => setAutoRouteCheck(e.target.checked)} />
        </Form.Item>
        <Form.Item
          label={<span>子网</span>}
          name='subnet'
          rules={[{ required: !autoRouteCheck, message: '请输入子网' }]}
        >
          <Input disabled={autoRouteCheck} placeholder='请输入子网(10.10.10.0)' />
        </Form.Item>
        <Form.Item
          label={<span>掩码</span>}
          name='netmask'
          rules={[{ required: !autoRouteCheck, message: '请输入掩码' }]}
        >
          <Input disabled={autoRouteCheck} placeholder='请输入掩码(255.255.255.0)' />
        </Form.Item>
        <Form.Item>
          <Button
            loading={createRouteReq.loading}
            icon={<PlusOutlined />}
            type='primary'
            htmlType='submit'
          >
            新增
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            block
            icon={<SyncOutlined />}
            onClick={() => listRouteReq.run({ sessionid: hostAndSessionActive.session.id })}
            loading={listRouteReq.loading}
          >
            刷新
          </Button>
        </Form.Item>
      </Form>
    </Fragment>
  );
};

const MsfRouteMemo = memo(MsfRoute);

const PortFwd = () => {
  console.log('PortFwd');
  const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
    hostAndSessionActive: model.hostAndSessionActive,
  }));
  const [portFwdActive, setPortFwdActive] = useState([]);

  const initListPortFwdReq = useRequest(
    () => getMsgrpcPortFwdAPI({ sessionid: hostAndSessionActive.session.id }),
    {
      onSuccess: (result, params) => {
        setPortFwdActive(result);
      },
      onError: (error, params) => {
      },
    },
  );

  const listPortFwdReq = useRequest(getMsgrpcPortFwdAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setPortFwdActive(result);
    },
    onError: (error, params) => {
    },
  });

  const createPortFwdReq = useRequest(postMsgrpcPortFwdAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listPortFwdReq.run({ sessionid: hostAndSessionActive.session.id });
    },
    onError: (error, params) => {
    },
  });

  const onCreatePortFwdForward = values => {
    createPortFwdReq.run({
      ...values,
      sessionid: hostAndSessionActive.session.id,
      type: 'Forward',
    });
  };
  const onCreatePortFwdReverse = values => {
    createPortFwdReq.run({
      ...values,
      sessionid: hostAndSessionActive.session.id,
      type: 'Reverse',
    });
  };

  const destoryPortFwdReq = useRequest(deleteMsgrpcPortFwdAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listPortFwdReq.run({ sessionid: hostAndSessionActive.session.id });
    },
    onError: (error, params) => {
    },
  });

  return (
    <Fragment>
      <Table
        className={styles.portFwdTable}
        // width="70vw"
        // bordered
        size='small'
        rowKey='local'
        pagination={false}
        dataSource={portFwdActive}
        loading={listPortFwdReq.loading || destoryPortFwdReq.loading}
        columns={[
          {
            title: '方向',
            dataIndex: 'type',
            key: 'type',
            width: '10%',
            render: (text, record) => {
              if (record.type === 'Forward') {
                return (
                  <div>
                    <Tag color='cyan'>正向转发</Tag>
                  </div>
                );
              }
              return (
                <div>
                  <Tag color='geekblue'>反向转发</Tag>
                </div>
              );
            },
          },
          {
            title: '本地(Viper)',
            dataIndex: 'local',
            key: 'local',
            render: (text, record) => {
              if (record.type === 'Forward') {
                return (
                  <div>
                    <Tag style={{ marginRight: 8 }} color='green'>
                      监听
                    </Tag>
                    <span>{`${record.lhost}:${record.lport}`}</span>
                  </div>
                );
              }
              return (
                <div>
                  <Tag style={{ marginRight: 8 }} color='gold'>
                    目标
                  </Tag>
                  <span>{`${record.lhost}:${record.lport}`}</span>
                </div>
              );
            },
          },

          {
            title: '远程(Session)',
            dataIndex: 'remote',
            key: 'remote',
            render: (text, record) => {
              if (record.type === 'Forward') {
                return (
                  <div>
                    <Tag style={{ marginRight: 8 }} color='gold'>
                      目标
                    </Tag>
                    <span>{`${record.rhost}:${record.rport}`}</span>
                  </div>
                );
              }
              return (
                <div>
                  <Tag style={{ marginRight: 8 }} color='green'>
                    监听
                  </Tag>
                  <span>{`${record.rhost}:${record.rport}`}</span>
                </div>
              );
            },
          },
          {
            title: '操作',
            dataIndex: 'operation',
            width: '10%',
            render: (text, record) => (
              <a style={{ color: 'red' }} onClick={() => destoryPortFwdReq.run(record)}>
                删除
              </a>
            ),
          },
        ]}
      />
      <Row style={{ marginTop: 8 }}>
        <Tabs defaultActiveKey='Forward' size='small'>
          <TabPane
            tab={
              <span>
                <SwapRightOutlined /> 正向
              </span>
            }
            key='Forward'
          >
            <Form style={{ marginLeft: 16 }} layout='inline' onFinish={onCreatePortFwdForward}>
              <Form.Item
                label={<span>本地端口(监听)</span>}
                name='lport'
                rules={[{ required: true, message: '请输入本地监听端口' }]}
              >
                <InputNumber style={{ width: 120 }} placeholder='VPS端口' />
              </Form.Item>
              <Form.Item
                label={<span>远程IP(目标)</span>}
                name='rhost'
                rules={[{ required: true, message: '请输入远程IP' }]}
              >
                <Input style={{ width: 160 }} placeholder='内网IP/127.0.0.1' />
              </Form.Item>
              <Form.Item
                label={<span>远程端口(目标)</span>}
                name='rport'
                rules={[{ required: true, message: '请输入远程端口' }]}
              >
                <InputNumber style={{ width: 120 }} placeholder='目标端口' />
              </Form.Item>
              <Form.Item>
                <Button
                  icon={<PlusOutlined />}
                  type='primary'
                  htmlType='submit'
                  loading={createPortFwdReq.loading}
                >
                  新增
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  icon={<SyncOutlined />}
                  onClick={() => listPortFwdReq.run({ sessionid: hostAndSessionActive.session.id })}
                  loading={listPortFwdReq.loading}
                >
                  刷新
                </Button>
              </Form.Item>
            </Form>
            <Paragraph
              style={{ marginLeft: 16, marginTop: 16 }}
              ellipsis={{
                rows: 3,
                expandable: true,
              }}
            >
              将VPS的网络端口转发到内网的某IP某端口.
              <br />
              例如:通过192.168.3.13的Session将VPS的10.10.10.10:2000转发到内网192.168.3.14:3389.本地端口(监听):2000
              远程IP(目标):192.168.3.14 远程端口(目标):3389
            </Paragraph>
          </TabPane>
          <TabPane
            tab={
              <span>
                <SwapLeftOutlined /> 反向
              </span>
            }
            key='Reverse'
          >
            <Form style={{ marginLeft: 16 }} layout='inline' onFinish={onCreatePortFwdReverse}>
              <Form.Item
                label={<span>本地IP(目标)</span>}
                name='lhost'
                rules={[{ required: true, message: '请输入本地目标IP' }]}
              >
                <Input style={{ width: 160 }} placeholder='VPSIP/目标IP' />
              </Form.Item>
              <Form.Item
                label={<span>本地端口(目标)</span>}
                name='lport'
                rules={[{ required: true, message: '请输入本地端口' }]}
              >
                <InputNumber style={{ width: 120 }} placeholder='目标端口' />
              </Form.Item>
              <Form.Item
                label={<span>远程端口(监听)</span>}
                name='rport'
                rules={[{ required: true, message: '请输入远程端口' }]}
              >
                <InputNumber style={{ width: 120 }} placeholder='监听端口' />
              </Form.Item>
              <Form.Item>
                <Button
                  loading={createPortFwdReq.loading}
                  type='primary'
                  htmlType='submit'
                  icon={<PlusOutlined />}
                >
                  新增
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  icon={<SyncOutlined />}
                  onClick={() => listPortFwdReq.run({ sessionid: hostAndSessionActive.session.id })}
                  loading={listPortFwdReq.loading}
                >
                  刷新
                </Button>
              </Form.Item>
            </Form>
            <Paragraph
              style={{ marginLeft: 16, marginTop: 16 }}
              ellipsis={{
                rows: 3,
                expandable: true,
              }}
            >
              将内网的某IP某端口转发到VPS的网络端口.
              <br />
              例如:通过192.168.3.13的session将内网192.168.3.13:20000转发到10.10.10.10:2000.
              本地IP(目标):10.10.10.10 本地端口(监听):2000 远程端口(监听):20000.
              <br />
              (10.10.10.10:2000开启handler监听,192.168.3.14连接192.168.3.13:20000生成反向shell)
            </Paragraph>
          </TabPane>
        </Tabs>
      </Row>
    </Fragment>
  );
};

const PortFwdMemo = memo(PortFwd);

const Transport = props => {
  console.log('Transport');
  const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
    hostAndSessionActive: model.hostAndSessionActive,
  }));
  const { closeModal } = props;
  const [session_exp, setSession_exp] = useState(0);
  const [transports, setTransports] = useState([]);
  const [handlers, setHandlers] = useState([]);

  const initListTransportReq = useRequest(
    () => getMsgrpcTransportAPI({ sessionid: hostAndSessionActive.session.id }),
    {
      onSuccess: (result, params) => {
        setSession_exp(result.session_exp);
        setTransports(result.transports);
        setHandlers(result.handlers);
      },
      onError: (error, params) => {
      },
    },
  );

  const listTransportReq = useRequest(getMsgrpcTransportAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSession_exp(result.session_exp);
      setTransports(result.transports);
      setHandlers(result.handlers);
    },
    onError: (error, params) => {
    },
  });

  const createTransportReq = useRequest(postMsgrpcTransportAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listTransportReq.run({ sessionid: hostAndSessionActive.session.id });
    },
    onError: (error, params) => {
    },
  });

  const onCreateTransport = values => {
    createTransportReq.run({ ...values, sessionid: hostAndSessionActive.session.id });
  };

  const updateTransportReq = useRequest(putMsgrpcTransportAPI, {
    manual: true,
    onSuccess: (result, params) => {
      closeModal();
    },
    onError: (error, params) => {
    },
  });

  const onUpdateTransport = action => {
    updateTransportReq.run({ action, sessionid: hostAndSessionActive.session.id, type: 'Reverse' });
  };

  const onSleepSession = values => {
    updateTransportReq.run({
      action: 'sleep',
      ...values,
      sessionid: hostAndSessionActive.session.id,
    });
  };

  const destoryTransportReq = useRequest(deleteMsgrpcTransportAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listPortFwdReq.run({ sessionid: hostAndSessionActive.session.id });
    },
    onError: (error, params) => {
    },
  });

  const onDestoryTransport = record => {
    destoryTransportReq.run({
      ...record,
      sessionid: hostAndSessionActive.session.id,
    });
  };

  const portServiceExpandedRowRender = record => (
    <Descriptions size='small' column={3} bordered>
      {record.proxy_host !== null && record.proxy_host !== undefined ? (
        <Descriptions.Item label='Proxy Host'>{record.proxy_host}</Descriptions.Item>
      ) : null}
      {record.proxy_user !== null && record.proxy_user !== undefined ? (
        <Descriptions.Item label='Proxy User'>{record.proxy_user}</Descriptions.Item>
      ) : null}
      {record.proxy_pass !== null && record.proxy_pass !== undefined ? (
        <Descriptions.Item label='Proxy Pass'>{record.proxy_pass}</Descriptions.Item>
      ) : null}
      {record.ua !== null && record.ua !== undefined ? (
        <Descriptions.Item label='User Agent'>{record.ua}</Descriptions.Item>
      ) : null}
      {record.cert_hash !== null && record.cert_hash !== undefined ? (
        <Descriptions.Item label='Cert Hash'>{record.cert_hash}</Descriptions.Item>
      ) : null}
    </Descriptions>
  );

  const selectOptions = [];
  for (const oneselect of handlers) {
    if (oneselect.name.includes('rc4')) {
      // rc4类传输协议无法使用
    } else {
      selectOptions.push(<Option value={oneselect.value}>{oneselect.name}</Option>);
    }
  }
  const time_exp = moment().unix() + session_exp;

  return (
    <Fragment>
      <Table
        className={styles.sessionNetTable}
        size='small'
        rowKey='url'
        pagination={false}
        dataSource={transports}
        loading={
          listTransportReq.loading ||
          createTransportReq.loading ||
          updateTransportReq.loading ||
          destoryTransportReq.loading
        }
        expandedRowRender={portServiceExpandedRowRender}
        columns={[
          {
            dataIndex: 'active',
            width: 32,
            render: (text, record) => {
              if (record.active === true) {
                return (
                  <Avatar
                    shape='square'
                    size={20}
                    style={{ backgroundColor: '#1890ff' }}
                    icon={<CheckOutlined />}
                  />
                );
              } else {
                return null;
              }
            },
          },
          {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
            ellipsis: true,
            render: (text, record) => {
              if (text.startsWith('tcp://')) {
                return <span style={{ color: 'orange' }}>{text}</span>;
              } else if (text.startsWith('http://')) {
                return <span style={{ color: 'red' }}>{text}</span>;
              } else if (text.startsWith('https://')) {
                return <span style={{ color: 'green' }}>{text}</span>;
              } else {
                return <span>{text}</span>;
              }
            },
          },
          {
            title: '超时时间',
            dataIndex: 'comm_timeout',
            width: 64,
            render: (text, record) => {
              return <span>{text} s</span>;
            },
          },
          {
            title: '重连次数',
            dataIndex: 'comm_timeout',
            width: 64,
            render: (text, record) => {
              return <span>{text}</span>;
            },
          },
          {
            title: '重连间隔',
            dataIndex: 'retry_wait',
            width: 64,
            render: (text, record) => {
              return <span>{text} s</span>;
            },
          },
          {
            title: '强制过期',
            dataIndex: 'retry_wait',
            width: 80,
            render: (text, record) => {
              return (
                <Tag
                  style={{
                    marginLeft: 16,
                  }}
                  color='cyan'
                >
                  {moment(time_exp * 1000).fromNow()}
                </Tag>
              );
            },
          },
          {
            title: '操作',
            dataIndex: 'operation',
            width: 56,
            render: (text, record) => {
              if (record.active) {
                return null;
              }

              return (
                <a style={{ color: 'red' }} onClick={() => onDestoryTransport(record)}>
                  删除
                </a>
              );
            },
          },
        ]}
      />
      <Form
        style={{
          marginLeft: 16,
          marginTop: 8,
          display: 'flex',
        }}
        layout='inline'
        onFinish={onCreateTransport}
        initialValues={{}}
      >
        <Form.Item label='监听' name='handler' rules={[{ required: true, message: '请选择监听' }]}>
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
            type='primary'
            htmlType='submit'
            icon={<PlusOutlined />}
          >
            添加
          </Button>
        </Form.Item>
        <Form.Item>
          <Popconfirm
            title='确认切换Session传输,此操作会删除当前Session?'
            onConfirm={() => onUpdateTransport('prev')}
          >
            <Button loading={updateTransportReq.loading} danger icon={<UpOutlined />}>
              切换
            </Button>
          </Popconfirm>
        </Form.Item>
        <Form.Item>
          <Popconfirm
            title='确认切换Session传输,此操作会删除当前Session?'
            onConfirm={() => onUpdateTransport('next')}
          >
            <Button loading={updateTransportReq.loading} danger icon={<DownOutlined />}>
              切换
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
            刷新
          </Button>
        </Form.Item>
      </Form>
      <Form
        style={{
          marginLeft: 16,
          marginTop: 8,
          display: 'flex',
        }}
        layout='inline'
        onFinish={onSleepSession}
        initialValues={{}}
      >
        <Form.Item name='sleep' rules={[{ required: true, message: '请选择监听' }]} label='休眠'>
          <Select style={{ width: 120 }}>
            <Option value={60}>1分钟</Option>
            <Option value={60 * 60}>1小时</Option>
            <Option value={60 * 60 * 6}>6小时</Option>
            <Option value={60 * 60 * 12}>12小时</Option>
            <Option value={60 * 60 * 24}>24小时</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            loading={updateTransportReq.loading}
            danger
            htmlType='submit'
            icon={<RestOutlined />}
          >
            休眠
          </Button>
        </Form.Item>
      </Form>
    </Fragment>
  );
};

const TransportMemo = memo(Transport);

const FileSession = () => {
  console.log('FileSession');
  const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
    hostAndSessionActive: model.hostAndSessionActive,
  }));
  const [fileSessionListActive, setFileSessionListActive] = useState({
    path: null,
    entries: [],
  });
  const [fileSessionInputPathActive, setFileSessionInputPathActive] = useState('/');

  const initListFileSessionReq = useRequest(
    () =>
      getMsgrpcFileSessionAPI({
        sessionid: hostAndSessionActive.session.id,
        operation: 'pwd',
      }),
    {
      onSuccess: (result, params) => {
        setFileSessionListActive(result);
        try {
          setFileSessionInputPathActive(result.path);
        } catch (e) {
        }
      },
      onError: (error, params) => {
      },
    },
  );

  const createPostModuleActuatorReq = useRequest(postPostmodulePostModuleActuatorAPI, {
    manual: true,
    onSuccess: (result, params) => {
    },
    onError: (error, params) => {
    },
  });

  const listFileSessionReq = useRequest(getMsgrpcFileSessionAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setFileSessionListActive(result);
      try {
        setFileSessionInputPathActive(result.path);
      } catch (e) {
      }
    },
    onError: (error, params) => {
    },
  });

  const onListFileSession = (sessionid, operation, filepath = null, dirpath = '/') => {
    if (operation === 'pwd') {
      listFileSessionReq.run({ sessionid, operation });
    } else if (operation === 'list') {
      listFileSessionReq.run({ sessionid, operation, dirpath });
    } else if (operation === 'download') {
      createPostModuleActuatorReq.run({
        ipaddress: hostAndSessionActive.ipaddress,
        loadpath: 'MODULES.FileSessionDownloadModule',
        sessionid: sessionid,
        custom_param: JSON.stringify({ SESSION_FILE: filepath }),
      });
    }
  };

  const listFileSessionRunReq = useRequest(getMsgrpcFileSessionAPI, {
    manual: true,
    onSuccess: (result, params) => {
    },
    onError: (error, params) => {
    },
  });

  const onListFileSessionRun = (sessionid, operation, filepath = null, arg = '') => {
    if (operation === 'run') {
      listFileSessionRunReq.run({ sessionid, operation, filepath, arg });
    }
  };

  const copytoclipboard = filedata => {
    copy(filedata);
    message.success('已复制原始内容至剪切板');
  };

  const updateFileSessionReq = useRequest(putMsgrpcFileSessionAPI, {
    manual: true,
    onSuccess: (result, params) => {
    },
    onError: (error, params) => {
    },
  });

  const onUpdateFileSession = values => {
    updateFileSessionReq.run({
      sessionid: values.sessionid,
      filepath: values.filepath,
      filedata: btoa(values.filedata),
    });
  };

  const listFileSessionCatReq = useRequest(getMsgrpcFileSessionAPI, {
    manual: true,
    onSuccess: (result, params) => {
      Modal.info({
        icon: null,
        title: result.reason,
        mask: false,
        style: { top: 32 },
        okText: '关闭',
        width: '70%',
        content: (
          <Fragment>
            <Form preserve={false} onFinish={onUpdateFileSession}>
              <Form.Item name='filedata' initialValue={result.data}>
                <TextArea
                  // defaultValue={result.data}
                  autoSize={{ minRows: 5, maxRows: 15 }}
                />
              </Form.Item>
              <Space style={{ marginBottom: 0 }}>
                <Form.Item>
                  <Button type='primary' htmlType='submit' loading={updateFileSessionReq.loading}>
                    保存修改
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button onClick={() => copytoclipboard(result.data)}>拷贝到剪切板</Button>
                </Form.Item>
                <Form.Item name='sessionid' initialValue={hostAndSessionActive.session.id} />
                <Form.Item name='filepath' initialValue={result.reason} />
              </Space>
            </Form>
          </Fragment>
        ),
        onOk() {
        },
      });
    },
    onError: (error, params) => {
    },
  });

  const onListFileSessionCat = (sessionid, filepath = null) => {
    listFileSessionCatReq.run({ sessionid, operation: 'cat', filepath });
  };

  const onListFileSessionCd = (sessionid, operation, dirpath = '/') => {
    listFileSessionRunReq.run({ sessionid, operation, dirpath });
  };

  const createFileSessionReq = useRequest(postMsgrpcFileSessionAPI, {
    manual: true,
    onSuccess: (result, params) => {
      onListFileSession(hostAndSessionActive.session.id, 'list', null, fileSessionListActive.path);
    },
    onError: (error, params) => {
    },
  });

  const onCreateFileSession = (sessionid, operation, dirpath = '/') => {
    if (operation === 'create_dir') {
      createFileSessionReq.run({ sessionid, operation, dirpath });
    }
  };

  const destoryFileSessionReq = useRequest(deleteMsgrpcFileSessionAPI, {
    manual: true,
    onSuccess: (result, params) => {
      onListFileSession(hostAndSessionActive.session.id, 'list', null, fileSessionListActive.path);
    },
    onError: (error, params) => {
    },
  });

  const onDestoryFileSession = (record, operation) => {
    const sessionid = hostAndSessionActive.session.id;
    if (operation === 'destory_dir') {
      destoryFileSessionReq.run({ sessionid, operation, dirpath: record.absolute_path });
    } else if (operation === 'destory_file') {
      destoryFileSessionReq.run({ sessionid, operation, filepath: record.absolute_path });
    }
  };

  return (
    <Fragment>
      <Row>
        <Space style={{ display: 'flex' }}>
          <ButtonGroup>
            <Tooltip placement='bottom' mouseEnterDelay={0.3} title='根目录'>
              <Button
                style={{ marginLeft: 8, width: 56 }}
                icon={<DesktopOutlined />}
                onClick={() =>
                  onListFileSession(hostAndSessionActive.session.id, 'list', null, '/')
                }
              />
            </Tooltip>
            <Tooltip placement='bottom' title='默认目录'>
              <Button
                style={{ width: 56 }}
                icon={<HomeOutlined />}
                onClick={() => onListFileSession(hostAndSessionActive.session.id, 'pwd')}
              />
            </Tooltip>
            <Tooltip placement='bottom' mouseEnterDelay={0.3} title='上级目录'>
              <Button
                // type="primary"
                style={{ width: 56 }}
                onClick={() =>
                  onListFileSession(
                    hostAndSessionActive.session.id,
                    'list',
                    null,
                    `${fileSessionListActive.path}/..`,
                  )
                }
                icon={<ArrowUpOutlined />}
              />
            </Tooltip>
          </ButtonGroup>
          <Search
            style={{
              width: 'calc(80vw - 560px)',
            }}
            // prefix={<HddOutlined className="site-form-item-icon" />}
            prefix={<FolderOpenOutlined />}
            placeholder='请输入目录'
            onChange={event => setFileSessionInputPathActive(event.target.value)}
            value={fileSessionInputPathActive}
            onSearch={value =>
              onListFileSession(hostAndSessionActive.session.id, 'list', null, value)
            }
            enterButton={
              <Button
                loading={listFileSessionReq.loading}
                type='primary'
                htmlType='submit'
                icon={<ArrowRightOutlined />}
              />
            }
          />
          <Tooltip placement='bottom' mouseEnterDelay={0.3} title='重新加载当前目录'>
            <Button
              // type="primary"
              loading={listFileSessionReq.loading}
              style={{ width: 56 }}
              onClick={() =>
                onListFileSession(
                  hostAndSessionActive.session.id,
                  'list',
                  null,
                  fileSessionListActive.path,
                )
              }
              icon={<SyncOutlined />}
            />
          </Tooltip>
          <Tooltip placement='bottom' mouseEnterDelay={0.3} title='切换工作目录到当前目录'>
            <Button
              // type="primary"
              loading={listFileSessionRunReq.loading}
              style={{ width: 56 }}
              onClick={() =>
                onListFileSessionCd(
                  hostAndSessionActive.session.id,
                  'cd',
                  fileSessionListActive.path,
                )
              }
              icon={<PushpinOutlined />}
            />
          </Tooltip>
          <Popover
            title='新建文件夹名称'
            placement='bottomRight'
            content={
              <Search
                style={{ width: '300px' }}
                enterButton='新建'
                size='default'
                onSearch={value =>
                  onCreateFileSession(
                    hostAndSessionActive.session.id,
                    'create_dir',
                    `${fileSessionListActive.path}/${value}`,
                  )
                }
              />
            }
            trigger='click'
          >
            <Button
              loading={createFileSessionReq.loading}
              style={{ width: 56 }}
              disabled={hostAndSessionActive.session.id === -1}
              icon={<FolderAddOutlined />}
            />
          </Popover>
          <Popover
            placement='bottomRight'
            overlayStyle={{ padding: '0px 0px 0px 0px' }}
            content={
              <FileMsfModal
                hostAndSessionActive={hostAndSessionActive}
                dirpath={fileSessionListActive.path}
              />
            }
            trigger='click'
          >
            <Button
              type='primary'
              style={{ width: 56 }}
              disabled={hostAndSessionActive.session.id === -1}
              icon={<UploadOutlined />}
            />
          </Popover>
        </Space>
      </Row>
      <Row>
        <Table
          className={styles.filelistTable}
          scroll={{ y: 'calc(80vh - 40px)' }}
          size='small'
          rowKey='name'
          pagination={false}
          dataSource={fileSessionListActive.entries}
          loading={
            initListFileSessionReq.loading ||
            createPostModuleActuatorReq.loading ||
            listFileSessionReq.loading ||
            listFileSessionRunReq.loading ||
            updateFileSessionReq.loading ||
            listFileSessionCatReq.loading ||
            createFileSessionReq.loading ||
            destoryFileSessionReq.loading
          }
          onRow={record => ({
            onDoubleClick: event => {
              if (
                record.type === 'directory' ||
                record.type === 'fixed' ||
                record.type === 'remote'
              ) {
                onListFileSession(
                  hostAndSessionActive.session.id,
                  'list',
                  null,
                  record.absolute_path,
                );
              }
            },
          })}
          columns={[
            {
              title: '类型',
              dataIndex: 'type',
              key: 'type',
              width: 56,
              sorter: {
                compare: (a, b) => {
                  return a.type.length - b.type.length;
                },
                multiple: 4,
              },
              render: (text, record) => {
                if (text === 'file') {
                  return (
                    <div style={{ textAlign: 'center' }}>
                      <MyIcon type='icon-wenjian1' style={{ fontSize: '22px' }} />
                    </div>
                  );
                }
                if (text === 'directory') {
                  return (
                    <div style={{ textAlign: 'center' }}>
                      <MyIcon type='icon-wenjian' style={{ fontSize: '26px' }} />
                    </div>
                  );
                }
                if (text === 'fixed') {
                  return (
                    <div style={{ textAlign: 'center' }}>
                      <MyIcon type='icon-yingpan' style={{ fontSize: '26px' }} />
                    </div>
                  );
                }
                if (text === 'remote') {
                  return (
                    <div style={{ textAlign: 'center' }}>
                      <MyIcon type='icon-zhichixiezaiguazai' style={{ fontSize: '26px' }} />
                    </div>
                  );
                }

                if (text === 'cdrom') {
                  return (
                    <div style={{ textAlign: 'center' }}>
                      <MyIcon type='icon-CD' style={{ fontSize: '22px' }} />
                    </div>
                  );
                }
                return (
                  <div style={{ textAlign: 'center' }}>
                    <MyIcon type='icon-unknow' style={{ fontSize: '22px' }} />
                  </div>
                );
              },
            },
            {
              title: '名称',
              dataIndex: 'name',
              key: 'name',
              sorter: {
                compare: (a, b) => a.name.localeCompare(b.name),
                multiple: 3,
              },
              ellipsis: true,
              render: (text, record) => {
                if (text === 'file') {
                  return <span>{text}</span>;
                }
                if (text === 'directory') {
                  return <span>{text}</span>;
                }
                if (text === 'fixed') {
                  return <span>{text}</span>;
                }
                if (text === 'cdrom') {
                  return <span>{text}</span>;
                }
                return <span>{text}</span>;
              },
            },
            {
              title: '权限',
              dataIndex: 'format_mode',
              key: 'format_mode',
              width: 160,
            },
            {
              title: '大小',
              dataIndex: 'format_size',
              key: 'format_size',
              width: 96,
              sorter: {
                compare: (a, b) => a.size - b.size,
                multiple: 2,
              },
            },
            {
              title: '修改时间',
              dataIndex: 'mtime',
              key: 'mtime',
              width: 128,
              sorter: {
                compare: (a, b) => a.mtime - b.mtime,
                multiple: 2,
              },
              render: (text, record) => (
                <Tag color='cyan'>{moment(record.mtime * 1000).format('YYYY-MM-DD HH:mm')}</Tag>
              ),
            },
            {
              title: '操作',
              dataIndex: 'operation',
              width: 184,
              render: (text, record) => {
                if (record.type === 'directory') {
                  // 文件夹打开类操作
                  return (
                    <Space size='middle'>
                      <a
                        onClick={() =>
                          onListFileSession(
                            hostAndSessionActive.session.id,
                            'list',
                            null,
                            record.absolute_path,
                          )
                        }
                      >
                        打开
                      </a>
                      <a style={{ visibility: 'Hidden' }}>占位</a>
                      <a style={{ visibility: 'Hidden' }}>占位</a>
                      <Popconfirm
                        placement='topRight'
                        title='确认删除文件夹(无法撤销)?'
                        onConfirm={() => onDestoryFileSession(record, 'destory_dir')}
                      >
                        <a style={{ color: 'red' }}>删除</a>
                      </Popconfirm>
                    </Space>
                  );
                }
                if (record.type === 'fixed' || record.type === 'remote') {
                  // 文件夹打开类操作
                  return (
                    <div>
                      <a
                        onClick={() =>
                          onListFileSession(
                            hostAndSessionActive.session.id,
                            'list',
                            null,
                            record.absolute_path,
                          )
                        }
                      >
                        打开
                      </a>
                    </div>
                  );
                }
                if (record.type === 'file') {
                  // 文件类操作
                  return (
                    <Space size='middle'>
                      <a
                        onClick={() =>
                          onListFileSession(
                            hostAndSessionActive.session.id,
                            'download',
                            record.absolute_path,
                            null,
                          )
                        }
                      >
                        下载
                      </a>
                      {record.cat_able === true ? (
                        <a
                          style={{ color: 'green' }}
                          onClick={() =>
                            onListFileSessionCat(
                              hostAndSessionActive.session.id,
                              record.absolute_path,
                            )
                          }
                        >
                          查看
                        </a>
                      ) : (
                        <a style={{ visibility: 'Hidden' }}>占位</a>
                      )}
                      <Popover
                        placement='left'
                        title='命令行参数'
                        content={
                          <Search
                            style={{ width: 400 }}
                            enterButton='执行'
                            size='default'
                            onSearch={value =>
                              onListFileSessionRun(
                                hostAndSessionActive.session.id,
                                'run',
                                record.absolute_path,
                                value,
                              )
                            }
                          />
                        }
                        trigger='click'
                      >
                        <a style={{ color: '#faad14' }}>执行</a>
                      </Popover>
                      <Popconfirm
                        placement='topRight'
                        title='确认删除文件(无法撤销)?'
                        onConfirm={() => onDestoryFileSession(record, 'destory_file')}
                      >
                        <a style={{ color: 'red' }}>删除</a>
                      </Popconfirm>
                    </Space>
                  );
                }
              },
            },
          ]}
        />
      </Row>
    </Fragment>
  );
};

const FileSessionMemo = memo(FileSession);

const HostInfo = () => {
  console.log('HostInfo');
  const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
    hostAndSessionActive: model.hostAndSessionActive,
  }));
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
  });
  const initListHostInfoReq = useRequest(
    () =>
      getPostmodulePostModuleResultAPI({
        ipaddress: hostAndSessionActive.ipaddress,
        loadpath: 'MODULES.HostBaseInfoModule',
      }),
    {
      onSuccess: (result, params) => {
        try {
          const resultJson = JSON.parse(result.result);
          resultJson.UPDATE_TIME = result.update_time;
          setHostAndSessionBaseInfo(resultJson);
        } catch (e) {
          console.error(e);
        }
      },
      onError: (error, params) => {
      },
    },
  );
  const listHostInfoReq = useRequest(getPostmodulePostModuleResultAPI, {
    manual: true,
    onSuccess: (result, params) => {
      try {
        const resultJson = JSON.parse(result.result);
        resultJson.UPDATE_TIME = result.update_time;
        setHostAndSessionBaseInfo(resultJson);
      } catch (e) {
        console.error(e);
      }
    },
    onError: (error, params) => {
    },
  });

  const onListHostInfo = record => {
    listHostInfoReq.run({ ipaddress: record.ipaddress, loadpath: 'MODULES.HostBaseInfoModule' });
  };

  const updateHostInfoReq = useRequest(postPostmodulePostModuleActuatorAPI, {
    manual: true,
    onSuccess: (result, params) => {
    },
    onError: (error, params) => {
    },
  });

  const onUpdateHostInfo = () => {
    updateHostInfoReq.run({
      ipaddress: hostAndSessionActive.ipaddress,
      loadpath: 'MODULES.HostBaseInfoModule',
      sessionid: hostAndSessionActive.session.id,
    });
  };
  const paginationProps = {
    simple: true,
    pageSize: 10,
  };
  const processColumns = [
    {
      title: 'PID',
      dataIndex: 'pid',
      width: 64,
      sorter: (a, b) => a.pid >= b.pid,
    },
    {
      title: 'NAME',
      dataIndex: 'name',
    },
    {
      title: 'PATH',
      dataIndex: 'path',
    },
    {
      title: 'USER',
      dataIndex: 'user',
    },
    {
      title: 'ARCH',
      width: 48,
      dataIndex: 'arch',
    },
  ];
  const usefulProcessColumns = [
    {
      title: '标签',
      dataIndex: 'tag',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: 'PID',
      dataIndex: 'process',

      render: (text, record) => <span>{record.process.pid}</span>,
    },
    {
      title: 'NAME',
      dataIndex: 'process',

      render: (text, record) => <span>{record.process.name}</span>,
    },
    {
      title: 'PATH',
      dataIndex: 'process',
      render: (text, record) => <span>{record.process.path}</span>,
    },
    {
      title: 'USER',
      dataIndex: 'process',
      render: (text, record) => <span>{record.process.user}</span>,
    },
    {
      title: 'ARCH',
      dataIndex: 'process',
      render: (text, record) => <span>{record.process.arch}</span>,
    },
  ];
  const netstatColumns = [
    {
      title: 'protocol',
      dataIndex: 'protocol',
      width: 60,
    },
    {
      title: 'local_addr',
      dataIndex: 'local_addr',
      width: 60,
    },
    {
      title: 'remote_addr',
      dataIndex: 'remote_addr',
      width: 60,
    },
    {
      title: 'state',
      dataIndex: 'state',
      width: 60,
      sorter: (a, b) => a.state >= b.state,
    },
    {
      title: 'pid_name',
      dataIndex: 'pid_name',
      width: 60,
    },
  ];
  const arpColumns = [
    {
      title: 'ip_addr',
      dataIndex: 'ip_addr',
    },
    {
      title: 'mac_addr',
      dataIndex: 'mac_addr',
    },
    {
      title: 'interface',
      dataIndex: 'interface',
    },
  ];
  const interfaceColumns = [
    {
      title: 'Name',
      dataIndex: 'Name',
    },
    {
      title: 'Hardware MAC',
      dataIndex: 'Hardware MAC',
    },
    {
      title: 'IP/Mask',
      dataIndex: 'IPv4',
      render: (text, record) => {
        let allstr = '';
        for (const ippair of record.IPv4) {
          allstr = `${allstr} ${ippair['IPv4 Address']} / ${ippair['IPv4 Netmask']}`;
        }
        return <span>{allstr}</span>;
      },
    },
  ];

  return (
    <Fragment>
      <Row>
        <ButtonGroup>
          <Button
            type='primary'
            icon={<SyncOutlined />}
            onClick={() => onListHostInfo(hostAndSessionActive)}
            loading={listHostInfoReq.loading}
          >
            读取缓存
          </Button>
          <Button
            icon={<RetweetOutlined />}
            loading={updateHostInfoReq.loading}
            onClick={() => onUpdateHostInfo()}
            disabled={
              hostAndSessionActive.session === undefined ||
              hostAndSessionActive.session === null ||
              hostAndSessionActive.session.id === undefined ||
              hostAndSessionActive.session.id === -1
            }
          >
            重新请求
          </Button>
        </ButtonGroup>
        {hostAndSessionBaseInfo.UPDATE_TIME === 0 ||
        hostAndSessionBaseInfo.UPDATE_TIME === undefined ? (
          <Tag
            style={{
              marginLeft: 16,
            }}
            color='red'
          >
            未更新
          </Tag>
        ) : (
          <Tag
            style={{
              marginLeft: 16,
            }}
            color='cyan'
          >
            {moment(hostAndSessionBaseInfo.UPDATE_TIME * 1000).fromNow()}
          </Tag>
        )}
      </Row>
      <Row>
        <Tabs
          size='small'
          defaultActiveKey='1'
          style={{
            minHeight: '80vh',
          }}
        >
          <TabPane tab={<span>主机信息</span>} key='1'>
            <Descriptions size='small' column={1} bordered>
              <Descriptions.Item label='主机名'>
                {hostAndSessionBaseInfo.Computer}
              </Descriptions.Item>
              <Descriptions.Item label='操作系统'>
                {hostAndSessionBaseInfo.OS} {hostAndSessionBaseInfo.ARCH}
              </Descriptions.Item>
              <Descriptions.Item label='DOMAIN'>{hostAndSessionBaseInfo.DOMAIN}</Descriptions.Item>
              <Descriptions.Item label='当前登录用户数'>
                {hostAndSessionBaseInfo.LoggedOnUsers}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
          <TabPane tab={<span>网卡信息</span>} key='8'>
            <Table
              className={styles.hostinfoTable}
              columns={interfaceColumns}
              dataSource={hostAndSessionBaseInfo.INTERFACE}
              pagination={false}
              rowKey='Name'
              size='small'
              expandRowByClick
            />
          </TabPane>
          <TabPane tab={<span>本地监听</span>} key='10'>
            <Table
              className={styles.hostinfoTable}
              columns={netstatColumns}
              dataSource={hostAndSessionBaseInfo.listen_address}
              pagination={false}
              size='small'
            />
          </TabPane>
          <TabPane tab={<span>外网连接</span>} key='5'>
            <Table
              className={styles.hostinfoTable}
              columns={netstatColumns}
              dataSource={hostAndSessionBaseInfo.public_ipaddress}
              pagination={false}
              size='small'
            />
          </TabPane>
          <TabPane tab={<span>内网连接</span>} key='6'>
            <Table
              className={styles.hostinfoTable}
              columns={netstatColumns}
              dataSource={hostAndSessionBaseInfo.private_ipaddress}
              pagination={false}
              size='small'
            />
          </TabPane>
          <TabPane tab={<span>ARP信息</span>} key='7'>
            <Table
              className={styles.hostinfoTable}
              columns={arpColumns}
              dataSource={hostAndSessionBaseInfo.ARP}
              pagination={false}
              size='small'
            />
          </TabPane>
          <TabPane tab={<span>重要进程</span>} key='9'>
            <Table
              className={styles.hostinfoTable}
              scroll={{ x: 'calc(70vw - 16px)' }}
              columns={usefulProcessColumns}
              dataSource={hostAndSessionBaseInfo.useful_processes}
              pagination={false}
              size='small'
            />
          </TabPane>
          <TabPane tab={<span>所有连接</span>} key='4'>
            <Table
              className={styles.hostinfoTable}
              columns={netstatColumns}
              dataSource={hostAndSessionBaseInfo.NETSTAT}
              pagination={false}
              size='small'
            />
          </TabPane>
          <TabPane tab={<span>所有进程</span>} key='2'>
            <Table
              className={styles.hostinfoTable}
              columns={processColumns}
              dataSource={hostAndSessionBaseInfo.PROCESSES}
              pagination={false}
              size='small'
            />
          </TabPane>
        </Tabs>
      </Row>
    </Fragment>
  );
};
const HostInfoMemo = memo(HostInfo);

const PortService = () => {
  console.log('PortService');
  const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
    hostAndSessionActive: model.hostAndSessionActive,
  }));
  const [portServiceActive, setPortServiceActive] = useState([]);

  const initListPortServiceReq = useRequest(
    () => getPostlateralPortserviceAPI({ ipaddress: hostAndSessionActive.ipaddress }),
    {
      onSuccess: (result, params) => {
        setPortServiceActive(result);
      },
      onError: (error, params) => {
      },
    },
  );
  const listPortServiceReq = useRequest(getPostlateralPortserviceAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setPortServiceActive(result);
    },
    onError: (error, params) => {
    },
  });

  const destoryPortServiceReq = useRequest(deletePostlateralPortserviceAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listPortServiceReq.run({ ipaddress: hostAndSessionActive.ipaddress });
    },
    onError: (error, params) => {
    },
  });

  const onDestoryPortService = record => {
    destoryPortServiceReq.run({ ipaddress: record.ipaddress, port: record.port });
  };
  const paginationProps = {
    simple: true,
    pageSize: 5,
  };

  return (
    <Table
      size='small'
      rowKey='port'
      pagination={paginationProps}
      dataSource={portServiceActive}
      loading={listPortServiceReq.loading || initListPortServiceReq.loading}
      columns={[
        {
          title: '端口',
          dataIndex: 'port',
          key: 'port',
          width: '10%',
        },
        {
          title: '服务',
          dataIndex: 'service',
          key: 'service',
          width: '15%',
        },
        {
          title: '指纹',
          dataIndex: 'banner',
          key: 'banner',
        },
        {
          title: '更新时间',
          dataIndex: 'update_time',
          key: 'update_time',
          width: '10%',
          render: (text, record) => (
            <Tag color='cyan'>{moment(record.update_time * 1000).fromNow()}</Tag>
          ),
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: 48,
          render: (text, record) => (
            <a onClick={() => onDestoryPortService(record)} style={{ color: 'red' }}>
              删除
            </a>
          ),
        },
      ]}
    />
  );
};
const PortServiceMemo = memo(PortService);

const Vulnerability = () => {
  console.log('Vulnerability');
  const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
    hostAndSessionActive: model.hostAndSessionActive,
  }));
  const [vulnerabilityActive, setVulnerabilityActive] = useState([]);

  const initListVulnerabilityeReq = useRequest(
    () => getPostlateralVulnerabilityAPI({ ipaddress: hostAndSessionActive.ipaddress }),
    {
      onSuccess: (result, params) => {
        setVulnerabilityActive(result);
      },
      onError: (error, params) => {
      },
    },
  );
  const listVulnerabilityReq = useRequest(getPostlateralVulnerabilityAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setVulnerabilityActive(result);
    },
    onError: (error, params) => {
    },
  });

  const destoryVulnerabilityReq = useRequest(deletePostlateralVulnerabilityAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listVulnerabilityReq.run({ ipaddress: hostAndSessionActive.ipaddress });
    },
    onError: (error, params) => {
    },
  });

  const onDestoryVulnerability = record => {
    destoryVulnerabilityReq.run({ id: record.id });
  };

  const paginationProps = {
    simple: true,
    pageSize: 5,
  };

  return (
    <Table
      size='small'
      rowKey='source_module_name'
      pagination={paginationProps}
      dataSource={vulnerabilityActive}
      loading={listVulnerabilityReq.loading || initListVulnerabilityeReq.loading}
      columns={[
        {
          title: '扫描模块',
          dataIndex: 'source_module_name',
          key: 'source_module_name',
        },
        {
          title: '说明',
          dataIndex: 'desc',
          key: 'desc',
          // width: '15%',
        },
        {
          title: '更新时间',
          dataIndex: 'update_time',
          key: 'update_time',
          width: 80,
          render: (text, record) => (
            <Tag color='cyan'>{moment(record.update_time * 1000).fromNow()}</Tag>
          ),
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: 48,
          render: (text, record) => (
            <a onClick={() => onDestoryVulnerability(record)} style={{ color: 'red' }}>
              删除
            </a>
          ),
        },
      ]}
    />
  );
};
const VulnerabilityMemo = memo(Vulnerability);

const UpdateHost = props => {
  console.log('UpdateHost');
  const { hostAndSessionActive } = useModel('HostAndSessionModel', model => ({
    hostAndSessionActive: model.hostAndSessionActive,
  }));
  const updateHostReq = useRequest(putCoreHostAPI, {
    manual: true,
    onSuccess: (result, params) => {
      props.closeModal();
    },
    onError: (error, params) => {
    },
  });

  const onUpdateHost = values => {
    updateHostReq.run(values);
  };

  const formLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 20 },
  };
  const tailLayout = {
    wrapperCol: { offset: 2, span: 20 },
  };
  const hostTypeToAvatar = {
    ad_server: (
      <Avatar shape='square' style={{ backgroundColor: '#177ddc' }} icon={<WindowsOutlined />} />
    ),
    pc: <Avatar shape='square' style={{ backgroundColor: '#49aa19' }} icon={<LaptopOutlined />} />,
    web_server: (
      <Avatar shape='square' style={{ backgroundColor: '#13a8a8' }} icon={<CloudOutlined />} />
    ),
    cms: <Avatar shape='square' style={{ backgroundColor: '#d84a1b' }} icon={<BugOutlined />} />,
    firewall: (
      <Avatar shape='square' style={{ backgroundColor: '#d87a16' }} icon={<GatewayOutlined />} />
    ),
    other: (
      <Avatar shape='square' style={{ backgroundColor: '#bfbfbf' }} icon={<QuestionOutlined />} />
    ),
  };

  return (
    <Card>
      <Form
        style={{
          width: '548px',
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
          name='ipaddress'
          rules={[{ required: true, message: '请输入' }]}
          style={{ display: 'None' }}
          {...formLayout}
        >
          <span>{hostAndSessionActive.ipaddress}</span>
        </Form.Item>
        <Form.Item label={<span>标签</span>} name='tag' {...formLayout}>
          <Radio.Group>
            <Radio value='ad_server'>{hostTypeToAvatar.ad_server}</Radio>
            <Radio value='pc'>{hostTypeToAvatar.pc}</Radio>
            <Radio value='web_server'>{hostTypeToAvatar.web_server}</Radio>
            <Radio value='cms'>{hostTypeToAvatar.cms}</Radio>
            <Radio value='firewall'>{hostTypeToAvatar.firewall}</Radio>
            <Radio value='other'>{hostTypeToAvatar.other}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label={<span>备注</span>}
          name='comment'
          rules={[{ message: '最长支持二十个字符', max: 20 }]}
          {...formLayout}
        >
          <Input placeholder='最长支持二十个字符' />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            icon={<DeliveredProcedureOutlined />}
            block
            type='primary'
            htmlType='submit'
            loading={updateHostReq.loading}
          >
            更新
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
const UpdateHostMemo = memo(UpdateHost);

const PostModuleAutoConfForm = props => {
  const [postModuleAutoConfForm] = Form.useForm();
  const [settingsPostModuleAutoConf, setSettingsPostModuleAutoConf] = useState({});

  //初始化数据
  const initListPostModuleAutoConfReq = useRequest(
    () => getCoreSettingAPI({ kind: 'postmoduleautoconf' }),
    {
      onSuccess: (result, params) => {
        setSettingsPostModuleAutoConf(result);
        postModuleAutoConfForm.setFieldsValue(result);
      },
      onError: (error, params) => {
      },
    },
  );

  const updateSessionMonitorReq = useRequest(postCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSettingsPostModuleAutoConf(result);
      postModuleAutoConfForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    },
  });

  const onUpdateSessionMonitor = setting => {
    let params = {
      kind: 'postmoduleautoconf',
      tag: 'default',
      setting,
    };
    updateSessionMonitorReq.run(params);
  };

  return (
    <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} layout='vertical'>
      <Form.Item label='开关'>
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<MinusOutlined />}
          checked={settingsPostModuleAutoConf.flag}
          onClick={() => onUpdateSessionMonitor({ flag: !settingsPostModuleAutoConf.flag })}
        />
      </Form.Item>
      <Form.Item label='时间间隔' tooltip='执行每个模块的间隔时间'>
        <Radio.Group
          onChange={e => onUpdateSessionMonitor({ interval: e.target.value })}
          value={settingsPostModuleAutoConf.interval}
        >
          <Space direction='vertical'>
            <Radio value={1}>1秒</Radio>
            <Radio value={10}>10秒</Radio>
            <Radio value={60}>1分钟</Radio>
            <Radio value={600}>10分钟</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label='单一主机最大权限数量'
        tooltip='当同一个ip地址的权限大于N个时,不再执行编排(防止编排模块生成权限,权限又执行编排,造成死循环)'
      >
        <Radio.Group
          onChange={e => onUpdateSessionMonitor({ max_session: e.target.value })}
          value={settingsPostModuleAutoConf.max_session}
        >
          <Space direction='vertical'>
            <Radio value={3}>3个</Radio>
            <Radio value={5}>5个</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};

const PostModuleAutoConfFormMemo = memo(PostModuleAutoConfForm);

const AutoRobot = () => {
  console.log('AutoRobot');
  const [postModuleAutoList, setPostModuleAutoList] = useState([]);
  const [runAutoModuleModalVisable, setRunAutoModuleModalModalVisable] = useState(false);
  //初始化数据
  const initListPostModuleAutoReq = useRequest(getPostModuleAutoAPI, {
    onSuccess: (result, params) => {
      setPostModuleAutoList(result);
    },
    onError: (error, params) => {
    },
  });

  const listPostModuleAutoReq = useRequest(getPostModuleAutoAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setPostModuleAutoList(result);
    },
    onError: (error, params) => {
    },
  });

  const createPostModuleAutoReq = useRequest(postPostModuleAutoAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listPostModuleAutoReq.run();
    },
    onError: (error, params) => {
    },
  });

  const destoryPostModuleAutoReq = useRequest(deletePostModuleAutoAPI, {
    manual: true,
    onSuccess: (result, params) => {
      const { module_uuid } = result;
      setPostModuleAutoList(postModuleAutoList.filter(item => item.module_uuid !== module_uuid));
    },
    onError: (error, params) => {
    },
  });

  return (
    <Fragment>
      <Row gutter={0} style={{ marginTop: -16 }}>
        <Col span={12}>
          <Button
            block
            icon={<PlusOutlined />}
            onClick={() => setRunAutoModuleModalModalVisable(true)}
          >
            添加模块
          </Button>
        </Col>
        <Col span={12}>
          <Button
            icon={<SyncOutlined />}
            style={{
              width: '100%',
            }}
            loading={
              listPostModuleAutoReq.loading ||
              createPostModuleAutoReq.loading ||
              destoryPostModuleAutoReq.loading
            }
            onClick={() => listPostModuleAutoReq.run()}
          >
            刷新
          </Button>
        </Col>
      </Row>
      <Row gutter={0}>
        <Col span={20}>
          <Table
            className={styles.postModuleAutoTable}
            size='small'
            rowKey='job_id'
            pagination={false}
            dataSource={postModuleAutoList}
            bordered
            columns={[
              {
                title: '模块',
                dataIndex: 'moduleinfo',
                key: 'moduleinfo',
                width: 240,
                render: (text, record) => (
                  <Popover
                    placement='right'
                    content={PostModuleInfoContent(record.moduleinfo)}
                    trigger='click'
                  >
                    <a>{record.moduleinfo.NAME}</a>
                  </Popover>
                ),
              },
              {
                title: '预配置参数',
                dataIndex: 'custom_param',
                key: 'custom_param',
                render: (text, record) => {
                  const component = [];
                  for (const key in record.custom_param) {
                    const item = record.custom_param[key];
                    component.push(
                      <span>
                        {' '}
                        <strong>{key}: </strong>
                        {item}{' '}
                      </span>,
                    );
                  }
                  return <Fragment>{component}</Fragment>;
                },
              },
              {
                // title: '操作',
                dataIndex: 'operation',
                width: 56,
                render: (text, record) => (
                  <div style={{ textAlign: 'center' }}>
                    <a
                      style={{ color: 'red' }}
                      onClick={() =>
                        destoryPostModuleAutoReq.run({ module_uuid: record.module_uuid })
                      }
                    >
                      删除
                    </a>
                  </div>
                ),
              },
            ]}
          />
        </Col>
        <Col span={4}>
          <Card style={{ marginTop: 0 }}>
            <PostModuleAutoConfFormMemo />
          </Card>
        </Col>
      </Row>
      <Modal
        mask={false}
        style={{ top: 32 }}
        width='90vw'
        destroyOnClose
        visible={runAutoModuleModalVisable}
        onCancel={() => setRunAutoModuleModalModalVisable(false)}
        footer={null}
        bodyStyle={{ padding: '0px 0px 0px 0px' }}
      >
        <RunAutoModuleMemo
          closeModel={() => {
            setRunAutoModuleModalModalVisable(false);
          }}
          listData={() => {
            listPostModuleAutoReq.run();
          }}
        />
      </Modal>
    </Fragment>
  );
};

const AutoRobotMemo = memo(AutoRobot);

export default HostAndSession;

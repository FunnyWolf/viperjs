import React, { Fragment, memo, useState } from 'react';
import { useModel, useRequest } from 'umi';
import '@ant-design/compatible/assets/index.css';
import {
  ArrowRightOutlined,
  CaretRightOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  FormOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  QuestionOutlined,
  RadarChartOutlined,
  SearchOutlined,
  StarOutlined,
  StarTwoTone,
} from '@ant-design/icons';

import {
  Alert,
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from 'antd';
import './xterm.css';
import moment from 'moment';
import { host_type_to_avatar_table, MyIcon } from '@/pages/Core/Common';
import styles from './RunModule.less';
import {
  getCoreNetworkSearchAPI,
  getPostmodulePostModuleConfigAPI,
  postPostmodulePostModuleActuatorAPI,
} from '@/services/apiv1';

const { Option } = Select;
const { Search, TextArea } = Input;
const { TabPane } = Tabs;

//字符串格式化函数
String.prototype.format = function() {
  let args = arguments;
  return this.replace(/\{(\d+)\}/g, function(m, i) {
    return args[i];
  });
};


export const RunModule = (props) => {
  console.log('RunModule');
  const { closeModel } = props;
  const {
    hostAndSessionActive,
    postModuleConfigListStateAll,
  } = useModel('HostAndSessionModel', model => ({
    hostAndSessionActive: model.hostAndSessionActive,
    postModuleConfigListStateAll: model.postModuleConfigListStateAll,
  }));


  const getPins = () => {
    if (localStorage.getItem('Pins') === null) {
      localStorage.setItem('Pins', JSON.stringify([]));
      return [];
    }
    return JSON.parse(localStorage.getItem('Pins'));
  };

  const changePin = loadpath => {
    const pins = getPins();
    const index = pins.indexOf(loadpath);
    if (index > -1) {
      pins.splice(index, 1);
      localStorage.setItem('Pins', JSON.stringify(pins));
      return pins;
    }
    pins.push(loadpath);
    localStorage.setItem('Pins', JSON.stringify(pins));
    return pins;
  };

  const hasSession =
    hostAndSessionActive.session !== undefined &&
    hostAndSessionActive.session !== null &&
    hostAndSessionActive.session.id !== -1;
  let postModuleConfigListStateSort = postModuleConfigListStateAll
    .map(record => {
      if (record.REQUIRE_SESSION) {
        if (hasSession) {
          return { ...record };
        }
        return null;
      }
      return { ...record };
    }).filter(record => !!record);

  const pins = getPins();
  postModuleConfigListStateSort.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));

  const [postModuleConfigListState, setPostModuleConfigListState] = useState(postModuleConfigListStateSort);
  const [postModuleConfigListStateTmp, setPostModuleConfigListStateTmp] = useState(postModuleConfigListStateSort);
  const [postModuleConfigActive, setPostModuleConfigActive] = useState({
    NAME: null,
    DESC: null,
    WARN: null,
    AUTHOR: null,
    OPTIONS: [],
    REQUIRE_SESSION: true,
    loadpath: null,
    PERMISSIONS: [],
    PLATFORM: [],
    REFERENCES: [],
    ATTCK: [],
    SEARCH: null,
  });

  const listPostModuleConfigReq = useRequest(getPostmodulePostModuleConfigAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setPostModuleConfigActive(result);
    },
    onError: (error, params) => {
    },
  });

  const createPostModuleActuatorReq = useRequest(postPostmodulePostModuleActuatorAPI, {
    manual: true,
    onSuccess: (result, params) => {
      closeModel();
    },
    onError: (error, params) => {
    },
  });

  const onCreatePostModuleActuator = (params) => {
    createPostModuleActuatorReq.run({
      hid: hostAndSessionActive.id,
      sessionid: hostAndSessionActive.session.id,
      loadpath: postModuleConfigActive.loadpath,
      custom_param: JSON.stringify(params),
    });
  };

  const onPostModuleConfigListChange = postModuleConfigListState => {
    const pins = getPins();
    postModuleConfigListState.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));
    setPostModuleConfigListState(postModuleConfigListState);
  };

  const handleModuleSearch = value => {
    const reg = new RegExp(value, 'gi');
    onPostModuleConfigListChange(
      postModuleConfigListStateTmp
        .map(record => {
          let NAMEMatch = false;
          let DESCMatch = false;
          let REFERENCESMatch = false;
          try {
            // toString().
            // NAMEMatch = record.NAME.includes(value);
            NAMEMatch = record.NAME.match(reg);
            DESCMatch = record.DESC.match(reg);
            REFERENCESMatch = record.REFERENCES.toString().match(reg);
          } catch (error) {
          }

          if (NAMEMatch || DESCMatch || REFERENCESMatch) {
            return {
              ...record,
            };
          }
          return null;
        }).filter(record => !!record),
    );
  };


  const moduleTypeOnChange = value => {
    if (value === undefined) {
      onPostModuleConfigListChange(postModuleConfigListStateTmp);
      return;
    }
    if (value.length <= 0) {
      onPostModuleConfigListChange(postModuleConfigListStateTmp);
    } else {
      const newpostModuleConfigListState = postModuleConfigListStateTmp.filter(
        item => value.indexOf(item.MODULETYPE) >= 0,
      );
      onPostModuleConfigListChange(newpostModuleConfigListState);
    }
  };

  const getOptions = () => {
    const options = [];
    for (const oneOption of postModuleConfigActive.OPTIONS) {
      if (oneOption.type === 'str') {
        options.push(
          <Col span={oneOption.option_length}>
            <Form.Item
              label={
                <Tooltip title={oneOption.desc}>
                  <span>{oneOption.name_tag}</span>
                </Tooltip>
              }
              name={oneOption.name}
              initialValue={oneOption.default}
              rules={[{ required: oneOption.required, message: '请输入' }]}
            >
              <Input style={{ width: '90%' }}
                // defaultValue={oneOption.default}
              />
            </Form.Item>
          </Col>,
        );
      } else if (oneOption.type === 'bool') {
        options.push(
          <Col span={oneOption.option_length}>
            <Form.Item
              label={
                <Tooltip title={oneOption.desc}>
                  <span>{oneOption.name_tag}</span>
                </Tooltip>
              }
              name={oneOption.name}
              valuePropName="checked"
              initialValue={oneOption.default}
              rules={[{ required: oneOption.required, message: '请输入' }]}
            >
              <Checkbox style={{ width: '90%' }} defaultChecked={oneOption.default}/>
            </Form.Item>
          </Col>,
        );
      } else if (oneOption.type === 'integer') {
        options.push(
          <Col span={oneOption.option_length}>
            <Form.Item
              label={
                <Tooltip title={oneOption.desc}>
                  <span>{oneOption.name_tag}</span>
                </Tooltip>
              }
              name={oneOption.name}
              initialValue={oneOption.default}
              rules={[{ required: oneOption.required, message: '请输入' }]}
              wrapperCol={{ span: 24 }}
            >
              <InputNumber style={{ width: '90%' }}
                // defaultValue={oneOption.default}
              />
            </Form.Item>
          </Col>,
        );
      } else if (oneOption.type === 'float') {
        options.push(
          <Col span={oneOption.option_length}>
            <Form.Item
              label={
                <Tooltip title={oneOption.desc}>
                  <span>{oneOption.name_tag}</span>
                </Tooltip>
              }
              name={oneOption.name}
              initialValue={oneOption.default}
              rules={[{ required: oneOption.required, message: '请输入' }]}
              wrapperCol={{ span: 24 }}
            >
              <InputNumber step={0.1} style={{ width: '90%' }}
                // defaultValue={oneOption.default}
              />
            </Form.Item>
          </Col>,
        );
      } else if (oneOption.type === 'enum') {
        const selectOptions = [];
        for (const oneselect of oneOption.enum_list) {
          selectOptions.push(
            <Option value={oneselect.value}>
              <Tooltip mouseEnterDelay={0.3} title={oneselect.name}>
                {oneselect.name}
              </Tooltip>
            </Option>,
          );
        }
        options.push(
          <Col span={oneOption.option_length}>
            <Form.Item
              label={
                <Tooltip title={oneOption.desc}>
                  <span>{oneOption.name_tag}</span>
                </Tooltip>
              }
              name={oneOption.name}
              initialValue={oneOption.default}
              rules={[{ required: oneOption.required, message: '请输入' }]}
              wrapperCol={{ span: 24 }}
            >
              <Select
                allowClear
                // defaultValue={oneOption.default}
                style={{
                  // minWidth: '90%',
                  width: '90%',
                }}
              >
                {selectOptions}
              </Select>
            </Form.Item>
          </Col>,
        );
      } else {
        options.push(
          <Col span={oneOption.option_length}>
            <Form.Item
              label={
                <Tooltip title={oneOption.desc}>
                  <span>{oneOption.name_tag}</span>
                </Tooltip>
              }
              name={oneOption.name}
              initialValue={oneOption.default}
              rules={[{ required: oneOption.required, message: '请输入' }]}
              wrapperCol={{ span: 24 }}
            >
              <Input style={{ width: '90%' }}
                // defaultValue={oneOption.default}
              />
            </Form.Item>
          </Col>,
        );
      }
    }
    return options;
  };

  const ModuleInfoContent = props => {
    const { postModuleConfig } = props;
    if (postModuleConfig === undefined) {
      return null;
    }
    const platform = postModuleConfig.PLATFORM;
    const platformCom = [];
    for (let i = 0; i < platform.length; i++) {
      if (platform[i].toLowerCase() === 'windows') {
        platformCom.push(<Tag color="blue">{platform[i]}</Tag>);
      } else {
        platformCom.push(<Tag color="magenta">{platform[i]}</Tag>);
      }
    }

    const permissions = postModuleConfig.PERMISSIONS;
    const permissionsCom = [];
    for (let i = 0; i < permissions.length; i++) {
      if (['system', 'root'].indexOf(permissions[i].toLowerCase()) >= 0) {
        permissionsCom.push(<Tag color="volcano">{permissions[i]}</Tag>);
      } else if (['administrator'].indexOf(permissions[i].toLowerCase()) >= 0) {
        permissionsCom.push(<Tag color="orange">{permissions[i]}</Tag>);
      } else {
        permissionsCom.push(<Tag color="lime">{permissions[i]}</Tag>);
      }
    }
    const references = postModuleConfig.REFERENCES;
    const referencesCom = [];
    for (let i = 0; i < references.length; i++) {
      referencesCom.push(
        <div>
          <a href={references[i]} target="_blank">
            {references[i]}
          </a>
        </div>,
      );
    }
    const attcks = postModuleConfig.ATTCK;
    const attckCom = [];
    for (let i = 0; i < attcks.length; i++) {
      attckCom.push(<Tag color="gold">{attcks[i]}</Tag>);
    }
    return (
      <Descriptions
        size="small"
        style={{
          padding: '0 0 0 0',
          marginRight: 8,
        }}
        column={8}
        bordered
      >
        <Descriptions.Item label="名称" span={8}>
          {postModuleConfig.NAME}
        </Descriptions.Item>
        <Descriptions.Item label="作者" span={4}>
          <Tag color="lime">{postModuleConfig.AUTHOR}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="TTPs" span={4}>
          {attckCom}
        </Descriptions.Item>
        <Descriptions.Item label="适用系统" span={4}>
          {platformCom}
        </Descriptions.Item>
        <Descriptions.Item label="适用权限" span={4}>
          {permissionsCom}
        </Descriptions.Item>
        <Descriptions.Item label="参考链接" span={8}>
          {referencesCom}
        </Descriptions.Item>
        <Descriptions.Item span={8} label="简介">
          <pre>{postModuleConfig.DESC}</pre>
        </Descriptions.Item>
      </Descriptions>
    );
  };

  const postModuleConfigTableColumns = [
    {
      dataIndex: 'NAME',
      render: (text, record) => {
        let tag = null;
        if (record.loadpath === postModuleConfigActive.loadpath) {
          tag = (
            <Avatar
              shape="square"
              size={20}
              style={{ backgroundColor: '#1890ff' }}
              icon={<ArrowRightOutlined/>}
            />
          );
        } else {
          tag = (
            <Avatar
              shape="square"
              size={20}
              style={{
                visibility: 'hidden',
                backgroundColor: '#bfbfbf',
              }}
              icon={<QuestionOutlined/>}
            />
          );
        }
        const pins = getPins();
        const pinIcon =
          pins.indexOf(record.loadpath) > -1 ? (
            <StarTwoTone
              twoToneColor="#d89614"
              onClick={() => {
                changePin(record.loadpath);
                onPostModuleConfigListChange(postModuleConfigListState);
              }}
              style={{
                marginTop: 4,
                float: 'right',
                fontSize: '18px',
              }}
            />
          ) : (
            <StarOutlined
              onClick={() => {
                changePin(record.loadpath);
                onPostModuleConfigListChange(postModuleConfigListState);
              }}
              style={{
                marginTop: 4,
                float: 'right',
                fontSize: '18px',
              }}
            />
          );

        return (
          <div style={{ display: 'inline' }}>
            {tag}
            <a style={{ marginLeft: 4 }}>{text}</a>
            {pinIcon}
          </div>
        );
      },
    },
  ];


  // session 信息
  const record = hostAndSessionActive;
  if (record.session === null || record.session === undefined) {
    return null;
  }
  // 心跳标签
  const fromnowTime = (moment().unix() - record.session.fromnow) * 1000;
  const timepass = record.session.fromnow;

  let heartbeat = null;

  if (timepass <= 60) {
    heartbeat = (
      <Tooltip title={timepass + 's'} placement="left">
        <Tag
          color="green"
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
  } else if (60 < timepass <= 90) {
    heartbeat = (
      <Tooltip title={timepass + 's'} placement="left">
        <Tag
          color="orange"
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
  } else {
    heartbeat = (
      <Tooltip title={timepass + 's'} placement="left">
        <Tag
          color="red"
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
      color="purple"
      style={{
        width: 40,
        marginLeft: -6,
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      <strong>{record.session.id}</strong>
    </Tag>
  );

  // 连接标签
  const connecttooltip = (
    <span>
        {' '}
      {record.session.tunnel_peer_locate} {record.session.tunnel_peer} {'-> '}
      {record.session.tunnel_local}
      </span>
  );
  const connectTag = (
    <Tooltip mouseEnterDelay={1} placement="right" title={connecttooltip}>
      <Tag
        color="cyan"
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
        color="geekblue"
        style={{
          cursor: 'pointer',
          marginLeft: -6,
        }}
      >
        {record.session.arch}
      </Tag>
    ) : (
      <Tag
        color="volcano"
        style={{
          cursor: 'pointer',
          marginLeft: -6,
        }}
      >
        {record.session.arch}
      </Tag>
    );

  // os标签
  const os_tag_new =
    record.session.platform === 'windows' ? (
      <Tooltip mouseEnterDelay={1} placement="right" title={record.session.os}>
        <Tag
          color="blue"
          style={{
            marginLeft: -6,
            cursor: 'pointer',
          }}
        >
          <div className={styles.sessionOSTextOverflow}>
            <MyIcon
              type="icon-windows"
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
      <Tooltip mouseEnterDelay={1} placement="right" title={record.session.os}>
        <Tag
          color="magenta"
          style={{
            marginLeft: -6,
            cursor: 'pointer',
          }}
        >
          <div className={styles.sessionOSTextOverflow}>
            <MyIcon
              type="icon-linux"
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
      <Tooltip mouseEnterDelay={1} placement="right" title={record.session.info}>
        <Tag
          color="gold"
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
      <Tooltip mouseEnterDelay={1} placement="right" title={record.session.info}>
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
  const hostipaddress = (
    <Tag
      color="orange"
      style={{
        width: 120,
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      <strong>{record.ipaddress}</strong>
    </Tag>
  );


  return (
    <Fragment>
      <Row>
        <Col span={8}>
          <Card bordered={false}>
            <div style={{ display: 'flex' }}>
              <Select className={styles.testNew} onChange={moduleTypeOnChange} allowClear>
                <Option value="Initial_Access">初始访问</Option>
                <Option value="Persistence">持久化</Option>
                <Option value="Privilege_Escalation">权限提升</Option>
                <Option value="Defense_Evasion">防御绕过</Option>
                <Option value="Credential_Access">凭证访问</Option>
                <Option value="Discovery">信息收集</Option>
                <Option value="Lateral_Movement">横向移动</Option>
                <Option value="Collection">数据采集</Option>
                <Option value="Command_and_Control">命令控制</Option>
              </Select>
              <Search
                style={{ marginLeft: 4 }}
                placeholder="名称/说明/TTPs"
                onSearch={value => handleModuleSearch(value)}
              />
            </div>
            <Table
              className={styles.moduleTableNew}
              scroll={{ y: 'calc(80vh - 80px)' }}
              rowClassName={styles.moduleTr}
              showHeader={false}
              onRow={record => ({
                onClick: () => listPostModuleConfigReq.run({ loadpath: record.loadpath }),
              })}
              size="small"
              bordered
              pagination={false}
              rowKey={item => item.loadpath}
              columns={postModuleConfigTableColumns}
              dataSource={postModuleConfigListState}
              // rowSelection={undefined}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Tabs defaultActiveKey="params" style={{ marginTop: 12 }}>
            <TabPane
              tab={
                <span><FormOutlined/>参数</span>
              }
              key="params"
            >
              <Form
                className={styles.moduleCardNew}
                style={{ marginBottom: 16 }}
                layout="vertical"
                wrapperCol={{ span: 24 }}
                onFinish={onCreatePostModuleActuator}
              >
                <Row>{getOptions()}</Row>
                <Row>
                  {postModuleConfigActive.WARN === null ||
                  postModuleConfigActive.WARN === undefined ? null : (
                    <Col span={22}>
                      <Alert
                        style={{ marginBottom: 16 }}
                        type="warning"
                        showIcon
                        message={postModuleConfigActive.WARN}
                      />
                    </Col>
                  )}
                  <Col span={22}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      disabled={postModuleConfigActive.loadpath === null}
                      icon={<CaretRightOutlined/>}
                      loading={
                        createPostModuleActuatorReq.loading || listPostModuleConfigReq.loading
                      }
                    >
                      执行
                    </Button>
                  </Col>
                </Row>
              </Form>
            </TabPane>
            <TabPane
              tab={
                <span>
                    <InfoCircleOutlined/>
                    说明
                  </span>
              }
              key="desc"
            >
              <ModuleInfoContent postModuleConfig={postModuleConfigActive}/>
            </TabPane>
            <TabPane
              tab={<span><CheckCircleOutlined/>权限&主机</span>}
              key="hostandsession"
            >
              <div
                style={{
                  display: 'flex',
                  cursor: 'pointer',
                }}
              >
                {heartbeat}
                {sessionidTag}
                {connectTag}
                {archTag}
                {os_tag_new}
                {user}
              </div>
              <div
                style={{
                  display: 'flex',
                  cursor: 'pointer',
                }}
              >
                {hostipaddress}
                <Tooltip title={record.comment} placement="left">
                  {host_type_to_avatar_table[record.tag]}
                </Tooltip>
              </div>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </Fragment>
  );
};

export const RunModuleMemo = React.memo(RunModule);

export const RunBotModule = props => {
  console.log('RunBotModule');

  const botModuleConfigListProps = useModel('HostAndSessionModel', model => ({
    botModuleConfigList: model.botModuleConfigList,
  })).botModuleConfigList;

  const getPins = () => {
    if (localStorage.getItem('Pins') === null) {
      localStorage.setItem('Pins', JSON.stringify([]));
      return [];
    }
    return JSON.parse(localStorage.getItem('Pins'));
  };

  const changePin = loadpath => {
    const pins = getPins();
    const index = pins.indexOf(loadpath);
    if (index > -1) {
      pins.splice(index, 1);
      localStorage.setItem('Pins', JSON.stringify(pins));
      return pins;
    }
    pins.push(loadpath);
    localStorage.setItem('Pins', JSON.stringify(pins));
    return pins;
  };

  const pins = getPins();
  botModuleConfigListProps.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));
  const [botModuleConfigList, setBotModuleConfigList] = useState(botModuleConfigListProps);
  const [botModuleConfigActive, setBotModuleConfigActive] = useState({
    NAME: null,
    DESC: null,
    AUTHOR: null,
    OPTIONS: [],
    REQUIRE_SESSION: true,
    loadpath: null,
    REFERENCES: [],
    SEARCH: '',
  });

  const [ipportListState, setIpportListState] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);


  const listPostModuleConfigReq = useRequest(getPostmodulePostModuleConfigAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setBotModuleConfigActive(result);
      setSelectedRowKeys([]);
      setSelectedRows([]);
    },
    onError: (error, params) => {
    },
  });

  const createPostModuleActuatorReq = useRequest(postPostmodulePostModuleActuatorAPI, {
    manual: true,
    onSuccess: (result, params) => {

    },
    onError: (error, params) => {
    },
  });

  const onCreatePostModuleActuator = (params) => {
    createPostModuleActuatorReq.run({
      moduletype: 'Bot',
      ipportlist: selectedRows,
      loadpath: botModuleConfigActive.loadpath,
      custom_param: JSON.stringify(params),
    });
  };

  const onPostModuleConfigListChange = botModuleConfigList => {
    const pins = getPins();
    botModuleConfigList.sort((a, b) => pins.indexOf(b.loadpath) - pins.indexOf(a.loadpath));
    setBotModuleConfigList(botModuleConfigList);
  };

  const handleModuleSearch = value => {
    const reg = new RegExp(value, 'gi');
    onPostModuleConfigListChange(
      botModuleConfigListProps
        .map(record => {
          let NAMEMatch = false;
          let DESCMatch = false;
          let REFERENCESMatch = false;
          try {
            NAMEMatch = record.NAME.match(reg);
            DESCMatch = record.DESC.match(reg);
            REFERENCESMatch = record.REFERENCES.toString().match(reg);
          } catch (error) {
          }

          if (NAMEMatch || DESCMatch || REFERENCESMatch) {
            return {
              ...record,
            };
          }
          return null;
        }).filter(record => !!record),
    );
  };

  const listNetworkSearchReq = useRequest(getCoreNetworkSearchAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setIpportListState(result);
    },
    onError: (error, params) => {
    },
  });

  const searchNetworkSubmit = values => {
    let querystr = botModuleConfigActive.SEARCH;
    if (values.inputstr !== undefined && values.inputstr !== null) {
      querystr = querystr = '{0} && {1}'.format(botModuleConfigActive.SEARCH, values.inputstr);
    }
    listNetworkSearchReq.run({ engine: 'FOFA', querystr, page: values.page, size: values.size });
  };

  const getOptions = botModuleConfigActive => {
    let options = [];
    for (const oneOption of botModuleConfigActive.OPTIONS) {
      if (oneOption.type === 'str') {
        options.push(
          <Col span={oneOption.option_length}>
            <Form.Item
              label={
                <Tooltip title={oneOption.desc}>
                  <span>{oneOption.name_tag}</span>
                </Tooltip>
              }
              initialValue={oneOption.default}
              name={oneOption.name}
              rules={[{ required: oneOption.required, message: '请输入' }]}
            >
              <Input style={{ width: '90%' }}
                // defaultValue={oneOption.default}
              />
            </Form.Item>
          </Col>,
        );
      } else if (oneOption.type === 'bool') {
        options.push(
          <Col span={oneOption.option_length}>
            <Form.Item
              label={
                <Tooltip title={oneOption.desc}>
                  <span>{oneOption.name_tag}</span>
                </Tooltip>
              }
              initialValue={oneOption.default}
              name={oneOption.name}
              valuePropName="checked"
              rules={[{ required: oneOption.required, message: '请输入' }]}
            >
              <Checkbox style={{ width: '90%' }} defaultChecked={oneOption.default}/>
            </Form.Item>
          </Col>,
        );
      } else if (oneOption.type === 'integer') {
        options.push(
          <Col span={oneOption.option_length}>
            <Form.Item
              label={
                <Tooltip title={oneOption.desc}>
                  <span>{oneOption.name_tag}</span>
                </Tooltip>
              }
              initialValue={oneOption.default}
              name={oneOption.name}
              rules={[{ required: oneOption.required, message: '请输入' }]}
              wrapperCol={{ span: 24 }}
            >
              <InputNumber style={{ width: '90%' }}
                // defaultValue={oneOption.default}
              />
            </Form.Item>
          </Col>,
        );
      } else if (oneOption.type === 'float') {
        options.push(
          <Col span={oneOption.option_length}>
            <Form.Item
              label={
                <Tooltip title={oneOption.desc}>
                  <span>{oneOption.name_tag}</span>
                </Tooltip>
              }
              initialValue={oneOption.default}
              name={oneOption.name}
              rules={[{ required: oneOption.required, message: '请输入' }]}
              wrapperCol={{ span: 24 }}
            >
              <InputNumber step={0.1} style={{ width: '90%' }}
                // defaultValue={oneOption.default}
              />
            </Form.Item>
          </Col>,
        );
      } else if (oneOption.type === 'enum') {
        const selectOptions = [];
        for (const oneselect of oneOption.enum_list) {
          selectOptions.push(
            <Option value={oneselect.value}>
              <Tooltip mouseEnterDelay={0.3} title={oneselect.name}>
                {oneselect.name}
              </Tooltip>
            </Option>,
          );
        }
        options.push(
          <Col span={oneOption.option_length}>
            <Form.Item
              label={
                <Tooltip title={oneOption.desc}>
                  <span>{oneOption.name_tag}</span>
                </Tooltip>
              }
              initialValue={oneOption.default}
              name={oneOption.name}
              rules={[{ required: oneOption.required, message: '请输入' }]}
              wrapperCol={{ span: 24 }}
            >
              <Select
                allowClear
                // defaultValue={oneOption.default}
                style={{
                  // minWidth: '90%',
                  width: '90%',
                }}
              >
                {selectOptions}
              </Select>
            </Form.Item>
          </Col>,
        );
      } else {
        options.push(
          <Col span={oneOption.option_length}>
            <Form.Item
              label={
                <Tooltip title={oneOption.desc}>
                  <span>{oneOption.name_tag}</span>
                </Tooltip>
              }
              initialValue={oneOption.default}
              name={oneOption.name}
              rules={[{ required: oneOption.required, message: '请输入' }]}
              wrapperCol={{ span: 24 }}
            >
              <Input style={{ width: '90%' }}
                // defaultValue={oneOption.default}
              />
            </Form.Item>
          </Col>,
        );
      }
    }
    return options;
  };


  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const postModuleConfigTableColumns = [
    {
      dataIndex: 'NAME',
      render: (text, record) => {
        let tag = null;
        if (record.loadpath === botModuleConfigActive.loadpath) {
          tag = (
            <Avatar
              shape="square"
              size={20}
              style={{ backgroundColor: '#1890ff' }}
              icon={<CheckOutlined/>}
            />
          );
        } else {
          tag = (
            <Avatar
              shape="square"
              size={20}
              style={{
                visibility: 'hidden',
                backgroundColor: '#bfbfbf',
              }}
              icon={<QuestionOutlined/>}
            />
          );
        }
        const pins = getPins();
        const pinIcon =
          pins.indexOf(record.loadpath) > -1 ? (
            <StarTwoTone
              twoToneColor="#d89614"
              onClick={() => {
                const newpins = changePin(record.loadpath);
                onPostModuleConfigListChange(botModuleConfigList);
              }}
              style={{
                marginTop: 4,
                float: 'right',
                fontSize: '18px',
              }}
            />
          ) : (
            <StarOutlined
              onClick={() => {
                const newpins = changePin(record.loadpath);
                onPostModuleConfigListChange(botModuleConfigList);
              }}
              style={{
                marginTop: 4,
                float: 'right',
                fontSize: '18px',
              }}
            />
          );

        return (
          <div style={{ display: 'inline' }}>
            {tag}
            <a style={{ marginLeft: 4 }}>{text}</a>
            {pinIcon}
          </div>
        );
      },
    },
  ];


  const options = getOptions(botModuleConfigActive);

  const ModuleInfoContent = props => {
    const { postModuleConfig } = props;
    if (postModuleConfig === undefined) {
      return null;
    }

    const references = postModuleConfig.REFERENCES;
    const referencesCom = [];
    for (let i = 0; i < references.length; i++) {
      referencesCom.push(
        <div>
          <a href={references[i]} target="_blank">
            {references[i]}
          </a>
        </div>,
      );
    }
    return (
      <Descriptions
        size="small"
        style={{
          padding: '0 0 0 0',
          marginRight: 8,
        }}
        column={8}
        bordered
      >
        <Descriptions.Item label="名称" span={8}>
          {postModuleConfig.NAME}
        </Descriptions.Item>
        <Descriptions.Item label="作者" span={4}>
          <Tag color="lime">{postModuleConfig.AUTHOR}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="参考链接" span={8}>
          {referencesCom}
        </Descriptions.Item>
        <Descriptions.Item span={8} label="搜索关键字">
          <pre>{postModuleConfig.SEARCH}</pre>
        </Descriptions.Item>
        <Descriptions.Item span={8} label="简介">
          <pre>{postModuleConfig.DESC}</pre>
        </Descriptions.Item>
      </Descriptions>
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };


  return (
    <Row>
      <Col span={8}>
        <Card bordered={false} className={styles.botModuleCard}>
          <div style={{ display: 'flex' }}>
            <Search
              style={{}}
              placeholder="搜索模块"
              onSearch={value => handleModuleSearch(value)}
            />
          </div>
          <Table
            className={styles.botmoduleTableNew}
            scroll={{ y: 'calc(100vh - 320px - 36px)' }}
            rowClassName={styles.moduleTr}
            showHeader={false}
            onRow={record => ({
              onClick: () => listPostModuleConfigReq.run({ loadpath: record.loadpath }),
            })}
            size="small"
            bordered
            pagination={false}
            rowKey={item => item.loadpath}
            rowSelection={undefined}
            columns={postModuleConfigTableColumns}
            dataSource={botModuleConfigList}
          />
          <Form layout="horizontal" onFinish={searchNetworkSubmit}>
            <Form.Item name="inputstr">
              <TextArea
                placeholder="自定义搜索规则,参考FOFA官网"
                autoSize={{ minRows: 2, maxRows: 2 }}
              />
            </Form.Item>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="分页"
                  name="page"
                  initialValue={1}
                  rules={[
                    {
                      type: 'number',
                      min: 1,
                    },
                  ]}
                >
                  <InputNumber/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span>数量</span>}
                  initialValue={100}
                  rules={[
                    {
                      type: 'number',
                      min: 1,
                      max: 10000,
                    },
                  ]}
                  name="size"
                >
                  <InputNumber/>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button
                block
                icon={<SearchOutlined/>}
                type="primary"
                htmlType="submit"
                disabled={botModuleConfigActive.loadpath === null}
                loading={listNetworkSearchReq.loading}
              >
                搜索
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
      <Col span={16}>
        <Tabs defaultActiveKey="ipportlist" style={{ marginTop: 12 }}>
          <TabPane
            tab={<span><RadarChartOutlined/>全网数据</span>}
            key="ipportlist"
          >
            <Card
              bordered={false}
              bodyStyle={{ padding: '0px 8px 16px 0px' }}
              style={{ marginTop: 0 }}
            >
              <Table
                style={{ marginTop: 0 }}
                loading={listNetworkSearchReq.loading}
                className={styles.searchHostsTable}
                scroll={{ y: 'calc(100vh - 136px - 36px)' }}
                size="small"
                bordered
                pagination={false}
                rowKey="ip"
                rowSelection={rowSelection}
                columns={[
                  {
                    title: 'IP',
                    dataIndex: 'ip',
                    key: 'ip',
                    width: 120,
                    render: (text, record) => (
                      <strong
                        style={{
                          color: '#13a8a8',
                        }}
                      >
                        {text}
                      </strong>
                    ),
                  },
                  {
                    title: '端口',
                    dataIndex: 'port',
                    key: 'port',
                    width: 64,
                    render: (text, record) => {
                      return text;
                    },
                  },
                  {
                    title: '协议',
                    dataIndex: 'protocol',
                    key: 'protocol',
                    width: 96,
                    render: (text, record) => {
                      return text;
                    },
                  },
                  {
                    title: '国家',
                    dataIndex: 'country_name',
                    key: 'country_name',
                    width: 96,
                    render: (text, record) => {
                      return text;
                    },
                  },
                  {
                    title: '组织',
                    dataIndex: 'as_organization',
                    key: 'as_organization',
                    render: (text, record) => {
                      return text;
                    },
                  },
                ]}
                dataSource={ipportListState}
              />
            </Card>
          </TabPane>
          <TabPane
            tab={<span><FormOutlined/>参数</span>}
            key="params"
          >
            <Form
              style={{ marginBottom: 16 }}
              layout="vertical"
              wrapperCol={{ span: 24 }}
              onFinish={onCreatePostModuleActuator}
            >
              <Row>{options}</Row>
              <Row>
                <Col span={22}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    disabled={
                      botModuleConfigActive.loadpath === null || selectedRows.length === 0
                    }
                    icon={<PlayCircleOutlined/>}
                    loading={
                      createPostModuleActuatorReq.loading || listPostModuleConfigReq.loading
                    }
                  >
                    运行
                  </Button>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane
            tab={<span><InfoCircleOutlined/>说明</span>}
            key="desc"
          >
            <ModuleInfoContent postModuleConfig={botModuleConfigActive}/>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

export const RunBotModuleMemo = memo(RunBotModule);

export const PostModule = props => {
  console.log('PostModule');
  const { loadpath, hostAndSessionActive, initialValues } = props;
  const [postModuleConfigActive, setPostModuleConfigActive] = useState({
    NAME: null,
    DESC: null,
    AUTHOR: null,
    OPTIONS: [],
    REQUIRE_SESSION: true,
    loadpath: null,
    PERMISSIONS: [],
    PLATFORM: [],
    REFERENCES: [],
    ATTCK: [],
  });


  const initGetPostModuleConfigReq = useRequest(() => getPostmodulePostModuleConfigAPI({ loadpath }), {
    onSuccess: (result, params) => {
      setPostModuleConfigActive(result);
    },
    onError: (error, params) => {
    },
  });

  const createPostModuleActuatorReq = useRequest(postPostmodulePostModuleActuatorAPI, {
    manual: true,
    onSuccess: (result, params) => {
    },
    onError: (error, params) => {
    },
  });

  const onCreatePostModuleActuator = (params) => {
    createPostModuleActuatorReq.run({
      hid: hostAndSessionActive.id,
      sessionid: hostAndSessionActive.session.id,
      loadpath: postModuleConfigActive.loadpath,
      custom_param: JSON.stringify(params),
    });
  };
  const [form] = Form.useForm();
  const options = [];
  if (postModuleConfigActive === undefined) {
    return [];
  }
  for (const oneOption of postModuleConfigActive.OPTIONS) {
    // this.formRef.current.setFieldsValue({ [oneOption.name]: oneOption.default });
    form.setFieldsValue({ [oneOption.name]: oneOption.default });
    if (oneOption.type === 'str') {
      options.push(
        <Col span={oneOption.option_length}>
          <Form.Item
            label={
              <Tooltip title={oneOption.desc}>
                <span>{oneOption.name_tag}</span>
              </Tooltip>
            }
            name={oneOption.name}
            rules={[{ required: oneOption.required, message: '请输入' }]}
          >
            <Input style={{ width: '90%' }}
              // defaultValue={oneOption.default}
            />
          </Form.Item>
        </Col>,
      );
    } else if (oneOption.type === 'bool') {
      options.push(
        <Col span={oneOption.option_length}>
          <Form.Item
            label={
              <Tooltip title={oneOption.desc}>
                <span>{oneOption.name_tag}</span>
              </Tooltip>
            }
            name={oneOption.name}
            valuePropName="checked"
            rules={[{ required: oneOption.required, message: '请输入' }]}
          >
            <Checkbox style={{ width: '90%' }} defaultChecked={oneOption.default}/>
          </Form.Item>
        </Col>,
      );
    } else if (oneOption.type === 'integer') {
      options.push(
        <Col span={oneOption.option_length}>
          <Form.Item
            label={
              <Tooltip title={oneOption.desc}>
                <span>{oneOption.name_tag}</span>
              </Tooltip>
            }
            name={oneOption.name}
            rules={[{ required: oneOption.required, message: '请输入' }]}
            wrapperCol={{ span: 24 }}
          >
            <InputNumber style={{ width: '90%' }}
              // defaultValue={oneOption.default}
            />
          </Form.Item>
        </Col>,
      );
    } else if (oneOption.type === 'float') {
      options.push(
        <Col span={oneOption.option_length}>
          <Form.Item
            label={
              <Tooltip title={oneOption.desc}>
                <span>{oneOption.name_tag}</span>
              </Tooltip>
            }
            name={oneOption.name}
            rules={[{ required: oneOption.required, message: '请输入' }]}
            wrapperCol={{ span: 24 }}
          >
            <InputNumber step={0.1} style={{ width: '90%' }}
              // defaultValue={oneOption.default}
            />
          </Form.Item>
        </Col>,
      );
    } else if (oneOption.type === 'enum') {
      const selectOptions = [];
      for (const oneselect of oneOption.enum_list) {
        selectOptions.push(
          <Option value={oneselect.value}>
            <Tooltip mouseEnterDelay={0.3} title={oneselect.name}>
              {oneselect.name}
            </Tooltip>
          </Option>,
        );
      }
      options.push(
        <Col span={oneOption.option_length}>
          <Form.Item
            label={
              <Tooltip title={oneOption.desc}>
                <span>{oneOption.name_tag}</span>
              </Tooltip>
            }
            name={oneOption.name}
            rules={[{ required: oneOption.required, message: '请输入' }]}
            wrapperCol={{ span: 24 }}
          >
            <Select
              // defaultValue={oneOption.default}
              style={{
                // minWidth: '90%',
                width: '90%',
              }}
            >
              {selectOptions}
            </Select>
          </Form.Item>
        </Col>,
      );
    } else {
      options.push(
        <Col span={oneOption.option_length}>
          <Form.Item
            label={
              <Tooltip title={oneOption.desc}>
                <span>{oneOption.name_tag}</span>
              </Tooltip>
            }
            name={oneOption.name}
            rules={[{ required: oneOption.required, message: '请输入' }]}
            wrapperCol={{ span: 24 }}
          >
            <Input style={{ width: '90%' }}
              // defaultValue={oneOption.default}
            />
          </Form.Item>
        </Col>,
      );
    }
  }
  form.setFieldsValue(initialValues);
  return (
    <Form
      form={form}
      layout="vertical"
      wrapperCol={{ span: 24 }}
      onFinish={onCreatePostModuleActuator}
      initialValues={initialValues}
    >
      <Row>{options}</Row>
      <Row>
        <Col span={12}>
          <Button
            type="primary"
            htmlType="submit"
            block
            icon={<PlayCircleOutlined/>}
            loading={
              createPostModuleActuatorReq.loading
            }
          >
            运行
          </Button>
        </Col>
      </Row>
    </Form>
  );
};



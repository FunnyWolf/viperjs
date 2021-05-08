import React, { Fragment, memo, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';

import {
  Alert,
  Button,
  Col,
  Form as FormNew,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { host_type_to_avatar_table, SidTag } from '@/pages/Core/Common';
import styles from './MsfSocks.less';
import { useRequest } from 'umi';
import {
  deleteMsgrpcPortFwdAPI,
  deleteMsgrpcRouteAPI,
  deleteMsgrpcSocksAPI,
  getMsgrpcSocksAPI,
  postMsgrpcSocksAPI,
} from '@/services/apiv1';

const { Option } = Select;
const { TabPane } = Tabs;

//字符串格式化函数
String.prototype.format = function() {
  let args = arguments;
  return this.replace(/\{(\d+)\}/g, function(m, i) {
    return args[i];
  });
};

const MsfSocks = props => {
  console.log('MsfSocks');
  const [createSocksModalVisible, setCreateSocksModalVisible] = useState(false);
  const [socksActive, setSocksActive] = useState([]);
  const [routeAll, setRouteAll] = useState([]);
  const [portfwds, setPortfwds] = useState({});
  const [hostsRoute, setHostsRoute] = useState([]);

  const initListSocksReq = useRequest(getMsgrpcSocksAPI, {
    onSuccess: (result, params) => {
      setSocksActive(result.socks);
      setRouteAll(result.routes);
      setPortfwds(result.portfwds);
      setHostsRoute(result.hostsRoute);
    },
    onError: (error, params) => {
    },
  });

  const listSocksReq = useRequest(getMsgrpcSocksAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSocksActive(result.socks);
      setRouteAll(result.routes);
      setPortfwds(result.portfwds);
      setHostsRoute(result.hostsRoute);
    },
    onError: (error, params) => {
    },
  });

  const createSocksReq = useRequest(postMsgrpcSocksAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listSocksReq.run();
      setCreateSocksModalVisible(false);
    },
    onError: (error, params) => {
    },
  });

  const destorySocksReq = useRequest(deleteMsgrpcSocksAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listSocksReq.run();
    },
    onError: (error, params) => {
    },
  });

  const destoryPortFwdReq = useRequest(deleteMsgrpcPortFwdAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listSocksReq.run();
    },
    onError: (error, params) => {
    },
  });

  const destoryRouteReq = useRequest(deleteMsgrpcRouteAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listSocksReq.run();
    },
    onError: (error, params) => {
    },
  });

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const buttonLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

  return (
    <Fragment>
      <Row gutter={0} style={{ marginTop: -16 }}>
        <Col span={12}>
          <Button
            type="dashed"
            style={{ marginTop: 0 }}
            block
            icon={<PlusOutlined/>}
            onClick={() => setCreateSocksModalVisible(true)}
          >
            新增代理
          </Button>
          <Tabs
            style={{
              padding: '0 0 0 0',
            }}
            type="card"
            defaultActiveKey="socks"
            tabPosition="top"
          >
            <TabPane tab="内网代理" key="socks">
              <Table
                bordered
                style={{ marginTop: -16 }}
                className={styles.routesTable}
                size="small"
                rowKey="port"
                pagination={false}
                dataSource={socksActive}
                columns={[
                  {
                    title: '代理类型',
                    dataIndex: 'type',
                    key: 'type',
                  },
                  {
                    title: '监听地址',
                    dataIndex: 'lhost',
                    key: 'lhost',
                  },
                  {
                    title: '端口',
                    dataIndex: 'port',
                    key: 'port',
                  },
                  {
                    title: '操作',
                    dataIndex: 'operation',
                    width: 64,
                    render: (text, record) => (
                      <a style={{ color: 'red' }} onClick={() => destorySocksReq.run(record)}>
                        删除
                      </a>
                    ),
                  },
                ]}
              />
            </TabPane>
          </Tabs>
        </Col>
        <Col span={12}>
          <Button
            icon={<SyncOutlined/>}
            block
            loading={
              listSocksReq.loading ||
              destorySocksReq.loading ||
              destoryPortFwdReq.loading ||
              destoryRouteReq.loading
            }
            onClick={() => listSocksReq.run()}
          >
            刷新
          </Button>
          <Tabs
            style={{
              marginTop: 0,
              padding: '0 0 0 0',
            }}
            type="card"
            animated
            defaultActiveKey="hostsRoute"
            tabPosition="top"
          >
            <TabPane tab=" 路由路径 " key="hostsRoute">
              <Table
                bordered
                style={{ marginTop: -16 }}
                className={styles.routesTable}
                size="small"
                rowKey="subnet"
                pagination={false}
                dataSource={hostsRoute}
                columns={[
                  {
                    title: '主机',
                    dataIndex: 'ipaddress',
                    key: 'ipaddress',
                    width: 120,
                    render: (text, record) => {
                      return (
                        <strong
                          style={{
                            textAlign: 'center',
                            color: '#d8bd14',
                          }}
                        >
                          {text}
                        </strong>
                      );
                    },
                  },
                  {
                    title: '路由路径',
                    dataIndex: 'route',
                    key: 'route',
                    width: 120,
                    render: (text, record) => {
                      let routepath = null;
                      if (
                        record.route === {} ||
                        record.route === null ||
                        record.route === undefined
                      ) {
                        routepath = <span style={{ color: 'orange' }}>网络直连</span>;
                      } else if (record.route.type === 'DIRECT') {
                        routepath = <span style={{ color: 'orange' }}>网络直连</span>;
                      } else if (record.route.type === 'ROUTE') {
                        routepath = (
                          <Space>
                            <span style={{ color: 'green' }}>内网路由</span>
                            {SidTag(record.route.data)}
                          </Space>
                        );
                      }
                      return routepath;
                    },
                  },
                  {
                    title: '备注信息',
                    dataIndex: 'comment',
                    key: 'comment',
                    render: (text, record) => (
                      <div style={{ display: 'flex' }}>
                        {host_type_to_avatar_table[record.tag]}
                        <Typography.Text style={{ marginLeft: 4 }}>
                          {record.comment}
                        </Typography.Text>
                      </div>
                    ),
                  },
                ]}
              />
            </TabPane>
            <TabPane tab=" 路由列表 " key="routes">
              <Table
                bordered
                style={{ marginTop: -16 }}
                className={styles.routesTable}
                size="small"
                rowKey="subnet"
                pagination={false}
                dataSource={routeAll}
                columns={[
                  {
                    title: 'SID',
                    dataIndex: 'session',
                    key: 'session',
                    width: 48,
                    render: (text, record) => {
                      return SidTag(text);
                    },
                  },
                  {
                    title: '路由子网',
                    dataIndex: 'subnet',
                    key: 'subnet',
                  },
                  {
                    title: '路由掩码',
                    dataIndex: 'netmask',
                    key: 'netmask',
                    width: 120,
                  },
                  {
                    title: '操作',
                    dataIndex: 'operation',
                    width: 64,
                    render: (text, record) => (
                      <a
                        style={{ color: 'red' }}
                        onClick={() =>
                          destoryRouteReq.run({
                            sessionid: record.session,
                            subnet: record.subnet,
                            netmask: record.netmask,
                          })
                        }
                      >
                        删除
                      </a>
                    ),
                  },
                ]}
              />
            </TabPane>
            <TabPane tab=" 端口转发 " key="portfwd">
              <Table
                style={{ marginTop: -16 }}
                className={styles.routesTable}
                bordered
                size="small"
                rowKey="index"
                pagination={false}
                dataSource={portfwds}
                columns={[
                  {
                    title: 'SID',
                    dataIndex: 'sessionid',
                    key: 'index',
                    width: 48,
                    render: (text, record) => {
                      return SidTag(text);
                    },
                  },
                  {
                    title: '转发方向',
                    dataIndex: 'type',
                    key: 'type',
                    width: 80,
                    render: (text, record) => {
                      if (record.type === 'Forward') {
                        return (
                          <div>
                            <Tag color="cyan">正向转发</Tag>
                          </div>
                        );
                      }
                      return (
                        <div>
                          <Tag color="geekblue">反向转发</Tag>
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
                            <Tag style={{ marginRight: 8 }} color="green">
                              监听
                            </Tag>
                            <span>{`${record.lhost}:${record.lport}`}</span>
                          </div>
                        );
                      }
                      return (
                        <div>
                          <Tag style={{ marginRight: 8 }} color="gold">
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
                            <Tag style={{ marginRight: 8 }} color="gold">
                              目标
                            </Tag>
                            <span>{`${record.rhost}:${record.rport}`}</span>
                          </div>
                        );
                      }
                      return (
                        <div>
                          <Tag style={{ marginRight: 8 }} color="green">
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
                    width: 64,
                    render: (text, record) => (
                      <a style={{ color: 'red' }} onClick={() => destoryPortFwdReq.run(record)}>
                        删除
                      </a>
                    ),
                  },
                ]}
              />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
      <Modal
        title="新增代理"
        centered
        width="50vw"
        bodyStyle={{ padding: '8 8 8 8' }}
        destroyOnClose
        visible={createSocksModalVisible}
        footer={null}
        onCancel={() => setCreateSocksModalVisible(false)}
      >
        <FormNew onFinish={createSocksReq.run}>
          <FormNew.Item
            {...formLayout}
            label={<span>代理类型</span>}
            name="type"
            rules={[
              {
                required: true,
                message: '请选择代理类型',
              },
            ]}
          >
            <Select style={{ width: 160 }}>
              <Option value="msf_socks4a">Socks4a</Option>
              <Option value="msf_socks5">Socks5</Option>
            </Select>
          </FormNew.Item>
          <FormNew.Item
            {...formLayout}
            label={<span>本地端口</span>}
            name="port"
            rules={[
              {
                required: true,
                message: '请输入本地监听端口',
              },
            ]}
          >
            <InputNumber style={{ width: 160 }} placeholder="socks监听端口"/>
          </FormNew.Item>
          <FormNew.Item {...buttonLayout}>
            <Button
              block
              loading={createSocksReq.loading}
              icon={<PlusOutlined/>}
              htmlType="submit"
              type="primary"
            >
              新增
            </Button>
          </FormNew.Item>
          <Row>
            <Col span={20} offset={4}>
              <Alert
                message="Socks代理请勿开放到外网1080,80等常用端口,防范DDos攻击"
                type="warning"
                showIcon
              />
            </Col>
          </Row>
        </FormNew>
      </Modal>
    </Fragment>
  );
};
export const MsfSocksMemo = memo(MsfSocks);

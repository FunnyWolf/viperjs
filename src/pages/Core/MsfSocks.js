import React, { memo, useState } from "react";
import {
  BugOutlined,
  CloudOutlined,
  CopyOutlined,
  DeleteOutlined,
  DeliveredProcedureOutlined,
  FormOutlined,
  GatewayOutlined,
  LaptopOutlined,
  PlusOutlined,
  QuestionOutlined,
  SearchOutlined,
  SyncOutlined,
  WindowsOutlined
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Col,
  Form as FormNew,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag
} from "antd";
import { SidTag } from "@/pages/Core/Common";
import styles from "./MsfSocks.less";
import {
  deleteCoreHostAPI,
  deleteMsgrpcPortFwdAPI,
  deleteMsgrpcRouteAPI,
  deleteMsgrpcSocksAPI,
  getCoreHostAPI,
  postMsgrpcSocksAPI,
  putCoreHostAPI
} from "@/services/apiv1";

import copy from "copy-to-clipboard";
import { formatMessage, useRequest } from "umi";
import moment from "moment";

const { Option } = Select;
const { TabPane } = Tabs;
const { Search } = Input;

//字符串格式化函数
String.prototype.format = function() {
  let args = arguments;
  return this.replace(/\{(\d+)\}/g, function(m, i) {
    return args[i];
  });
};
const host_type_to_avatar = {
  ad_server: (
    <Avatar
      size="small"
      shape="square"
      style={{ backgroundColor: "#177ddc" }}
      icon={<WindowsOutlined />}
    />
  ),
  pc: (
    <Avatar
      size="small"
      shape="square"
      style={{ backgroundColor: "#49aa19" }}
      icon={<LaptopOutlined />}
    />
  ),
  web_server: (
    <Avatar
      size="small"
      shape="square"
      style={{ backgroundColor: "#13a8a8" }}
      icon={<CloudOutlined />}
    />
  ),
  cms: (
    <Avatar
      size="small"
      shape="square"
      style={{ backgroundColor: "#d84a1b" }}
      icon={<BugOutlined />}
    />
  ),
  firewall: (
    <Avatar
      size="small"
      shape="square"
      style={{ backgroundColor: "#d87a16" }}
      icon={<GatewayOutlined />}
    />
  ),
  other: (
    <Avatar
      size="small"
      shape="square"
      style={{ backgroundColor: "#bfbfbf" }}
      icon={<QuestionOutlined />}
    />
  )
};


const MuitHosts = () => {
  console.log("MuitHosts");
  const [updateHostModalVisable, setUpdateHostModalVisable] = useState(false);
  const [hostList, setHostList] = useState([]);
  const [hostListTmp, setHostListTmp] = useState([]);
  const [hostAcvtive, setHostAcvtive] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [text, setText] = useState("");
  const [createSocksModalVisible, setCreateSocksModalVisible] = useState(false);
  const [socksActive, setSocksActive] = useState([]);
  const [routeAll, setRouteAll] = useState([]);
  const [portfwds, setPortfwds] = useState([]);
  const [hostsRoute, setHostsRoute] = useState([]);

  const createSocksReq = useRequest(postMsgrpcSocksAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listHostReq.run();
      setCreateSocksModalVisible(false);
    },
    onError: (error, params) => {
    }
  });

  const destorySocksReq = useRequest(deleteMsgrpcSocksAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listHostReq.run();
    },
    onError: (error, params) => {
    }
  });

  const destoryPortFwdReq = useRequest(deleteMsgrpcPortFwdAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listHostReq.run();
    },
    onError: (error, params) => {
    }
  });

  const destoryRouteReq = useRequest(deleteMsgrpcRouteAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listHostReq.run();
    },
    onError: (error, params) => {
    }
  });


  const initListHostReq = useRequest(getCoreHostAPI, {
    onSuccess: (result, params) => {
      setSocksActive(result.socks);
      setPortfwds(result.portfwds);
      setRouteAll(result.routes);
      setHostList(result.hosts);

      setHostListTmp(result.hosts);
      setSelectedRowKeys([]);
      setSelectedRows([]);
    },
    onError: (error, params) => {
    }
  });

  const listHostReq = useRequest(getCoreHostAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setHostList(result.hosts);
      setHostListTmp(result.hosts);
      setSelectedRowKeys([]);
      setSelectedRows([]);
    },
    onError: (error, params) => {
    }
  });

  const showUpdateHostModal = record => {
    setUpdateHostModalVisable(true);
    setHostAcvtive(record);
  };

  const closeUpdateHostModal = () => {
    setUpdateHostModalVisable(false);
  };

  const updateHostReq = useRequest(putCoreHostAPI, {
    manual: true,
    onSuccess: (result, params) => {
      closeUpdateHostModal();
      listHostReq.run();
    },
    onError: (error, params) => {
    }
  });

  const destoryHostReq = useRequest(deleteCoreHostAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listHostReq.run();
    },
    onError: (error, params) => {
    }
  });


  const getSelectHostIPaddress = () => {
    const ipaddressArray = [];
    for (let i = 0; i < selectedRows.length; i += 1) {
      ipaddressArray.push(selectedRows[i].ipaddress);
    }
    copy(ipaddressArray.join());
    message.success(
      `${ipaddressArray.join()} ${formatMessage({ id: "app.response.copytoclipboard" })}`
    );
  };

  const reloadSearch = () => {
    setHostList(hostListTmp);
    setText("");
  };

  const handleSearch = value => {
    const templist = hostListTmp;
    const reg = new RegExp(value, "gi");
    setHostList(
      templist
        .map(record => {
          let ipaddressMatch = false;
          let commentMatch = false;
          let techMatch = false;
          try {
            ipaddressMatch = record.ipaddress.includes(value);
            if (record.comment === null) {
              commentMatch = false;
            } else {
              commentMatch = record.comment.includes(value);
            }

            for (let i = 0; i < record.portService.length; i++) {
              const portServiceStr = JSON.stringify(record.portService[i]);
              techMatch = portServiceStr.match(reg);
              if (techMatch) {
                break;
              }
            }
          } catch (error) {
          }

          if (ipaddressMatch || commentMatch || techMatch) {
            return {
              ...record
            };
          }
          return null;
        })
        .filter(record => !!record)
    );
  };

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const expandedRowRender = record => {
    const portsColumns = [
      {
        title: "端口",
        dataIndex: "port",
        width: 80,
        render: (val, record) => <span>{val}</span>
      },
      {
        title: "服务",
        dataIndex: "service"
        // width: '15%',
      },
      {
        title: "Banner",
        dataIndex: "banner"
        // width: '20%',
      },

      {
        title: "更新时间",
        dataIndex: "update_time",
        width: 80,
        render: val => <Tag color="cyan">{moment(val * 1000).fromNow()}</Tag>
      }
    ];

    return (
      <Table
        bordered
        style={{ marginLeft: 23 }}
        size="small"
        columns={portsColumns}
        rowKey={item => item.id}
        dataSource={record.portService}
        pagination={false}
      />
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const formLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 18 }
  };

  const tailLayout = {
    wrapperCol: { offset: 3, span: 18 }
  };

  const buttonLayout = {
    wrapperCol: { offset: 4, span: 16 }
  };

  const hostTypeToAvatar = {
    ad_server: (
      <Avatar shape="square" style={{ backgroundColor: "#177ddc" }} icon={<WindowsOutlined />} />
    ),
    pc: <Avatar shape="square" style={{ backgroundColor: "#49aa19" }} icon={<LaptopOutlined />} />,
    web_server: (
      <Avatar shape="square" style={{ backgroundColor: "#13a8a8" }} icon={<CloudOutlined />} />
    ),
    cms: <Avatar shape="square" style={{ backgroundColor: "#d84a1b" }} icon={<BugOutlined />} />,
    firewall: (
      <Avatar shape="square" style={{ backgroundColor: "#d87a16" }} icon={<GatewayOutlined />} />
    ),
    other: (
      <Avatar shape="square" style={{ backgroundColor: "#bfbfbf" }} icon={<QuestionOutlined />} />
    )
  };

  return (
    <div
      style={{ marginTop: -16 }}
    >
      <Row>
        <Col span={20}>
          <Row>
            <Col span={8}>
              <Input
                allowClear
                prefix={<SearchOutlined />}
                style={{ width: "100%" }}
                placeholder="搜索 : IP地址/端口/服务"
                value={text}
                onChange={e => {
                  setText(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            </Col>
            <Col span={4}>
              <Button
                onClick={() => getSelectHostIPaddress()}
                block
                disabled={selectedRowKeys.length === 0}
                icon={<CopyOutlined />}
              >
                拷贝
              </Button>
            </Col>
            <Col span={4}>
              <Button
                onClick={() => destoryHostReq.run({ ipaddress: selectedRowKeys.toString() })}
                block
                disabled={selectedRowKeys.length === 0}
                danger
              >
                <DeleteOutlined /> 删除
              </Button>
            </Col>
            <Col span={8}>
              <Button
                icon={<SyncOutlined />}
                onClick={() => listHostReq.run()}
                block
                loading={listHostReq.loading ||
                destoryHostReq.loading ||
                destorySocksReq.loading ||
                destoryPortFwdReq.loading ||
                destoryRouteReq.loading}
              >
                刷新
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <Table
                style={{ marginTop: 0 }}
                className={styles.muitHostsTable}
                size="small"
                bordered
                pagination={false}
                rowKey="ipaddress"
                expandable={{
                  expandedRowRender: expandedRowRender,
                  rowExpandable: record => record.portService.length > 0
                }}
                rowSelection={rowSelection}
                columns={[
                  {
                    title: "主机",
                    dataIndex: "ipaddress",
                    key: "ipaddress",
                    width: 120,
                    render: (text, record) => (
                      <strong
                        style={{
                          color: "#d8bd14"
                        }}
                      >
                        {text}
                      </strong>
                    )
                  },
                  {
                    title: "开放端口",
                    dataIndex: "portService",
                    key: "portService",
                    width: 80,
                    sorter: (a, b) => a.portService.length >= b.portService.length,
                    render: (text, record) => {
                      return (
                        <strong
                          style={{
                            color: "#13a8a8"
                          }}
                        >
                          {record.portService.length} 个
                        </strong>
                      );
                    }
                  },
                  {
                    title: "路由路径",
                    dataIndex: "route",
                    key: "route",
                    width: 120,
                    render: (text, record) => {
                      let routepath = null;
                      if (
                        record.route === {} ||
                        record.route === null ||
                        record.route === undefined
                      ) {
                        routepath = <span style={{ color: "orange" }}>网络直连</span>;
                      } else if (record.route.type === "DIRECT") {
                        routepath = <span style={{ color: "orange" }}>网络直连</span>;
                      } else if (record.route.type === "ROUTE") {
                        routepath = (
                          <Space>
                            <span style={{ color: "green" }}>内网路由</span>
                            {SidTag(record.route.data)}
                          </Space>
                        );
                      }
                      return routepath;
                    }
                  },
                  {
                    title: "备注",
                    dataIndex: "comment",
                    key: "comment",
                    // width: '10%',
                    render: (text, record) => {
                      return (
                        <div>
                          {host_type_to_avatar[record.tag]}
                          <span style={{ marginLeft: 8 }}>{text}</span>
                          <a style={{ float: "right" }} onClick={() => showUpdateHostModal(record)}><FormOutlined /></a>
                        </div>
                      );
                    }
                  },
                  {
                    title: "操作",
                    dataIndex: "operation",
                    width: 48,
                    render: (text, record) => (
                      <div style={{ textAlign: "center" }}>
                        <Space size="middle">
                          <a
                            onClick={() => destoryHostReq.run({ ipaddress: record.ipaddress })}
                            style={{ color: "red" }}
                          >
                            删除
                          </a>
                        </Space>
                      </div>
                    )
                  }
                ]}
                dataSource={hostList}
              />
            </Col>
            <Col span={8}>
              <Table
                bordered
                className={styles.proxyTable}
                size="small"
                rowKey="subnet"
                pagination={false}
                dataSource={routeAll}
                columns={[
                  {
                    title: "SID",
                    dataIndex: "session",
                    key: "session",
                    width: 48,
                    render: (text, record) => {
                      return SidTag(text);
                    }
                  },
                  {
                    title: "路由子网",
                    dataIndex: "subnet",
                    key: "subnet"
                    // width: 120,
                  },
                  {
                    title: "路由掩码",
                    dataIndex: "netmask",
                    key: "netmask",
                    width: 120
                  },
                  {
                    title: "操作",
                    dataIndex: "operation",
                    width: 48,
                    render: (text, record) => (
                      <a
                        style={{ color: "red" }}
                        onClick={() =>
                          destoryRouteReq.run({
                            sessionid: record.session,
                            subnet: record.subnet,
                            netmask: record.netmask
                          })
                        }
                      >
                        删除
                      </a>
                    )
                  }
                ]}
              />
              <Table
                style={{ marginTop: -16 }}
                className={styles.portfwdTable}
                bordered
                size="small"
                rowKey="index"
                pagination={false}
                dataSource={portfwds}
                columns={[
                  {
                    title: "SID",
                    dataIndex: "sessionid",
                    key: "index",
                    width: 48,
                    render: (text, record) => {
                      return SidTag(text);
                    }
                  },
                  {
                    title: "转发方向",
                    dataIndex: "type",
                    key: "type",
                    width: 80,
                    render: (text, record) => {
                      if (record.type === "Forward") {
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
                    }
                  },
                  {
                    title: "本地(Viper)",
                    dataIndex: "local",
                    key: "local",
                    render: (text, record) => {
                      if (record.type === "Forward") {
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
                    }
                  },
                  {
                    title: "远程(Session)",
                    dataIndex: "remote",
                    key: "remote",
                    render: (text, record) => {
                      if (record.type === "Forward") {
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
                    }
                  },
                  {
                    title: "操作",
                    dataIndex: "operation",
                    width: 64,
                    render: (text, record) => (
                      <a style={{ color: "red" }} onClick={() => destoryPortFwdReq.run(record)}>
                        删除
                      </a>
                    )
                  }
                ]}
              />
            </Col>
          </Row>
        </Col>
        <Col span={4}>
          <Button
            style={{ marginTop: 0 }}
            block
            icon={<PlusOutlined />}
            onClick={() => setCreateSocksModalVisible(true)}
          >
            新增代理
          </Button>
          <Table
            bordered
            className={styles.routesTable}
            size="small"
            rowKey="port"
            pagination={false}
            dataSource={socksActive}
            columns={[
              {
                title: "代理类型",
                dataIndex: "type",
                key: "type",
                width: 96
              },
              {
                title: "端口",
                dataIndex: "port",
                key: "port"
                // width: 96,
              },
              {
                title: "操作",
                dataIndex: "operation",
                width: 64,
                render: (text, record) => (
                  <a style={{ color: "red" }} onClick={() => destorySocksReq.run(record)}>
                    删除
                  </a>
                )
              }
            ]}
          />
        </Col>
      </Row>
      <Modal
        width="50vw"
        bodyStyle={{ padding: "32px 8px 8px 1px" }}
        destroyOnClose
        visible={updateHostModalVisable}
        footer={null}
        style={{ top: "30vh" }}
        onCancel={closeUpdateHostModal}
      >
        <Form
          initialValues={{
            ipaddress: hostAcvtive.ipaddress,
            tag: hostAcvtive.tag,
            comment: hostAcvtive.comment
          }}
          onFinish={updateHostReq.run}
        >
          <Form.Item
            label={<span>ipaddress</span>}
            name="ipaddress"
            rules={[{ required: true, message: "请输入" }]}
            style={{ display: "None" }}
            {...formLayout}
          >
            <span>{hostAcvtive.ipaddress}</span>
          </Form.Item>
          <Form.Item
            label={<span>标签</span>}
            name="tag"
            rules={[{ required: true, message: "请选择标签" }]}
            {...formLayout}
          >
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
            label={<span>注释</span>}
            name="comment"
            rules={[{ message: "最多支持二十个字符", max: 20 }]}
            {...formLayout}
          >
            <Input placeholder="最大支持二十个字符" />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              icon={<DeliveredProcedureOutlined />}
              block
              type="primary"
              htmlType="submit"
              loading={updateHostReq.loading}
            >
              更新
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="新增代理"
        centered
        width="50vw"
        bodyStyle={{ padding: "8 8 8 8" }}
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
                message: "请选择代理类型"
              }
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
                message: "请输入本地监听端口"
              }
            ]}
          >
            <InputNumber style={{ width: 160 }} placeholder="socks监听端口" />
          </FormNew.Item>
          <FormNew.Item {...buttonLayout}>
            <Button
              block
              loading={createSocksReq.loading}
              icon={<PlusOutlined />}
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
    </div>
  );
};

export const MuitHostsMemo = memo(MuitHosts);

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
  Alert, Avatar, Button, Col, Form, Input, InputNumber, Modal, Radio, Row, Select, Space, Table, Tag
} from "antd";
import { DocIcon, SidTag } from "@/pages/Core/Common";
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
import { useRequest } from "umi";
import moment from "moment";
import { formatText, msgsuccess } from "@/utils/locales";
import { cssCalc, Downheight } from "@/utils/utils";
import { useModel } from "@@/plugin-model/useModel";

const { Option } = Select;

const host_type_to_avatar = {
  ad_server: (<Avatar
    size="small"
    shape="square"
    style={{ backgroundColor: "#177ddc" }}
    icon={<WindowsOutlined />}
  />), pc: (<Avatar
    size="small"
    shape="square"
    style={{ backgroundColor: "#49aa19" }}
    icon={<LaptopOutlined />}
  />), web_server: (<Avatar
    size="small"
    shape="square"
    style={{ backgroundColor: "#13a8a8" }}
    icon={<CloudOutlined />}
  />), cms: (<Avatar
    size="small"
    shape="square"
    style={{ backgroundColor: "#d84a1b" }}
    icon={<BugOutlined />}
  />), firewall: (<Avatar
    size="small"
    shape="square"
    style={{ backgroundColor: "#d87a16" }}
    icon={<GatewayOutlined />}
  />), other: (<Avatar
    size="small"
    shape="square"
    style={{ backgroundColor: "#bfbfbf" }}
    icon={<QuestionOutlined />}
  />)
};


const MsfSocks = () => {
  console.log("MsfSocks");
  const [updateHostModalVisable, setUpdateHostModalVisable] = useState(false);
  const [hostList, setHostList] = useState([]);
  const [hostListTmp, setHostListTmp] = useState([]);
  const [hostAcvtive, setHostAcvtive] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [createSocksModalVisible, setCreateSocksModalVisible] = useState(false);
  const [socksActive, setSocksActive] = useState([]);
  const [routeAll, setRouteAll] = useState([]);
  const [portfwds, setPortfwds] = useState([]);
  const [hostsRoute, setHostsRoute] = useState([]);
  const {
    resizeDownHeight,
  } = useModel("Resize", model => ({
    resizeDownHeight: model.resizeDownHeight,
  }));

  useRequest(getCoreHostAPI, {
    onSuccess: (result, params) => {
      setSocksActive(result.socks);
      setPortfwds(result.portfwds);
      setRouteAll(result.routes);

      setHostList(result.hosts);
      setHostListTmp(result.hosts);
      setSelectedRowKeys([]);
      setSelectedRows([]);
    }, onError: (error, params) => {
    }
  });

  const listHostReq = useRequest(getCoreHostAPI, {
    manual: true, onSuccess: (result, params) => {
      setSocksActive(result.socks);
      setPortfwds(result.portfwds);
      setRouteAll(result.routes);

      setHostList(result.hosts);
      setHostListTmp(result.hosts);
      setSelectedRowKeys([]);
      setSelectedRows([]);
    }, onError: (error, params) => {
    }
  });

  const createSocksReq = useRequest(postMsgrpcSocksAPI, {
    manual: true, onSuccess: (result, params) => {
      listHostReq.run();
      setCreateSocksModalVisible(false);
    }, onError: (error, params) => {
    }
  });

  const destorySocksReq = useRequest(deleteMsgrpcSocksAPI, {
    manual: true, onSuccess: (result, params) => {
      listHostReq.run();
    }, onError: (error, params) => {
    }
  });

  const destoryPortFwdReq = useRequest(deleteMsgrpcPortFwdAPI, {
    manual: true, onSuccess: (result, params) => {
      listHostReq.run();
    }, onError: (error, params) => {
    }
  });

  const destoryRouteReq = useRequest(deleteMsgrpcRouteAPI, {
    manual: true, onSuccess: (result, params) => {
      listHostReq.run();
    }, onError: (error, params) => {
    }
  });


  const updateHostReq = useRequest(putCoreHostAPI, {
    manual: true, onSuccess: (result, params) => {
      setUpdateHostModalVisable(false);
      listHostReq.run();
    }, onError: (error, params) => {
    }
  });

  const destoryHostReq = useRequest(deleteCoreHostAPI, {
    manual: true, onSuccess: (result, params) => {
      listHostReq.run();
    }, onError: (error, params) => {
    }
  });

  const showUpdateHostModal = record => {
    setUpdateHostModalVisable(true);
    setHostAcvtive(record);
  };

  const getSelectHostIPaddress = () => {
    const ipaddressArray = [];
    for (let i = 0; i < selectedRows.length; i += 1) {
      ipaddressArray.push(selectedRows[i].ipaddress);
    }
    copy(ipaddressArray.join());
    msgsuccess(`${ipaddressArray.join()} 已拷贝到剪切板`, `${ipaddressArray.join()} copyed to clipboard`);
  };

  const handleSearch = value => {
    const templist = hostListTmp;
    const reg = new RegExp(value, "gi");
    setHostList(templist.map(record => {
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
      .filter(record => !!record));
  };

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const expandedRowRender = record => {
    const portsColumns = [{
      title: formatText("app.msfsocks.ports.port"),
      dataIndex: "port",
      width: 80,
      render: (val, record) => <span>{val}</span>
    }, {
      title: formatText("app.msfsocks.ports.service"), dataIndex: "service"
    }, {
      title: "Banner", dataIndex: "banner"
    },

      {
        title: formatText("app.core.updatetime"),
        dataIndex: "update_time",
        width: 136,
        render: val => <Tag color="cyan">{moment(val * 1000).format("YYYY-MM-DD HH:mm")}</Tag>
      }];

    return (<Table
      bordered
      style={{ marginLeft: 23 }}
      size="small"
      columns={portsColumns}
      rowKey={item => item.id}
      dataSource={record.portService}
      pagination={false}
    />);
  };

  const rowSelection = {
    selectedRowKeys, onChange: onSelectChange
  };

  const formLayout = {
    labelCol: { span: 4 }, wrapperCol: { span: 18 }
  };

  const tailLayout = {
    wrapperCol: { offset: 3, span: 18 }
  };

  const buttonLayout = {
    wrapperCol: { offset: 4, span: 16 }
  };

  const hostTypeToAvatar = {
    ad_server: (<Avatar shape="square" style={{ backgroundColor: "#177ddc" }} icon={<WindowsOutlined />} />),
    pc: <Avatar shape="square" style={{ backgroundColor: "#49aa19" }} icon={<LaptopOutlined />} />,
    web_server: (<Avatar shape="square" style={{ backgroundColor: "#13a8a8" }} icon={<CloudOutlined />} />),
    cms: <Avatar shape="square" style={{ backgroundColor: "#d84a1b" }} icon={<BugOutlined />} />,
    firewall: (<Avatar shape="square" style={{ backgroundColor: "#d87a16" }} icon={<GatewayOutlined />} />),
    other: (<Avatar shape="square" style={{ backgroundColor: "#bfbfbf" }} icon={<QuestionOutlined />} />)
  };

  return (<div
    style={{ marginTop: -16 }}
  >
    <DocIcon url="https://www.yuque.com/vipersec/help/cv0shx" />
    <Row>
      <Col span={10}>
        <Row>
          <Col span={12}>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              style={{ width: "100%" }}
              placeholder={formatText("app.msfsocks.ports.ph")}
              onChange={e => {
                handleSearch(e.target.value);
              }}
            />
          </Col>
          <Col span={6}>
            <Button
              onClick={() => getSelectHostIPaddress()}
              block
              disabled={selectedRowKeys.length === 0}
              icon={<CopyOutlined />}
            >{formatText("app.core.copy")}</Button>
          </Col>
          <Col span={6}>
            <Button
              onClick={() => destoryHostReq.run({ ipaddress: selectedRowKeys.toString() })}
              block
              disabled={selectedRowKeys.length === 0}
              danger
            ><DeleteOutlined />{formatText("app.core.delete")}</Button>
          </Col>
        </Row>
        <Table
          style={{
            marginTop: 0,
            overflow: "auto",
            maxHeight: cssCalc(`${resizeDownHeight} - 68px`),
            minHeight: cssCalc(`${resizeDownHeight} - 68px`)
          }}
          size="small"
          bordered
          pagination={false}
          rowKey="ipaddress"
          expandable={{
            expandedRowRender: expandedRowRender, rowExpandable: record => record.portService.length > 0
          }}
          rowSelection={rowSelection}
          columns={[{
            title: formatText("app.msfsocks.ports.host"),
            dataIndex: "ipaddress",
            key: "ipaddress",
            width: 120,
            render: (text, record) => (<strong
              style={{
                color: "#d8bd14"
              }}
            >
              {text}
            </strong>)
          }, {
            title: formatText("app.msfsocks.ports.portService"),
            dataIndex: "portService",
            key: "portService",
            width: 88,
            sorter: (a, b) => a.portService.length >= b.portService.length,
            render: (text, record) => {
              return (<strong
                style={{
                  color: "#13a8a8"
                }}
              >
                {record.portService.length}
              </strong>);
            }
          }, {
            title: formatText("app.msfsocks.ports.route"),
            dataIndex: "route",
            key: "route",
            width: 120,
            render: (text, record) => {
              let routepath = null;
              if (record.route === {} || record.route === null || record.route === undefined) {
                routepath = <span style={{ color: "orange" }}>{formatText("app.msfsocks.ports.tag.direct")}</span>;
              } else if (record.route.type === "DIRECT") {
                routepath = <span style={{ color: "orange" }}>{formatText("app.msfsocks.ports.tag.direct")}</span>;
              } else if (record.route.type === "ROUTE") {
                routepath = (<Space>
                  <span style={{ color: "green" }}>{formatText("app.msfsocks.ports.tag.route")}</span>
                  {SidTag(record.route.data)}
                </Space>);
              }
              return routepath;
            }
          }, {
            title: formatText("app.msfsocks.ports.comment"), dataIndex: "comment", key: "comment", // width: '10%',
            render: (text, record) => {
              return (<div>
                {host_type_to_avatar[record.tag]}
                <span style={{ marginLeft: 8 }}>{text}</span>
                <a style={{ float: "right" }} onClick={() => showUpdateHostModal(record)}><FormOutlined /></a>
              </div>);
            }
          }, {
            dataIndex: "operation", width: 48, render: (text, record) => (<div style={{ textAlign: "center" }}>
              <Space size="middle">
                <a
                  onClick={() => destoryHostReq.run({ ipaddress: record.ipaddress })}
                  style={{ color: "red" }}
                >
                  {formatText("app.core.delete")}
                </a>
              </Space>
            </div>)
          }]}
          dataSource={hostList}
        />
      </Col>
      <Col span={14}>
        <Row>
          <Col span={12}>
            <Button
              icon={<SyncOutlined />}
              onClick={() => listHostReq.run()}
              block
              loading={listHostReq.loading || destoryHostReq.loading || destorySocksReq.loading || destoryPortFwdReq.loading || destoryRouteReq.loading}
            >{formatText("app.core.refresh")}</Button>
            <Table
              bordered
              style={{
                overflow: "auto",
                maxHeight: cssCalc(`${resizeDownHeight} - 68px - 25vh`),
                minHeight: cssCalc(`${resizeDownHeight} - 68px - 25vh`)
              }}
              size="small"
              rowKey="subnet"
              pagination={false}
              dataSource={routeAll}
              columns={[{
                title: "SID", dataIndex: "session", key: "session", width: 48, render: (text, record) => {
                  return SidTag(text);
                }
              }, {
                title: formatText("app.msfsocks.proxy.subnet"), dataIndex: "subnet", key: "subnet"
              }, {
                title: formatText("app.msfsocks.proxy.netmask"), dataIndex: "netmask", key: "netmask", width: 120
              }, {
                dataIndex: "operation", width: 48, render: (text, record) => (<a
                  style={{ color: "red" }}
                  onClick={() => destoryRouteReq.run({
                    sessionid: record.session, subnet: record.subnet, netmask: record.netmask
                  })}
                >
                  {formatText("app.core.delete")}
                </a>)
              }]}
            />
          </Col>
          <Col span={12}>
            <Button
              style={{ marginTop: 0 }}
              block
              icon={<PlusOutlined />}
              onClick={() => setCreateSocksModalVisible(true)}
            >{formatText("app.msfsocks.socks.add")}
            </Button>
            <Table
              bordered
              style={{
                overflow: "auto",
                maxHeight: cssCalc(`${resizeDownHeight} - 68px - 25vh`),
                minHeight: cssCalc(`${resizeDownHeight} - 68px - 25vh`)
              }}
              size="small"
              rowKey="port"
              pagination={false}
              dataSource={socksActive}
              columns={[{
                title: formatText("app.msfsocks.socks.type"), dataIndex: "type", key: "type", width: 104
              }, {
                title: formatText("app.msfsocks.socks.port"), dataIndex: "port", key: "port"
              }, {
                dataIndex: "operation",
                width: 64,
                render: (text, record) => (<a style={{ color: "red" }} onClick={() => destorySocksReq.run(record)}>
                  {formatText("app.core.delete")}
                </a>)
              }]}
            />
          </Col>
        </Row>
        <Table
          style={{
            marginTop: -16,
            overflow: "auto",
            maxHeight: cssCalc("25vh"),
            minHeight: cssCalc("25vh")
          }}
          bordered
          size="small"
          rowKey="index"
          pagination={false}
          dataSource={portfwds}
          columns={[{
            title: "SID", dataIndex: "sessionid", key: "index", width: 48, render: (text, record) => {
              return SidTag(text);
            }
          }, {
            title: formatText("app.msfsocks.portfwd.type"),
            dataIndex: "type",
            key: "type",
            width: 80,
            render: (text, record) => {
              if (record.type === "Forward") {
                return (<div>
                  <Tag color="cyan">{formatText("app.msfsocks.portfwd.type.forword")}</Tag>
                </div>);
              }
              return (<div>
                <Tag color="geekblue">{formatText("app.msfsocks.portfwd.type.reverse")}</Tag>
              </div>);
            }
          }, {
            title: formatText("app.msfsocks.portfwd.local"),
            dataIndex: "local",
            key: "local",
            render: (text, record) => {
              if (record.type === "Forward") {
                return (<div>
                  <Tag style={{ marginRight: 8 }} color="green">
                    {formatText("app.msfsocks.portfwd.listen")}
                  </Tag>
                  <span>{`${record.lhost}:${record.lport}`}</span>
                </div>);
              }
              return (<div>
                <Tag style={{ marginRight: 8 }} color="gold">
                  {formatText("app.msfsocks.portfwd.target")}
                </Tag>
                <span>{`${record.lhost}:${record.lport}`}</span>
              </div>);
            }
          }, {
            title: formatText("app.msfsocks.portfwd.remote"),
            dataIndex: "remote",
            key: "remote",
            render: (text, record) => {
              if (record.type === "Forward") {
                return (<div>
                  <Tag style={{ marginRight: 8 }} color="gold">
                    {formatText("app.msfsocks.portfwd.target")}
                  </Tag>
                  <span>{`${record.rhost}:${record.rport}`}</span>
                </div>);
              }
              return (<div>
                <Tag style={{ marginRight: 8 }} color="green">
                  {formatText("app.msfsocks.portfwd.listen")}
                </Tag>
                <span>{`${record.rhost}:${record.rport}`}</span>
              </div>);
            }
          },
            {
              title: formatText("app.msfsocks.portfwd.tip"),
              dataIndex: "remote",
              key: "remote",
              render: (text, record) => {
                return (
                  <div>
                    <span>{`${record.tip}`}</span>
                  </div>
                );
              }
            },
            {
              dataIndex: "operation",
              width: 40,
              render: (text, record) => (<a style={{ color: "red" }} onClick={() => destoryPortFwdReq.run(record)}>
                {formatText("app.core.delete")}
              </a>)
            }]}
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
      onCancel={() => setUpdateHostModalVisable(false)}
    >
      <Form
        initialValues={{
          ipaddress: hostAcvtive.ipaddress, tag: hostAcvtive.tag, comment: hostAcvtive.comment
        }}
        onFinish={updateHostReq.run}
      >
        <Form.Item
          label={<span>ipaddress</span>}
          name="ipaddress"
          rules={[{ required: true }]}
          style={{ display: "None" }}
          {...formLayout}
        >
          <span>{hostAcvtive.ipaddress}</span>
        </Form.Item>
        <Form.Item
          label={<span>{formatText("app.msfsocks.host.tag")}</span>}
          name="tag"
          rules={[{ required: true, message: formatText("app.msfsocks.host.tag.rule") }]}
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
          label={<span>{formatText("app.msfsocks.host.comment")}</span>}
          name="comment"
          rules={[{ message: formatText("app.msfsocks.host.comment.rule"), max: 20 }]}
          {...formLayout}
        >
          <Input placeholder={formatText("app.msfsocks.host.comment.rule")} />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            icon={<DeliveredProcedureOutlined />}
            block
            type="primary"
            htmlType="submit"
            loading={updateHostReq.loading}
          >
            {formatText("app.core.update")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
    <Modal
      title={formatText("app.msfsocks.socks.add")}
      centered
      width="50vw"
      bodyStyle={{ padding: "8 8 8 8" }}
      destroyOnClose
      visible={createSocksModalVisible}
      footer={null}
      onCancel={() => setCreateSocksModalVisible(false)}
    >
      <Form onFinish={createSocksReq.run}>
        <Form.Item
          {...formLayout}
          label={<span>{formatText("app.msfsocks.socks.type")}</span>}
          name="type"
          rules={[{
            required: true, message: formatText("app.msfsocks.socks.type.rule")
          }]}
        >
          <Select style={{ width: 160 }}>
            <Option value="msf_socks4a">Socks4a</Option>
            <Option value="msf_socks5">Socks5</Option>
          </Select>
        </Form.Item>
        <Form.Item
          {...formLayout}
          label={<span>{formatText("app.msfsocks.socks.port")}</span>}
          name="port"
          rules={[{
            required: true, message: formatText("app.msfsocks.socks.port.rule")
          }]}
        >
          <InputNumber style={{ width: 160 }} placeholder={formatText("app.msfsocks.socks.port.rule")} />
        </Form.Item>
        <Form.Item {...buttonLayout}>
          <Button
            block
            loading={createSocksReq.loading}
            icon={<PlusOutlined />}
            htmlType="submit"
            type="primary"
          >
            {formatText("app.core.add")}
          </Button>
        </Form.Item>
        <Row>
          <Col span={20} offset={4}>
            <Alert
              message={formatText("app.msfsocks.socks.alert")}
              type="warning"
              showIcon
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>);
};

export const MsfSocksMemo = memo(MsfSocks);

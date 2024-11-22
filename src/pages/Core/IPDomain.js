import React, { Fragment, memo, useEffect, useState } from 'react';
import { useRequest } from 'umi';
import {
  deleteWebdatabaseIPDomainAPI,
  getWebdatabaseIPDomainAPI,
  getWebdatabaseOptionsAPI,
  getWebdatabaseProjectAPI, postWebdatabaseClueCertAPI,
  postWebdatabaseClueFaviconAPI,
  postWebdatabaseProjectAPI,
  putWebdatabasePortAPI,
} from '@/services/apiv1';

import {
  AutoComplete,
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Dropdown,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  List,
  Menu,
  Pagination,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
} from 'antd-v5';
import {
  BugOutlined,
  CameraOutlined,
  CheckOutlined,
  ChromeOutlined,
  CloseOutlined,
  DeleteOutlined,
  DeliveredProcedureOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  GlobalOutlined,
  KeyOutlined,
  LinkOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  ProjectOutlined,
  QuestionOutlined,
  ReadOutlined,
  SearchOutlined,
  SwapOutlined,
  SyncOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { Modal } from 'antd';
import { cssCalc } from '@/utils/utils';
import { formatText, manuali18n, msgsuccess } from '@/utils/locales';
import { DocIcon, TimeTag, WebMainHeight } from '@/pages/Core/Common';
import { useModel } from '@@/plugin-model/useModel';

const listitemHeight = 240;

const hostTypeToAvatar = {
  purple: (
    <Tag color="#531dab">
      <TagOutlined />
    </Tag>
  ),
  blue: (
    <Tag color="#096dd9">
      <TagOutlined />
    </Tag>
  ),
  green: (
    <Tag color="#389e0d">
      <TagOutlined />
    </Tag>
  ),
  orange: (
    <Tag color="#d46b08">
      <TagOutlined />
    </Tag>
  ),
  red: (
    <Tag color="#cf1322">
      <TagOutlined />
    </Tag>
  ),
  grey: (
    <Tag color="#bfbfbf">
      <TagOutlined />
    </Tag>
  ),
};

const tagComment = (color, comment) => {
  switch (color) {
    case 'purple':
      return (
        <Tag color="#531dab">
          <TagOutlined /> {comment}
        </Tag>
      );
    case 'blue':
      return (
        <Tag color="#096dd9">
          <TagOutlined /> {comment}
        </Tag>
      );
    case 'green':
      return (
        <Tag color="#389e0d">
          <TagOutlined /> {comment}
        </Tag>
      );
    case 'orange':
      return (
        <Tag color="#d46b08">
          <TagOutlined /> {comment}
        </Tag>
      );
    case 'red':
      return (
        <Tag color="#cf1322">
          <TagOutlined /> {comment}
        </Tag>
      );
    case 'grey':
      return (
        <Tag color="#bfbfbf">
          <TagOutlined /> {comment}
        </Tag>
      );
    default:
      return null;
  }
};

const tagSeverity = severity => {
  switch (severity) {
    case 'info':
      return (
        <Tag bordered={false} style={{ textAlign: 'center', cursor: 'pointer', width: 64 }}>
          Info
        </Tag>
      );
    case 'low':
      return (
        <Tag
          color="cyan"
          bordered={false}
          style={{ textAlign: 'center', cursor: 'pointer', width: 64 }}
        >
          Low
        </Tag>
      );
    case 'medium':
      return (
        <Tag
          color="blue"
          bordered={false}
          style={{ textAlign: 'center', cursor: 'pointer', width: 64 }}
        >
          Medium
        </Tag>
      );
    case 'high':
      return (
        <Tag
          color="orange"
          bordered={false}
          style={{ textAlign: 'center', cursor: 'pointer', width: 64 }}
        >
          High
        </Tag>
      );
    case 'critical':
      return (
        <Tag
          color="red"
          bordered={false}
          style={{ textAlign: 'center', cursor: 'pointer', width: 64 }}
        >
          Critical
        </Tag>
      );
    default:
      return null;
  }
};

const IPDomain = props => {
  console.log('IPDomain');

  const {
    projectActive,
    projects,
    setProjects,
    ipdomains,
    setIPDomains,
    webIPDomainPortWaitList,
    setWebIPDomainPortWaitList,
  } = useModel('WebMainModel', model => ({
    projectActive: model.projectActive,
    projects: model.projects,
    setProjects: model.setProjects,
    ipdomains: model.ipdomains,
    setIPDomains: model.setIPDomains,
    webIPDomainPortWaitList: model.webIPDomainPortWaitList,
    setWebIPDomainPortWaitList: model.setWebIPDomainPortWaitList,
  }));

  const [activeRecord, setActiveRecord] = useState({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showVulnModal, setShowVulnModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [vulnActive, setVulnActive] = useState({ reference: [] });
  const initTableParams = {
    current: 1,
    pageSize: 10,
  };
  const [tableParams, setTableParams] = useState(initTableParams);

  const [searchParams, setSearchParams] = useState({});

  const listIPdomainReq = useRequest(getWebdatabaseIPDomainAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setIPDomains(result.result);
      setTableParams(result.pagination);
    },
    onError: (error, params) => {},
  });

  const listProjectReq = useRequest(getWebdatabaseProjectAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setProjects(result);
    },
    onError: (error, params) => {},
  });

  const switchProjectReq = useRequest(postWebdatabaseProjectAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setIPDomains(ipdomains.filter(item => item.ipdomain !== params[0].ipdomain));
      setShowSwitchModal(false);
    },
    onError: (error, params) => {},
  });

  const destoryIPDomainReq = useRequest(deleteWebdatabaseIPDomainAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setIPDomains(ipdomains.filter(item => item.ipdomain !== params[0].ipdomain));
    },
    onError: (error, params) => {},
  });

  const updatePortCommentReq = useRequest(putWebdatabasePortAPI, {
    manual: true,
    onSuccess: (result, params) => {
      ipdomains.map(item => {
        if (item.ipdomain === params[0].ipdomain && item.port === params[0].port) {
          item.color = params[0].color;
          item.comment = params[0].comment;
          return item;
        }
      });
      setIPDomains(ipdomains);
    },
    onError: (error, params) => {},
  });

  const postClueFaviconReq = useRequest(postWebdatabaseClueFaviconAPI, {
    manual: true,
    onSuccess: (result, params) => {},
    onError: (error, params) => {},
  });

  const postClueCertReq = useRequest(postWebdatabaseClueCertAPI, {
    manual: true,
    onSuccess: (result, params) => {},
    onError: (error, params) => {},
  });

  useEffect(
    () => {
      listIPdomainReq.run({
        project_id: projectActive.project_id,
        pagination: tableParams,
      });
    },
    [projectActive]
  );

  useEffect(() => {
    listProjectReq.run();
    if (ipdomains.length === 0) {
      listIPdomainReq.run({
        project_id: projectActive.project_id,
        pagination: tableParams,
      });
    }
  }, []);

  const onUpdatePortComment = values => {
    updatePortCommentReq.run({
      ipdomain: activeRecord.ipdomain,
      port: activeRecord.port,
      ...values,
    });
  };
  const addToWebIPDomainPortWaitList = record => {
    const { id } = record;

    if (!webIPDomainPortWaitList.some(item => item.id === id)) {
      setWebIPDomainPortWaitList([...webIPDomainPortWaitList, record]);
      msgsuccess(`加入等待列表成功`, `Add to waiting list successfully`);
    } else {
      msgsuccess(`已在等待列表中`, `Already in the waiting list`);
    }
  };

  const add_favicon_to_clue = record => {
    const { ipdomain, port } = record;
    postClueFaviconReq.run({
      ipdomain: ipdomain,
      port: port,
    });
  };

  const add_cert_to_clue = record => {
    const { ipdomain, port } = record;
    postClueCertReq.run({
      ipdomain: ipdomain,
      port: port,
    });
  };

  const onSwitchProject = (key, record) => {
    switchProjectReq.run({
      project_id: key,
      ipdomain: record.ipdomain,
    });
  };

  const handlePageChange = (page, pageSize) => {
    const pagination = { current: page, pageSize: pageSize };
    setTableParams({ ...tableParams, ...pagination });
    listIPdomainReq.run({
      project_id: projectActive.project_id,
      pagination: pagination,
      ...searchParams,
    });
  };

  const handleRefresh = () => {
    listIPdomainReq.run({
      project_id: projectActive.project_id,
      pagination: tableParams,
      ...searchParams,
    });
  };

  const handleSearch = values => {
    setSearchParams(values);
    listIPdomainReq.run({
      project_id: projectActive.project_id,
      pagination: initTableParams,
      ...values, // init pagination when search
    });
  };

  const LocationRow = record => {
    if (record.location) {
      const location = record.location;
      const isp = location.isp;
      return (
        <>
          <Tag
            color="geekblue"
            style={{
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            {isp}
          </Tag>
          <Tag
            color="geekblue"
            style={{
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            {location.country_cn} {location.province_cn} {location.city_cn}
          </Tag>
          {/*{TimeTag(location.update_time)}*/}
        </>
      );
    } else {
      return null;
    }
  };

  const FirstRow = record => {
    const IPdomainTag = record => {
      return (
        <Tag
          color="blue"
          style={{
            textAlign: 'center',
            cursor: 'pointer',
          }}
          // bordered={false}
        >
          <strong>{record.ipdomain}</strong>
        </Tag>
      );
    };

    return (
      <Row>
        <Space size={0}>
          {IPdomainTag(record)}
          {PortNumTag(record)}
          {ServiceTag(record)}
          {TimeTag(record.update_time)}
          {tagComment(record.color, record.comment)}
        </Space>
      </Row>
    );
  };

  const IPRow = record => {
    const IPTag = record => {
      if (record.ip) {
        return (
          <Tag
            color="blue"
            style={{
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            {record.ip}
          </Tag>
        );
      } else {
        return null;
      }
    };
    return (
      <Row>
        <Space size={0}>
          {IPTag(record)}
          {LocationRow(record)}
        </Space>
      </Row>
    );
  };

  const ServiceTag = record => {
    if (record.service) {
      const service = record.service;
      return (
        <Tag
          color="cyan"
          style={{
            // width: 160,
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <strong>{service.service}</strong>
        </Tag>
      );
    }
  };
  const PortNumTag = record => {
    if (record.alive) {
      return (
        <Tag
          color="green"
          style={{
            // width: 160,
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <strong>{record.port}</strong>
        </Tag>
      );
    } else {
      return (
        <Tag
          color="red"
          style={{
            // width: 160,
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <strong>{record.port}</strong>
        </Tag>
      );
    }
  };

  const ComponentRow = record => {
    const nulldiv = null;
    if (record.component && record.component.length > 0) {
      const components = record.component;
      const tagslist = components.map(component => {
        return (
          <Tag
            // icon={<MacCommandOutlined/>}
            color="purple"
            style={{
              textAlign: 'center',
            }}
          >
            {component.product_name}
          </Tag>
        );
      });
      return (
        <Row>
          <Space wrap size={[0, 4]}>
            {tagslist}
          </Space>
        </Row>
      );
    } else {
      return nulldiv;
    }
  };

  const CDNTag = record => {
    if (record.cdn === null) {
      return (
        <Tag
          // color="warning"
          icon={<QuestionOutlined />}
          style={{
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          CDN
        </Tag>
      );
    } else {
      if (record.cdn.flag === true) {
        return (
          <Tag
            color="success"
            icon={<CheckOutlined />}
            style={{
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            CDN - {record.cdn.name} - {record.cdn.domain}
          </Tag>
        );
      } else {
        return (
          <Tag
            color="warning"
            icon={<CloseOutlined />}
            style={{
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            CDN
          </Tag>
        );
      }
    }
  };

  const WAFTag = record => {
    const waf = record.waf;
    if (waf === undefined) {
      return null;
    } else if (waf === null) {
      return (
        <Tag
          icon={<QuestionOutlined />}
          style={{
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          WAF
        </Tag>
      );
    } else {
      if (waf.flag === true) {
        return (
          <Tag
            color="success"
            icon={<CheckOutlined />}
            style={{
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            WAF - {waf.name}
          </Tag>
        );
      } else {
        return (
          <Tag
            color="warning"
            icon={<CloseOutlined />}
            style={{
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            WAF
          </Tag>
        );
      }
    }
  };

  const SecurityRow = record => {
    return (
      <Row>
        <Space size={0}>
          {CDNTag(record)}
          {WAFTag(record)}
        </Space>
      </Row>
    );
  };

  const VulnerabilityRow = record => {
    const vulnerability = record.vulnerability;
    if (vulnerability) {
      const num_count = vulnerability.num_count;
      return (
        <Space size={0}>
          <Tag
            color="red"
            style={{
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            Critical {num_count.critical}
          </Tag>
          <Tag
            // bordered={false}
            color="orange"
            style={{
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            High {num_count.high}
          </Tag>
          <Tag
            // bordered={false}
            color="blue"
            style={{
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            Medium {num_count.medium}
          </Tag>
          <Tag
            // bordered={false}
            color="cyan"
            style={{
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            Low {num_count.low}
          </Tag>
          <Tag
            // bordered={false}
            // color="cyan"
            style={{
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            Info {num_count.info}
          </Tag>
        </Space>
      );
    }
  };

  const ActionRow = record => {
    const onClick = ({ key }) => {
      switch (key) {
        case 'switch_project':
          setActiveRecord(record);
          setShowSwitchModal(true);
          break;
        case 'add_to_waitlist':
          addToWebIPDomainPortWaitList(record);
          break;
        case 'update_comment':
          setActiveRecord(record);
          setShowCommentModal(true);
          break;
        case 'add_favicon_to_clue':
          add_favicon_to_clue(record);
          break;
        case 'add_cert_to_clue':
          add_cert_to_clue(record);
          break;
        case 'delete':
          confirm({
            title: manuali18n('确认删除该记录', 'Confirm to delete this record'),
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
              destoryIPDomainReq.run({ ipdomain: record.ipdomain });
            },
          });
          break;
        default:
          console.log('unknow command');
      }
    };

    const items = [
      {
        label: 'switch_project',
        key: 'switch_project',
        icon: <SwapOutlined />,
      },
      {
        label: 'add_to_waitlist',
        key: 'add_to_waitlist',
        icon: <PlusCircleOutlined />,
      },
      {
        label: 'update_comment',
        key: 'update_comment',
        icon: <TagOutlined />,
      },
      {
        label: 'add_favicon_to_clue',
        key: 'add_favicon_to_clue',
        icon: <TagOutlined />,
      },
      {
        label: 'add_cert_to_clue',
        key: 'add_cert_to_clue',
        icon: <TagOutlined />,
      },
      {
        label: 'delete',
        key: 'delete',
        danger: true,
        icon: <DeleteOutlined />,
      },
    ];
    return (
      <Dropdown.Button style={{ marginRight: 4 }} menu={{ items, onClick }} trigger={['click']} />
    );
  };

  const SearchCard = () => {
    const [serviceOptions, setServiceOptions] = useState([]);
    const [componentOptions, setComponentOptions] = useState([]);
    const listServiceOptionsReq = useRequest(getWebdatabaseOptionsAPI, {
      manual: true,
      onSuccess: (result, params) => {
        setServiceOptions(result);
      },
      onError: (error, params) => {},
    });
    const listComponentOptionsReq = useRequest(getWebdatabaseOptionsAPI, {
      manual: true,
      onSuccess: (result, params) => {
        setComponentOptions(result);
      },
      onError: (error, params) => {},
    });

    useEffect(() => {
      listServiceOptionsReq.run({
        project_id: projectActive.project_id,
        table: 'ServiceModel',
        param: 'service',
      });
    }, []);

    useEffect(() => {
      listComponentOptionsReq.run({
        project_id: projectActive.project_id,
        table: 'ComponentModel',
        param: 'product_name',
      });
    }, []);

    const [form] = Form.useForm();
    return (
      <Form form={form} onFinish={handleSearch} initialValues={searchParams}>
        <Space direction="vertical">
          <Space>
            <Form.Item name="ipdomain" label="IP / Domain">
              <Input style={{ width: 240 }} placeholder="IP / Domain" />
            </Form.Item>
            <Form.Item name="port" label="Port">
              <InputNumber style={{ width: 120 }} placeholder="Port" min={1} max={65535} />
            </Form.Item>
            <Form.Item
              name="alive_flag"
              // label="CDN"
              label="Alive"
            >
              <Select
                style={{
                  width: 96,
                }}
                placeholder="Status"
                allowClear
                options={[
                  {
                    value: true,
                    label: (
                      <span style={{ color: 'green' }}>
                        <CheckOutlined /> Open
                      </span>
                    ),
                  },
                  {
                    value: false,
                    label: (
                      <span style={{ color: 'orange' }}>
                        <CloseOutlined /> Close
                      </span>
                    ),
                  },
                ]}
              />
            </Form.Item>
          </Space>
          <Space>
            <Form.Item name="service" label="Service">
              <Select
                mode="multiple"
                style={{
                  width: '320px',
                }}
                placeholder="Service"
                allowClear
                options={serviceOptions.map(item => ({
                  label: item,
                  value: item,
                }))}
              />
            </Form.Item>
            <Form.Item name="component" label="Component">
              <Select
                mode="multiple"
                style={{
                  width: '400px',
                }}
                placeholder="Component"
                allowClear
                options={componentOptions.map(item => ({
                  label: item,
                  value: item,
                }))}
              />
            </Form.Item>
          </Space>
          <Space>
            <Form.Item name="waf_flag" label="WAF">
              <Select
                style={{
                  width: 96,
                }}
                placeholder="WAF"
                allowClear
                options={[
                  {
                    value: false,
                    label: (
                      <span style={{ color: 'orange' }}>
                        <CloseOutlined /> WAF
                      </span>
                    ),
                  },
                  {
                    value: true,
                    label: (
                      <span style={{ color: 'green' }}>
                        <CheckOutlined /> WAF
                      </span>
                    ),
                  },
                  {
                    value: 'unknown',
                    label: (
                      <span>
                        <QuestionOutlined /> WAF
                      </span>
                    ),
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name="cdn_flag" label="CDN">
              <Select
                style={{
                  width: 96,
                }}
                placeholder="CDN"
                allowClear
                options={[
                  {
                    value: false,
                    label: (
                      <span style={{ color: 'orange' }}>
                        <CloseOutlined /> CDN
                      </span>
                    ),
                  },
                  {
                    value: true,
                    label: (
                      <span style={{ color: 'green' }}>
                        <CheckOutlined /> CDN
                      </span>
                    ),
                  },
                  {
                    value: 'unknown',
                    label: (
                      <span>
                        <QuestionOutlined /> CDN
                      </span>
                    ),
                  },
                ]}
              />
            </Form.Item>
          </Space>
          <Form.Item>
            <Button
              type="primary"
              block
              icon={<SearchOutlined />}
              htmlType="submit"
              loading={listIPdomainReq.loading}
            />
          </Form.Item>
        </Space>
      </Form>
    );
  };

  const HttpTabPane = record => {
    const http_base = record.http_base;
    const http_favicon = record.http_favicon;
    const waf = record.waf;
    let src = null;
    if (http_favicon) {
      src = 'data:image/png;base64,' + http_favicon.content;
    }
    let WAFDesc = null;
    if (waf) {
      if (waf.flag) {
        WAFDesc = (
          <Descriptions
            size="small"
            column={8}
            // bordered
            layout="vertical"
          >
            <Descriptions.Item span={4} label="WAF Name">
              {WAFTag(record)}
            </Descriptions.Item>
            <Descriptions.Item span={2} label="WAF Manufacturer">
              <Tag
                color="cyan"
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <strong>{waf.manufacturer}</strong>
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item span={2} label="Trigger URL">
              <a target="_blank" href={waf.trigger_url}>
                <LinkOutlined />
                URL
              </a>
            </Descriptions.Item>
          </Descriptions>
        );
      } else {
        WAFDesc = (
          <Descriptions
            size="small"
            column={8}
            // bordered
            layout="vertical"
          >
            <Descriptions.Item span={4} label="Name">
              {WAFTag(record)}
            </Descriptions.Item>
          </Descriptions>
        );
      }
    }

    if (http_base) {
      return (
        <Tabs.TabPane icon={<ChromeOutlined />} tab={<span>HTTP</span>} key="HTTP">
          <Space direction="vertical">
            <Descriptions
              size="small"
              column={8}
              // bordered
              layout="vertical"
            >
              <Descriptions.Item span={4} label="Title">
                <a target="_blank" href={http_base.url}>
                  <LinkOutlined /> {http_base.title}
                </a>
              </Descriptions.Item>
              <Descriptions.Item span={2} label="Status Code">
                <Tag
                  color="cyan"
                  style={{
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <strong>{http_base.status_code}</strong>
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item span={2} label="Favicon">
                <Avatar shape="square" size={20} src={src} />
              </Descriptions.Item>
            </Descriptions>
            {WAFDesc}
          </Space>
        </Tabs.TabPane>
      );
    } else {
      return null;
    }
  };

  const showVulnDetail = record => {
    setVulnActive(record);
    setShowVulnModal(true);
  };

  const VulnerabilityTabPane = record => {
    const vulnerabilitys = record.vulnerability;
    if (vulnerabilitys !== null && vulnerabilitys.data.length > 0) {
      return (
        <Tabs.TabPane icon={<BugOutlined />} tab={<span>Vulnerability</span>} key="Vulnerability">
          <Row>
            <Col span={24}>
              <Table
                style={{
                  overflow: 'auto',
                  minHeight: listitemHeight,
                  maxHeight: listitemHeight,
                }}
                columns={[
                  {
                    title: 'Severity',
                    dataIndex: 'severity',
                    width: 88,
                    filters: [
                      {
                        text: tagSeverity('info'),
                        value: 'info',
                      },
                      {
                        text: tagSeverity('low'),
                        value: 'low',
                      },
                      {
                        text: tagSeverity('medium'),
                        value: 'medium',
                      },
                      {
                        text: tagSeverity('high'),
                        value: 'high',
                      },
                      {
                        text: tagSeverity('critical'),
                        value: 'critical',
                      },
                    ],
                    onFilter: (value, record) => {
                      return record.severity.indexOf(value) === 0;
                    },
                    render: (text, record) => {
                      return tagSeverity(text);
                    },
                  },
                  {
                    title: 'TemplateID',
                    dataIndex: 'template_id',
                    // width: 160,
                  },
                  {
                    title: 'Name',
                    dataIndex: 'name',
                  },
                  {
                    title: 'UpdateTime',
                    dataIndex: 'name',
                    width: 96,
                    render: (text, record) => {
                      return TimeTag(record.update_time);
                    },
                  },
                  {
                    // title: "Action",
                    width: 64,
                    dataIndex: 'template_id',
                    render: (text, record) => {
                      return (
                        <div style={{ textAlign: 'center' }}>
                          <Space size="middle">
                            <a onClick={() => showVulnDetail(record)}>
                              {formatText('ipdomain.detail')}
                            </a>
                          </Space>
                        </div>
                      );
                    },
                  },
                ]}
                dataSource={vulnerabilitys.data}
                pagination={false}
                scroll={{ y: listitemHeight - 32 }}
                className="tablev5"
                size="small"
              />
            </Col>
          </Row>
        </Tabs.TabPane>
      );
    }
  };

  const DNSTabPane = record => {
    const dnsrecord = record.dnsrecord;

    if (dnsrecord !== null && dnsrecord.length > 0) {
      return (
        <Tabs.TabPane icon={<GlobalOutlined />} tab={<span>DNS</span>} key="DNSRecord">
          <Row>
            <Col span={12}>
              <Table
                style={{
                  overflow: 'auto',
                  minHeight: listitemHeight,
                  maxHeight: listitemHeight,
                }}
                columns={[
                  {
                    title: 'Type',
                    dataIndex: 'type',
                    width: 64,
                  },
                  {
                    title: 'Value',
                    dataIndex: 'value',
                  },
                ]}
                dataSource={dnsrecord}
                pagination={false}
                scroll={{ y: listitemHeight - 32 }}
                className="tablev5"
                size="small"
              />
            </Col>
          </Row>
        </Tabs.TabPane>
      );
    } else {
      return null;
    }
  };

  const CertTabPane = record => {
    if (record.cert) {
      const cert = record.cert;
      const subject = cert.subject;
      return (
        <Tabs.TabPane icon={<KeyOutlined />} tab={<span>Cert</span>} key="Cert">
          <Row>
            <Col span={16}>
              <Descriptions column={1} layout="vertical">
                <Descriptions.Item label="subject_dn">{cert.subject_dn}</Descriptions.Item>
                <Descriptions.Item label="jarm">{cert.jarm}</Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={8}>
              <Table
                style={{
                  overflow: 'auto',
                  minHeight: listitemHeight,
                  maxHeight: listitemHeight,
                }}
                columns={[
                  {
                    title: 'DNS Names',
                    dataIndex: 'id',
                    render: (text, record) => {
                      return record;
                    },
                  },
                ]}
                dataSource={cert.dns_names}
                pagination={false}
                scroll={{ y: listitemHeight - 32 }}
                className="tablev5"
                size="small"
              />
            </Col>
          </Row>
        </Tabs.TabPane>
      );
    }
    return null;
  };

  const ScreenshotTabPane = record => {
    const screenshot = record.screenshot;
    if (screenshot) {
      const src = 'data:image/png;base64,' + screenshot.content;
      return (
        <Tabs.TabPane icon={<CameraOutlined />} tab={<span>Image</span>} key="Image">
          <Image width={listitemHeight - 16} height={listitemHeight - 16} src={src} />
        </Tabs.TabPane>
      );
    }
  };

  const ResponseTabPane = record => {
    if (record.service) {
      if (record.service.response) {
        const response = record.service.response;
        return (
          <Tabs.TabPane icon={<ReadOutlined />} tab={<span>Response</span>} key="Response">
            <pre
              style={{
                marginBottom: 0,
                padding: '0 0 0 0', // overflowX: 'hidden',
                maxHeight: listitemHeight,
                minHeight: listitemHeight,
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                background: '#141414',
              }}
            >
              {response}
            </pre>
          </Tabs.TabPane>
        );
      }
    }
    return null;
  };

  const IPDomainPortCard = record => {
    return (
      <Card styles={{ body: { padding: '0px 0px 0px 0px', minHeight: listitemHeight + 40 } }}>
        <Row>
          <Col span={8}>
            <Space style={{ marginLeft: 8, marginTop: 8 }} direction="vertical">
              {FirstRow(record)}
              {IPRow(record)}
              {ComponentRow(record)}
              {SecurityRow(record)}
              {VulnerabilityRow(record)}
            </Space>
          </Col>
          <Col span={16}>
            <Tabs tabBarExtraContent={ActionRow(record)} size="small">
              {HttpTabPane(record)}
              {CertTabPane(record)}
              {ScreenshotTabPane(record)}
              {ResponseTabPane(record)}
              {DNSTabPane(record)}
              {VulnerabilityTabPane(record)}
            </Tabs>
          </Col>
        </Row>
      </Card>
    );
  };

  const handleOpenSearchModel = () => {
    setShowSearchModal(true);
  };
  const handleCloseSearchModel = () => {
    setShowSearchModal(false);
  };

  const renderItem = record => {
    return (
      <List.Item
        style={{
          padding: '0px 0px 4px 0px', // marginBottom: 2,
        }}
      >
        {IPDomainPortCard(record)}
      </List.Item>
    );
  };

  return (
    <Fragment>
      <DocIcon url="https://www.yuque.com/vipersec/help/yc0ipk" />
      <Flex justify="flex-end" align="flex-start" style={{ paddingLeft: 1, paddingRight: 1 }}>
        <Button
          style={{ width: 80 }}
          icon={<SearchOutlined />}
          onClick={() => handleOpenSearchModel()}
          // loading={listIPdomainReq.loading}
        />
        <Button
          style={{ width: 80 }}
          icon={<SyncOutlined />}
          onClick={() => handleRefresh()}
          loading={listIPdomainReq.loading}
        />
        <Pagination
          // style={{
          //   float: 'right',
          // }}
          {...tableParams}
          onChange={handlePageChange}
          showLessItems={true}
          showSizeChanger={false}
          responsive={false}
        />
      </Flex>
      <List
        style={{
          overflow: 'auto',
          maxHeight: cssCalc(`${WebMainHeight} - 64px`),
          minHeight: cssCalc(`${WebMainHeight} - 64px`),
        }}
        // bordered={true}
        rowKey={'id'}
        split={false}
        itemLayout="vertical"
        size="small"
        dataSource={ipdomains}
        renderItem={item => renderItem(item)}
        loading={listIPdomainReq.loading}
      />
      <Modal
        // style={{ top: 32 }}
        width="40vw"
        destroyOnClose
        closable={false}
        open={showCommentModal}
        onCancel={() => setShowCommentModal(false)}
        footer={null}
        styles={{
          body: { padding: 0, margin: 0 },
        }}
      >
        <Form
          onFinish={onUpdatePortComment}
          initialValues={{
            color: activeRecord.color,
            comment: activeRecord.comment,
          }}
        >
          <Form.Item
            // label={formatText('ipdomain.portcomment.comment')}
            name="comment"
            rules={[
              {
                message: formatText('app.hostandsession.updatehost.comment.rule'),
                max: 20,
              },
            ]}
          >
            <Input placeholder={formatText('app.hostandsession.updatehost.comment.rule')} />
          </Form.Item>
          <Form.Item name="color">
            <Radio.Group>
              <Radio value="purple">{hostTypeToAvatar.purple}</Radio>
              <Radio value="blue">{hostTypeToAvatar.blue}</Radio>
              <Radio value="green">{hostTypeToAvatar.green}</Radio>
              <Radio value="orange">{hostTypeToAvatar.orange}</Radio>
              <Radio value="red">{hostTypeToAvatar.red}</Radio>
              <Radio value="grey">{hostTypeToAvatar.grey}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button
              loading={updatePortCommentReq.loading}
              icon={<DeliveredProcedureOutlined />}
              block
              type="primary"
              htmlType="submit"
            >
              <span style={{ marginLeft: 4 }}>{formatText('app.core.update')}</span>
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        styles={{
          body: { margin: -24 },
        }}
        mask={false}
        width="24vw"
        destroyOnClose
        closable={false}
        open={showSwitchModal}
        onCancel={() => setShowSwitchModal(false)}
        footer={null}
      >
        <Menu
          onClick={({ item, key, keyPath, domEvent }) => onSwitchProject(key, activeRecord)}
          items={projects
            .filter(project => project.project_id !== projectActive.project_id)
            .map(project => {
              return {
                key: project.project_id,
                label: project.name,
                icon: <ProjectOutlined />,
              };
            })}
        />
      </Modal>
      <Modal
        bodyStyle={{ padding: '0px 0px 0px 0px' }}
        size="small"
        mask={false}
        width="70vw"
        destroyOnClose
        closable={false}
        open={showVulnModal}
        onCancel={() => setShowVulnModal(false)}
        footer={null}
      >
        <Descriptions column={6} layout="vertical" bordered>
          <Descriptions.Item span={2} label="name">
            {vulnActive.name}
          </Descriptions.Item>
          <Descriptions.Item label="template_id" span={2}>
            {vulnActive.template_id}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="severity">
            {vulnActive.severity}
          </Descriptions.Item>
          <Descriptions.Item span={6} label="description">
            {vulnActive.description}
          </Descriptions.Item>
          <Descriptions.Item label="reference" span={6}>
            <Space size={0} direction="vertical">
              {vulnActive.reference.map(one_reference => {
                return (
                  <a target="_blank " href={one_reference.url}>
                    {one_reference}
                  </a>
                );
              })}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="matched_at" span={6}>
            {vulnActive.matched_at}
          </Descriptions.Item>
          <Descriptions.Item label="request" span={6}>
            <pre
              style={{
                padding: '0 0 0 0',
                whiteSpace: 'pre-wrap',
                marginBottom: 8,
              }}
            >
              {vulnActive.request}
            </pre>
          </Descriptions.Item>
          <Descriptions.Item label="response" span={6}>
            <pre
              style={{
                padding: '0 0 0 0',
                whiteSpace: 'pre-wrap',
                marginBottom: 8,
              }}
            >
              {vulnActive.response}
            </pre>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <Modal
        style={{ top: 76 }}
        width="60vw"
        bodyStyle={{ padding: '8px 8px 8px 8px' }}
        size="small"
        open={showSearchModal}
        onCancel={() => handleCloseSearchModel()}
        footer={null}
        mask={false}
        maskClosable
        closable={false}
        destroyOnClose
      >
        <SearchCard />
      </Modal>
    </Fragment>
  );
};
export const IPDomainMemo = memo(IPDomain);

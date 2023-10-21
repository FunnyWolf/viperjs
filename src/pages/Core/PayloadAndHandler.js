import React, { Fragment, memo, useImperativeHandle, useState } from "react";
import {
  deleteMsgrpcHandlerAPI,
  getCoreSettingAPI,
  getMsgrpcHandlerAPI,
  postMsgrpcHandlerAPI,
  postMsgrpcPayloadAPI
} from "@/services/apiv1";
import { DocIcon, randomstr } from "@/pages/Core/Common";
import {
  Alert,
  Avatar,
  Button,
  Cascader,
  Checkbox,
  Col,
  Collapse,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  Popover,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tooltip
} from "antd";
import { BlockOutlined, CustomerServiceOutlined, SyncOutlined, SaveOutlined } from "@ant-design/icons";
import { useRequest } from "umi";
import { formatText } from "@/utils/locales";
import { sessionTagList } from "@/pages/Core/HostAndSession";
import { cssCalc, Downheight } from "@/utils/utils";
import { useModel } from "@@/plugin-model/useModel";

const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;

const migrateProcess = ["explorer.exe", "notepad.exe", "svchost.exe"];
const initialAutoRunScript = ["post/windows/manage/migrate NAME=explorer.exe SPAWN=false"];

const CreateHandlerModalContent = props => {
  const { createHandlerFinish } = props;
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };
  const shortFormLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 4 }
  };
  const CommformLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  };
  const buttonLayout = {
    wrapperCol: { offset: 5, span: 14 }
  };
  const handlerPayloadOptions = [
    {
      value: "windows",
      label: "windows",
      children: [
        {
          value: "x64",
          label: "x64",
          children: [
            {
              value: "meterpreter",
              label: "meterpreter",
              children: [
                {
                  value: "bind_tcp",
                  label: "bind_tcp"
                },
                {
                  value: "bind_tcp_rc4",
                  label: "bind_tcp_rc4"
                },
                {
                  value: "reverse_http",
                  label: "reverse_http"
                },
                {
                  value: "reverse_https",
                  label: "reverse_https"
                },
                {
                  value: "reverse_tcp",
                  label: "reverse_tcp"
                },
                {
                  value: "reverse_tcp_rc4",
                  label: "reverse_tcp_rc4"
                },

                {
                  value: "reverse_winhttp",
                  label: "reverse_winhttp"
                },
                {
                  value: "reverse_winhttps",
                  label: "reverse_winhttps"
                },
                {
                  value: "reverse_dns",
                  label: "reverse_dns"
                }
              ]
            },
            {
              value: "meterpreter_bind_tcp",
              label: "meterpreter_bind_tcp"
            },
            {
              value: "meterpreter_reverse_http",
              label: "meterpreter_reverse_http"
            },
            {
              value: "meterpreter_reverse_https",
              label: "meterpreter_reverse_https"
            },
            {
              value: "meterpreter_reverse_tcp",
              label: "meterpreter_reverse_tcp"
            },
            {
              value: "meterpreter_reverse_dns",
              label: "meterpreter_reverse_dns"
            }
          ]
        },
        {
          value: "meterpreter",
          label: "meterpreter",
          children: [
            {
              value: "bind_tcp",
              label: "bind_tcp"
            },
            {
              value: "bind_tcp_rc4",
              label: "bind_tcp_rc4"
            },
            {
              value: "reverse_http",
              label: "reverse_http"
            },
            {
              value: "reverse_https",
              label: "reverse_https"
            },
            {
              value: "reverse_tcp",
              label: "reverse_tcp"
            },

            {
              value: "reverse_tcp_rc4",
              label: "reverse_tcp_rc4"
            },
            {
              value: "reverse_winhttp",
              label: "reverse_winhttp"
            },
            {
              value: "reverse_winhttps",
              label: "reverse_winhttps"
            },
            {
              value: "reverse_dns",
              label: "reverse_dns"
            }
          ]
        },
        {
          value: "meterpreter_bind_tcp",
          label: "meterpreter_bind_tcp"
        },
        {
          value: "meterpreter_reverse_http",
          label: "meterpreter_reverse_http"
        },
        {
          value: "meterpreter_reverse_https",
          label: "meterpreter_reverse_https"
        },
        {
          value: "meterpreter_reverse_tcp",
          label: "meterpreter_reverse_tcp"
        },
        {
          value: "meterpreter_reverse_dns",
          label: "meterpreter_reverse_dns"
        }
      ]
    },
    {
      value: "linux",
      label: "linux",
      children: [
        {
          value: "x64",
          label: "x64",
          children: [
            {
              value: "meterpreter",
              label: "meterpreter",
              children: [
                {
                  value: "bind_tcp",
                  label: "bind_tcp"
                },
                {
                  value: "reverse_tcp",
                  label: "reverse_tcp"
                }
              ]
            },

            {
              value: "meterpreter_reverse_http",
              label: "meterpreter_reverse_http"
            },
            {
              value: "meterpreter_reverse_https",
              label: "meterpreter_reverse_https"
            },
            {
              value: "meterpreter_reverse_tcp",
              label: "meterpreter_reverse_tcp"
            }
          ]
        },
        {
          value: "x86",
          label: "x86",
          children: [
            {
              value: "meterpreter",
              label: "meterpreter",
              children: [
                {
                  value: "reverse_tcp",
                  label: "reverse_tcp"
                },
                {
                  value: "bind_tcp",
                  label: "bind_tcp"
                }
              ]
            },
            {
              value: "meterpreter_reverse_http",
              label: "meterpreter_reverse_http"
            },
            {
              value: "meterpreter_reverse_https",
              label: "meterpreter_reverse_https"
            },
            {
              value: "meterpreter_reverse_tcp",
              label: "meterpreter_reverse_tcp"
            }
          ]
        }
      ]
    },
    {
      value: "multi",
      label: "multi",
      children: [
        {
          value: "meterpreter",
          label: "meterpreter",
          children: [
            {
              value: "reverse_http",
              label: "reverse_http"
            },
            {
              value: "reverse_https",
              label: "reverse_https"
            }
          ]
        }
      ]
    },
    {
      value: "java",
      label: "java",
      children: [
        {
          value: "meterpreter",
          label: "meterpreter",
          children: [
            {
              value: "bind_tcp",
              label: "bind_tcp"
            },
            {
              value: "reverse_http",
              label: "reverse_http"
            },
            {
              value: "reverse_tcp",
              label: "reverse_tcp"
            }
          ]
        }
      ]
    },
    {
      value: "python",
      label: "python",
      children: [
        {
          value: "meterpreter",
          label: "meterpreter",
          children: [
            {
              value: "bind_tcp",
              label: "bind_tcp"
            },
            {
              value: "reverse_http",
              label: "reverse_http"
            },
            {
              value: "reverse_https",
              label: "reverse_https"
            },
            {
              value: "reverse_tcp",
              label: "reverse_tcp"
            },
            {
              value: "reverse_tcp_ssl",
              label: "reverse_tcp_ssl"
            }
          ]
        },
        {
          value: "meterpreter_bind_tcp",
          label: "meterpreter_bind_tcp"
        },
        {
          value: "meterpreter_reverse_http",
          label: "meterpreter_reverse_http"
        },
        {
          value: "meterpreter_reverse_https",
          label: "meterpreter_reverse_https"
        },
        {
          value: "meterpreter_reverse_tcp",
          label: "meterpreter_reverse_tcp"
        }
      ]
    },
    {
      value: "android",
      label: "android",
      children: [
        {
          value: "meterpreter",
          label: "meterpreter",
          children: [
            {
              value: "reverse_http",
              label: "reverse_http"
            },
            {
              value: "reverse_https",
              label: "reverse_https"
            },
            {
              value: "reverse_tcp",
              label: "reverse_tcp"
            }
          ]
        },
        {
          value: "meterpreter_reverse_http",
          label: "meterpreter_reverse_http"
        },
        {
          value: "meterpreter_reverse_https",
          label: "meterpreter_reverse_https"
        },
        {
          value: "meterpreter_reverse_tcp",
          label: "meterpreter_reverse_tcp"
        }
      ]
    },
    {
      value: "osx",
      label: "osx",
      children: [
        {
          value: "x64",
          label: "x64",
          children: [
            {
              value: "meterpreter",
              label: "meterpreter",
              children: [
                {
                  value: "bind_tcp",
                  label: "bind_tcp"
                },
                {
                  value: "reverse_tcp",
                  label: "reverse_tcp"
                }
              ]
            },

            {
              value: "meterpreter_reverse_http",
              label: "meterpreter_reverse_http"
            },
            {
              value: "meterpreter_reverse_https",
              label: "meterpreter_reverse_https"
            },
            {
              value: "meterpreter_reverse_tcp",
              label: "meterpreter_reverse_tcp"
            }
          ]
        },
        {
          value: "aarch64",
          label: "aarch64",
          children: [
            {
              value: "meterpreter",
              label: "meterpreter",
              children: [
                {
                  value: "reverse_tcp",
                  label: "reverse_tcp"
                }
              ]
            },
            {
              value: "meterpreter_reverse_http",
              label: "meterpreter_reverse_http"
            },
            {
              value: "meterpreter_reverse_https",
              label: "meterpreter_reverse_https"
            },
            {
              value: "meterpreter_reverse_tcp",
              label: "meterpreter_reverse_tcp"
            }
          ]
        }
      ]
    },
    {
      value: "php",
      label: "php",
      children: [
        {
          value: "meterpreter",
          label: "meterpreter",
          children: [
            {
              value: "bind_tcp",
              label: "bind_tcp"
            },
            {
              value: "reverse_tcp",
              label: "reverse_tcp"
            }
          ]
        },
        {
          value: "meterpreter_reverse_tcp",
          label: "meterpreter_reverse_tcp"
        }
      ]
    }
  ];

  const StageEncoder = ["x86/shikata_ga_nai", "x86/xor_dynamic", "x64/xor", "x64/xor_dynamic"];
  const [form] = Form.useForm();
  const [selectPayload, setStateSelectPayload] = useState(null);
  const [pem_files, setPemfiles] = useState([]);
  const [lhost, setLhost] = useState(null);
  const [sessionDict, setSessionDict] = useState([]);

  useRequest(() => getCoreSettingAPI({ kind: "lhost" }), {
    onSuccess: (result, params) => {
      if (result.lhost === null || result.lhost === "") {
        setLhost(location.hostname);
      } else {
        setLhost(result.lhost);
      }
      setPemfiles(result.pem_files);
      setSessionDict(result.sessions);
    },
    onError: (error, params) => {
    }
  });

  const createHandlerReq = useRequest(postMsgrpcHandlerAPI, {
    manual: true,
    onSuccess: (result, params) => {
      createHandlerFinish();
    },
    onError: (error, params) => {
    }
  });

  const onCreateHandlerBySubmit = params => {
    params.PAYLOAD = params.PAYLOAD.join("/");
    createHandlerReq.run({ opts: params });
  };

  const changePayloadOption = (value, selectedOptions) => {
    const payload = value.join("/");
    setStateSelectPayload(payload);
    if (payload.includes("bind_tcp")) {
      form.setFieldsValue({ ExitOnSession: true });
    } else {
      form.setFieldsValue({ ExitOnSession: false });
    }
  };


  const handlerPayloadBaseOption = () => {
    let options = [];
    if (selectPayload === null || selectPayload === undefined) {
      return null;
    }
    if (selectPayload.includes("reverse")) {
      if (selectPayload.includes("reverse_dns")) {
        options.push(
          <Form.Item
            {...formLayout}
            label="RHOST"
            name="RHOST"
            initialValue="127.0.0.1"
            style={{ display: "None" }}
          ><Fragment />
          </Form.Item>
        );
        options.push(
          <Form.Item
            {...formLayout}
            label="LPORT"
            name="LPORT"
            initialValue={60006}
            style={{ display: "None" }}
          >
            <Fragment />
          </Form.Item>
        );
      } else {
        options.push(
          <Form.Item
            {...formLayout}
            label="LHOST"
            name="LHOST"
            initialValue={lhost}
            rules={[
              {
                required: true,
                message: formatText("app.payloadandhandler.lhost_rule")
              }
            ]}
          >
            <Input placeholder={formatText("app.payloadandhandler.lhost_rule")} />
          </Form.Item>
        );
        options.push(
          <Form.Item
            {...formLayout}
            label="LPORT"
            name="LPORT"
            rules={[
              {
                required: true,
                message: formatText("app.payloadandhandler.port_rule")
              }
            ]}
          >
            <InputNumber style={{ width: 160 }} />
          </Form.Item>
        );
      }

    } else {
      options.push(
        <Form.Item
          {...formLayout}
          label="RHOST"
          name="RHOST"
          rules={[
            {
              required: true,
              message: formatText("app.payloadandhandler.rhost_rule")
            }
          ]}
        >
          <Input placeholder={formatText("app.payloadandhandler.rhost_rule")} />
        </Form.Item>
      );
      options.push(
        <Form.Item
          {...formLayout}
          label="LPORT"
          name="LPORT"
          rules={[
            {
              required: true,
              message: formatText("app.payloadandhandler.port_rule")
            }
          ]}
        >
          <InputNumber style={{ width: 160 }} />
        </Form.Item>
      );
    }
    if (options.length === 0) {
      return null;
    } else {
      return options;
    }
  };

  const handlerPayloadComnOption = () => {
    let options = [];
    if (selectPayload === null || selectPayload === undefined) {
      return null;
    }
    if (~selectPayload.includes("reverse_dns")) {
      let selectOptions = [];
      for (let uuid in sessionDict) {
        let session = sessionDict[uuid];
        selectOptions.push(
          <Radio value={session.id}>{sessionTagList(session)}</Radio>
        );
      }

      options.push(<Form.Item
          {...CommformLayout}
          label={formatText("app.payloadandhandler.comm_label")}
          tooltip={formatText("app.payloadandhandler.comm_tip")}
          name="ReverseListenerComm"
        >
          <Radio.Group onChange={(e) => {
            for (let uuid in sessionDict) {
              let session = sessionDict[uuid];
              if (session.id === e.target.value) {
                form.setFieldsValue({ LHOST: session.session_host });
              }
            }

          }}>
            <Space direction="vertical">
              {selectOptions}
            </Space>
          </Radio.Group>
        </Form.Item>
      );
    }

    if (options.length === 0) {
      return null;
    } else {
      return (
        <Panel header={formatText("app.payloadandhandler.comm")} key="Comm">
          {options}
        </Panel>
      );
    }
  };
  const handlerPayloadWarnOption = () => {

    let options = [];
    if (selectPayload === null || selectPayload === undefined) {
      return null;
    }
    //添加警告信息
    if (selectPayload.endsWith("reverse_http") || selectPayload.endsWith("reverse_winhttp")) {
      options.push(
        <Row style={{ marginBottom: 16 }}>
          <Col span={16} offset={4}>
            <Alert
              message={formatText("app.payloadandhandler.alert_1")}
              type="warning"
              showIcon
            />
          </Col>
        </Row>
      );
    }

    if (selectPayload.includes("reverse_tcp")) {
      options.push(
        <Row style={{ marginBottom: 16 }}>
          <Col span={16} offset={4}>
            <Alert
              message={formatText("app.payloadandhandler.alert_2")}
              type="warning"
              showIcon
            />
          </Col>
        </Row>
      );
    }

    if (options.length === 0) {
      return null;
    } else {
      return options;
    }
  };

  const handlerPayloadSpecialOption = () => {

    let options = [];
    let options_second = [];
    if (selectPayload === null || selectPayload === undefined) {
      return null;
    }
    //添加配置信息
    if (selectPayload.includes("reverse_http") || selectPayload.includes("reverse_winhttp")) {
      options.push(
        <Form.Item
          {...formLayout}
          label="LURI"
          tooltip={formatText("app.payloadandhandler.luri_tip")}
          initialValue={randomstr(8)}
          name="LURI"
        >
          <Input placeholder={formatText("app.payloadandhandler.luri_rule")} />
        </Form.Item>
      );
    }

    if (selectPayload.includes("reverse_https") || selectPayload.includes("reverse_winhttps") || selectPayload.endsWith("_ssl")) {
      options.push(
        <Form.Item
          {...formLayout}
          label={formatText("app.payloadandhandler.pem_label")}
          tooltip={formatText("app.payloadandhandler.pem_tip")}
          name="HandlerSSLCert"
        >
          <Select placeholder={formatText("app.payloadandhandler.pem_rule")} allowClear>
            {pem_files.map((encoder, i) => (
              <Option value={`/root/.msf4/loot/${encoder}`}>{encoder}</Option>
            ))}
          </Select>
        </Form.Item>
      );
      options.push(
        <Form.Item
          {...shortFormLayout}
          label={formatText("app.payloadandhandler.ssl_version")}
          tooltip={formatText("app.payloadandhandler.ssl_version_tip")}
          initialValue="Auto"
          name="SSLVersion"
        >
          <Select
            defaultValue="Auto"
            options={[
              {
                value: "Auto",
                label: "Auto"
              },
              {
                value: "TLS",
                label: "TLS"
              },
              {
                value: "SSL23",
                label: "SSL23"
              },
              {
                value: "SSL3",
                label: "SSL3"
              },
              {
                value: "TLS1",
                label: "TLS1"
              },
              {
                value: "TLS1.1",
                label: "TLS1.1"
              },
              {
                value: "TLS1.2",
                label: "TLS1.2"
              }
            ]}
          />
        </Form.Item>
      );
      options.push(
        <Form.Item
          {...formLayout}
          label={formatText("app.payloadandhandler.sslcipher")}
          tooltip={formatText("app.payloadandhandler.sslcipher_tip")}
          name="SSLCipher"
          initialValue={null}
        >
          <Select
            allowClear
            options={[
              {
                value: "DHE-RSA-AES256-SHA",
                label: "DHE-RSA-AES256-SHA"
              },
              {
                value: "DHE-DSS-AES256-SHA",
                label: "DHE-DSS-AES256-SHA"
              }
            ]}
          />
        </Form.Item>
      );
      options.push(
        <Form.Item
          {...formLayout}
          label={formatText("app.payloadandhandler.ssl_label")}
          tooltip={formatText("app.payloadandhandler.ssl_tip")}
          initialValue={false}
          name="StagerVerifySSLCert"
          valuePropName="checked"
        >
          <Checkbox defaultChecked />
        </Form.Item>
      );
    }

    if (selectPayload.includes("reverse_http") || selectPayload.includes("reverse_winhttp")) {

      options_second.push(
        <Form.Item
          {...formLayout}
          label="User Agent"
          tooltip="The user-agent that the payload should use for communication"
          initialValue="Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
          name="HttpUserAgent"
          rules={[
            {
              required: true,
              message: "Please input UserAgent"
            }
          ]}
        >
          <TextArea placeholder="Please input UserAgent" />
        </Form.Item>
      );
      options_second.push(
        <Form.Item
          {...formLayout}
          label="OverrideRequestHost"
          tooltip="Forces a specific host and port instead of using what the client requests, defaults to LHOST:LPORT"
          initialValue={false}
          name="OverrideRequestHost"
          valuePropName="checked"
          rules={[]}
        >
          <Checkbox />
        </Form.Item>
      );

      options_second.push(
        <Form.Item
          {...formLayout}
          label="OverrideScheme"
          tooltip="When OverrideRequestHost is set, use this value as the scheme for secondary requests, e.g http or https"
          name="OverrideScheme"
          rules={[]}
        >
          <Select placeholder="Please select scheme">
            <Option value="http">http</Option>
            <Option value="https">https</Option>
          </Select>
        </Form.Item>
      );

      options_second.push(
        <Form.Item
          {...formLayout}
          label="OverrideLHOST"
          tooltip="When OverrideRequestHost is set, use this value as the host name for secondary requests"
          name="OverrideLHOST"
          rules={[]}
        >
          <Input placeholder="" />
        </Form.Item>
      );
      options_second.push(
        <Form.Item
          {...formLayout}
          label="OverrideLPORT"
          tooltip="When OverrideRequestHost is set, use this value as the port number for secondary requests"
          name="OverrideLPORT"
          rules={[]}
        >
          <InputNumber style={{ width: 160 }} />
        </Form.Item>
      );


      options_second.push(
        <Form.Item
          {...formLayout}
          label="HttpCookie"
          tooltip="An optional value to use for the Cookie HTTP header"
          name="HttpCookie"
          rules={[]}
        >
          <Input placeholder="" />
        </Form.Item>
      );
      options_second.push(
        <Form.Item
          {...formLayout}
          label="HttpHostHeader"
          tooltip="An optional value to use for the Host HTTP header"
          name="HttpHostHeader"
          rules={[]}
        >
          <Input placeholder="" />
        </Form.Item>
      );

      options_second.push(
        <Form.Item
          {...formLayout}
          label="HttpProxyType"
          tooltip="The type of HTTP proxy (Accepted: HTTP, SOCKS)"
          name="HttpProxyType"
          rules={[]}
        >
          <Select placeholder="Please select protocol">
            <Option value="HTTP">HTTP</Option>
            <Option value="SOCKS">SOCKS</Option>
          </Select>
        </Form.Item>
      );
      options_second.push(
        <Form.Item
          {...formLayout}
          label="HttpProxyHost"
          tooltip="An optional proxy server IP address or hostname"
          name="HttpProxyHost"
          rules={[]}
        >
          <Input placeholder="" />
        </Form.Item>
      );

      options_second.push(
        <Form.Item
          {...formLayout}
          label="HttpProxyPort"
          tooltip="An optional proxy server port"
          name="HttpProxyPort"
          rules={[]}
        >
          <InputNumber style={{ width: 160 }} />
        </Form.Item>
      );
      options_second.push(
        <Form.Item
          {...formLayout}
          label="HttpProxyUser"
          tooltip="An optional proxy server username Max parameter length: 63 characters"
          name="HttpProxyUser"
          rules={[]}
        >
          <Input placeholder="" />
        </Form.Item>
      );
      options_second.push(
        <Form.Item
          {...formLayout}
          label="HttpProxyPass"
          tooltip="An optional proxy server password Max parameter length: 63 characters"
          name="HttpProxyPass"
          rules={[]}
        >
          <Input placeholder="" />
        </Form.Item>
      );
    }

    if (selectPayload.includes("rc4")) {
      options.push(
        <Form.Item
          {...formLayout}
          label={formatText("app.payloadandhandler.rc4password")}
          tooltip="Password to derive RC4 key from"
          initialValue={randomstr(8)}
          name="RC4PASSWORD"
          rules={[
            {
              required: true,
              message: formatText("app.payloadandhandler.rc4password_rule")
            }
          ]}
        >
          <Input placeholder={formatText("app.payloadandhandler.rc4password_rule")} />
        </Form.Item>
      );
    }
    if (selectPayload.includes("reverse_dns")) {
      options.push(
        <Form.Item
          {...formLayout}
          label="DOMAIN"
          tooltip={formatText("app.payloadandhandler.domain")}
          name="DOMAIN"
          rules={[
            {
              required: true,
              message: formatText("app.payloadandhandler.domain_rule")
            }
          ]}
        >
          <Input placeholder={formatText("app.payloadandhandler.domain_rule")} />
        </Form.Item>
      );
      options.push(
        <Form.Item
          {...formLayout}
          label="REQ_TYPE"
          tooltip={formatText("app.payloadandhandler.req_type_tip")}
          name="REQ_TYPE"
          initialValue="DNSKEY"
          rules={[
            {
              required: true,
              message: formatText("app.payloadandhandler.req_type_rule")
            }
          ]}>
          <Select style={{ width: 200 }}>
            <Option value="DNSKEY">{formatText("app.payloadandhandler.DNSKEY")}</Option>
            <Option value="IPv6">{formatText("app.payloadandhandler.IPv6")}</Option>
          </Select>
        </Form.Item>
      );
      options.push(
        <Form.Item
          {...formLayout}
          label="SERVER_ID"
          tooltip={formatText("app.payloadandhandler.SERVER_ID_tip")}
          initialValue={randomstr(8)}
          name="SERVER_ID"
          rules={[
            {
              required: true,
              message: formatText("app.payloadandhandler.SERVER_ID_rule")
            }
          ]}
        >
          <Input placeholder={formatText("app.payloadandhandler.SERVER_ID_rule")} />
        </Form.Item>
      );
    }
    if (options.length === 0) {
      return null;
    } else {
      if (options_second.length === 0) {
        return (
          <Panel header={formatText("app.payloadandhandler.advance")} key="advance">
            {options}
          </Panel>
        );
      } else {
        return (<Fragment>
            <Panel header={formatText("app.payloadandhandler.advance")} key="advance">
              {options}
            </Panel>
            <Panel header={formatText("app.payloadandhandler.advance_second")} key="advance_second">
              {options_second}
            </Panel>
          </Fragment>
        );
      }
    }
  };


  const handlerMeterpreterDebugLogging = () => {
    if (selectPayload === null || selectPayload === undefined) {
      return null;
    }
    if (selectPayload.includes("reverse")) {
      return <Form.Item
        {...formLayout}
        label="MeterpreterDebugLogging"
        name="MeterpreterDebugLogging"
        rules={[]}
        initialValue="rpath:C:/Windows/Temp/foo.txt"
      >
        <Input placeholder="rpath:C:/Windows/Temp/foo.txt rpath:/tmp/foo.txt" />
      </Form.Item>;
    } else {
      return <Form.Item
        {...formLayout}
        label="MeterpreterDebugLogging"
        name="MeterpreterDebugLogging"
        rules={[]}
        initialValue="rpath:/tmp/foo.txt"
      >
        <Input placeholder="rpath:C:/Windows/Temp/foo.txt rpath:/tmp/foo.txt" />
      </Form.Item>;
    }
  };


  return (
    <Form
      form={form}
      onFinish={onCreateHandlerBySubmit}
    >
      <Collapse bordered={false} defaultActiveKey={["base", "advance"]}>
        <Panel header={formatText("app.payloadandhandler.base")} key="base">
          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.payload")}
            name="PAYLOAD"
            rules={[
              {
                required: true,
                message: formatText("app.payloadandhandler.payload_rule")
              }
            ]}
          >
            <Cascader
              options={handlerPayloadOptions}
              onChange={changePayloadOption}
              placeholder={formatText("app.payloadandhandler.payload_rule")}
            />
          </Form.Item>
          {handlerPayloadBaseOption()}
          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.EXITONSESSION")}
            tooltip={formatText("app.payloadandhandler.EXITONSESSION_tip")}
            name="ExitOnSession"
            valuePropName="checked"
            rules={[]}
            initialValue={false}
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.VIRTUALHANDLER")}
            tooltip={formatText("app.payloadandhandler.VIRTUALHANDLER_tip")}
            name="VIRTUALHANDLER"
            valuePropName="checked"
            rules={[]}
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.handlername")}
            name="HandlerName"
            rules={[]}>
            <Input placeholder={formatText("app.payloadandhandler.handlername_ph")} />
          </Form.Item>
          {handlerPayloadWarnOption()}
        </Panel>

        {handlerPayloadComnOption()}
        {handlerPayloadSpecialOption()}
        <Panel header={formatText("app.payloadandhandler.auto")} key="auto">
          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.AutoRunScript")}
            tooltip={formatText("app.payloadandhandler.AutoRunScript_tip")}
            name="InitialAutoRunScript"
            rules={[]}
          >
            <Select allowClear>
              {initialAutoRunScript.map((encoder, i) => (
                <Option value={encoder}>{encoder}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.PrependMigrate")}
            tooltip={formatText("app.payloadandhandler.PrependMigrate_tip")}
            name="PrependMigrate"
            valuePropName="checked"
            initialValue={false}
            rules={[]}
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.PrependMigrateProc")}
            name="PrependMigrateProc" rules={[]}>
            <Select style={{ width: 200 }} allowClear>
              {migrateProcess.map((encoder, i) => (
                <Option value={encoder}>{encoder}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.AutoUnhookProcess")}
            tooltip={formatText("app.payloadandhandler.AutoUnhookProcess_tip")}
            name="AutoUnhookProcess"
            valuePropName="checked"
            rules={[]}
            initialValue={false}
          >
            <Checkbox />
          </Form.Item>
        </Panel>
        <Panel header={formatText("app.payloadandhandler.diy")} key="diy">
          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.AutoVerifySessionTimeout")}
            tooltip={formatText("app.payloadandhandler.AutoVerifySessionTimeout_tip")}
            name="AutoVerifySessionTimeout"
            rules={[]}
            initialValue={30}
          >
            <InputNumber
              style={{ width: 160 }}
              placeholder={formatText("app.payloadandhandler.AutoVerifySessionTimeout_ph")} />
          </Form.Item>
          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.SessionCommunicationTimeout")}
            name="SessionCommunicationTimeout"
            rules={[]}
            initialValue={60 * 5}
          >
            <InputNumber
              style={{ width: 160 }} />
          </Form.Item>
          <Form.Item
            {...formLayout}
            label="ExpirationTimeout(second)"
            name="SessionExpirationTimeout"
            rules={[]}
            initialValue={31536000}
          >
            <InputNumber
              style={{ width: 160 }}
            />
          </Form.Item>
          <Form.Item
            {...formLayout}
            label="RetryTotal(second)"
            name="SessionRetryTotal"
            rules={[]}
            initialValue={31536000}
          >
            <InputNumber style={{ width: 160 }} />
          </Form.Item>

          <Form.Item
            {...formLayout}
            label="RetryWait(second)"
            name="SessionRetryWait"
            rules={[]}
            initialValue={10}
          >
            <InputNumber style={{ width: 160 }} />
          </Form.Item>
          <Form.Item {...formLayout} label="StageEncoder" name="StageEncoder" rules={[]}>
            <Select placeholder="Please select encoder">
              {StageEncoder.map((encoder, i) => (
                <Option value={encoder}>{encoder}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            {...formLayout}
            label="StageEncodingFallback"
            name="StageEncodingFallback"
            valuePropName="checked"
            rules={[]}
            initialValue
          >
            <Checkbox defaultChecked />
          </Form.Item>

          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.proxies_proto")}
            tooltip={formatText("app.payloadandhandler.proxies_proto_tip")}
          >
            <Input.Group compact>
              <Form.Item name="proxies_proto" noStyle initialValue="Direct" rules={[]}>
                <Select style={{ width: 88 }}>
                  <Option value="Direct">Direct</Option>
                  <Option value="Socks5">Socks5</Option>
                  <Option value="Socks4">Socks4</Option>
                  <Option value="Http">Http</Option>
                </Select>
              </Form.Item>
              <Form.Item name="proxies_ipport" noStyle rules={[]}>
                <Input style={{ width: "70%" }} placeholder="IP:PORT" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item
            {...formLayout}
            label="MeterpreterDebugBuild"
            name="MeterpreterDebugBuild"
            valuePropName="checked"
            rules={[]}
          >
            <Checkbox />
          </Form.Item>
          {handlerMeterpreterDebugLogging()}
        </Panel>
      </Collapse>
      <Form.Item style={{ marginTop: 24 }} {...buttonLayout}>
        <Button
          block
          loading={createHandlerReq.loading}
          icon={<CustomerServiceOutlined />}
          htmlType="submit"
          type="primary"
        >
          {formatText("app.payloadandhandler.addhandler")}
        </Button>
      </Form.Item>
    </Form>
  );
};

const CreatePayloadModalContent = props => {
  const { createPayloadFinish } = props;

  const [selectPayload, setStateSelectPayload] = useState(null);
  const [pem_files, setPemfiles] = useState([]);
  const [lhost, setLhost] = useState(null);

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 }
  };
  const buttonLayout = {
    wrapperCol: { offset: 5, span: 14 }
  };
  const payloadOptions = [
    {
      value: "windows",
      label: "windows",
      children: [
        {
          value: "x64",
          label: "x64",
          children: [
            {
              value: "meterpreter",
              label: "meterpreter",
              children: [
                {
                  value: "bind_tcp",
                  label: "bind_tcp"
                },
                {
                  value: "bind_tcp_rc4",
                  label: "bind_tcp_rc4"
                },
                {
                  value: "reverse_http",
                  label: "reverse_http"
                },
                {
                  value: "reverse_https",
                  label: "reverse_https"
                },
                {
                  value: "reverse_tcp",
                  label: "reverse_tcp"
                },
                {
                  value: "reverse_tcp_rc4",
                  label: "reverse_tcp_rc4"
                },

                {
                  value: "reverse_winhttp",
                  label: "reverse_winhttp"
                },
                {
                  value: "reverse_winhttps",
                  label: "reverse_winhttps"
                },
                {
                  value: "reverse_dns",
                  label: "reverse_dns"
                }
              ]
            },
            {
              value: "meterpreter_bind_tcp",
              label: "meterpreter_bind_tcp"
            },
            {
              value: "meterpreter_reverse_http",
              label: "meterpreter_reverse_http"
            },
            {
              value: "meterpreter_reverse_https",
              label: "meterpreter_reverse_https"
            },
            {
              value: "meterpreter_reverse_tcp",
              label: "meterpreter_reverse_tcp"
            },
            {
              value: "meterpreter_reverse_dns",
              label: "meterpreter_reverse_dns"
            }
          ]
        },
        {
          value: "meterpreter",
          label: "meterpreter",
          children: [
            {
              value: "bind_tcp",
              label: "bind_tcp"
            },
            {
              value: "bind_tcp_rc4",
              label: "bind_tcp_rc4"
            },
            {
              value: "reverse_http",
              label: "reverse_http"
            },
            {
              value: "reverse_https",
              label: "reverse_https"
            },
            {
              value: "reverse_tcp",
              label: "reverse_tcp"
            },

            {
              value: "reverse_tcp_rc4",
              label: "reverse_tcp_rc4"
            },
            {
              value: "reverse_winhttp",
              label: "reverse_winhttp"
            },
            {
              value: "reverse_winhttps",
              label: "reverse_winhttps"
            },
            {
              value: "reverse_dns",
              label: "reverse_dns"
            }
          ]
        },
        {
          value: "meterpreter_bind_tcp",
          label: "meterpreter_bind_tcp"
        },
        {
          value: "meterpreter_reverse_http",
          label: "meterpreter_reverse_http"
        },
        {
          value: "meterpreter_reverse_https",
          label: "meterpreter_reverse_https"
        },
        {
          value: "meterpreter_reverse_tcp",
          label: "meterpreter_reverse_tcp"
        },
        {
          value: "meterpreter_reverse_dns",
          label: "meterpreter_reverse_dns"
        }
      ]
    },
    {
      value: "linux",
      label: "linux",
      children: [
        {
          value: "x64",
          label: "x64",
          children: [
            {
              value: "meterpreter",
              label: "meterpreter",
              children: [
                {
                  value: "bind_tcp",
                  label: "bind_tcp"
                },
                {
                  value: "reverse_tcp",
                  label: "reverse_tcp"
                }
              ]
            },

            {
              value: "meterpreter_reverse_http",
              label: "meterpreter_reverse_http"
            },
            {
              value: "meterpreter_reverse_https",
              label: "meterpreter_reverse_https"
            },
            {
              value: "meterpreter_reverse_tcp",
              label: "meterpreter_reverse_tcp"
            }
          ]
        },
        {
          value: "x86",
          label: "x86",
          children: [
            {
              value: "meterpreter",
              label: "meterpreter",
              children: [
                {
                  value: "reverse_tcp",
                  label: "reverse_tcp"
                },
                {
                  value: "bind_tcp",
                  label: "bind_tcp"
                }
              ]
            },
            {
              value: "meterpreter_reverse_http",
              label: "meterpreter_reverse_http"
            },
            {
              value: "meterpreter_reverse_https",
              label: "meterpreter_reverse_https"
            },
            {
              value: "meterpreter_reverse_tcp",
              label: "meterpreter_reverse_tcp"
            }
          ]
        }
      ]
    },
    {
      value: "python",
      label: "python",
      children: [
        {
          value: "meterpreter",
          label: "meterpreter",
          children: [
            {
              value: "bind_tcp",
              label: "bind_tcp"
            },
            {
              value: "reverse_http",
              label: "reverse_http"
            },
            {
              value: "reverse_https",
              label: "reverse_https"
            },
            {
              value: "reverse_tcp",
              label: "reverse_tcp"
            },
            {
              value: "reverse_tcp_ssl",
              label: "reverse_tcp_ssl"
            }
          ]
        },
        {
          value: "meterpreter_bind_tcp",
          label: "meterpreter_bind_tcp"
        },
        {
          value: "meterpreter_reverse_http",
          label: "meterpreter_reverse_http"
        },
        {
          value: "meterpreter_reverse_https",
          label: "meterpreter_reverse_https"
        },
        {
          value: "meterpreter_reverse_tcp",
          label: "meterpreter_reverse_tcp"
        }
      ]
    },
    {
      value: "java",
      label: "java",
      children: [
        {
          value: "meterpreter",
          label: "meterpreter",
          children: [
            {
              value: "bind_tcp",
              label: "bind_tcp"
            },
            {
              value: "reverse_http",
              label: "reverse_http"
            },
            {
              value: "reverse_tcp",
              label: "reverse_tcp"
            }
          ]
        }
      ]
    },
    {
      value: "android",
      label: "android",
      children: [
        {
          value: "meterpreter",
          label: "meterpreter",
          children: [
            {
              value: "reverse_http",
              label: "reverse_http"
            },
            {
              value: "reverse_https",
              label: "reverse_https"
            },
            {
              value: "reverse_tcp",
              label: "reverse_tcp"
            }
          ]
        },
        {
          value: "meterpreter_reverse_http",
          label: "meterpreter_reverse_http"
        },
        {
          value: "meterpreter_reverse_https",
          label: "meterpreter_reverse_https"
        },
        {
          value: "meterpreter_reverse_tcp",
          label: "meterpreter_reverse_tcp"
        }
      ]
    },
    {
      value: "osx",
      label: "osx",
      children: [
        {
          value: "x64",
          label: "x64",
          children: [
            {
              value: "meterpreter",
              label: "meterpreter",
              children: [
                {
                  value: "bind_tcp",
                  label: "bind_tcp"
                },
                {
                  value: "reverse_tcp",
                  label: "reverse_tcp"
                }
              ]
            },

            {
              value: "meterpreter_reverse_http",
              label: "meterpreter_reverse_http"
            },
            {
              value: "meterpreter_reverse_https",
              label: "meterpreter_reverse_https"
            },
            {
              value: "meterpreter_reverse_tcp",
              label: "meterpreter_reverse_tcp"
            }
          ]
        },
        {
          value: "aarch64",
          label: "aarch64",
          children: [
            {
              value: "meterpreter",
              label: "meterpreter",
              children: [
                {
                  value: "reverse_tcp",
                  label: "reverse_tcp"
                }
              ]
            },
            {
              value: "meterpreter_reverse_http",
              label: "meterpreter_reverse_http"
            },
            {
              value: "meterpreter_reverse_https",
              label: "meterpreter_reverse_https"
            },
            {
              value: "meterpreter_reverse_tcp",
              label: "meterpreter_reverse_tcp"
            }
          ]
        }
      ]
    },
    {
      value: "php",
      label: "php",
      children: [
        {
          value: "meterpreter",
          label: "meterpreter",
          children: [
            {
              value: "bind_tcp",
              label: "bind_tcp"
            },
            {
              value: "reverse_tcp",
              label: "reverse_tcp"
            }
          ]
        },
        {
          value: "meterpreter_reverse_tcp",
          label: "meterpreter_reverse_tcp"
        }
      ]
    }
  ];

  const payloadEncoder = [
    "x86/shikata_ga_nai",
    "x86/xor_dynamic",
    "x64/xor",
    "x64/xor_dynamic",
    "cmd/powershell_base64"
  ];


  useRequest(() => getCoreSettingAPI({ kind: "lhost" }), {
    onSuccess: (result, params) => {
      if (result.lhost === null || result.lhost === "") {
        setLhost(location.hostname);
      } else {
        setLhost(result.lhost);
      }
      setPemfiles(result.pem_files);
    },
    onError: (error, params) => {
    }
  });

  const createHandlerReq = useRequest(postMsgrpcHandlerAPI, {
    manual: true,
    onSuccess: (result, params) => {
    },
    onError: (error, params) => {
    }
  });

  const createPayloadReq = useRequest(postMsgrpcPayloadAPI, {
    manual: true,
    onSuccess: (result, params) => {
      // message.success(decodeURI(response.headers.get('Message')));
      createPayloadFinish();
    },
    onError: (error, params) => {
    }
  });

  const payloadFormatOption = () => {
    let options = [];
    if (selectPayload === null || selectPayload === undefined) {
      return null;
    }
    if (selectPayload.includes("windows")) {
      options = [
        { show: formatText("app.payloadandhandler.src.bypass.exe"), value: "exe-src" },
        { show: formatText("app.payloadandhandler.src.bypass.exe.service"), value: "exe-src-service" },
        { show: formatText("app.payloadandhandler.separate.bypass.exe"), value: "exe-diy" },
        { show: formatText("app.payloadandhandler.separate.bypass.dll"), value: "dll-diy" },
        { show: formatText("app.payloadandhandler.separate.bypass.dll.mutex"), value: "dll-mutex-diy" },
        { show: "msbuild", value: "msbuild" },
        { show: "base64", value: "base64" },
        { show: "c", value: "c" },
        { show: "csharp", value: "csharp" },
        { show: "exe", value: "exe" },
        { show: "exe-service", value: "exe-service" },
        { show: "macho", value: "macho" },
        { show: "powershell", value: "powershell" },
        { show: "psh-reflection", value: "psh-reflection" },
        { show: "psh-cmd", value: "psh-cmd" },
        { show: "python", value: "python" },
        { show: "hex", value: "hex" },
        { show: "hta-psh", value: "hta-psh" },
        { show: "raw", value: "raw" },
        { show: "vba", value: "vba" },
        { show: "vbs", value: "vbs" },
        { show: "loop-vbs", value: "loop-vbs" },
        { show: "war", value: "war" }
      ];
    }
    if (selectPayload.includes("linux")) {
      options = [
        { show: formatText("app.payloadandhandler.src.bypass.elf"), value: "elf-src" },
        { show: formatText("app.payloadandhandler.separate.bypass.elf"), value: "elf-diy" },
        { show: "bash", value: "bash" },
        { show: "c", value: "c" },
        { show: "raw", value: "raw" },
        { show: "hex", value: "hex" },
        { show: "elf", value: "elf" },
        { show: "elf-so", value: "elf-so" }
      ];
    }
    if (selectPayload.includes("java")) {
      options = [
        { show: "jar", value: "jar" },
        { show: "java", value: "java" },
        { show: "war", value: "war" }
      ];
    }
    if (selectPayload.includes("python")) {
      options = [{ show: "raw", value: "raw" }, { show: "python", value: "python" }];
    }
    if (selectPayload.includes("php")) {
      options = [{ show: "raw", value: "raw" }];
    }

    return (
      <Form.Item
        {...formLayout}
        label={formatText("app.payloadandhandler.format")}
        name="Format"
        rules={[
          {
            required: true,
            message: formatText("app.payloadandhandler.format_rule")
          }
        ]}
      >
        <Select style={{ width: 240 }}>
          {options.map((format, i) => (
            <Option value={format.value}>{format.show}</Option>
          ))}
        </Select>
      </Form.Item>
    );
  };

  const payloadBaseOption = () => {
    let options = [];
    if (selectPayload === null || selectPayload === undefined) {
      return null;
    }
    if (selectPayload.includes("reverse")) {
      if (selectPayload.includes("reverse_dns")) {
        options.push(
          <Form.Item
            {...formLayout}
            label="RHOST"
            name="RHOST"
            initialValue="127.0.0.1"
            style={{ display: "None" }}
          ><Fragment />
          </Form.Item>
        );
        options.push(
          <Form.Item
            {...formLayout}
            label="LPORT"
            name="LPORT"
            initialValue={60006}
            style={{ display: "None" }}
          >
            <Fragment />
          </Form.Item>
        );
      } else {
        options.push(
          <Form.Item
            {...formLayout}
            label="LHOST"
            name="LHOST"
            initialValue={lhost}
            rules={[
              {
                required: true,
                message: formatText("app.payloadandhandler.lhost_rule")
              }
            ]}
          >
            <Input placeholder={formatText("app.payloadandhandler.lhost_rule")} />
          </Form.Item>
        );
        options.push(
          <Form.Item
            {...formLayout}
            label="LPORT"
            name="LPORT"
            rules={[
              {
                required: true,
                message: formatText("app.payloadandhandler.port_rule")
              }
            ]}
          >
            <InputNumber style={{ width: 160 }} />
          </Form.Item>
        );
      }

    } else {
      options.push(
        <Form.Item
          {...formLayout}
          label="RHOST"
          name="RHOST"
          initialValue="0.0.0.0"
        >
          <Input placeholder={formatText("app.payloadandhandler.rhost_rule")} />
        </Form.Item>
      );
      options.push(
        <Form.Item
          {...formLayout}
          label="LPORT"
          name="LPORT"
          rules={[
            {
              required: true,
              message: formatText("app.payloadandhandler.port_rule")
            }
          ]}
        >
          <InputNumber style={{ width: 160 }} />
        </Form.Item>
      );
    }
    if (options.length === 0) {
      return null;
    } else {
      return options;
    }
  };

  const payloadSpecialOption = () => {

    let options = [];

    if (selectPayload === null || selectPayload === undefined) {
      return null;
    }
    //添加警告信息
    if (selectPayload.endsWith("reverse_http") || selectPayload.endsWith("reverse_winhttp")) {
      options.push(
        <Row style={{ marginBottom: 16 }}>
          <Col span={14} offset={6}>
            <Alert
              message={formatText("app.payloadandhandler.http_alert")}
              type="warning"
              showIcon
            />
          </Col>
        </Row>
      );
    }

    //添加配置信息
    if (selectPayload.includes("reverse_http") || selectPayload.includes("reverse_winhttp")) {
      options.push(
        <Form.Item
          {...formLayout}
          label="LURI"
          tooltip="The HTTP Path"
          initialValue={randomstr(8)}
          name="LURI"
        >
          <Input placeholder={formatText("app.payloadandhandler.luri_rule")} />
        </Form.Item>
      );
    }

    if (selectPayload.includes("reverse_https") || selectPayload.includes("reverse_winhttps") || selectPayload.endsWith("_ssl")) {
      options.push(
        <Form.Item
          {...formLayout}
          label={formatText("app.payloadandhandler.pem_label")}
          tooltip={formatText("app.payloadandhandler.pem_tip")}
          name="HandlerSSLCert"
        >
          <Select placeholder={formatText("app.payloadandhandler.pem_rule")} allowClear>
            {pem_files.map((encoder, i) => (
              <Option value={`/root/.msf4/loot/${encoder}`}>{encoder}</Option>
            ))}
          </Select>
        </Form.Item>
      );
      options.push(
        <Form.Item
          {...formLayout}
          label={formatText("app.payloadandhandler.ssl_label")}
          tooltip={formatText("app.payloadandhandler.ssl_tip")}
          initialValue
          name="StagerVerifySSLCert"
          valuePropName="checked"
        >
          <Checkbox defaultChecked />
        </Form.Item>
      );
    }

    if (selectPayload.includes("reverse_http") || selectPayload.includes("reverse_winhttp")) {
      options.push(
        <Form.Item
          {...formLayout}
          label="User Agent"
          tooltip="The user-agent that the payload should use for communication"
          initialValue="Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
          name="HttpUserAgent"
          rules={[
            {
              required: true,
              message: "Please input UserAgent"
            }
          ]}
        >
          <TextArea placeholder="Please input UserAgent" />
        </Form.Item>
      );

      options.push(
        <Form.Item
          {...formLayout}
          label="OverrideRequestHost"
          tooltip="Forces a specific host and port instead of using what the client requests, defaults to LHOST:LPORT"
          initialValue={false}
          name="OverrideRequestHost"
          valuePropName="checked"
          rules={[]}
        >
          <Checkbox />
        </Form.Item>
      );

      options.push(
        <Form.Item
          {...formLayout}
          label="OverrideScheme"
          tooltip="When OverrideRequestHost is set, use this value as the scheme for secondary requests, e.g http or https"
          name="OverrideScheme"
          rules={[]}
        >
          <Select placeholder="Please select scheme">
            <Option value="http">http</Option>
            <Option value="https">https</Option>
          </Select>
        </Form.Item>
      );

      options.push(
        <Form.Item
          {...formLayout}
          label="OverrideLHOST"
          tooltip="When OverrideRequestHost is set, use this value as the host name for secondary requests"
          name="OverrideLHOST"
          rules={[]}
        >
          <Input placeholder="" />
        </Form.Item>
      );
      options.push(
        <Form.Item
          {...formLayout}
          label="OverrideLPORT"
          tooltip="When OverrideRequestHost is set, use this value as the port number for secondary requests"
          name="OverrideLPORT"
          rules={[]}
        >
          <InputNumber style={{ width: 160 }} />
        </Form.Item>
      );

      options.push(
        <Form.Item
          {...formLayout}
          label="HttpCookie"
          tooltip="An optional value to use for the Cookie HTTP header"
          name="HttpCookie"
          rules={[]}
        >
          <Input placeholder="" />
        </Form.Item>
      );
      options.push(
        <Form.Item
          {...formLayout}
          label="HttpHostHeader"
          tooltip="An optional value to use for the Host HTTP header"
          name="HttpHostHeader"
          rules={[]}
        >
          <Input placeholder="" />
        </Form.Item>
      );

      options.push(
        <Form.Item
          {...formLayout}
          label="HttpProxyType"
          tooltip="The type of HTTP proxy (Accepted: HTTP, SOCKS)"
          name="HttpProxyType"
          rules={[]}
        >
          <Select placeholder="Please select proxy type">
            <Option value="HTTP">HTTP</Option>
            <Option value="SOCKS">SOCKS</Option>
          </Select>
        </Form.Item>
      );
      options.push(
        <Form.Item
          {...formLayout}
          label="HttpProxyHost"
          tooltip="An optional proxy server IP address or hostname"
          name="HttpProxyHost"
          rules={[]}
        >
          <Input placeholder="" />
        </Form.Item>
      );

      options.push(
        <Form.Item
          {...formLayout}
          label="HttpProxyPort"
          tooltip="An optional proxy server port"
          name="HttpProxyPort"
          rules={[]}
        >
          <InputNumber style={{ width: 160 }} />
        </Form.Item>
      );
      options.push(
        <Form.Item
          {...formLayout}
          label="HttpProxyUser"
          tooltip="An optional proxy server username Max parameter length: 63 characters"
          name="HttpProxyUser"
          rules={[]}
        >
          <Input placeholder="" />
        </Form.Item>
      );
      options.push(
        <Form.Item
          {...formLayout}
          label="HttpProxyPass"
          tooltip="An optional proxy server password Max parameter length: 63 characters"
          name="HttpProxyPass"
          rules={[]}
        >
          <Input placeholder="" />
        </Form.Item>
      );

    }

    if (selectPayload.includes("rc4")) {
      options.push(
        <Form.Item
          {...formLayout}
          label={formatText("app.payloadandhandler.rc4password")}
          tooltip="Password to derive RC4 key from"
          initialValue={randomstr(8)}
          name="RC4PASSWORD"
          rules={[
            {
              required: true,
              message: formatText("app.payloadandhandler.rc4password_rule")
            }
          ]}
        >
          <Input placeholder="请输入RC4密码" />
        </Form.Item>
      );
    }

    if (selectPayload.includes("reverse_dns")) {
      options.push(
        <Form.Item
          {...formLayout}
          label="DOMAIN"
          tooltip={formatText("app.payloadandhandler.domain")}
          name="DOMAIN"
          rules={[
            {
              required: true,
              message: formatText("app.payloadandhandler.domain_rule")
            }
          ]}
        >
          <Input placeholder={formatText("app.payloadandhandler.domain_rule")} />
        </Form.Item>
      );
      options.push(
        <Form.Item
          {...formLayout}
          label="REQ_TYPE"
          tooltip={formatText("app.payloadandhandler.req_type_tip")}
          name="REQ_TYPE"
          initialValue="DNSKEY"
          rules={[
            {
              required: true,
              message: formatText("app.payloadandhandler.req_type_rule")
            }
          ]}>
          <Select style={{ width: 200 }}>
            <Option value="DNSKEY">{formatText("app.payloadandhandler.DNSKEY")}</Option>
            <Option value="IPv6">{formatText("app.payloadandhandler.IPv6")}</Option>
          </Select>
        </Form.Item>
      );
      options.push(
        <Form.Item
          {...formLayout}
          label="SERVER_ID"
          tooltip={formatText("app.payloadandhandler.SERVER_ID_tip")}
          initialValue={randomstr(8)}
          name="SERVER_ID"
          rules={[
            {
              required: true,
              message: formatText("app.payloadandhandler.SERVER_ID_rule")
            }
          ]}
        >
          <Input placeholder={formatText("app.payloadandhandler.SERVER_ID_rule")} />
        </Form.Item>
      );
    }

    if (options.length === 0) {
      return null;
    } else {
      return (
        <Panel header={formatText("app.payloadandhandler.advance")} key="advance">
          {options}
        </Panel>
      );
    }
  };

  const changePayloadOption = (value, selectedOptions) => {
    const payload = value.join("/");
    setStateSelectPayload(payload);
  };

  const onCreatePayloadBySubmit = values => {
    const opts = values;
    const mname = values.PAYLOAD.join("/");
    delete opts.PAYLOAD;
    if (opts.ADD_HANDLER === true) {
      createHandlerReq.run({ opts: { PAYLOAD: mname, ...opts } });
    }
    delete opts.ADD_HANDLER;
    createPayloadReq.run({ mname, opts });
  };

  return (
    <Form onFinish={onCreatePayloadBySubmit}>
      <Collapse bordered={false} defaultActiveKey={["base", "advance"]}>
        <Panel header={formatText("app.payloadandhandler.base")} key="base">
          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.payload")}
            name="PAYLOAD"
            rules={[
              {
                required: true,
                message: formatText("app.payloadandhandler.payload_rule")
              }
            ]}
          >
            <Cascader
              options={payloadOptions}
              onChange={changePayloadOption}
              placeholder={formatText("app.payloadandhandler.payload_rule")}
            />
          </Form.Item>
          {payloadBaseOption()}
          {payloadFormatOption()}
        </Panel>
        {payloadSpecialOption()}
        <Panel header={formatText("app.payloadandhandler.auto")} key="auto">
          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.PrependMigrate")}
            tooltip={formatText("app.payloadandhandler.PrependMigrate_tip")}
            name="PrependMigrate"
            valuePropName="checked"
            initialValue={false}
            rules={[]}
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.PrependMigrateProc")}
            name="PrependMigrateProc"
            rules={[]}>
            <Select style={{ width: 200 }} allowClear>
              {migrateProcess.map((encoder, i) => (
                <Option value={encoder}>{encoder}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.ADD_HANDLER")}
            tooltip={formatText("app.payloadandhandler.ADD_HANDLER_tip")}
            name="ADD_HANDLER"
            valuePropName="checked"
            initialValue={false}
            rules={[]}
          >
            <Checkbox />
          </Form.Item>
        </Panel>

        <Panel header={formatText("app.payloadandhandler.diy")} key="diy">
          <Form.Item {...formLayout} label="Encoder" name="Encoder" rules={[]}>
            <Select style={{ width: 200 }} allowClear>
              {payloadEncoder.map((encoder, i) => (
                <Option value={encoder}>{encoder}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.Iterations")}
            name="Iterations"
            rules={[]}>
            <InputNumber style={{ width: 160 }} />
          </Form.Item>
          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.ForceEncode")}
            name="ForceEncode"
            valuePropName="checked"
            initialValue={false}
            rules={[]}
          >
            <Checkbox />
          </Form.Item>

          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.BadChars")}
            name="BadChars"
            rules={[]}>
            <Input />
          </Form.Item>
          <Form.Item
            {...formLayout}
            label={formatText("app.payloadandhandler.SessionCommunicationTimeout")}
            name="SessionCommunicationTimeout"
            rules={[]}
            initialValue={60 * 5}
          >
            <InputNumber style={{ width: 160 }} />
          </Form.Item>
          <Form.Item
            {...formLayout}
            label="ExpirationTimeout(second)"
            name="SessionExpirationTimeout"
            rules={[]}
            initialValue={31536000}
          >
            <InputNumber style={{ width: 160 }} />
          </Form.Item>
          <Form.Item
            {...formLayout}
            label="SessionRetryTotal(Second)"
            name="SessionRetryTotal"
            rules={[]}
            initialValue={31536000}
          >
            <InputNumber style={{ width: 160 }} />
          </Form.Item>
          <Form.Item
            {...formLayout}
            label="SessionRetryWait(Second)"
            name="SessionRetryWait"
            rules={[]}
            initialValue={10}
          >
            <InputNumber style={{ width: 160 }} />
          </Form.Item>
        </Panel>
      </Collapse>
      <Form.Item style={{ marginTop: 24 }} {...buttonLayout}>
        <Button
          block
          loading={createPayloadReq.loading}
          icon={<BlockOutlined />}
          htmlType="submit"
          type="primary"
        >
          {formatText("app.payloadandhandler.genpayload")}
        </Button>
      </Form.Item>
    </Form>
  );
};

const showHandlerDetail = item => {
  const Descriptions_Items = [];
  let showstr = null;
  for (const key in item) {
    if (item[key] === null || item[key] === "") {
      continue;
    } else if (item[key] === true || item[key] === false) {
      showstr = item[key] ? "True" : "False";
    } else {
      showstr = item[key];
    }
    Descriptions_Items.push(<Descriptions.Item label={key}>{showstr}</Descriptions.Item>);
  }
  Modal.info({
    mask: false,
    style: { top: 20 },
    width: "95%",
    icon: "",
    content: (
      <Descriptions
        style={{ marginTop: -32, marginRight: -24, marginLeft: -24, marginBottom: -16 }}
        bordered
        size="small"
        column={3}
      >
        {Descriptions_Items}
      </Descriptions>
    ),
    onOk() {
    }
  });
};

function genPayloadByHandler(item) {
  const createPayloadReq = useRequest(postMsgrpcPayloadAPI, {
    manual: true,
    onSuccess: (result, params) => {
    },
    onError: (error, params) => {
    }
  });

  function onCreatePayloadByHandler(params, format) {
    params.Format = format;
    createPayloadReq.run({ mname: params.PAYLOAD, opts: params });
  };

  const buttonTemple = (type) => {
    return <Button onClick={() => onCreatePayloadByHandler(item, type)}>{type}</Button>;
  };


  const buttons = <Fragment>
    <Space direction="vertical">
      <Space>
        {buttonTemple("asp")}
        {buttonTemple("aspx")}
        {buttonTemple("aspx-exe")}
      </Space>
      <Space>
        {buttonTemple("base32")}
        {buttonTemple("base64")}
        {buttonTemple("bash")}
      </Space>
      <Space>
        {buttonTemple("c")}
        {buttonTemple("csharp")}
      </Space>
      <Space>
        {buttonTemple("dll")}
        {buttonTemple("dword")}
      </Space>
      <Space>
        {buttonTemple("elf")}
        {buttonTemple("elf-so")}
        {buttonTemple("exe")}
        {buttonTemple("exe-only")}
        {buttonTemple("exe-service")}
        {buttonTemple("exe-small")}
      </Space>
      <Space>
        {buttonTemple("hex")}
        {buttonTemple("hta-psh")}
      </Space>
      <Space>
        {buttonTemple("jar")}
        {buttonTemple("java")}
        {buttonTemple("jsp")}
        {buttonTemple("js_be")}
        {buttonTemple("js_le")}
      </Space>
      <Space>
        {buttonTemple("macho")}
        {buttonTemple("msi")}
        {buttonTemple("msi-nouac")}
      </Space>
      <Space>
        {buttonTemple("powershell")}
        {buttonTemple("psh")}
        {buttonTemple("psh-cmd")}
        {buttonTemple("psh-net")}
        {buttonTemple("psh-reflection")}
      </Space>
      <Space>
        {buttonTemple("python")}
        {buttonTemple("python-reflection")}
        {buttonTemple("perl")}
      </Space>
      <Space>
        {buttonTemple("raw")}
        {buttonTemple("ruby")}
      </Space>
      <Space>
        {buttonTemple("vbapplication")}
        {buttonTemple("vba")}
        {buttonTemple("vba-exe")}
        {buttonTemple("vba-psh")}
      </Space>
      <Space>
        {buttonTemple("vbscript")}
        {buttonTemple("vbs")}
        {buttonTemple("loop-vbs")}
      </Space>
      <Space>
        {buttonTemple("war")}
      </Space>
    </Space>
  </Fragment>;
  return buttons;
};


const PayloadAndHandler = (props) => {
  console.log("PayloadAndHandler");
  const [createHandlerModalVisible, setCreateHandlerModalVisible] = useState(false);
  const [createPayloadModalVisible, setCreatePayloadModalVisible] = useState(false);
  const [handlerListActive, setHandlerListActive] = useState([]);
  const {
    resizeDownHeight
  } = useModel("Resize", model => ({
    resizeDownHeight: model.resizeDownHeight
  }));
  const listHanderReq = useRequest(getMsgrpcHandlerAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setHandlerListActive(result);
    },
    onError: (error, params) => {
    }
  });

  //初始化数据
  useImperativeHandle(props.onRef, () => {
    return {
      updateData: () => {
        listHanderReq.run();
      }
    };
  });


  useRequest(getMsgrpcHandlerAPI, {
    onSuccess: (result, params) => {
      setHandlerListActive(result);
    },
    onError: (error, params) => {
    }
  });


  const createHandlerReq = useRequest(postMsgrpcHandlerAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listHanderReq.run();
    },
    onError: (error, params) => {
    }
  });

  const onCreateHandlerByVirtual = params => {
    createHandlerReq.run({ opts: params });
  };

  const onCreateVirtualHandler = params => {
    params.VIRTUALHANDLER = true;
    createHandlerReq.run({ opts: params });
  };

  const destoryHandlerReq = useRequest(deleteMsgrpcHandlerAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listHanderReq.run();
    },
    onError: (error, params) => {
    }
  });

  const createPayloadReq = useRequest(postMsgrpcPayloadAPI, {
    manual: true,
    onSuccess: (result, params) => {
    },
    onError: (error, params) => {
    }
  });

  const onCreatePayloadByHandler = params => {
    params.Format = "AUTO";
    createPayloadReq.run({ mname: params.PAYLOAD, opts: params });
  };

  const createHandlerFinish = () => {
    setCreateHandlerModalVisible(false);
    listHanderReq.run();
  };
  const createPayloadFinish = () => {
    setCreatePayloadModalVisible(false);
  };


  return (
    <Fragment>
      <DocIcon url="https://www.yuque.com/vipersec/help/rxb29t" />
      <Row style={{ marginTop: -16 }} gutter={0}>
        <Col span={8}>
          <Button
            block
            icon={<CustomerServiceOutlined />}
            onClick={() => setCreateHandlerModalVisible(true)}
          >
            {formatText("app.payloadandhandler.addhandler")}
          </Button>
        </Col>
        <Col span={8}>
          <Button
            loading={createPayloadReq.loading}
            block
            icon={<BlockOutlined />}
            onClick={() => setCreatePayloadModalVisible(true)}
          >
            {formatText("app.payloadandhandler.genpayload")}
          </Button>
        </Col>
        <Col span={8}>
          <Button
            icon={<SyncOutlined />}
            style={{
              width: "100%"
            }}
            loading={listHanderReq.loading || createHandlerReq.loading || destoryHandlerReq.loading}
            onClick={() => listHanderReq.run()}
          >
            {formatText("app.core.refresh")}
          </Button>
        </Col>
      </Row>
      <Table
        style={{
          marginTop: 0,
          padding: "0 0 0 0",
          overflow: "auto",
          maxHeight: cssCalc(`${resizeDownHeight} - 32px`),
          minHeight: cssCalc(`${resizeDownHeight} - 32px`)
        }}
        size="small"
        bordered
        pagination={false}
        rowKey="ID"
        dataSource={handlerListActive}
        columns={[
          {
            title: "ID",
            dataIndex: "ID",
            key: "ID",
            width: 48,
            render: (text, record) =>
              record.ID >= 0 ? (
                <Avatar
                  style={{ backgroundColor: "#49aa19", width: "100%" }}
                  shape="square"
                  size={24}
                >
                  <Tooltip placement="right" title={formatText("app.payloadandhandler.realhandler")}>
                    {record.ID}
                  </Tooltip>
                </Avatar>
              ) : (
                <Avatar style={{ width: "100%" }} shape="square" size={24}>
                  <Tooltip placement="right" title={formatText("app.payloadandhandler.virlhandler")}>
                    {-record.ID}
                  </Tooltip>
                </Avatar>
              )
          },
          {
            title: formatText("app.payloadandhandler.payload"),
            dataIndex: "PAYLOAD",
            key: "PAYLOAD",
            width: 280,
            render: (text, record) => record.PAYLOAD
          },
          {
            title: "LHOST/RHOST",
            dataIndex: "PAYLOAD",
            key: "PAYLOAD",
            width: 136,
            render: (text, record) => {
              if (record.RHOST !== undefined && record.RHOST !== null) {
                return <span>{record.RHOST}</span>;
              }
              if (record.LHOST !== undefined && record.LHOST !== null) {
                return <span>{record.LHOST}</span>;
              }
              return null;
            }
          },
          {
            title: "PORT",
            dataIndex: "LPORT",
            key: "LPORT",
            width: 64,
            render: (text, record) => <span>{record.LPORT}</span>
          },
          {
            title: formatText("app.payloadandhandler.params"),
            dataIndex: "PAYLOAD",
            key: "PAYLOAD",
            render: (text, record) => {
              const items = [];

              if (record.LURI !== undefined && record.LURI !== null) {
                items.push(<span>{` LURI: ${record.LURI}`}</span>);
              }
              if (record.HandlerSSLCert !== undefined && record.HandlerSSLCert !== null) {
                const pos = record.HandlerSSLCert.lastIndexOf("/");
                items.push(
                  <span>{` ${formatText("app.payloadandhandler.pemfile")}: ${record.HandlerSSLCert.substr(pos + 1)}`}</span>);
              }

              if (record.RC4PASSWORD !== undefined && record.RC4PASSWORD !== null) {
                items.push(<span>{` ${formatText("app.payloadandhandler.rc4password")}: ${record.RC4PASSWORD}`}</span>);
              }
              if (record.proxies !== undefined && record.proxies !== null) {
                items.push(<span>{` ${formatText("app.payloadandhandler.proxy")}: ${record.proxies}`}</span>);
              }

              if (record.DOMAIN !== undefined && record.DOMAIN !== null) {
                items.push(<span>{` DOMAIN: ${record.DOMAIN}`}</span>);
              }

              if (record.REQ_TYPE !== undefined && record.REQ_TYPE !== null) {
                items.push(<span>{` REQ_TYPE: ${record.REQ_TYPE}`}</span>);
              }

              if (record.SERVER_ID !== undefined && record.SERVER_ID !== null) {
                items.push(<span>{` SERVER_ID: ${record.SERVER_ID}`}</span>);
              }

              if (record.ReverseListenerComm !== undefined && record.ReverseListenerComm !== null) {
                items.push(<span>{` Channel Session: ${record.ReverseListenerComm}`}</span>);
              }

              return <Space style={{ display: "flex" }}>{items}</Space>;
            }
          },
          {
            title: formatText("app.payloadandhandler.handlername"),
            dataIndex: "HandlerName",
            key: "HandlerName",
            render: (text, record) => record.HandlerName
          },
          {
            title: formatText("app.payloadandhandler.backup"),
            dataIndex: "Backup",
            key: "ID",
            width: 48,
            render: (text, record) =>
              record.Backup ? (
                <Avatar
                  style={{ backgroundColor: "#d8bd14", width: "100%" }}
                  shape="square"
                  size={24}
                >
                  <SaveOutlined />
                </Avatar>
              ) : null
          },
          {
            dataIndex: "operation",
            width: 400,
            render: (text, record) => {
              let transformAction = null;
              if (record.ID >= 0) {
                transformAction = (
                  <a style={{ color: "#a5a5a5" }} onClick={() => onCreateVirtualHandler(record)}>
                    {formatText("app.payloadandhandler.getvirl")}
                  </a>
                );
              } else {
                transformAction = (
                  <a style={{ color: "#faad14" }} onClick={() => onCreateHandlerByVirtual(record)}>
                    {formatText("app.payloadandhandler.getreal")}
                  </a>
                );
              }
              return (
                <div style={{ textAlign: "center" }}>
                  <Space size="middle">
                    <a style={{ color: "green" }} onClick={() => onCreatePayloadByHandler(record)}>
                      {formatText("app.payloadandhandler.genpe")}
                    </a>
                    <Popover
                      placement="left"
                      title={formatText("app.payloadandhandler.format_rule")}
                      content={() => genPayloadByHandler(record)}
                      trigger="click">
                      <a style={{ color: "#13a8a8" }}>
                        {formatText("app.payloadandhandler.genpayload")}
                      </a>
                    </Popover>
                    <a onClick={() => showHandlerDetail(record)}>{formatText("app.payloadandhandler.Detail")}</a>
                    {transformAction}
                    <a
                      onClick={() => destoryHandlerReq.run({ jobid: record.ID })}
                      style={{ color: "red" }}
                    >
                      {formatText("app.core.delete")}
                    </a>
                  </Space>
                </div>
              );
            }
          }
        ]}
      />
      <Modal
        style={{ top: 20 }}
        width="60vw"
        bodyStyle={{ padding: "0px 0px 1px 0px" }}
        destroyOnClose
        visible={createHandlerModalVisible}
        footer={null}
        onCancel={() => setCreateHandlerModalVisible(false)}
      >
        <CreateHandlerModalContent createHandlerFinish={createHandlerFinish} />
      </Modal>
      <Modal
        style={{ top: 20 }}
        width="60vw"
        bodyStyle={{ padding: "0px 0px 1px 0px" }}
        destroyOnClose
        visible={createPayloadModalVisible}
        footer={null}
        onCancel={() => setCreatePayloadModalVisible(false)}
      >
        <CreatePayloadModalContent createPayloadFinish={createPayloadFinish} />
      </Modal>
    </Fragment>
  );
};
export const PayloadAndHandlerMemo = memo(PayloadAndHandler);

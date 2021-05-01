import React, { Fragment, memo, useState } from 'react';
import {
  deleteMsgrpcHandlerAPI,
  getCoreSettingAPI,
  getMsgrpcHandlerAPI,
  postMsgrpcHandlerAPI,
  postMsgrpcPayloadAPI,
} from '@/services/apiv1';
// import { useControllableValue, useBoolean, useMount } from '@umijs/hooks';
import styles from './PayloadAndHandler.less';
import '@ant-design/compatible/assets/index.css';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Cascader,
  Checkbox,
  Col,
  Collapse,
  Descriptions,
  Form as FormNew,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from 'antd';
import { BlockOutlined, CustomerServiceOutlined, InfoCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'umi';

const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;
const migrateProcess = ['explorer.exe', 'notepad.exe', 'svchost.exe'];

const initialAutoRunScript = ['post/windows/manage/migrate NAME=explorer.exe SPAWN=false'];
const randomString = (length, chars) => {
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};
const CreateHandlerModalContent = props => {
  const { createHandlerFinish } = props;
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  const buttonLayout = {
    wrapperCol: { offset: 5, span: 14 },
  };
  const handlerPayloadOptions = [
    {
      value: 'windows',
      label: 'windows',
      children: [
        {
          value: 'x64',
          label: 'x64',
          children: [
            {
              value: 'meterpreter',
              label: 'meterpreter',
              children: [
                {
                  value: 'bind_tcp',
                  label: 'bind_tcp',
                },
                {
                  value: 'bind_tcp_rc4',
                  label: 'bind_tcp_rc4',
                },
                {
                  value: 'reverse_http',
                  label: 'reverse_http',
                },
                {
                  value: 'reverse_https',
                  label: 'reverse_https',
                },
                {
                  value: 'reverse_tcp',
                  label: 'reverse_tcp',
                },
                {
                  value: 'reverse_tcp_rc4',
                  label: 'reverse_tcp_rc4',
                },

                {
                  value: 'reverse_winhttp',
                  label: 'reverse_winhttp',
                },
                {
                  value: 'reverse_winhttps',
                  label: 'reverse_winhttps',
                },
              ],
            },
            {
              value: 'meterpreter_bind_tcp',
              label: 'meterpreter_bind_tcp',
            },
            {
              value: 'meterpreter_reverse_http',
              label: 'meterpreter_reverse_http',
            },
            {
              value: 'meterpreter_reverse_https',
              label: 'meterpreter_reverse_https',
            },
            {
              value: 'meterpreter_reverse_tcp',
              label: 'meterpreter_reverse_tcp',
            },
          ],
        },
        {
          value: 'meterpreter',
          label: 'meterpreter',
          children: [
            {
              value: 'bind_tcp',
              label: 'bind_tcp',
            },
            {
              value: 'bind_tcp_rc4',
              label: 'bind_tcp_rc4',
            },
            {
              value: 'reverse_http',
              label: 'reverse_http',
            },
            {
              value: 'reverse_https',
              label: 'reverse_https',
            },
            // {
            //   value: 'reverse_https_proxy',
            //   label: 'reverse_https_proxy',
            // },
            {
              value: 'reverse_tcp',
              label: 'reverse_tcp',
            },

            {
              value: 'reverse_tcp_rc4',
              label: 'reverse_tcp_rc4',
            },
            {
              value: 'reverse_winhttp',
              label: 'reverse_winhttp',
            },
            {
              value: 'reverse_winhttps',
              label: 'reverse_winhttps',
            },
          ],
        },
        {
          value: 'meterpreter_bind_tcp',
          label: 'meterpreter_bind_tcp',
        },
        {
          value: 'meterpreter_reverse_http',
          label: 'meterpreter_reverse_http',
        },
        {
          value: 'meterpreter_reverse_https',
          label: 'meterpreter_reverse_https',
        },
        {
          value: 'meterpreter_reverse_tcp',
          label: 'meterpreter_reverse_tcp',
        },
      ],
    },
    {
      value: 'linux',
      label: 'linux',
      children: [
        {
          value: 'x64',
          label: 'x64',
          children: [
            {
              value: 'meterpreter',
              label: 'meterpreter',
              children: [
                {
                  value: 'bind_tcp',
                  label: 'bind_tcp',
                },
                {
                  value: 'reverse_tcp',
                  label: 'reverse_tcp',
                },
              ],
            },

            {
              value: 'meterpreter_reverse_http',
              label: 'meterpreter_reverse_http',
            },
            {
              value: 'meterpreter_reverse_https',
              label: 'meterpreter_reverse_https',
            },
            {
              value: 'meterpreter_reverse_tcp',
              label: 'meterpreter_reverse_tcp',
            },
          ],
        },
        {
          value: 'x86',
          label: 'x86',
          children: [
            {
              value: 'meterpreter',
              label: 'meterpreter',
              children: [
                {
                  value: 'reverse_tcp',
                  label: 'reverse_tcp',
                },
                {
                  value: 'bind_tcp',
                  label: 'bind_tcp',
                },
              ],
            },
            {
              value: 'meterpreter_reverse_http',
              label: 'meterpreter_reverse_http',
            },
            {
              value: 'meterpreter_reverse_https',
              label: 'meterpreter_reverse_https',
            },
            {
              value: 'meterpreter_reverse_tcp',
              label: 'meterpreter_reverse_tcp',
            },
          ],
        },
      ],
    },
    {
      value: 'multi',
      label: 'multi',
      children: [
        {
          value: 'meterpreter',
          label: 'meterpreter',
          children: [
            {
              value: 'reverse_http',
              label: 'reverse_http',
            },
            {
              value: 'reverse_https',
              label: 'reverse_https',
            },
          ],
        },
      ],
    },
    {
      value: 'java',
      label: 'java',
      children: [
        {
          value: 'meterpreter',
          label: 'meterpreter',
          children: [
            {
              value: 'bind_tcp',
              label: 'bind_tcp',
            },
            {
              value: 'reverse_http',
              label: 'reverse_http',
            },
            {
              value: 'reverse_tcp',
              label: 'reverse_tcp',
            },
          ],
        },
      ],
    },
    {
      value: 'php',
      label: 'php',
      children: [
        {
          value: 'meterpreter',
          label: 'meterpreter',
          children: [
            {
              value: 'bind_tcp',
              label: 'bind_tcp',
            },
            {
              value: 'reverse_tcp',
              label: 'reverse_tcp',
            },
          ],
        },
        {
          value: 'meterpreter_reverse_tcp',
          label: 'meterpreter_reverse_tcp',
        },
      ],
    },
    {
      value: 'python',
      label: 'python',
      children: [
        {
          value: 'meterpreter',
          label: 'meterpreter',
          children: [
            {
              value: 'bind_tcp',
              label: 'bind_tcp',
            },
            {
              value: 'reverse_http',
              label: 'reverse_http',
            },
            {
              value: 'reverse_https',
              label: 'reverse_https',
            },
            {
              value: 'reverse_tcp',
              label: 'reverse_tcp',
            },
            {
              value: 'reverse_tcp_ssl',
              label: 'reverse_tcp_ssl',
            },
          ],
        },
        {
          value: 'meterpreter_bind_tcp',
          label: 'meterpreter_bind_tcp',
        },
        {
          value: 'meterpreter_reverse_http',
          label: 'meterpreter_reverse_http',
        },
        {
          value: 'meterpreter_reverse_https',
          label: 'meterpreter_reverse_https',
        },
        {
          value: 'meterpreter_reverse_tcp',
          label: 'meterpreter_reverse_tcp',
        },
      ],
    },
  ];
  const StageEncoder = ['x86/shikata_ga_nai', 'x86/xor_dynamic', 'x64/xor', 'x64/xor_dynamic'];
  const [selectPayload, setStateSelectPayload] = useState(null);
  const [showLhost, setShowLhost] = useState(false);
  const [showRhost, setShowRhost] = useState(false);
  const [pem_files, setPemfiles] = useState([]);
  const [lhost, setLhost] = useState(null);

  const initListLHostReq = useRequest(() => getCoreSettingAPI({ kind: 'lhost' }), {
    onSuccess: (result, params) => {
      if (result.lhost === null || result.lhost === '') {
        setLhost(location.hostname);
      } else {
        setLhost(result.lhost);
      }
      setPemfiles(result.pem_files);
    },
    onError: (error, params) => {
    },
  });

  const createHandlerReq = useRequest(postMsgrpcHandlerAPI, {
    manual: true,
    onSuccess: (result, params) => {
      createHandlerFinish();
    },
    onError: (error, params) => {
    },
  });

  const onCreateHandlerBySubmit = params => {
    params.PAYLOAD = params.PAYLOAD.join('/');
    params.timestamp = Date.parse(new Date()) / 1000;
    createHandlerReq.run({ opts: params });
  };

  const changePayloadOption = (value, selectedOptions) => {
    const payload = value.join('/');
    setStateSelectPayload(payload);
    if (payload.includes('reverse')) {
      setShowLhost(true);
      setShowRhost(false);
    } else {
      setShowLhost(false);
      setShowRhost(true);
    }
  };

  let rString = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

  const handlerPayloadSpecialOption = () => {
    let options = [];
    if (selectPayload === null || selectPayload === undefined) {
      return null;
    }

    if (selectPayload.endsWith('reverse_http') || selectPayload.endsWith('reverse_winhttp')) {
      options.push(
        <Row style={{ marginBottom: 16 }}>
          <Col span={14} offset={6}>
            <Alert
              message="reverse_http类型payload不免杀,建议使用reverse_https类型"
              type="warning"
              showIcon
            />
          </Col>
        </Row>,
      );
    }

    if (selectPayload.includes('reverse_tcp')) {
      options.push(
        <Row style={{ marginBottom: 16 }}>
          <Col span={14} offset={6}>
            <Alert
              message="reverse_tcp及reverse_tcp_rc4类型监听请勿开放到外网80,443等常用端口,防范DDos攻击"
              type="warning"
              showIcon
            />
          </Col>
        </Row>,
      );
    }

    if (selectPayload.includes('reverse_https') || selectPayload.includes('reverse_winhttps')) {
      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip title="请选择PEM格式的证书文件,文件内容可以参考<文件列表>中www.example.com.pem,证书文件中需要同时包含公私钥,配置证书后会自动过滤http请求">
              <span>证书文件</span>
            </Tooltip>
          }
          name="HandlerSSLCert"
          rules={[
            {
              required: true,
              message: '请选择证书文件',
            },
          ]}
        >
          <Select placeholder="请选择证书文件">
            {pem_files.map((encoder, i) => (
              <Option value={`~/.msf4/loot/${encoder}`}>{encoder}</Option>
            ))}
          </Select>
        </FormNew.Item>,
      );
      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip title="是否验证Meterpreter中的SSL证书(只对reverse_winhttps及linux类型https监听有效)">
              <span>验证证书</span>
            </Tooltip>
          }
          initialValue={false}
          name="StagerVerifySSLCert"
          valuePropName="checked"
          rules={[
            {
              required: true,
              message: '请选择证书文件',
            },
          ]}
        >
          <Checkbox defaultChecked/>
        </FormNew.Item>,
      );
    }

    if (selectPayload.includes('reverse_http') || selectPayload.includes('reverse_winhttp')) {
      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip title="The HTTP Path">
              <span>LURI</span>
            </Tooltip>
          }
          initialValue={rString}
          name="LURI"
        >
          <Input placeholder="请输入自定义的URI"/>
        </FormNew.Item>,
      );

      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip
              title="The returned HTML response body when the handler receives a request that is not from a payload">
              <span>http服务默认返回报文</span>
            </Tooltip>
          }
          initialValue={'<html><body><h1>It works!</h1></body></html>'}
          name="HttpUnknownRequestResponse"
          rules={[
            {
              required: true,
              message: '请填写http服务默认返回报文',
            },
          ]}
        >
          <TextArea placeholder="请输入Https服务默认返回的报文"/>
        </FormNew.Item>,
      );

      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip title="The user-agent that the payload should use for communication">
              <span>User Agent</span>
            </Tooltip>
          }
          initialValue="Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
          name="HttpUserAgent"
          rules={[
            {
              required: true,
              message: '请输入http的UserAgent',
            },
          ]}
        >
          <TextArea placeholder="请输入https的UserAgent"/>
        </FormNew.Item>,
      );

      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip
              title="Forces a specific host and port instead of using what the client requests, defaults to LHOST:LPORT">
              <span>OverrideRequestHost</span>
            </Tooltip>
          }
          initialValue={false}
          name="OverrideRequestHost"
          valuePropName="checked"
          rules={[]}
        >
          <Checkbox/>
        </FormNew.Item>,
      );
      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip title="An optional value to use for the Host HTTP header">
              <span>HttpHostHeader</span>
            </Tooltip>
          }
          name="HttpHostHeader"
          rules={[]}
        >
          <Input placeholder=""/>
        </FormNew.Item>,
      );
      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip
              title="When OverrideRequestHost is set, use this value as the scheme for secondary requests, e.g http or https">
              <span>OverrideScheme</span>
            </Tooltip>
          }
          name="OverrideScheme"
          rules={[]}
        >
          <Select placeholder="请选择协议">
            <Option value="http">http</Option>
            <Option value="https">https</Option>
          </Select>
        </FormNew.Item>,
      );

      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip title="When OverrideRequestHost is set, use this value as the host name for secondary requests">
              <span>OverrideLHOST</span>
            </Tooltip>
          }
          name="OverrideLHOST"
          rules={[]}
        >
          <Input placeholder=""/>
        </FormNew.Item>,
      );
      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip title="When OverrideRequestHost is set, use this value as the port number for secondary requests">
              <span>OverrideLPORT</span>
            </Tooltip>
          }
          name="OverrideLPORT"
          rules={[]}
        >
          <InputNumber style={{ width: 160 }}/>
        </FormNew.Item>,
      );
    }

    if (selectPayload.includes('rc4')) {
      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip title="Password to derive RC4 key from">
              <span>RC4密码</span>
            </Tooltip>
          }
          initialValue={rString}
          name="RC4PASSWORD"
          rules={[
            {
              required: true,
              message: '请输入RC4协议密码,建议在8位以上',
            },
          ]}
        >
          <Input placeholder="请输入RC4密码"/>
        </FormNew.Item>,
      );
      options.push(
        <FormNew.Item {...formLayout} label="说明">
          <span>RC4初始生成Session时较慢,请耐心等待,Session生成后速度不受影响.</span>
        </FormNew.Item>,
      );
    }

    if (options.length === 0) {
      return null;
    } else {
      return (
        <Panel header="高级参数" key="advance">
          {options}
        </Panel>
      );
    }
  };

  return (
    <FormNew onFinish={onCreateHandlerBySubmit}>
      <Collapse bordered={false} defaultActiveKey={['base', 'advance']}>
        <Panel header="基础参数" key="base">
          <FormNew.Item
            {...formLayout}
            label="载荷"
            name="PAYLOAD"
            rules={[
              {
                required: true,
                message: '请选择有效载荷',
              },
            ]}
          >
            <Cascader
              options={handlerPayloadOptions}
              onChange={changePayloadOption}
              placeholder="请选择有效载荷"
            />
          </FormNew.Item>
          {showRhost ? (
            <FormNew.Item
              {...formLayout}
              label="RHOST"
              name="RHOST"
              rules={[
                {
                  required: true,
                  message: '请输入正向连接的IP地址',
                },
              ]}
            >
              <Input placeholder="请输入正向连接的IP地址"/>
            </FormNew.Item>
          ) : null}
          {showLhost ? (
            <FormNew.Item
              {...formLayout}
              label="LHOST"
              name="LHOST"
              initialValue={lhost}
              rules={[
                {
                  required: true,
                  message: '请输入反向连接的IP地址',
                },
              ]}
            >
              <Input placeholder="请输入反向连接的IP地址"/>
            </FormNew.Item>
          ) : null}
          <FormNew.Item
            {...formLayout}
            label="LPORT"
            name="LPORT"
            rules={[
              {
                required: true,
                message: '请输入端口',
              },
            ]}
          >
            <InputNumber style={{ width: 160 }}/>
          </FormNew.Item>
          <FormNew.Item {...formLayout} label="别名" name="HandlerName" rules={[]}>
            <Input placeholder="自定义监听名称"/>
          </FormNew.Item>
          <FormNew.Item
            {...formLayout}
            label={
              <Tooltip title="VIPER缓存监听配置,但渗透服务器不会生成正真的监听,此选项用于结合端口转发的反向SHELL/无需监听的payload生成">
                <span>
                  <InfoCircleOutlined/>
                  &nbsp;虚拟监听
                </span>
              </Tooltip>
            }
            name="VIRTUALHANDLER"
            valuePropName="checked"
            rules={[]}
          >
            <Checkbox/>
          </FormNew.Item>
        </Panel>
        {handlerPayloadSpecialOption()}
        <Panel header="自动化" key="auto">
          <FormNew.Item
            {...formLayout}
            label={
              <Tooltip title="权限(Session)初始化完成后自动执行脚本,请注意该参数只有在监听中生效,在载荷中使用不生效">
                <span>
                  <InfoCircleOutlined/>
                  &nbsp;自动执行脚本
                </span>
              </Tooltip>
            }
            name="InitialAutoRunScript"
            rules={[]}
          >
            <Select allowClear>
              {initialAutoRunScript.map((encoder, i) => (
                <Option value={encoder}>{encoder}</Option>
              ))}
            </Select>
          </FormNew.Item>
          <FormNew.Item
            {...formLayout}
            label={
              <Tooltip title="Payload执行后自动迁移到指定进程,请注意 1)必须使用该监听生成的载荷才能生效 2)迁移进程后原进程不会关闭,并且占用loader文件">
                <span>
                  <InfoCircleOutlined/>
                  &nbsp;自动迁移
                </span>
              </Tooltip>
            }
            name="PrependMigrate"
            valuePropName="checked"
            initialValue={false}
            rules={[]}
          >
            <Checkbox/>
          </FormNew.Item>
          <FormNew.Item {...formLayout} label="自动迁移到进程" name="PrependMigrateProc" rules={[]}>
            <Select style={{ width: 200 }} allowClear>
              {migrateProcess.map((encoder, i) => (
                <Option value={encoder}>{encoder}</Option>
              ))}
            </Select>
          </FormNew.Item>
          <FormNew.Item
            {...formLayout}
            label={
              <Tooltip title="自动加载unhook插件unhook杀软对进程的hook操作">
                <span>
                  <InfoCircleOutlined/>
                  &nbsp;自动unhook
                </span>
              </Tooltip>
            }
            name="AutoUnhookProcess"
            valuePropName="checked"
            rules={[]}
            initialValue={false}
          >
            <Checkbox/>
          </FormNew.Item>
          <FormNew.Item
            {...formLayout}
            label={
              <Tooltip title="监听生成Session后自动关闭,reverse_http(s)会自动忽略改选项">
                <span>
                  <InfoCircleOutlined/>
                  &nbsp;自动关闭监听
                </span>
              </Tooltip>
            }
            name="EXITONSESSION"
            valuePropName="checked"
            rules={[]}
            initialValue={false}
          >
            <Checkbox/>
          </FormNew.Item>
        </Panel>
        <Panel header="自定义参数" key="3">
          <FormNew.Item
            {...formLayout}
            label="连接超时时间(秒)"
            name="SessionCommunicationTimeout"
            rules={[]}
            initialValue={300}
          >
            <InputNumber style={{ width: 160 }} placeholder="请输入正确的连接超时时间"/>
          </FormNew.Item>
          <FormNew.Item
            {...formLayout}
            label="Session强制过期时间(秒)"
            name="SessionExpirationTimeout"
            rules={[]}
            initialValue={3600 * 24 * 30}
          >
            <InputNumber style={{ width: 160 }} placeholder="请输入正确的强制过期时间"/>
          </FormNew.Item>
          <FormNew.Item
            {...formLayout}
            label="网络断开重试次数"
            name="SessionRetryTotal"
            rules={[]}
            initialValue={3600}
          >
            <InputNumber style={{ width: 160 }} placeholder="请输入正确的强制过期时间"/>
          </FormNew.Item>

          <FormNew.Item
            {...formLayout}
            label="网络断开重试间隔(秒)"
            name="SessionRetryWait"
            rules={[]}
            initialValue={10}
          >
            <InputNumber style={{ width: 160 }} placeholder="请输入正确的强制过期时间"/>
          </FormNew.Item>
          <FormNew.Item {...formLayout} label="ShellCode编码" name="StageEncoder" rules={[]}>
            <Select placeholder="请选择编码">
              {StageEncoder.map((encoder, i) => (
                <Option value={encoder}>{encoder}</Option>
              ))}
            </Select>
          </FormNew.Item>
          <FormNew.Item
            {...formLayout}
            label="ShellCode编码回退"
            name="StageEncodingFallback"
            valuePropName="checked"
            rules={[]}
            initialValue
          >
            <Checkbox defaultChecked/>
          </FormNew.Item>

          <FormNew.Item
            {...formLayout}
            label={
              <Tooltip title="正向监听会通过填写的代理进行连接,反向Payload无法使用代理">
                <span>
                  <InfoCircleOutlined/>
                  &nbsp;代理信息
                </span>
              </Tooltip>
            }
          >
            <Input.Group compact>
              <FormNew.Item name="proxies_proto" noStyle initialValue="Direct" rules={[]}>
                <Select style={{ width: 88 }}>
                  <Option value="Direct">直连</Option>
                  <Option value="Socks5">Socks5</Option>
                  <Option value="Socks4">Socks4</Option>
                  <Option value="Http">Http</Option>
                </Select>
              </FormNew.Item>
              <FormNew.Item name="proxies_ipport" noStyle rules={[]}>
                <Input style={{ width: '70%' }} placeholder="IP:PORT"/>
              </FormNew.Item>
            </Input.Group>
          </FormNew.Item>
        </Panel>
      </Collapse>
      <FormNew.Item style={{ marginTop: 24 }} {...buttonLayout}>
        <Button
          block
          loading={createHandlerReq.loading}
          icon={<CustomerServiceOutlined/>}
          htmlType="submit"
          type="primary"
        >
          新增监听
        </Button>
      </FormNew.Item>
    </FormNew>
  );
};

const CreatePayloadModalContent = props => {
  const { createPayloadFinish } = props;

  const [selectPayload, setStateSelectPayload] = useState(null);
  const [showLhost, setShowLhost] = useState(false);
  const [showRhost, setShowRhost] = useState(false);
  const [pem_files, setPemfiles] = useState([]);
  const [lhost, setLhost] = useState(null);

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  const buttonLayout = {
    wrapperCol: { offset: 5, span: 14 },
  };
  const payloadOptions = [
    {
      value: 'windows',
      label: 'windows',
      children: [
        {
          value: 'x64',
          label: 'x64',
          children: [
            {
              value: 'meterpreter',
              label: 'meterpreter',
              children: [
                {
                  value: 'bind_tcp',
                  label: 'bind_tcp',
                },
                {
                  value: 'bind_tcp_rc4',
                  label: 'bind_tcp_rc4',
                },
                {
                  value: 'reverse_http',
                  label: 'reverse_http',
                },
                {
                  value: 'reverse_https',
                  label: 'reverse_https',
                },
                {
                  value: 'reverse_tcp',
                  label: 'reverse_tcp',
                },
                {
                  value: 'reverse_tcp_rc4',
                  label: 'reverse_tcp_rc4',
                },

                {
                  value: 'reverse_winhttp',
                  label: 'reverse_winhttp',
                },
                {
                  value: 'reverse_winhttps',
                  label: 'reverse_winhttps',
                },
              ],
            },
            {
              value: 'meterpreter_bind_tcp',
              label: 'meterpreter_bind_tcp',
            },
            {
              value: 'meterpreter_reverse_http',
              label: 'meterpreter_reverse_http',
            },
            {
              value: 'meterpreter_reverse_https',
              label: 'meterpreter_reverse_https',
            },
            {
              value: 'meterpreter_reverse_tcp',
              label: 'meterpreter_reverse_tcp',
            },
          ],
        },
        {
          value: 'meterpreter',
          label: 'meterpreter',
          children: [
            {
              value: 'bind_tcp',
              label: 'bind_tcp',
            },
            {
              value: 'bind_tcp_rc4',
              label: 'bind_tcp_rc4',
            },
            {
              value: 'reverse_http',
              label: 'reverse_http',
            },
            {
              value: 'reverse_https',
              label: 'reverse_https',
            },
            // {
            //   value: 'reverse_https_proxy',
            //   label: 'reverse_https_proxy',
            // },
            {
              value: 'reverse_tcp',
              label: 'reverse_tcp',
            },

            {
              value: 'reverse_tcp_rc4',
              label: 'reverse_tcp_rc4',
            },
            {
              value: 'reverse_winhttp',
              label: 'reverse_winhttp',
            },
            {
              value: 'reverse_winhttps',
              label: 'reverse_winhttps',
            },
          ],
        },
        {
          value: 'meterpreter_bind_tcp',
          label: 'meterpreter_bind_tcp',
        },
        {
          value: 'meterpreter_reverse_http',
          label: 'meterpreter_reverse_http',
        },
        {
          value: 'meterpreter_reverse_https',
          label: 'meterpreter_reverse_https',
        },
        {
          value: 'meterpreter_reverse_tcp',
          label: 'meterpreter_reverse_tcp',
        },
      ],
    },
    {
      value: 'linux',
      label: 'linux',
      children: [
        {
          value: 'x64',
          label: 'x64',
          children: [
            {
              value: 'meterpreter',
              label: 'meterpreter',
              children: [
                {
                  value: 'bind_tcp',
                  label: 'bind_tcp',
                },
                {
                  value: 'reverse_tcp',
                  label: 'reverse_tcp',
                },
              ],
            },

            {
              value: 'meterpreter_reverse_http',
              label: 'meterpreter_reverse_http',
            },
            {
              value: 'meterpreter_reverse_https',
              label: 'meterpreter_reverse_https',
            },
            {
              value: 'meterpreter_reverse_tcp',
              label: 'meterpreter_reverse_tcp',
            },
          ],
        },
        {
          value: 'x86',
          label: 'x86',
          children: [
            {
              value: 'meterpreter',
              label: 'meterpreter',
              children: [
                {
                  value: 'reverse_tcp',
                  label: 'reverse_tcp',
                },
                {
                  value: 'bind_tcp',
                  label: 'bind_tcp',
                },
              ],
            },
            {
              value: 'meterpreter_reverse_http',
              label: 'meterpreter_reverse_http',
            },
            {
              value: 'meterpreter_reverse_https',
              label: 'meterpreter_reverse_https',
            },
            {
              value: 'meterpreter_reverse_tcp',
              label: 'meterpreter_reverse_tcp',
            },
          ],
        },
      ],
    },
    {
      value: 'java',
      label: 'java',
      children: [
        {
          value: 'meterpreter',
          label: 'meterpreter',
          children: [
            {
              value: 'bind_tcp',
              label: 'bind_tcp',
            },
            {
              value: 'reverse_http',
              label: 'reverse_http',
            },
            {
              value: 'reverse_tcp',
              label: 'reverse_tcp',
            },
          ],
        },
      ],
    },
    {
      value: 'php',
      label: 'php',
      children: [
        {
          value: 'meterpreter',
          label: 'meterpreter',
          children: [
            {
              value: 'bind_tcp',
              label: 'bind_tcp',
            },
            {
              value: 'reverse_tcp',
              label: 'reverse_tcp',
            },
          ],
        },
        {
          value: 'meterpreter_reverse_tcp',
          label: 'meterpreter_reverse_tcp',
        },
      ],
    },
    {
      value: 'python',
      label: 'python',
      children: [
        {
          value: 'meterpreter',
          label: 'meterpreter',
          children: [
            {
              value: 'bind_tcp',
              label: 'bind_tcp',
            },
            {
              value: 'reverse_http',
              label: 'reverse_http',
            },
            {
              value: 'reverse_https',
              label: 'reverse_https',
            },
            {
              value: 'reverse_tcp',
              label: 'reverse_tcp',
            },
            {
              value: 'reverse_tcp_ssl',
              label: 'reverse_tcp_ssl',
            },
          ],
        },
        {
          value: 'meterpreter_bind_tcp',
          label: 'meterpreter_bind_tcp',
        },
        {
          value: 'meterpreter_reverse_http',
          label: 'meterpreter_reverse_http',
        },
        {
          value: 'meterpreter_reverse_https',
          label: 'meterpreter_reverse_https',
        },
        {
          value: 'meterpreter_reverse_tcp',
          label: 'meterpreter_reverse_tcp',
        },
      ],
    },
  ];
  const payloadEncoder = [
    'x86/shikata_ga_nai',
    'x86/xor_dynamic',
    'x64/xor',
    'x64/xor_dynamic',
    'cmd/powershell_base64',
  ];

  const changePayloadOption = (value, selectedOptions) => {
    const payload = value.join('/');
    setStateSelectPayload(payload);
    if (payload.includes('reverse')) {
      setShowLhost(true);
      setShowRhost(false);
    } else {
      setShowLhost(false);
      setShowRhost(true);
    }
  };

  const payloadFormatOption = () => {
    let options = [];
    if (selectPayload === null || selectPayload === undefined) {
      return null;
    }
    if (selectPayload.includes('windows')) {
      options = [
        { show: '源码免杀exe', value: 'exe-src' },
        { show: '源码免杀exe(服务)', value: 'exe-src-service' },
        { show: '分离免杀exe', value: 'exe-diy' },
        { show: '分离免杀dll', value: 'dll-diy' },
        { show: '分离免杀dll(mutex)', value: 'dll-mutex-diy' },
        { show: '分离免杀elf', value: 'elf-diy' },
        { show: 'msbuild', value: 'msbuild' },
        { show: 'c', value: 'c' },
        { show: 'csharp', value: 'csharp' },
        { show: 'exe', value: 'exe' },
        { show: 'exe-service', value: 'exe-service' },
        { show: 'powershell', value: 'powershell' },
        { show: 'psh-reflection', value: 'psh-reflection' },
        { show: 'psh-cmd', value: 'psh-cmd' },
        { show: 'python', value: 'python' },
        { show: 'hex', value: 'hex' },
        { show: 'hta-psh', value: 'hta-psh' },
        { show: 'raw', value: 'raw' },
        { show: 'vba', value: 'vba' },
        { show: 'vbscript', value: 'vbscript' },
      ];
    }
    if (selectPayload.includes('linux')) {
      options = [
        { show: '分离免杀elf', value: 'elf-diy' },
        { show: 'raw', value: 'raw' },
        { show: 'hex', value: 'hex' },
        { show: 'elf', value: 'elf' },
        { show: 'c', value: 'c' },
        { show: 'elf-so', value: 'elf-so' },
      ];
    }
    if (selectPayload.includes('java')) {
      options = [
        { show: 'jar', value: 'jar' },
        { show: 'java', value: 'java' },
        { show: 'war', value: 'war' },
      ];
    }
    if (selectPayload.includes('python')) {
      options = [{ show: 'raw', value: 'raw' }, { show: 'python', value: 'python' }];
    }
    if (selectPayload.includes('php')) {
      options = [{ show: 'raw', value: 'raw' }];
    }

    return (
      <FormNew.Item
        {...formLayout}
        label="载荷类型"
        name="Format"
        rules={[
          {
            required: true,
            message: '请选择载荷类型',
          },
        ]}
      >
        <Select style={{ width: 160 }}>
          {options.map((format, i) => (
            <Option value={format.value}>{format.show}</Option>
          ))}
        </Select>
      </FormNew.Item>
    );
  };

  const payloadSpecialOption = () => {
    let rString = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

    let options = [];

    if (selectPayload === null || selectPayload === undefined) {
      return null;
    }
    //添加警告信息
    if (selectPayload.endsWith('reverse_http') || selectPayload.endsWith('reverse_winhttp')) {
      options.push(
        <Row style={{ marginBottom: 16 }}>
          <Col span={14} offset={6}>
            <Alert
              message="reverse_http类型payload不免杀,建议使用reverse_https类型"
              type="warning"
              showIcon
            />
          </Col>
        </Row>,
      );
    }

    if (selectPayload.includes('reverse_https') || selectPayload.includes('reverse_winhttps')) {
      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip title="请选择PEM格式的证书文件,文件内容可以参考<文件列表>中www.example.com.pem,证书文件中需要同时包含公私钥,配置证书后会自动过滤http请求">
              <span>证书文件</span>
            </Tooltip>
          }
          name="HandlerSSLCert"
          rules={[
            {
              required: true,
              message: '请选择证书文件',
            },
          ]}
        >
          <Select placeholder="请选择证书文件">
            {pem_files.map((encoder, i) => (
              <Option value={`~/.msf4/loot/${encoder}`}>{encoder}</Option>
            ))}
          </Select>
        </FormNew.Item>,
      );
      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip title="是否验证Meterpreter中的SSL证书(只对reverse_winhttps及linux类型https监听有效)">
              <span>验证证书</span>
            </Tooltip>
          }
          initialValue
          name="StagerVerifySSLCert"
          valuePropName="checked"
          rules={[
            {
              required: true,
              message: '请选择证书文件',
            },
          ]}
        >
          <Checkbox defaultChecked/>
        </FormNew.Item>,
      );
    }

    if (selectPayload.includes('reverse_http') || selectPayload.includes('reverse_winhttp')) {
      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip title="The HTTP Path">
              <span>LURI</span>
            </Tooltip>
          }
          initialValue={rString}
          name="LURI"
        >
          <Input placeholder="请输入自定义的URI"/>
        </FormNew.Item>,
      );

      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip
              title="The returned HTML response body when the handler receives a request that is not from a payload">
              <span>http服务默认返回报文</span>
            </Tooltip>
          }
          initialValue={'<html><body><h1>It works!</h1></body></html>'}
          name="HttpUnknownRequestResponse"
          rules={[
            {
              required: true,
              message: '请填写http服务默认返回报文',
            },
          ]}
        >
          <TextArea placeholder="请输入Https服务默认返回的报文"/>
        </FormNew.Item>,
      );

      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip title="The user-agent that the payload should use for communication">
              <span>User Agent</span>
            </Tooltip>
          }
          initialValue="Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
          name="HttpUserAgent"
          rules={[
            {
              required: true,
              message: '请输入http的UserAgent',
            },
          ]}
        >
          <TextArea placeholder="请输入https的UserAgent"/>
        </FormNew.Item>,
      );

      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip
              title="Forces a specific host and port instead of using what the client requests, defaults to LHOST:LPORT">
              <span>OverrideRequestHost</span>
            </Tooltip>
          }
          initialValue={false}
          name="OverrideRequestHost"
          valuePropName="checked"
          rules={[]}
        >
          <Checkbox/>
        </FormNew.Item>,
      );
      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip title="An optional value to use for the Host HTTP header">
              <span>HttpHostHeader</span>
            </Tooltip>
          }
          name="HttpHostHeader"
          rules={[]}
        >
          <Input placeholder=""/>
        </FormNew.Item>,
      );
      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip
              title="When OverrideRequestHost is set, use this value as the scheme for secondary requests, e.g http or https">
              <span>OverrideScheme</span>
            </Tooltip>
          }
          name="OverrideScheme"
          rules={[]}
        >
          <Select placeholder="请选择协议">
            <Option value="http">http</Option>
            <Option value="https">https</Option>
          </Select>
        </FormNew.Item>,
      );

      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip title="When OverrideRequestHost is set, use this value as the host name for secondary requests">
              <span>OverrideLHOST</span>
            </Tooltip>
          }
          name="OverrideLHOST"
          rules={[]}
        >
          <Input placeholder=""/>
        </FormNew.Item>,
      );
      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip title="When OverrideRequestHost is set, use this value as the port number for secondary requests">
              <span>OverrideLPORT</span>
            </Tooltip>
          }
          name="OverrideLPORT"
          rules={[]}
        >
          <InputNumber style={{ width: 160 }}/>
        </FormNew.Item>,
      );
    }

    if (selectPayload.includes('rc4')) {
      options.push(
        <FormNew.Item
          {...formLayout}
          label={
            <Tooltip title="Password to derive RC4 key from">
              <span>RC4密码</span>
            </Tooltip>
          }
          initialValue={rString}
          name="RC4PASSWORD"
          rules={[
            {
              required: true,
              message: '请输入RC4协议密码,建议在8位以上',
            },
          ]}
        >
          <Input placeholder="请输入RC4密码"/>
        </FormNew.Item>,
      );
      options.push(
        <FormNew.Item {...formLayout} label="说明">
          <span>RC4初始生成Session时较慢,请耐心等待,Session生成后速度不受影响.</span>
        </FormNew.Item>,
      );
    }

    if (options.length === 0) {
      return null;
    } else {
      return (
        <Panel header="高级参数" key="advance">
          {options}
        </Panel>
      );
    }
  };

  const initListLHostReq = useRequest(() => getCoreSettingAPI({ kind: 'lhost' }), {
    onSuccess: (result, params) => {
      if (result.lhost === null || result.lhost === '') {
        setLhost(location.hostname);
      } else {
        setLhost(result.lhost);
      }
      setPemfiles(result.pem_files);
    },
    onError: (error, params) => {
    },
  });

  const createHandlerReq = useRequest(postMsgrpcHandlerAPI, {
    manual: true,
    onSuccess: (result, params) => {
    },
    onError: (error, params) => {
    },
  });

  const createPayloadReq = useRequest(postMsgrpcPayloadAPI, {
    manual: true,
    onSuccess: (result, params) => {
      // message.success(decodeURI(response.headers.get('Message')));
      createPayloadFinish();
    },
    onError: (error, params) => {
    },
  });

  const onCreatePayloadBySubmit = values => {
    const opts = values;
    const mname = values.PAYLOAD.join('/');
    delete opts.PAYLOAD;
    if (opts.ADD_HANDLER === true) {
      createHandlerReq.run({ opts: { PAYLOAD: mname, ...opts } });
    }
    delete opts.ADD_HANDLER;
    createPayloadReq.run({ mname, opts });
  };

  return (
    <FormNew onFinish={onCreatePayloadBySubmit}>
      <Collapse bordered={false} defaultActiveKey={['base', 'advance']}>
        <Panel header="基础参数" key="base">
          <FormNew.Item
            {...formLayout}
            label="载荷"
            name="PAYLOAD"
            rules={[
              {
                required: true,
                message: '请选择有效载荷',
              },
            ]}
          >
            <Cascader
              options={payloadOptions}
              onChange={changePayloadOption}
              placeholder="请选择有效载荷"
            />
          </FormNew.Item>
          {showRhost ? (
            <FormNew.Item
              {...formLayout}
              label="RHOST"
              name="RHOST"
              rules={[
                {
                  required: true,
                  message: '请输入正向连接的IP地址',
                },
              ]}
            >
              <Input placeholder="请输入正向连接的IP地址"/>
            </FormNew.Item>
          ) : null}
          {showLhost ? (
            <FormNew.Item
              {...formLayout}
              label="LHOST"
              name="LHOST"
              initialValue={lhost}
              rules={[
                {
                  required: true,
                  message: '请输入反向连接的IP地址',
                },
              ]}
            >
              <Input placeholder="请输入反向连接的IP地址"/>
            </FormNew.Item>
          ) : null}
          <FormNew.Item
            {...formLayout}
            label="LPORT"
            name="LPORT"
            rules={[
              {
                required: true,
                message: '请输入端口',
              },
            ]}
          >
            <InputNumber style={{ width: 160 }}/>
          </FormNew.Item>
          {payloadFormatOption()}
        </Panel>
        {payloadSpecialOption()}
        <Panel header="自动化" key="auto">
          <FormNew.Item
            {...formLayout}
            label={
              <Tooltip title="Payload执行后自动迁移到指定进程,请注意 1)必须使用该监听生成的载荷才能生效 2)迁移进程后原进程不会关闭,并且占用loader文件">
                <span>
                  <InfoCircleOutlined/>
                  &nbsp;自动迁移
                </span>
              </Tooltip>
            }
            name="PrependMigrate"
            valuePropName="checked"
            initialValue={false}
            rules={[]}
          >
            <Checkbox/>
          </FormNew.Item>
          <FormNew.Item {...formLayout} label="自动迁移到进程" name="PrependMigrateProc" rules={[]}>
            <Select style={{ width: 200 }} allowClear>
              {migrateProcess.map((encoder, i) => (
                <Option value={encoder}>{encoder}</Option>
              ))}
            </Select>
          </FormNew.Item>
          <FormNew.Item
            {...formLayout}
            label={
              <Tooltip title="生成载荷同时添加对应的监听(生成的监听无法使用代理,无法设置为永久监听,请手工点击刷新按钮刷新)">
                <span>
                  <InfoCircleOutlined/>
                  &nbsp;自动监听
                </span>
              </Tooltip>
            }
            name="ADD_HANDLER"
            valuePropName="checked"
            initialValue={false}
            rules={[]}
          >
            <Checkbox/>
          </FormNew.Item>
        </Panel>

        <Panel header="自定义参数" key="3">
          <FormNew.Item {...formLayout} label="编码" name="Encoder" rules={[]}>
            <Select style={{ width: 200 }} allowClear>
              {payloadEncoder.map((encoder, i) => (
                <Option value={encoder}>{encoder}</Option>
              ))}
            </Select>
          </FormNew.Item>
          <FormNew.Item {...formLayout} label="编码次数" name="Iterations" rules={[]}>
            <InputNumber style={{ width: 160 }}/>
          </FormNew.Item>
          <FormNew.Item
            {...formLayout}
            label="强制编码"
            name="ForceEncode"
            valuePropName="checked"
            initialValue={false}
            rules={[]}
          >
            <Checkbox/>
          </FormNew.Item>

          <FormNew.Item {...formLayout} label="避免字符" name="BadChars" rules={[]}>
            <Input/>
          </FormNew.Item>
          <FormNew.Item
            {...formLayout}
            label="连接超时时间(秒)"
            name="SessionCommunicationTimeout"
            rules={[]}
            initialValue={300}
          >
            <InputNumber style={{ width: 160 }} placeholder="请输入正确的连接超时时间"/>
          </FormNew.Item>
          <FormNew.Item
            {...formLayout}
            label="Session强制过期时间(秒)"
            name="SessionExpirationTimeout"
            rules={[]}
            initialValue={3600 * 24 * 30}
          >
            <InputNumber style={{ width: 160 }} placeholder="请输入正确的强制过期时间"/>
          </FormNew.Item>
          <FormNew.Item
            {...formLayout}
            label="网络断开重试次数"
            name="SessionRetryTotal"
            rules={[]}
            initialValue={3600}
          >
            <InputNumber style={{ width: 160 }} placeholder="请输入正确的强制过期时间"/>
          </FormNew.Item>
          <FormNew.Item
            {...formLayout}
            label="网络断开重试间隔(秒)"
            name="SessionRetryWait"
            rules={[]}
            initialValue={10}
          >
            <InputNumber style={{ width: 160 }} placeholder="请输入正确的强制过期时间"/>
          </FormNew.Item>
        </Panel>
      </Collapse>
      <FormNew.Item style={{ marginTop: 24 }} {...buttonLayout}>
        <Button
          block
          loading={createPayloadReq.loading}
          icon={<BlockOutlined/>}
          htmlType="submit"
          type="primary"
        >
          生成载荷
        </Button>
      </FormNew.Item>
    </FormNew>
  );
};

const PayloadAndHandler = () => {
  console.log('PayloadAndHandler');
  const [createHandlerModalVisible, setCreateHandlerModalVisible] = useState(false);
  const [createPayloadModalVisible, setCreatePayloadModalVisible] = useState(false);
  const [handlerListActive, setHandlerListActive] = useState([]);
  //初始化数据
  const initListHanderReq = useRequest(getMsgrpcHandlerAPI, {
    onSuccess: (result, params) => {
      setHandlerListActive(result);
    },
    onError: (error, params) => {
    },
  });

  const listHanderReq = useRequest(getMsgrpcHandlerAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setHandlerListActive(result);
    },
    onError: (error, params) => {
    },
  });

  const createHandlerReq = useRequest(postMsgrpcHandlerAPI, {
    manual: true,
    onSuccess: (result, params) => {
      listHanderReq.run();
    },
    onError: (error, params) => {
    },
  });

  const onCreateHandlerByVirtual = params => {
    params.timestamp = Date.parse(new Date()) / 1000;
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
    },
  });
  const createPayloadReq = useRequest(postMsgrpcPayloadAPI, {
    manual: true,
    onSuccess: (result, params) => {
    },
    onError: (error, params) => {
    },
  });

  const onCreatePayloadByHandler = params => {
    params.Format = 'AUTO';
    createPayloadReq.run({ mname: params.PAYLOAD, opts: params });
  };

  const createHandlerFinish = () => {
    setCreateHandlerModalVisible(false);
    listHanderReq.run();
  };
  const createPayloadFinish = () => {
    setCreatePayloadModalVisible(false);
  };
  const handlerDetail = item => {
    const Descriptions_Items = [];
    let showstr = null;
    for (const key in item) {
      if (item[key] === null || item[key] === '') {
        continue;
      } else if (item[key] === true || item[key] === false) {
        showstr = item[key] ? 'True' : 'False';
      } else {
        showstr = item[key];
      }
      Descriptions_Items.push(<Descriptions.Item label={key}>{showstr}</Descriptions.Item>);
    }
    Modal.info({
      mask: false,
      style: { top: 20 },
      width: '95%',
      icon: '',
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
      },
    });
  };

  return (
    <Fragment>
      <Row style={{ marginTop: -16 }} gutter={0}>
        <Col span={8}>
          <Button
            block
            icon={<CustomerServiceOutlined/>}
            onClick={() => setCreateHandlerModalVisible(true)}
          >
            新增监听
          </Button>
        </Col>
        <Col span={8}>
          <Button
            loading={createPayloadReq.loading}
            block
            icon={<BlockOutlined/>}
            onClick={() => setCreatePayloadModalVisible(true)}
          >
            生成载荷
          </Button>
        </Col>
        <Col span={8}>
          <Button
            icon={<SyncOutlined/>}
            style={{
              width: '100%',
            }}
            loading={listHanderReq.loading || createHandlerReq.loading || destoryHandlerReq.loading}
            onClick={() => listHanderReq.run()}
          >
            刷新
          </Button>
        </Col>
      </Row>
      <Card style={{ marginTop: 0 }} bodyStyle={{ padding: '0px 0px 0px 0px' }}>
        <Table
          className={styles.handlerTable}
          size="small"
          bordered
          pagination={false}
          rowKey="ID"
          dataSource={handlerListActive}
          columns={[
            {
              title: 'ID',
              dataIndex: 'ID',
              key: 'ID',
              width: 48,
              render: (text, record) =>
                record.ID >= 0 ? (
                  <Avatar
                    style={{ backgroundColor: '#49aa19', width: '100%' }}
                    shape="square"
                    size={24}
                  >
                    <Tooltip placement="right" title="真实监听">
                      {record.ID}
                    </Tooltip>
                  </Avatar>
                ) : (
                  <Avatar style={{ width: '100%' }} shape="square" size={24}>
                    <Tooltip placement="right" title="虚拟监听">
                      {-record.ID}
                    </Tooltip>
                  </Avatar>
                ),
            },
            {
              title: '载荷',
              dataIndex: 'PAYLOAD',
              key: 'PAYLOAD',
              width: 280,
              render: (text, record) => record.PAYLOAD,
            },
            {
              title: 'LHOST/RHOST',
              dataIndex: 'PAYLOAD',
              key: 'PAYLOAD',
              width: 136,
              render: (text, record) => {
                if (record.RHOST !== undefined && record.RHOST !== null) {
                  return <span>{record.RHOST}</span>;
                }
                if (record.LHOST !== undefined && record.LHOST !== null) {
                  return <span>{record.LHOST}</span>;
                }
                return null;
              },
            },
            {
              title: 'PORT',
              dataIndex: 'LPORT',
              key: 'LPORT',
              width: 64,
              render: (text, record) => <span>{record.LPORT}</span>,
            },
            {
              title: '其他参数',
              dataIndex: 'PAYLOAD',
              key: 'PAYLOAD',
              render: (text, record) => {
                const items = [];

                if (record.LURI !== undefined && record.LURI !== null) {
                  items.push(<span>{` LURI: ${record.LURI}`}</span>);
                }
                if (record.HandlerSSLCert !== undefined && record.HandlerSSLCert !== null) {
                  const pos = record.HandlerSSLCert.lastIndexOf('/');
                  items.push(<span>{` 证书: ${record.HandlerSSLCert.substr(pos + 1)}`}</span>);
                }

                if (record.RC4PASSWORD !== undefined && record.RC4PASSWORD !== null) {
                  items.push(<span>{` RC4密码: ${record.RC4PASSWORD}`}</span>);
                }
                if (record.proxies !== undefined && record.proxies !== null) {
                  items.push(<span>{` 代理: ${record.proxies}`}</span>);
                }
                return <Space style={{ display: 'flex' }}>{items}</Space>;
              },
            },
            {
              title: '别名',
              dataIndex: 'HandlerName',
              key: 'HandlerName',
              render: (text, record) => record.HandlerName,
            },
            {
              title: '操作',
              dataIndex: 'operation',
              width: 256,
              render: (text, record) => {
                let transformAction = null;
                if (record.ID >= 0) {
                  transformAction = (
                    <a style={{ color: '#faad14' }} onClick={() => onCreateVirtualHandler(record)}>
                      虚拟化
                    </a>
                  );
                } else {
                  transformAction = (
                    <a
                      style={{ color: '#faad14' }}
                      onClick={() => onCreateHandlerByVirtual(record)}
                    >
                      实例化
                    </a>
                  );
                }
                return (
                  <div style={{ textAlign: 'center' }}>
                    <Space size="middle">
                      <a
                        style={{ color: 'green' }}
                        onClick={() => onCreatePayloadByHandler(record)}
                      >
                        生成载荷
                      </a>
                      <a onClick={() => handlerDetail(record)}>详细参数</a>
                      {transformAction}
                      <a
                        onClick={() => destoryHandlerReq.run({ jobid: record.ID })}
                        style={{ color: 'red' }}
                      >
                        删除
                      </a>
                    </Space>
                  </div>
                );
              },
            },
          ]}
        />
      </Card>
      <Modal
        // title="添加监听"
        style={{ top: 20 }}
        width="60vw"
        bodyStyle={{ padding: '0px 0px 1px 0px' }}
        destroyOnClose
        visible={createHandlerModalVisible}
        footer={null}
        onCancel={() => setCreateHandlerModalVisible(false)}
      >
        <CreateHandlerModalContent createHandlerFinish={createHandlerFinish}/>
      </Modal>
      <Modal
        // title="生成载荷"
        style={{ top: 20 }}
        width="60vw"
        bodyStyle={{ padding: '0px 0px 2px 0px' }}
        destroyOnClose
        visible={createPayloadModalVisible}
        footer={null}
        onCancel={() => setCreatePayloadModalVisible(false)}
      >
        <CreatePayloadModalContent createPayloadFinish={createPayloadFinish}/>
      </Modal>
    </Fragment>
  );
};
export const PayloadAndHandlerMemo = memo(PayloadAndHandler);
export default PayloadAndHandler;

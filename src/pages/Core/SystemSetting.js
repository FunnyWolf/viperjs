import React, { Fragment, memo, useState } from 'react';
import {
  getCoreSettingAPI,
  getServiceStatusAPI,
  postCoreSettingAPI,
  putPostmodulePostModuleConfigAPI,
} from '@/services/apiv1';
import { history, useModel, useRequest } from 'umi';
import '@ant-design/compatible/assets/index.css';
import { setToken } from '@/utils/authority';
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  List,
  message,
  Row,
  Select,
  Space,
  Switch,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import {
  CheckOutlined,
  DeliveredProcedureOutlined,
  LogoutOutlined,
  MinusOutlined,
  ReloadOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useLocalStorageState } from 'ahooks';
import styles from '@/components/GlobalHeader/index.less';
import { reloadAuthorized } from '@/utils/Authorized';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

const viper_version = '1.2.3';
const viper_update_date = '20210228';
const datas = [
  {
    name: 'metasploit-framework',
    url: 'https://github.com/rapid7/metasploit-framework/blob/master/LICENSE',
  },
  {
    name: 'ant-design-pro',
    url: 'https://github.com/ant-design/ant-design-pro/blob/master/LICENSE',
  },
  {
    name: 'django-rest-framework',
    url: 'https://github.com/encode/django-rest-framework/blob/master/LICENSE.md',
  },
];

const buttonItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 4,
    },
  },
};

const inputItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};


const SystemSetting = () => {
  console.log('SystemSetting');
  const [viperDebugFlag, setViperDebugFlag] = useLocalStorageState('viper-debug-flag', false);
  return (
    <Fragment>
      <Tabs style={{ marginTop: -16 }} type="card" defaultActiveKey="system_info">
        <TabPane tab="关于VIPER" key="system_info">
          <SystemInfo/>
        </TabPane>
        <TabPane tab="网络配置" key="lhost">
          <Card style={{ marginTop: -16 }}>
            <Row>
              <Col span={16}>
                <LHostForm/>
              </Col>
              <Col span={8}>
                <Typography>
                  <Paragraph>
                    <Title level={4}>配置说明</Title>
                    <Text strong>回连地址</Text>填写为VPS的互联网IP/域名
                    <br/>
                    <Text>VIPER已占用端口.</Text>
                    <br/>
                    Nginx:<Text code>0.0.0.0:60000</Text>
                    <br/>
                    Redis:<Text code>127.0.0.1:60004</Text>
                    <br/>
                    Msfrpcd:<Text code>127.0.0.1:60005</Text>
                    <br/>
                    SSH(默认关闭):<Text code>127.0.0.1:60010</Text>
                  </Paragraph>
                </Typography>
              </Col>
            </Row>
          </Card>
        </TabPane>
        {viperDebugFlag ? <TabPane tab="FOFA API" key="FOFA">
          <Card style={{ marginTop: -16 }}>
            <Row>
              <Col span={16}>
                <FOFAForm/>
              </Col>
              <Col span={8}>
                <Typography>
                  <Paragraph>
                    <Title level={4}>配置方法</Title>
                    <Text>申请开通FOFA会员/账号,获取邮箱及key</Text>
                    <br/>
                    <Text>参考 : </Text>
                    <a href="https://fofa.so/static_pages/api_help">FOFA API教程</a>
                  </Paragraph>
                </Typography>
              </Col>
            </Row>
          </Card>
        </TabPane> : null}
        <TabPane tab="Server酱 Bot" key="serverchan">
          <Card style={{ marginTop: -16 }}>
            <Row>
              <Col span={16}>
                <ServerChanForm/>
              </Col>
              <Col span={8}>
                <Typography>
                  <Paragraph>
                    <Title level={4}>配置方法</Title>
                    <Text>登录Server酱,配置消息通道,获取SendKey,填入SendKey.</Text>
                    <br/>
                    <Text>参考:</Text>
                    <a
                      target="_blank"
                      href="https://sct.ftqq.com/"
                    >
                      Server酱·Turbo版
                    </a>
                  </Paragraph>
                </Typography>
              </Col>
            </Row>
          </Card>
        </TabPane>
        <TabPane tab="DingDing Bot" key="dingding">
          <Card style={{ marginTop: -16 }}>
            <Row>
              <Col span={16}>
                <DingDingForm/>
              </Col>
              <Col span={8}>
                <Typography>
                  <Paragraph>
                    <Title level={4}>配置方法</Title>
                    <Text>新建一个DingDing Bot,并获取Token.</Text>
                    <br/>
                    <Text>参考:</Text>
                    <a
                      target="_blank"
                      href="https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq">
                      获取自定义机器人webhook
                    </a>
                  </Paragraph>
                </Typography>
              </Col>
            </Row>
          </Card>
        </TabPane>
        <TabPane tab="Telegram Bot" key="telegram">
          <Card style={{ marginTop: -16 }}>
            <Row>
              <Col span={16}>
                <TelegramForm/>
              </Col>
              <Col span={8}>
                <Typography>
                  <Paragraph>
                    <Title level={4}>配置方法</Title>
                    <Text>新建一个Telegram Bot,并获取Token.</Text>
                    <br/>
                    <Text>参考:</Text>
                    <a
                      target="_blank"
                      href="https://longnight.github.io/2018/12/12/Telegram-Bot-notifications">
                      使用Telegram Bot来实现推送通知
                    </a>
                    <br/>
                    <Text>
                      Chat_id可以填写多个
                      <br/>
                      填写token及proxy后点击<Text strong>获取chat_id</Text>
                      获取备选chat_id列表
                    </Text>
                  </Paragraph>
                </Typography>
              </Col>
            </Row>
          </Card>
        </TabPane>
        <TabPane tab="Session监控" key="sessionmonitor">
          <Card style={{ marginTop: -16 }}>
            <Row>
              <Col xs={24} sm={16}>
                <SessionMonitorForm/>
              </Col>
              <Col span={8}>
                <Typography>
                  <Paragraph>
                    <Title level={4}>配置说明</Title>
                    <Text>
                      当激活Session监控后,每当平台新增Session时都会发送通知.
                      需要结合Bot使用.
                    </Text>
                    <br/>
                  </Paragraph>
                </Typography>
              </Col>
            </Row>
          </Card>
        </TabPane>

      </Tabs>
    </Fragment>
  );
};

export const SystemSettingMemo = memo(SystemSetting);

const SystemInfo = () => {
  const {
    setPostModuleConfigListStateAll,
  } = useModel('HostAndSessionModel', model => ({
    setPostModuleConfigListStateAll: model.setPostModuleConfigListStateAll,
  }));
  const [serviceStatusActive, setServiceStatusActive] = useState({ json_rpc: { status: false } });
  const [viperDebugFlag, setViperDebugFlag] = useLocalStorageState('viper-debug-flag', false);
  //初始化数据
  const initListServiceStatusReq = useRequest(getServiceStatusAPI, {
    onSuccess: (result, params) => {
      setServiceStatusActive(result);
    },
    onError: (error, params) => {
    },
  });

  const listServiceStatusReq = useRequest(getServiceStatusAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setServiceStatusActive(result);
    },
    onError: (error, params) => {
    },
  });

  const updatePostmodulePostModuleConfigReq = useRequest(putPostmodulePostModuleConfigAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setPostModuleConfigListStateAll(result);
    },
    onError: (error, params) => {
    },
  });

  const loginOut = () => {
    const { query, pathname } = history.location;
    const { redirect } = query;
    setToken('guest');
    reloadAuthorized();
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
      });
    }
  };

  return (
    <Card style={{ marginTop: -16 }}>
      <Row>
        <Col span={18}>
          <Row>
            <Descriptions size="small" style={{ marginLeft: 64 }} column={6}>
              <Descriptions.Item label="渗透服务">
                {serviceStatusActive.json_rpc.status ? (
                  <Tag color="green">正常</Tag>
                ) : (
                  <Tag color="red">不可用</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="平台版本">
                <Tag color="geekblue">{viper_version}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                <Tag color="geekblue">{viper_update_date}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="使用文档">
                <a
                  target="_blank"
                  href="https://www.yuque.com/funnywolfdoc/viperdoc"
                  className={styles.action}
                >
                  网页链接
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="问题反馈">
                <a
                  target="_blank"
                  href="https://www.yuque.com/funnywolfdoc/viperdoc/qmanm1"
                  // rel="noopener noreferrer"
                  className={styles.action}
                >
                  网页链接
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="实验功能">
                <Switch
                  checkedChildren={<CheckOutlined/>}
                  unCheckedChildren={<MinusOutlined/>}
                  checked={viperDebugFlag}
                  onClick={() => {
                    setViperDebugFlag(!viperDebugFlag);
                    message.info('刷新页面后生效');
                  }}
                />
              </Descriptions.Item>

            </Descriptions>
          </Row>
          <Row>
            <Space
              style={{ marginTop: 16, marginLeft: 64 }}
            >
              <Button

                icon={<SyncOutlined/>}
                onClick={() => listServiceStatusReq.run()}
                loading={listServiceStatusReq.loading}
              >
                更新渗透服务
              </Button>
              <Button
                type="primary"
                icon={<ReloadOutlined/>}
                onClick={() => updatePostmodulePostModuleConfigReq.run()}
                loading={updatePostmodulePostModuleConfigReq.loading}
              >
                重载所有模块
              </Button>
              <Button
                danger
                icon={<LogoutOutlined/>}
                onClick={loginOut}>
                退出平台
              </Button>

            </Space>
          </Row>
        </Col>
        <Col span={6}>
          <List
            size="small"
            header={<div>平台使用以下开源软件</div>}
            bordered
            dataSource={datas}
            renderItem={item => (
              <List.Item>
                <Typography.Text>{item.name}</Typography.Text> <a href={item.url}>LICENSE</a>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </Card>
  );
};

const SessionMonitorForm = props => {
  const [sessionMonitorForm] = Form.useForm();
  const [settingsSessionMonitor, setSettingsSessionMonitor] = useState({});

  //初始化数据
  const initListSessionMonitorReq = useRequest(() => getCoreSettingAPI({ kind: 'sessionmonitor' }), {
    onSuccess: (result, params) => {
      setSettingsSessionMonitor(result);
      sessionMonitorForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    },
  });

  const updateSessionMonitorReq = useRequest(postCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSettingsSessionMonitor(result);
      sessionMonitorForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    },
  });

  const onUpdateSessionMonitor = () => {
    let params = {
      kind: 'sessionmonitor',
      tag: 'default',
      setting: {
        flag: !settingsSessionMonitor.flag,
      },
    };
    updateSessionMonitorReq.run(params);
  };

  return (
    <Form {...inputItemLayout}>
      <Form.Item label="开关">
        <Switch
          checkedChildren={<CheckOutlined/>}
          unCheckedChildren={<MinusOutlined/>}
          checked={settingsSessionMonitor.flag}
          onClick={() => onUpdateSessionMonitor()}
        />
      </Form.Item>
    </Form>
  );
};
const TelegramForm = props => {
  const [telegramForm] = Form.useForm();
  const [settingsTelegram, setSettingsTelegram] = useState({});
  const [userChatIdList, setUserChatIdList] = useState([]);
  const chat_id_options = userChatIdList.map(d => (
    <Option label={d.chat_id} key={d.chat_id}>
      {d.user + ' : ' + d.chat_id}
    </Option>
  ));
  //初始化数据
  const initListTelegramReq = useRequest(() => getCoreSettingAPI({ kind: 'telegram' }), {
    onSuccess: (result, params) => {
      setSettingsTelegram(result);
      telegramForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    },
  });

  const updateTelegramReq = useRequest(postCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      if (params.tag === 'check') {
        setUserChatIdList(result);
      } else {
        setSettingsTelegram(result);
      }
      telegramForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    },
  });

  const onUpdateTelegram = values => {
    let params = {};
    if (values.chat_id === '' || values.chat_id === undefined) {
      params = {
        kind: 'telegram',
        tag: 'check',
        setting: { ...values },
      };
    } else {
      params = {
        kind: 'telegram',
        tag: 'default',
        setting: { ...values },
      };
    }

    updateTelegramReq.run(params);
  };

  return (
    <Form
      onFinish={onUpdateTelegram}
      form={telegramForm}
      {...inputItemLayout}
    >
      <Form.Item
        label="token"
        name="token"
        rules={[
          {
            required: true,
            message: '请输入token',
          },
        ]}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        label="chat_id"
        name="chat_id"
        rules={[]}
      >
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="请选择或输入chat_id"
          defaultValue={[]}
          optionLabelProp="label"
        >
          {chat_id_options}
        </Select>
      </Form.Item>

      <Form.Item
        label="proxy"
        name="proxy"
        rules={[]}
      >
        <Input/>
      </Form.Item>
      <Form.Item label="状态">
        {settingsTelegram.alive ? (
          <Badge status="processing" text="正常"/>
        ) : (
          <Badge status="error" text="不可用"/>
        )}
      </Form.Item>
      <Form.Item {...buttonItemLayout}>
        <Button
          icon={<DeliveredProcedureOutlined/>}
          type="primary"
          htmlType="submit"
          loading={updateTelegramReq.loading}
        >
          更新/获取chat_id
        </Button>
      </Form.Item>
    </Form>
  );
};

const DingDingForm = props => {
  const [dingdingForm] = Form.useForm();
  const [settingsDingDing, setSettingsDingDing] = useState({});

  //初始化数据
  const initListDingDingReq = useRequest(() => getCoreSettingAPI({ kind: 'dingding' }), {
    onSuccess: (result, params) => {
      setSettingsDingDing(result);
      dingdingForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    },
  });

  const updateDingDingReq = useRequest(postCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSettingsDingDing(result);
      dingdingForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    },
  });

  const onUpdateDingDing = values => {
    let params = {
      kind: 'dingding',
      tag: 'default',
      setting: { ...values },
    };
    updateDingDingReq.run(params);
  };

  return (
    <Form
      onFinish={onUpdateDingDing}
      form={dingdingForm}
      {...inputItemLayout}
    >
      <Form.Item
        label="access_token"
        name="access_token"
        rules={[
          {
            required: true,
            message: '请输入access_token',
          },
        ]}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        label="自定义关键词"
        name="keyword"
        rules={[
          {
            required: true,
            message: '请输入自定义关键词',
          },
        ]}
      >
        <Input/>
      </Form.Item>
      <Form.Item label="状态">
        {settingsDingDing.alive ? (
          <Badge status="processing" text="正常"/>
        ) : (
          <Badge status="error" text="不可用"/>
        )}
      </Form.Item>
      <Form.Item {...buttonItemLayout}>
        <Button
          icon={<DeliveredProcedureOutlined/>}
          type="primary"
          htmlType="submit"
          loading={updateDingDingReq.loading}
        >
          更新
        </Button>
      </Form.Item>
    </Form>
  );
};


const ServerChanForm = props => {
  const [serverchanForm] = Form.useForm();
  const [settingsServerChan, setSettingsServerChan] = useState({ sendkey: null, alive: false });

  //初始化数据
  const initListServerChanReq = useRequest(() => getCoreSettingAPI({ kind: 'serverchan' }), {
    onSuccess: (result, params) => {
      setSettingsServerChan(result);
      serverchanForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    },
  });

  const updateServerChanReq = useRequest(postCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSettingsServerChan(result);
      serverchanForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    },
  });

  const onUpdateServerChan = values => {
    let params = {
      kind: 'serverchan',
      tag: 'default',
      setting: { ...values },
    };
    updateServerChanReq.run(params);
  };

  return (
    <Form
      onFinish={onUpdateServerChan}
      form={serverchanForm}
      {...inputItemLayout}
    >
      <Form.Item
        label="SendKey"
        name="sendkey"
        rules={[
          {
            required: true,
            message: '请输入SendKey',
          },
        ]}
      >
        <Input/>
      </Form.Item>
      <Form.Item label="状态">
        {settingsServerChan.alive ? (
          <Badge status="processing" text="正常"/>
        ) : (
          <Badge status="error" text="不可用"/>
        )}
      </Form.Item>
      <Form.Item {...buttonItemLayout}>
        <Button
          icon={<DeliveredProcedureOutlined/>}
          type="primary"
          htmlType="submit"
          loading={updateServerChanReq.loading}
        >
          更新
        </Button>
      </Form.Item>
    </Form>
  );
};

const FOFAForm = props => {
  const [fofaForm] = Form.useForm();
  const [settingsFOFA, setSettingsFOFA] = useState({});

  //初始化数据
  const initListFOFAReq = useRequest(() => getCoreSettingAPI({ kind: 'FOFA' }), {
    onSuccess: (result, params) => {
      setSettingsFOFA(result);
      fofaForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    },
  });

  const updateFOFAReq = useRequest(postCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSettingsFOFA(result);
      fofaForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    },
  });

  const onUpdateFOFA = values => {
    let params = {
      kind: 'FOFA',
      tag: 'default',
      setting: { ...values },
    };
    updateFOFAReq.run(params);
  };

  return (
    <Form
      form={fofaForm}
      onFinish={onUpdateFOFA}
      {...inputItemLayout}>
      <Form.Item
        label="email"
        name="email"
        rules={[
          {
            required: true,
            message: '请输入email',
          },
        ]}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        label="key"
        name="key"
        rules={[
          {
            required: true,
            message: '请输入key',
          },
        ]}
      >
        <Input/>
      </Form.Item>
      <Row>
        <Col span={4}>
        </Col>
        <Col
          style={{ marginTop: -16, marginBottom: 8 }}
          span={4}>
          {settingsFOFA.alive ? (
            <Badge status="processing" text="正常"/>
          ) : (
            <Badge status="error" text="不可用"/>
          )}
        </Col>
      </Row>
      <Form.Item {...buttonItemLayout}>
        <Space>
          <Button
            icon={<DeliveredProcedureOutlined/>}
            type="primary"
            htmlType="submit"
            loading={updateFOFAReq.loading}
          >
            更新
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};


const LHostForm = props => {
  const [lHostForm] = Form.useForm();
  const lHostFormLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const buttonLHostFormLayout = {
    wrapperCol: {
      span: 16,
      offset: 4,
    },
  };

  const [lhost, setLhost] = useState({});
  //初始化数据
  const initListLHostReq = useRequest(() => getCoreSettingAPI({ kind: 'lhost' }), {
    onSuccess: (result, params) => {
      lHostForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    },
  });

  const updateLHostReq = useRequest(postCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      lHostForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    },
  });

  const onUpdateLhost = values => {
    let params = {
      kind: 'lhost',
      setting: { ...values },
    };
    updateLHostReq.run(params);
  };

  return (
    <Form
      form={lHostForm}
      initialValue={lhost}
      onFinish={onUpdateLhost}
      {...lHostFormLayout}>
      <Form.Item
        label="回连地址"
        name="lhost"

        rules={[
          {
            required: true,
            message: '请输入默认的回连地址(VPS的互联网IP/域名)',
          },
        ]}
      >
        <Input style={{ width: '80%' }} placeholder="VPS的互联网IP/域名"/>
      </Form.Item>

      <Form.Item {...buttonLHostFormLayout}>
        <Button
          icon={<DeliveredProcedureOutlined/>}
          type="primary"
          htmlType="submit"
          loading={updateLHostReq.loading}
        >
          更新
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SystemSetting;

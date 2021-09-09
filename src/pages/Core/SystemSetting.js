import React, { memo, useState } from 'react';
import {
  getCoreSettingAPI,
  getServiceStatusAPI,
  postCoreSettingAPI,
  putPostmodulePostModuleConfigAPI,
} from '@/services/apiv1';
import { history, useModel, useRequest } from 'umi';

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
  Popover,
  Radio,
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

import { reloadAuthorized } from '@/utils/Authorized';
import { formatText } from '@/utils/locales';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

const viper_version = 'v1.4.2';
const viper_update_date = '2021-09-05';


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
  return (
    <Tabs style={{ marginTop: -16 }} type="card" defaultActiveKey="system_info">
      <TabPane tab={formatText('app.systemsetting.aboutviper')} key="system_info">
        <SystemInfo/>
      </TabPane>
      <TabPane tab="360Quake API" key="360Quake">
        <QuakeForm/>
      </TabPane>
      <TabPane tab="FOFA API" key="FOFA">
        <FOFAForm/>
      </TabPane>
      <TabPane tab={formatText('app.systemsetting.serverchan')} key="serverchan">
        <ServerChanForm/>
      </TabPane>
      <TabPane tab="DingDing Bot" key="dingding">
        <DingDingForm/>
      </TabPane>
      <TabPane tab="Telegram Bot" key="telegram">
        <TelegramForm/>
      </TabPane>
      <TabPane tab={formatText('app.systemsetting.sessionmonitor')} key="sessionmonitor">
        <SessionMonitorForm/>
      </TabPane>
      <TabPane tab={formatText('app.systemsetting.networkconfig')} key="lhost">
        <LHostForm/>
      </TabPane>
    </Tabs>
  );
};

export const SystemSettingMemo = memo(SystemSetting);

const SystemInfo = () => {
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
  const { setPostModuleConfigListStateAll } = useModel('HostAndSessionModel', model => ({
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
        <Descriptions size="small" style={{ marginLeft: 64 }} column={6}>

          <Descriptions.Item label={formatText('app.systemsetting.version')}>
            <Tag color="blue">{viper_version}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={formatText('app.systemsetting.updatedate')}>
            <Tag color="blue">{viper_update_date}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={formatText('app.systemsetting.lastversion')}>
            <a
              target="_blank"
              href="https://github.com/FunnyWolf/Viper/releases"
            >
              Github Releases
            </a>
          </Descriptions.Item>
          <Descriptions.Item label={formatText('app.systemsetting.documentation')}>
            <a target="_blank" href="https://www.yuque.com/vipersec">
              {formatText('app.systemsetting.documentationlink')}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label={formatText('app.systemsetting.opensourcesoftware')}>
            <Popover content={
              <List
                size="small"
                bordered
                dataSource={datas}
                renderItem={item => (
                  <List.Item>
                    <a href={item.url}>{item.name}</a>
                  </List.Item>
                )}
              />}
                     placement="left"
                     trigger="click">
              <a>
                {formatText('app.systemsetting.opensourcesoftwarelink')}
              </a>
            </Popover>
          </Descriptions.Item>
        </Descriptions>
      </Row>
      <Row>
        <Descriptions size="small" style={{ marginLeft: 64, marginTop: 16 }} column={6}>
          <Descriptions.Item label={formatText('app.systemsetting.msfstatus')}>
            <Space>{serviceStatusActive.json_rpc.status ? (
              <Tag color="green">{formatText('app.core.working')}</Tag>
            ) : (
              <Tag color="red">{formatText('app.core.error')}</Tag>
            )}
              <Button
                size="small"
                style={{ width: 48 }}
                icon={<SyncOutlined/>}
                onClick={() => listServiceStatusReq.run()}
                loading={listServiceStatusReq.loading}
              >
              </Button>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label={formatText('app.systemsetting.betafunction')}>
            <Switch
              checkedChildren={<CheckOutlined/>}
              unCheckedChildren={<MinusOutlined/>}
              checked={viperDebugFlag}
              onClick={() => {
                setViperDebugFlag(!viperDebugFlag);
                message.info(formatText('app.systemsetting.reloadpage'));
              }}
            />
          </Descriptions.Item>

        </Descriptions>
      </Row>
      <Row>
        <Space style={{ marginTop: 16, marginLeft: 64 }}>
          <Button
            type="primary"
            icon={<ReloadOutlined/>}
            onClick={() => updatePostmodulePostModuleConfigReq.run()}
            loading={updatePostmodulePostModuleConfigReq.loading}
          >
            {formatText('app.systemsetting.reloadallmodule')}
          </Button>
          <Button danger icon={<LogoutOutlined/>} onClick={loginOut}>
            {formatText('app.systemsetting.logout')}
          </Button>
        </Space>
      </Row>
    </Card>
  );
};

const SessionMonitorForm = props => {
  const [sessionMonitorForm] = Form.useForm();
  const [settingsSessionMonitor, setSettingsSessionMonitor] = useState({});

  //初始化数据
  const initListSessionMonitorReq = useRequest(
    () => getCoreSettingAPI({ kind: 'sessionmonitor' }),
    {
      onSuccess: (result, params) => {
        setSettingsSessionMonitor(result);
        sessionMonitorForm.setFieldsValue(result);
      },
      onError: (error, params) => {
      },
    },
  );

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

  return (<Card style={{ marginTop: -16 }}>
    <Row>
      <Col xs={24} sm={16}>
        <Form {...inputItemLayout}>
          <Form.Item label={formatText('app.systemsetting.switch')}>
            <Switch
              checkedChildren={<CheckOutlined/>}
              unCheckedChildren={<MinusOutlined/>}
              checked={settingsSessionMonitor.flag}
              onClick={() => onUpdateSessionMonitor()}
            />
          </Form.Item>
        </Form>
      </Col>
      <Col span={8}>
        <Typography>
          <Paragraph>
            <Title level={4}>{formatText('app.systemsetting.howtoconfig')}</Title>
            <Text>
              {formatText('app.systemsetting.sessionmonitorreadme')}
            </Text>
            <br/>
          </Paragraph>
        </Typography>
      </Col>
    </Row>
  </Card>);
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

  return (<Card style={{ marginTop: -16 }}>
    <Row>
      <Col span={16}>
        <Form onFinish={onUpdateTelegram} form={telegramForm} {...inputItemLayout}>
          <Form.Item
            label="token"
            name="token"
            rules={[
              {
                required: true,
                message: formatText('app.systemsetting.inputtoken'),
              },
            ]}
          >
            <Input/>
          </Form.Item>
          <Form.Item label="chat_id" name="chat_id" rules={[]}>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder={formatText('app.systemsetting.selectorinputchatid')}
              defaultValue={[]}
              optionLabelProp="label"
            >
              {chat_id_options}
            </Select>
          </Form.Item>

          <Form.Item label="proxy" name="proxy" rules={[]}>
            <Input/>
          </Form.Item>
          <Row>
            <Col style={{ marginBottom: 24 }} span={4} offset={4}>
              {settingsTelegram.alive ? (
                <Badge status="processing" text={formatText('app.core.working')}/>
              ) : (
                <Badge status="error" text={formatText('app.core.error')}/>
              )}
            </Col>
          </Row>
          <Form.Item {...buttonItemLayout}>
            <Button
              icon={<DeliveredProcedureOutlined/>}
              type="primary"
              htmlType="submit"
              loading={updateTelegramReq.loading}
            >
              {formatText('app.systemsetting.updateorgetchatid')}
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={8}>
        <Typography>
          <Paragraph>
            <Title level={4}>{formatText('app.systemsetting.howtoconfig')}</Title>
            <Text>{formatText('app.systemsetting.opentelegram')}</Text>
            <br/>
            <a
              target="_blank"
              href="https://longnight.github.io/2018/12/12/Telegram-Bot-notifications"
            >
              {formatText('app.systemsetting.telegramreadme')}
            </a>
            <br/>
            <Text>
              {formatText('app.systemsetting.telegramdoc_1')}
              <br/>
              {formatText('app.systemsetting.telegramdoc_2')}
              <Text code>{formatText('app.systemsetting.updateorgetchatid')}</Text>
              {formatText('app.systemsetting.telegramdoc_3')}
            </Text>
          </Paragraph>
        </Typography>
      </Col>
    </Row>
  </Card>);
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

  return (<Card style={{ marginTop: -16 }}>
    <Row>
      <Col span={16}>
        <Form onFinish={onUpdateDingDing} form={dingdingForm} {...inputItemLayout}>
          <Form.Item
            label="access_token"
            name="access_token"
            rules={[
              {
                required: true,
                message: formatText('app.systemsetting.dingdingrules'),
              },
            ]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label={formatText('app.systemsetting.keyword')}
            name="keyword"
            rules={[
              {
                required: true,
                message: formatText('app.systemsetting.inputkeyword'),
              },
            ]}
          >
            <Input/>
          </Form.Item>
          <Row>
            <Col style={{ marginBottom: 24 }} span={4} offset={4}>
              {settingsDingDing.alive ? (
                <Badge status="processing" text={formatText('app.core.working')}/>
              ) : (
                <Badge status="error" text={formatText('app.core.error')}/>
              )}
            </Col>
          </Row>
          <Form.Item {...buttonItemLayout}>
            <Button
              icon={<DeliveredProcedureOutlined/>}
              type="primary"
              htmlType="submit"
              loading={updateDingDingReq.loading}
            >
              {formatText('app.core.update')}
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={8}>
        <Typography>
          <Paragraph>
            <Title level={4}>{formatText('app.systemsetting.howtoconfig')}</Title>
            <Text>{formatText('app.systemsetting.opendingding')}</Text>
            <br/>
            <a target="_blank" href="https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq">
              {formatText('app.systemsetting.dingdingreadme')}
            </a>
          </Paragraph>
        </Typography>
      </Col>
    </Row>
  </Card>);
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

  return (<Card style={{ marginTop: -16 }}>
      <Row>
        <Col span={16}>
          <Form onFinish={onUpdateServerChan} form={serverchanForm} {...inputItemLayout}>
            <Form.Item
              label="SendKey"
              name="sendkey"
              rules={[
                {
                  required: true,
                  message: formatText('app.systemsetting.inputsendkey'),
                },
              ]}
            >
              <Input/>
            </Form.Item>
            <Row>
              <Col style={{ marginBottom: 24 }} span={4} offset={4}>
                {settingsServerChan.alive ? (
                  <Badge status="processing" text={formatText('app.core.working')}/>
                ) : (
                  <Badge status="error" text={formatText('app.core.error')}/>
                )}
              </Col>
            </Row>
            <Form.Item {...buttonItemLayout}>
              <Button
                icon={<DeliveredProcedureOutlined/>}
                type="primary"
                htmlType="submit"
                loading={updateServerChanReq.loading}
              >
                {formatText('app.core.update')}
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={8}>
          <Typography>
            <Paragraph>
              <Title level={4}>{formatText('app.systemsetting.howtoconfig')}</Title>
              <Text>{formatText('app.systemsetting.openserverchan')}</Text>
              <br/>
              <a target="_blank" href="https://sct.ftqq.com/">
                {formatText('app.systemsetting.serverchanapireadme')}
              </a>
            </Paragraph>
          </Typography>
        </Col>
      </Row>
    </Card>
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
    <Card style={{ marginTop: -16 }}>
      <Row>
        <Col span={16}>
          <Form form={fofaForm} onFinish={onUpdateFOFA} {...inputItemLayout}>
            <Form.Item
              label="email"
              name="email"
              rules={[
                {
                  required: true,
                  message: formatText('app.systemsetting.inputemail'),
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
                  message: formatText('app.systemsetting.inputkey'),
                },
              ]}
            >
              <Input/>
            </Form.Item>
            <Row>
              <Col style={{ marginBottom: 24 }} span={4} offset={4}>
                {settingsFOFA.alive ? (
                  <Badge status="processing" text={formatText('app.core.working')}/>
                ) : (
                  <Badge status="error" text={formatText('app.core.error')}/>
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
                  {formatText('app.core.update')}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
        <Col span={8}>
          <Typography>
            <Paragraph>
              <Title level={4}>{formatText('app.systemsetting.howtoconfig')}</Title>
              <Text>{formatText('app.systemsetting.openfofavip')}</Text>
              <br/>
              <a href="https://fofa.so/static_pages/api_help">{formatText('app.systemsetting.fofaapireadme')}</a>
            </Paragraph>
          </Typography>
        </Col>
      </Row>
    </Card>);
};

const QuakeForm = props => {
  const [quakeForm] = Form.useForm();
  const [settingsQuake, setSettingsQuake] = useState({});

  //初始化数据
  const initListQuakeReq = useRequest(() => getCoreSettingAPI({ kind: 'Quake' }), {
    onSuccess: (result, params) => {
      setSettingsQuake(result);
      quakeForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    },
  });

  const updateQuakeReq = useRequest(postCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSettingsQuake(result);
      quakeForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    },
  });

  const onUpdateFOFA = values => {
    let params = {
      kind: 'Quake',
      tag: 'default',
      setting: { ...values },
    };
    updateQuakeReq.run(params);
  };

  return (
    <Card style={{ marginTop: -16 }}>
      <Row>
        <Col span={16}>
          <Form form={quakeForm} onFinish={onUpdateFOFA} {...inputItemLayout}>
            <Form.Item
              label="key"
              name="key"
              rules={[
                {
                  required: true,
                  message: formatText('app.systemsetting.inputkey'),
                },
              ]}
            >
              <Input/>
            </Form.Item>
            <Row>
              <Col style={{ marginBottom: 24 }} span={4} offset={4}>
                {settingsQuake.alive ? (
                  <Badge status="processing" text={formatText('app.core.working')}/>
                ) : (
                  <Badge status="error" text={formatText('app.core.error')}/>
                )}
              </Col>
            </Row>
            <Form.Item {...buttonItemLayout}>
              <Space>
                <Button
                  icon={<DeliveredProcedureOutlined/>}
                  type="primary"
                  htmlType="submit"
                  loading={updateQuakeReq.loading}
                >
                  {formatText('app.core.update')}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
        <Col span={8}>
          <Typography>
            <Paragraph>
              <Title level={4}>{formatText('app.systemsetting.howtoconfig')}</Title>
              <Text>{formatText('app.systemsetting.openquakevip')}</Text>
              <br/>
              <a href="https://quake.360.cn/quake/#/help?title=%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E">
                {formatText('app.systemsetting.quakeapireadme')}
              </a>
            </Paragraph>
          </Typography>
        </Col>
      </Row>
    </Card>);
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

  return (<Card style={{ marginTop: -16 }}>
    <Row>
      <Col span={16}>
        <Form form={lHostForm} initialValue={lhost} onFinish={onUpdateLhost} {...lHostFormLayout}>
          <Form.Item
            label={formatText('app.systemsetting.defaultlhost')}
            name="lhost"
            rules={[
              {
                required: true,
                message: formatText('app.systemsetting.defaultlhosttooltip'),
              },
            ]}
          >
            <Input style={{ width: '80%' }} placeholder={formatText('app.systemsetting.defaultlhostplaceholder')}/>
          </Form.Item>

          <Form.Item {...buttonLHostFormLayout}>
            <Button
              icon={<DeliveredProcedureOutlined/>}
              type="primary"
              htmlType="submit"
              loading={updateLHostReq.loading}
            >
              {formatText('app.core.update')}
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={8}>
        <Typography>
          <Paragraph>
            <Title level={4}>{formatText('app.systemsetting.howtoconfig')}</Title>
            <Text strong>{formatText('app.systemsetting.defaultlhost')}</Text>
            {formatText('app.systemsetting.defaultlhostdoc_1')}
            <br/>
            <Text>{formatText('app.systemsetting.defaultlhostdoc_2')}</Text>
            <br/>
            Nginx:<Text code>0.0.0.0:60000</Text>
            <br/>
            Redis:<Text code>127.0.0.1:60004</Text>
            <br/>
            Msfrpcd:<Text code>127.0.0.1:60005</Text>
            <br/>
            {formatText('app.systemsetting.defaultlhostdoc_ssh')}
            <Text code>0.0.0.0:60010</Text>
          </Paragraph>
        </Typography>
      </Col>
    </Row>
  </Card>);
};

export default SystemSetting;

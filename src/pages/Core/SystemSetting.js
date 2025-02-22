import React, {memo, useEffect, useRef, useState} from 'react';
import {
  deleteCoreSettingAPI,
  deleteCoreUUIDJsonAPI,
  getCoreSettingAPI,
  getServiceStatusAPI,
  postCoreSettingAPI,
  putCoreSettingAPI,
  putPostmodulePostModuleConfigAPI,
} from '@/services/apiv1';
import {history, useRequest} from 'umi';

import {setToken} from '@/utils/authority';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  List,
  Popover,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd-v5';
import {message} from 'antd';

import {
  CheckOutlined,
  CloudDownloadOutlined,
  DeleteOutlined,
  DeliveredProcedureOutlined,
  LogoutOutlined,
  MinusOutlined,
  PlusOutlined,
  ReloadOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {useLocalStorageState} from 'ahooks';

import {reloadAuthorized} from '@/utils/Authorized';
import {formatText} from '@/utils/locales';
import {DocIcon} from '@/pages/Core/Common';
import {BuildDate, Version} from '@/config';

const {TextArea} = Input;

const {Option} = Select;
const {TabPane} = Tabs;
const {Title, Paragraph, Text} = Typography;

const viper_update_date = Version;

const buttonItemLayout = {
  wrapperCol: {
    xs: {
      span: 24, offset: 0,
    }, sm: {
      span: 16, offset: 4,
    },
  },
};

const inputItemLayout = {
  labelCol: {
    span: 4,
  }, wrapperCol: {
    span: 16,
  },
};
const comonItemLayout = {
  labelCol: {
    span: 8,
  }, wrapperCol: {
    span: 16,
  },
};
const CommonButtonItemLayout = {
  wrapperCol: {
    span: 16, offset: 8,
  },
};
const SystemSetting = () => {
  console.log('SystemSetting');
  return (<Tabs size="small" defaultActiveKey="system_info">
    <TabPane tab={<span style={{marginLeft: 8, marginRight: 8}}>{formatText('app.systemsetting.aboutviper')}</span>}
             key="system_info">
      <SystemInfo/>
    </TabPane>
    <TabPane tab="Quake API" key="Quake">
      <QuakeForm/>
    </TabPane>
    <TabPane tab="Hunter API" key="Hunter">
      <HunterForm/>
    </TabPane>
    <TabPane tab="Zoomeye API" key="Zoomeye">
      <ZoomeyeForm/>
    </TabPane>
    <TabPane tab="FOFA API" key="FOFA">
      <FOFAForm/>
    </TabPane>
    <TabPane tab={formatText('app.systemsetting.aiqicha')} key="Aiqicha">
      <AiqichaForm/>
    </TabPane>
    <TabPane tab={formatText('app.systemsetting.serverchan')}
             key="serverchan">
      <ServerChanForm/>
    </TabPane>
    <TabPane tab="DingDing Bot" key="dingding">
      <DingDingForm/>
    </TabPane>
    <TabPane tab="Telegram Bot" key="telegram">
      <TelegramForm/>
    </TabPane>
    <TabPane tab="OpenAI" key="openai">
      <LLMForm/>
    </TabPane>
    <TabPane tab={formatText('app.systemsetting.smtp')} key="smtp">
      <SMTPForm/>
    </TabPane>
    <TabPane tab={formatText('app.systemsetting.user')} key="User">
      <UserForm/>
    </TabPane>
    <TabPane tab={formatText('app.systemsetting.common')} key="Common">
      <CommonForm/>
    </TabPane>
  </Tabs>);
};

const SystemInfo = () => {
  const datas = [
    {
      name: 'metasploit-framework', url: 'https://github.com/rapid7/metasploit-framework/blob/master/LICENSE',
    }, {
      name: 'ant-design-pro', url: 'https://github.com/ant-design/ant-design-pro/blob/master/LICENSE',
    }, {
      name: 'django-rest-framework', url: 'https://github.com/encode/django-rest-framework/blob/master/LICENSE.md',
    }];

  const [serviceStatusActive, setServiceStatusActive] = useState({
    json_rpc: {status: false}, wafcheck: {status: false},
  });
  const [lastestVersion, setLastestVersion] = useState(null);
  const [lastestVersionLoading, setLastestVersionLoading] = useState(false);
  const [viperDebugFlag, setViperDebugFlag] = useLocalStorageState('viper-debug-flag', false);
  // const [onlyShowSession, setOnlyShowSession] = useLocalStorageState("only-show-session", false);

  //初始化数据
  useEffect(() => {
    listServiceStatusReq.run();
  }, []);

  const getLastestVersionReq = () => {
    const repoName = 'Viper';
    const userName = 'FunnyWolf';
    const url = `https://api.github.com/repos/${userName}/${repoName}/releases/latest`;
    setLastestVersionLoading(true);
    fetch(url).then(res => res.json()).then(data => {
      setLastestVersion(data.name);
      setLastestVersionLoading(false);
    });
  };

  const listServiceStatusReq = useRequest(getServiceStatusAPI, {
    manual: true, onSuccess: (result, params) => {
      setServiceStatusActive(result);
    }, onError: (error, params) => {
    },
  });

  //初始化数据
  const downloadlogReq = useRequest(() => getCoreSettingAPI({kind: 'downloadlog'}), {
    manual: true, onSuccess: (result, params) => {
    }, onError: (error, params) => {
    },
  });

  const updatePostmodulePostModuleConfigReq = useRequest(putPostmodulePostModuleConfigAPI, {
    manual: true, onSuccess: (result, params) => {

    }, onError: (error, params) => {
    },
  });

  const deleteUuidJsonReq = useRequest(deleteCoreUUIDJsonAPI, {
    manual: true, onSuccess: (result, params) => {

    }, onError: (error, params) => {
    },
  });

  const loginOut = () => {
    const {query, pathname} = history.location;
    const {redirect} = query;
    setToken('guest');
    reloadAuthorized();
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
      });
    }
  };

  return (<Card>
    <DocIcon url="https://www.yuque.com/vipersec/help/vt9iyh"/>
    <Row>
      <Descriptions size="small" style={{marginLeft: 64}} column={5}>
        <Descriptions.Item label={formatText('app.systemsetting.version')}>
          <Tag color="blue">{viper_update_date}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label={formatText('app.systemsetting.builddate')}>
          <Tag color="blue">{BuildDate}</Tag>
        </Descriptions.Item>
        <Descriptions.Item
          label={formatText('app.systemsetting.lastversion')}>
          <Space>
            <Tag color="blue">{lastestVersion}</Tag>
            <Button
              size="small"
              style={{width: 48}}
              icon={<SyncOutlined/>}
              onClick={() => getLastestVersionReq()}
              loading={lastestVersionLoading}
            />
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </Row>
    <Row>
      <Descriptions size="small" style={{marginLeft: 64, marginTop: 16}} column={5}>
        <Descriptions.Item label={formatText('app.systemsetting.updatedate')}>
          <a
            target="_blank"
            href="https://github.com/FunnyWolf/Viper/releases"
          >
            Github Releases
          </a>
        </Descriptions.Item>
        <Descriptions.Item
          label={formatText('app.systemsetting.documentation')}>
          <a target="_blank" href="https://www.yuque.com/vipersec">
            {formatText('app.systemsetting.documentationlink')}
          </a>
        </Descriptions.Item>
        <Descriptions.Item
          label={formatText('app.systemsetting.opensourcesoftware')}>
          <Popover content={<List
            size="small"
            bordered
            dataSource={datas}
            renderItem={item => (<List.Item>
              <a href={item.url}>{item.name}</a>
            </List.Item>)}
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
      <Descriptions size="small" style={{marginLeft: 64, marginTop: 16}}
                    column={5}>
        <Descriptions.Item label={formatText('app.systemsetting.msfstatus')}>
          <Space>{serviceStatusActive.json_rpc.status ? (<Tag color="green">MSF</Tag>) : (<Tag color="red">MSF</Tag>)}
            {serviceStatusActive.wafcheck.status ? (<Tag color="green">WAFCHECK</Tag>) : (
              <Tag color="red">WAFCHECK</Tag>)}
            <Button
              size="small"
              style={{width: 48}}
              icon={<SyncOutlined/>}
              onClick={() => listServiceStatusReq.run()}
              loading={listServiceStatusReq.loading}
            />
          </Space>
        </Descriptions.Item>
        <Descriptions.Item
          label={formatText('app.systemsetting.betafunction')}>
          <Switch
            checkedChildren={<CheckOutlined/>}
            unCheckedChildren={<MinusOutlined/>}
            checked={viperDebugFlag}
            onClick={() => {
              setViperDebugFlag(!viperDebugFlag);
              location.reload();
            }}
          />
        </Descriptions.Item>
      </Descriptions>
    </Row>
    <Row>
      <Space style={{marginTop: 16, marginLeft: 64}}>
        <Button
          icon={<ReloadOutlined/>}
          onClick={() => updatePostmodulePostModuleConfigReq.run()}
          loading={updatePostmodulePostModuleConfigReq.loading}
        >
          <span style={{marginLeft: 4}}>{formatText('app.systemsetting.reloadallmodule')}</span>
        </Button>
        <Button
          icon={<DeleteOutlined/>}
          onClick={() => deleteUuidJsonReq.run()}
          loading={deleteUuidJsonReq.loading}
        >
          <span style={{marginLeft: 4}}>{formatText('app.systemsetting.deleteuuidjson')}</span>
        </Button>
        <Button
          icon={<CloudDownloadOutlined/>}
          onClick={() => downloadlogReq.run()}
          loading={downloadlogReq.loading}
        >
          <span style={{marginLeft: 4}}>{formatText('app.systemsetting.downloadlog')}</span>
        </Button>
        <Button danger icon={<LogoutOutlined/>} onClick={loginOut}>
          <span style={{marginLeft: 4}}>{formatText('app.systemsetting.logout')}</span>
        </Button>
      </Space>
    </Row>
  </Card>);
};

const TelegramForm = props => {
  const [telegramForm] = Form.useForm();
  const [settingsTelegram, setSettingsTelegram] = useState({});
  const [userChatIdList, setUserChatIdList] = useState([]);
  const chat_id_options = userChatIdList.map(d => (<Option label={d.chat_id} key={d.chat_id}>
    {d.user + ' : ' + d.chat_id}
  </Option>));
  //初始化数据
  const initListTelegramReq = useRequest(() => getCoreSettingAPI({kind: 'telegram'}), {
    onSuccess: (result, params) => {
      setSettingsTelegram(result);
      telegramForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const updateTelegramReq = useRequest(postCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      if (params.tag === 'check') {
        setUserChatIdList(result);
      } else {
        setSettingsTelegram(result);
      }
      telegramForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const onUpdateTelegram = values => {
    let params = {};
    if (values.chat_id === '' || values.chat_id === undefined) {
      params = {
        kind: 'telegram', tag: 'check', setting: {...values},
      };
    } else {
      params = {
        kind: 'telegram', tag: 'default', setting: {...values},
      };
    }

    updateTelegramReq.run(params);
  };

  return (<Card>
    <Row>
      <DocIcon url="https://www.yuque.com/vipersec/help/su4tv8"/>
      <Col span={16}>
        <Form onFinish={onUpdateTelegram}
              form={telegramForm} {...inputItemLayout}>
          <Form.Item
            label="token"
            name="token"
            rules={[
              {
                required: true, message: formatText('app.systemsetting.inputtoken'),
              }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item label="chat_id" name="chat_id" rules={[]}>
            <Select
              mode="tags"
              style={{width: '100%'}}
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
            <Col style={{marginBottom: 24}} span={4} offset={4}>
              {settingsTelegram.alive ? (<Badge status="processing"
                                                text={formatText('app.core.working')}/>) : (
                <Badge status="error" text={formatText('app.core.error')}/>)}
            </Col>
          </Row>
          <Form.Item {...buttonItemLayout}>
            <Button
              icon={<DeliveredProcedureOutlined/>}
              type="primary"
              htmlType="submit"
              loading={updateTelegramReq.loading}
            >
              <span style={{marginLeft: 4}}>{formatText('app.systemsetting.updateorgetchatid')}</span>
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
  const initListDingDingReq = useRequest(() => getCoreSettingAPI({kind: 'dingding'}), {
    onSuccess: (result, params) => {
      setSettingsDingDing(result);
      dingdingForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const updateDingDingReq = useRequest(postCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      setSettingsDingDing(result);
      dingdingForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const onUpdateDingDing = values => {
    let params = {
      kind: 'dingding', tag: 'default', setting: {...values},
    };
    updateDingDingReq.run(params);
  };

  return (<Card>
    <Row>
      <DocIcon url="https://www.yuque.com/vipersec/help/bogo5k"/>
      <Col span={16}>
        <Form onFinish={onUpdateDingDing}
              form={dingdingForm} {...inputItemLayout}>
          <Form.Item
            label="access_token"
            name="access_token"
            rules={[
              {
                required: true, message: formatText('app.systemsetting.dingdingrules'),
              }]}
          >
            <Input.Password/>
          </Form.Item>
          <Form.Item
            label={formatText('app.systemsetting.keyword')}
            name="keyword"
            rules={[
              {
                required: true, message: formatText('app.systemsetting.inputkeyword'),
              }]}
          >
            <Input/>
          </Form.Item>
          <Row>
            <Col style={{marginBottom: 24}} span={4} offset={4}>
              {settingsDingDing.alive ? (<Badge status="processing"
                                                text={formatText('app.core.working')}/>) : (
                <Badge status="error" text={formatText('app.core.error')}/>)}
            </Col>
          </Row>
          <Form.Item {...buttonItemLayout}>
            <Button
              icon={<DeliveredProcedureOutlined/>}
              type="primary"
              htmlType="submit"
              loading={updateDingDingReq.loading}
            >
              <span style={{marginLeft: 4}}>{formatText('app.core.update')}</span>
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
            <a target="_blank"
               href="https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq">
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
  const [settingsServerChan, setSettingsServerChan] = useState({sendkey: null, alive: false});

  //初始化数据
  const initListServerChanReq = useRequest(() => getCoreSettingAPI({kind: 'serverchan'}), {
    onSuccess: (result, params) => {
      setSettingsServerChan(result);
      serverchanForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const updateServerChanReq = useRequest(postCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      setSettingsServerChan(result);
      serverchanForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const onUpdateServerChan = values => {
    let params = {
      kind: 'serverchan', tag: 'default', setting: {...values},
    };
    updateServerChanReq.run(params);
  };

  return (<Card>
    <Row>
      <DocIcon url="https://www.yuque.com/vipersec/help/uw2aha"/>
      <Col span={16}>
        <Form onFinish={onUpdateServerChan}
              form={serverchanForm} {...inputItemLayout}>
          <Form.Item
            label="SendKey"
            name="sendkey"
            rules={[
              {
                required: true, message: formatText('app.systemsetting.inputsendkey'),
              }]}
          >
            <Input.Password/>
          </Form.Item>
          <Row>
            <Col style={{marginBottom: 24}} span={4} offset={4}>
              {settingsServerChan.alive ? (<Badge status="processing"
                                                  text={formatText('app.core.working')}/>) : (<Badge status="error"
                                                                                                     text={formatText('app.core.error')}/>)}
            </Col>
          </Row>
          <Form.Item {...buttonItemLayout}>
            <Button
              icon={<DeliveredProcedureOutlined/>}
              type="primary"
              htmlType="submit"
              loading={updateServerChanReq.loading}
            >
              <span style={{marginLeft: 4}}>{formatText('app.core.update')}</span>
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
  </Card>);
};

const FOFAForm = props => {
  const [fofaForm] = Form.useForm();
  const [settingsFOFA, setSettingsFOFA] = useState({});

  //初始化数据
  const initListFOFAReq = useRequest(() => getCoreSettingAPI({kind: 'FOFA'}), {
    onSuccess: (result, params) => {
      setSettingsFOFA(result);
      fofaForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const updateFOFAReq = useRequest(postCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      setSettingsFOFA(result);
      fofaForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const onUpdateFOFA = values => {
    let params = {
      kind: 'FOFA', tag: 'default', setting: {...values},
    };
    updateFOFAReq.run(params);
  };

  return (<Card>
    <DocIcon url="https://www.yuque.com/vipersec/help/mboabvam043nwd46"/>
    <Row>
      <Col span={16}>
        <Form form={fofaForm} onFinish={onUpdateFOFA} {...inputItemLayout}>
          <Form.Item
            label="email"
            name="email"
            rules={[
              {
                required: true, message: formatText('app.systemsetting.inputemail'),
              }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="key"
            name="key"
            rules={[
              {
                required: true, message: formatText('app.systemsetting.inputkey'),
              }]}
          >
            <Input.Password/>
          </Form.Item>
          <Row>
            <Col style={{marginBottom: 24}} span={4} offset={4}>
              {settingsFOFA.alive ? (<Badge status="processing"
                                            text={formatText('app.core.working')}/>) : (
                <Badge status="error" text={formatText('app.core.error')}/>)}
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
                <span style={{marginLeft: 4}}>{formatText('app.core.update')}</span>
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
            <a target="_blank"
               href="https://fofa.so/static_pages/api_help">
              {formatText('app.systemsetting.fofaapireadme')}</a>
          </Paragraph>
        </Typography>
      </Col>
    </Row>
  </Card>);
};

const QuakeForm = props => {
  const [quakeForm] = Form.useForm();
  const [settingsQuakeList, setSettingsQuakeList] = useState([]);
  //初始化数据

  useEffect(() => {
    listQuakeReq.run({kind: 'Quake'});
  }, []);

  const listQuakeReq = useRequest(getCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      setSettingsQuakeList(result);
    }, onError: (error, params) => {
    },
  });

  const createQuakeReq = useRequest(postCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      listQuakeReq.run({kind: 'Quake'});
    }, onError: (error, params) => {
    },
  });

  const updateQuakeReq = useRequest(putCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      listQuakeReq.run({kind: 'Quake'});
    }, onError: (error, params) => {
    },
  });

  const destoryQuakeReq = useRequest(deleteCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      listQuakeReq.run({kind: 'Quake'});
    }, onError: (error, params) => {
    },
  });

  const onUpdateQuake = values => {
    let params = {
      kind: 'Quake', tag: 'default', setting: {...values},
    };
    createQuakeReq.run(params);
  };

  return (<Card
    styles={{body: {padding: "24px 0px 0px 0px"}}}
  >
    <DocIcon url="https://www.yuque.com/vipersec/help/hufexqh266gf76s9"/>
    <Row>
      <Col span={18}>
        <Table
          columns={[
            {
              title: 'API KEY', dataIndex: 'key', // width: 320,
            }, {
              title: '状态', dataIndex: 'ban_status', width: 80,
            }, {
              title: '免费查询次数', dataIndex: 'free_query_api_count', width: 104,
            }, {
              title: '月度剩余积分', dataIndex: 'month_remaining_credit', width: 104,
            }, {
              title: '长效剩余积分', dataIndex: 'constant_credit', width: 104,
            }, {
              title: '账号类型', dataIndex: 'account_role', width: 80,
            }, {
              dataIndex: 'operation', width: 120, render: (text, record) => {
                return <div style={{textAlign: 'center'}}>
                  <Space size="middle">
                    <a
                      onClick={() => updateQuakeReq.run({
                        kind: 'Quake', tag: 'default', setting: {key: record.key},
                      })}
                      style={{color: 'yellow'}}
                    >
                      {formatText('app.core.update')}
                    </a>
                    <a
                      onClick={() => destoryQuakeReq.run({
                        kind: 'Quake', tag: 'default', setting: {key: record.key},
                      })}
                      style={{color: 'red'}}
                    >
                      {formatText('app.core.delete')}
                    </a>
                  </Space></div>;
              },
            }]}
          dataSource={settingsQuakeList}
          pagination={false}
          size="small"
          loading={listQuakeReq.loading}
          // style={{
          //   overflow: "auto", minHeight: listitemHeight, maxHeight: listitemHeight,
          // }}
          // scroll={{ y: listitemHeight - 32 }}
        />
        <Form
          style={{padding: 24}}
          form={quakeForm}
          onFinish={onUpdateQuake}
          layout="inline"
        >
          <Form.Item
            label="API KEY"
            name="key"
            rules={[
              {
                required: true, message: formatText('app.systemsetting.inputkey'),
              }]}
          >
            <Input.Password style={{width: 320}}/>
          </Form.Item>
          <Form.Item>
            <Button
              icon={<PlusOutlined/>}
              type="primary"
              htmlType="submit"
              loading={createQuakeReq.loading}
            >
              <span style={{marginLeft: 4}}>{formatText('app.core.add')}</span>
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={6}>
        <Typography
          style={{padding: 32}}
        >
          <Paragraph>
            <Title level={4}>{formatText('app.systemsetting.howtoconfig')}</Title>
            <Text>{formatText('app.systemsetting.openquakevip')}</Text>
            <br/>
            <a
              target="_blank"
              href="https://quake.360.cn/quake/#/help?title=%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E">
              {formatText('app.systemsetting.quakeapireadme')}
            </a>
          </Paragraph>
        </Typography>
      </Col>
    </Row>
  </Card>);
};

const LLMForm = props => {
  const [llmForm] = Form.useForm();
  const [settingsOpenaiList, setsettingsOpenaiList] = useState([]);
  //初始化数据

  useEffect(() => {
    listOpenAIReq.run({kind: 'OpenAI'});
  }, []);

  const listOpenAIReq = useRequest(getCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      setsettingsOpenaiList(result);
    }, onError: (error, params) => {
    },
  });

  const createOpenaiReq = useRequest(postCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      listOpenAIReq.run({kind: 'OpenAI'});
    }, onError: (error, params) => {
    },
  });

  const updateOpenaiReq = useRequest(putCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      listOpenAIReq.run({kind: 'OpenAI'});
    }, onError: (error, params) => {
    },
  });

  const destoryQuakeReq = useRequest(deleteCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      listOpenAIReq.run({kind: 'OpenAI'});
    }, onError: (error, params) => {
    },
  });

  const onUpdateQuake = values => {
    let params = {
      kind: 'OpenAI', tag: 'default', setting: {...values},
    };
    createOpenaiReq.run(params);
  };

  return (<Card
    styles={{body: {padding: "24px 0px 0px 0px"}}}
  >
    <DocIcon url="https://www.yuque.com/vipersec/help/oa9zmgf5uyk96kgh"/>
    <Row>
      <Col span={22}>
        <Table
          columns={[
            {
              title: 'key', dataIndex: 'api_key', width: 320,
            }, {
              title: 'base_url', dataIndex: 'base_url', width: 320,
            }, {
              title: 'model', dataIndex: 'model', width: 160,
            }, {
              title: 'easy', dataIndex: 'easy', width: 80,
              render: (text, record) => {
                if (record.easy) {
                  return (<Tag color="lime">Y</Tag>);
                }
              },
            }, {
              title: 'reasoning', dataIndex: 'reasoning', width: 80,
              render: (text, record) => {
                if (record.reasoning) {
                  return (<Tag color="lime">Y</Tag>);
                }
              },
            }, {
              title: 'function_calling', dataIndex: 'function_calling', width: 80,
              render: (text, record) => {
                if (record.function_calling) {
                  return (<Tag color="lime">Y</Tag>);
                }
              },
            }, {
              dataIndex: 'operation', width: 80, render: (text, record) => {
                return <div style={{textAlign: 'center'}}>
                  <Space size="middle">
                    {/*<a*/}
                    {/*  onClick={() => updateOpenaiReq.run({*/}
                    {/*    kind: 'OpenAI', tag: 'default', setting: {id: record.id},*/}
                    {/*  })}*/}
                    {/*  style={{color: 'yellow'}}*/}
                    {/*>*/}
                    {/*  {formatText('app.core.update')}*/}
                    {/*</a>*/}
                    <a
                      onClick={() => destoryQuakeReq.run({
                        kind: 'OpenAI', tag: 'default', setting: {id: record.id},
                      })}
                      style={{color: 'red'}}
                    >
                      {formatText('app.core.delete')}
                    </a>
                  </Space></div>;
              },
            }]}
          dataSource={settingsOpenaiList}
          pagination={false}
          size="small"
          loading={listOpenAIReq.loading}
        />
        <Form
          style={{padding: 24}}
          form={llmForm}
          onFinish={onUpdateQuake}
          layout="inline"
        >
          <Form.Item
            label="base_url"
            name="base_url"
            rules={[]}
          >
            <Input style={{width: 320}}/>
          </Form.Item>
          <Form.Item
            label="api_key"
            name="api_key"
            rules={[
              {
                required: true, message: formatText('app.systemsetting.inputkey'),
              }]}
          >
            <Input.Password style={{width: 320}}/>
          </Form.Item>
          <Form.Item
            label="model"
            name="model"
            rules={[
              {
                required: true, message: formatText('app.systemsetting.selectmodel'),
              }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item label="easy" name="easy" valuePropName="checked">
            <Checkbox/>
          </Form.Item>
          <Form.Item label="reasoning" name="reasoning" valuePropName="checked">
            <Checkbox/>
          </Form.Item>
          <Form.Item label="function_calling" name="function_calling" valuePropName="checked">
            <Checkbox/>
          </Form.Item>
          <Form.Item>
            <Button
              icon={<PlusOutlined/>}
              type="primary"
              htmlType="submit"
              loading={createOpenaiReq.loading}
            >
              <span style={{marginLeft: 4}}>{formatText('app.core.add')}</span>
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={2}>
        <Typography>
          <Paragraph>
            <Title level={4}>{formatText('app.systemsetting.howtoconfig')}</Title>
            <a
              target="_blank"
              href="https://www.yuque.com/vipersec/help/oa9zmgf5uyk96kgh">
              {formatText('app.systemsetting.openaimanual')}
            </a>
          </Paragraph>
        </Typography>
      </Col>
    </Row>
  </Card>);
};

const HunterForm = props => {
  const [hunterForm] = Form.useForm();
  const [settingsHunter, setSettingsHunter] = useState({});
  //初始化数据
  useEffect(() => {
    getReq.run({kind: 'Hunter'})
  }, []);

  const getReq = useRequest(getCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSettingsHunter(result);
      hunterForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const updateHunterReq = useRequest(postCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      setSettingsHunter(result);
      hunterForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const onUpdateHunter = values => {
    let params = {
      kind: 'Hunter', tag: 'default', setting: {...values},
    };
    updateHunterReq.run(params);
  };

  return (<Card>
    <DocIcon url="https://www.yuque.com/vipersec/help/wi4m1pz3kf5yqxri"/>
    <Row>
      <Col span={16}>
        <Form form={hunterForm}
              onFinish={onUpdateHunter} {...inputItemLayout}>
          <Form.Item
            label="key"
            name="key"
            rules={[
              {
                required: true, message: formatText('app.systemsetting.inputkey'),
              }]}
          >
            <Input.Password/>
          </Form.Item>
          <Row>
            <Col style={{marginBottom: 24}} span={4} offset={4}>
              {settingsHunter.alive ? (<Badge status="processing"
                                              text={formatText('app.core.working')}/>) : (
                <Badge status="error" text={formatText('app.core.error')}/>)}
            </Col>
          </Row>
          <Form.Item {...buttonItemLayout}>
            <Space>
              <Button
                icon={<DeliveredProcedureOutlined/>}
                type="primary"
                htmlType="submit"
                loading={updateHunterReq.loading}
              >
                <span style={{marginLeft: 4}}>{formatText('app.core.update')}</span>
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Col>
      <Col span={8}>
        <Typography>
          <Paragraph>
            <Title level={4}>{formatText('app.systemsetting.howtoconfig')}</Title>
            <Text>{formatText('app.systemsetting.openhuntervip')}</Text>
            <br/>
            <a
              target="_blank"
              href="https://hunter.qianxin.com/home/helpCenter?r=5-1-2">
              {formatText('app.systemsetting.hunterapireadme')}
            </a>
          </Paragraph>
        </Typography>
      </Col>
    </Row>
  </Card>);
};

const ZoomeyeForm = props => {
  const [zoomeyeForm] = Form.useForm();
  const [settingsZoomeye, setSettingsZoomeye] = useState({});

  //初始化数据
  const initListZoomeyeReq = useRequest(() => getCoreSettingAPI({kind: 'Zoomeye'}), {
    onSuccess: (result, params) => {
      setSettingsZoomeye(result);
      zoomeyeForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const updateZoomeyeReq = useRequest(postCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      setSettingsZoomeye(result);
      zoomeyeForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const onUpdateZoomeye = values => {
    let params = {
      kind: 'Zoomeye', tag: 'default', setting: {...values},
    };
    updateZoomeyeReq.run(params);
  };

  return (<Card>
    <DocIcon url="https://www.yuque.com/vipersec/help/mcn0wyw0sx76p859"/>
    <Row>
      <Col span={16}>
        <Form form={zoomeyeForm}
              onFinish={onUpdateZoomeye} {...inputItemLayout}>
          <Form.Item
            label="key"
            name="key"
            rules={[
              {
                required: true, message: formatText('app.systemsetting.inputkey'),
              }]}
          >
            <Input.Password/>
          </Form.Item>
          <Row>
            <Col style={{marginBottom: 24}} span={4} offset={4}>
              {settingsZoomeye.alive ? (<Badge status="processing"
                                               text={formatText('app.core.working')}/>) : (
                <Badge status="error" text={formatText('app.core.error')}/>)}
            </Col>
          </Row>
          <Form.Item
            wrapperCol={{span: 20, offset: 4}}
          >
            <Button
              icon={<DeliveredProcedureOutlined/>}
              type="primary"
              htmlType="submit"
              loading={updateZoomeyeReq.loading}
            >
              <span style={{marginLeft: 4}}>{formatText('app.core.update')}</span>
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={8}>
        <Typography>
          <Paragraph>
            <Title level={4}>{formatText('app.systemsetting.howtoconfig')}</Title>
            <Text>{formatText('app.systemsetting.openzoomeyevip')}</Text>
            <br/>
            <a
              target="_blank"
              href="https://www.zoomeye.org/doc">
              {formatText('app.systemsetting.zoomeyeapireadme')}
            </a>
          </Paragraph>
        </Typography>
      </Col>
    </Row>
  </Card>);
};

const AiqichaForm = props => {
  const [aiqichaForm] = Form.useForm();
  const [settingsAiqicha, setSettingsAiqicha] = useState({});

  //初始化数据
  const initListAiqichaReq = useRequest(() => getCoreSettingAPI({kind: 'Aiqicha'}), {
    onSuccess: (result, params) => {
      setSettingsAiqicha(result);
      aiqichaForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const updateAiqichaReq = useRequest(postCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      setSettingsAiqicha(result);
      aiqichaForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const onUpdateAiqicha = values => {
    let params = {
      kind: 'Aiqicha', tag: 'default', setting: {...values},
    };
    updateAiqichaReq.run(params);
  };

  return (<Card>
    <DocIcon url="https://www.yuque.com/vipersec/help/ary2q9yqzv1zb8k8"/>
    <Row>
      <Col span={20}>
        <Form
          form={aiqichaForm}
          onFinish={onUpdateAiqicha}
          labelCol={{span: 2, offset: 0}}
          wrapperCol={{span: 20, offset: 0}}
        >
          < Form.Item
            label="cookie"
            name="cookie"
            rules={[
              {
                required: true, message: formatText('app.systemsetting.inputcookie'),
              }]}
          >
            <TextArea autoSize={{
              minRows: 3,
              maxRows: 10,
            }}/>
          </Form.Item>
          <Row>
            <Col style={{marginBottom: 24}} span={4} offset={2}>
              {settingsAiqicha.alive ? (<Badge status="processing"
                                               text={formatText('app.core.working')}/>) : (
                <Badge status="error" text={formatText('app.core.error')}/>)}
            </Col>
          </Row>
          <Form.Item
            wrapperCol={{span: 20, offset: 2}}
          >
            <Button
              icon={<DeliveredProcedureOutlined/>}
              type="primary"
              htmlType="submit"
              loading={updateAiqichaReq.loading}
            >
              <span style={{marginLeft: 4}}>{formatText('app.core.update')}</span>
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={4}>
        <Typography>
          <Paragraph>
            <Title level={4}>{formatText('app.systemsetting.howtoconfig')}</Title>
            <Text>{formatText('app.systemsetting.getaiqichacookie')}</Text>
            <br/>
            <a
              target="_blank"
              href="https://www.yuque.com/vipersec/help/ary2q9yqzv1zb8k8">
              {formatText('app.systemsetting.getaiqichareadme')}
            </a>
          </Paragraph>
        </Typography>
      </Col>
    </Row>
  </Card>);
};
const OpenAIForm = props => {
  const [mainForm] = Form.useForm();
  const [settings, setSettings] = useState({});
  const [items, setItems] = useState(['gpt-3.5-turbo', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini']);
  const [name, setName] = useState('');
  const inputRef = useRef(null);
  const kind = 'OpenAI'

  //初始化数据
  useEffect(() => {
    getReq.run({kind: kind})
  }, []);
  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const getReq = useRequest(getCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSettings(result);
      mainForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const updateReq = useRequest(postCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      setSettings(result);
      mainForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const onUpdate = values => {
    let params = {
      kind: kind, tag: 'default', setting: {...values},
    };
    updateReq.run(params);
  };

  return (<Card>
    <DocIcon url="https://www.yuque.com/vipersec/help/oa9zmgf5uyk96kgh"/>
    <Row>
      <Col span={16}>
        <Form form={mainForm}
              onFinish={onUpdate} {...inputItemLayout}>
          <Form.Item
            label="base_url"
            name="base_url"
            rules={[]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="api_key"
            name="api_key"
            rules={[
              {
                required: true, message: formatText('app.systemsetting.inputkey'),
              }]}
          >
            <Input.Password/>
          </Form.Item>
          <Form.Item
            label="model"
            name="model"
            rules={[
              {
                required: true, message: formatText('app.systemsetting.selectmodel'),
              }]}
          >
            <Select
              style={{width: 300}}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{margin: '8px 0'}}/>
                  <Space style={{padding: '0 8px 4px'}}>
                    <Input
                      placeholder={formatText('app.systemsetting.inputmodel')}
                      ref={inputRef}
                      value={name}
                      onChange={onNameChange}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                    <Button type="text" icon={<PlusOutlined/>} onClick={addItem}>
                      Add item
                    </Button>
                  </Space>
                </>
              )}
              options={items.map((item) => ({label: item, value: item}))}
            />
          </Form.Item>
          <Row>
            <Col style={{marginBottom: 24}} span={4} offset={4}>
              {settings.alive ? (<Badge status="processing"
                                        text={formatText('app.core.working')}/>) : (
                <Badge status="error" text={formatText('app.core.error')}/>)}
            </Col>
          </Row>
          <Form.Item {...buttonItemLayout}>
            <Space>
              <Button
                icon={<DeliveredProcedureOutlined/>}
                type="primary"
                htmlType="submit"
                loading={updateReq.loading}
              >
                <span style={{marginLeft: 4}}>{formatText('app.core.update')}</span>
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Col>
      <Col span={8}>
        <Typography>
          <Paragraph>
            <Title level={4}>{formatText('app.systemsetting.howtoconfig')}</Title>
            <a
              target="_blank"
              href="https://www.yuque.com/vipersec/help/oa9zmgf5uyk96kgh">
              {formatText('app.systemsetting.openaimanual')}
            </a>
          </Paragraph>
        </Typography>
      </Col>
    </Row>
  </Card>);
};

const SMTPForm = props => {
  const [mainForm] = Form.useForm();
  const [settings, setSettings] = useState({});
  const kind = 'SMTP'
  //初始化数据
  useEffect(() => {
    getReq.run({kind: kind})
  }, []);

  const getReq = useRequest(getCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSettings(result);
      mainForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const updateReq = useRequest(postCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      setSettings(result);
      mainForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const onUpdate = values => {
    let params = {
      kind: kind, tag: 'default', setting: {...values},
    };
    updateReq.run(params);
  };

  return (<Card>
    <DocIcon url="https://www.yuque.com/vipersec/help/oa9zmgf5uyk96kgh"/>
    <Row>
      <Col span={16}>
        <Form form={mainForm}
              onFinish={onUpdate} {...inputItemLayout}>
          <Form.Item
            label="SMTP Server"
            name="smtp_server"
            rules={[]}
          >
            <Input style={{width: "400px"}}/>
          </Form.Item>
          <Form.Item
            label="SMTP Port"
            name="smtp_port"
            rules={[]}
          >
            <InputNumber defaultValue={465}/>
          </Form.Item>
          <Form.Item
            label="SSL"
            name="ssl"
            rules={[]}
            valuePropName="checked"
          >
            <Checkbox defaultChecked={true}/>
          </Form.Item>
          <Form.Item
            label="Mail Account"
            name="mail_account"
            rules={[]}
          >
            <Input placeholder="e.g. test@gmail.com" style={{width: "400px"}}/>
          </Form.Item>
          <Form.Item
            label="Mail Password"
            name="mail_password"
            rules={[]}
          >
            <Input.Password placeholder="smtp login password" style={{width: "400px"}}/>
          </Form.Item>
          <Row>
            <Col style={{marginBottom: 24}} span={4} offset={4}>
              {settings.alive ? (<Badge status="processing"
                                        text={formatText('app.core.working')}/>) : (
                <Badge status="error" text={formatText('app.core.error')}/>)}
            </Col>
          </Row>
          <Form.Item {...buttonItemLayout}>
            <Space>
              <Button
                icon={<DeliveredProcedureOutlined/>}
                type="primary"
                htmlType="submit"
                loading={updateReq.loading}
              >
                <span style={{marginLeft: 4}}>{formatText('app.core.update')}</span>
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Col>
      <Col span={8}>
        <Typography>
          <Paragraph>
            <Title level={4}>{formatText('app.systemsetting.howtoconfig')}</Title>
            <a
              target="_blank"
              href="https://www.yuque.com/vipersec/help/ezl4dzg2gw1d0ecw">
              {formatText('app.systemsetting.smtpmanual')}
            </a>
          </Paragraph>
        </Typography>
      </Col>
    </Row>
  </Card>);
};

const CommonForm = props => {
  const [commonForm] = Form.useForm();
  const [settingsCommon, setSettingsCommon] = useState({});

  //初始化数据
  const initListCOMMONReq = useRequest(() => getCoreSettingAPI({kind: 'common'}), {
    onSuccess: (result, params) => {
      setSettingsCommon(result);
      commonForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const updateCommonReq = useRequest(postCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      setSettingsCommon(result);
      commonForm.setFieldsValue(result);
    }, onError: (error, params) => {
    },
  });

  const onUpdateCommonEngine = values => {
    let params = {
      kind: 'common', tag: 'default', setting: {...values},
    };
    updateCommonReq.run(params);
  };

  return (<Card>
    <DocIcon url="https://www.yuque.com/vipersec/help/ngb9ta9tr5zo43qg"/>
    <Row>
      <Col span={16}>
        <Form form={commonForm} onFinish={onUpdateCommonEngine} {...comonItemLayout}>
          <Form.Item
            label="网络搜索引擎最大记录数"
            name="max_record_num_for_one_search"
            rules={[
              {
                required: true, message: formatText('app.systemsetting.inputemail'),
              }]}
          >
            <InputNumber min={1000} max={5000} defaultValue={1000}/>
          </Form.Item>
          <Form.Item
            label="Nuclei并发数"
            name="nuclei_rate_limit"
            rules={[
              {
                required: true,
              }]}
          >
            <InputNumber min={1000} max={20000} defaultValue={1000}/>
          </Form.Item>
          <Form.Item
            label="Nuclei漏洞级别"
            name="nuclei_levels"
            rules={[
              {
                required: true,
              }]}
          >
            <Checkbox.Group options={[
              {label: 'Critical', value: 'critical'}, {label: 'High', value: 'high'}, {
                label: 'Medium',
                value: 'medium',
              }, {label: 'Low', value: 'low'}]}
                            defaultValue={['High', 'Critical']}/>
          </Form.Item>
          <Form.Item
            label={formatText('app.systemsetting.defaultlhost')}
            name="lhost"
            rules={[
              {
                required: true, message: formatText('app.systemsetting.defaultlhosttooltip'),
              }]}
          >
            <Input style={{width: '80%'}} placeholder={formatText('app.systemsetting.defaultlhostplaceholder')}/>
          </Form.Item>

          <Form.Item label={formatText('app.systemsetting.common.session_monitor_switch')} name="session_monitor" valuePropName="checked">
            <Switch
              checkedChildren={<CheckOutlined/>}
              unCheckedChildren={<MinusOutlined/>}
            />
          </Form.Item>
          <Form.Item {...CommonButtonItemLayout}>
            <Button
              icon={<DeliveredProcedureOutlined/>}
              type="primary"
              htmlType="submit"
              loading={updateCommonReq.loading}
            >
              <span style={{marginLeft: 4}}>{formatText('app.core.update')}</span>
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  </Card>);
};

const UserForm = props => {
  const [formIntent] = Form.useForm();
  const [settingsList, setSettingsList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  //初始化数据

  useEffect(() => {
    listReq.run({kind: 'User'});
  }, []);

  const listReq = useRequest(getCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      setSettingsList(result);
    }, onError: (error, params) => {
    },
  });

  const createReq = useRequest(postCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      listReq.run({kind: 'User'});
    }, onError: (error, params) => {
    },
  });

  const updateReq = useRequest(putCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      listReq.run({kind: 'User'});
    }, onError: (error, params) => {
    },
  });

  const destroyReq = useRequest(deleteCoreSettingAPI, {
    manual: true, onSuccess: (result, params) => {
      listReq.run({kind: 'User'});
    }, onError: (error, params) => {
    },
  });

  const onUpdate = values => {
    if (values.password !== values.confirm) {
      message.error('This is an error message')
    } else {
      let params = {
        kind: 'User', tag: 'default', setting: {...values},
      };
      createReq.run(params);
    }
  };

  return (<Card
    styles={{body: {padding: "0px 0px 0px 0px"}}}
  >
    <DocIcon url="https://www.yuque.com/vipersec/help/atz5qaexqzxz1oc0"/>
    <Row>
      <Table
        columns={[
          {
            title: formatText('app.systemsetting.username'), dataIndex: 'username', width: 240,
          }, {
            title: formatText('app.systemsetting.superuser'), dataIndex: 'is_superuser', width: 80,
            render: (text, record) => {
              if (record.is_superuser) {
                return (<Tag color="lime">Y</Tag>);
              }
            },
          }, {
            dataIndex: 'operation', width: 80, render: (text, record) => {
              return <div style={{textAlign: 'center'}}>
                <Space size="middle">
                  {record.username === "root" ? null : <a
                    onClick={() => destroyReq.run({
                      kind: 'User', tag: 'default', setting: {username: record.username},
                    })}
                    style={{color: 'red'}}
                  >
                    {formatText('app.core.delete')}
                  </a>}
                </Space></div>;
            },
          }]}
        dataSource={settingsList}
        pagination={false}
        size="small"
        loading={listReq.loading}
        style={{
          // overflow: "auto", minHeight: listitemHeight, maxHeight: listitemHeight,
          // padding: 24,
          width: 400,
        }}
        // scroll={{ y: listitemHeight - 32 }}
      />
    </Row>
    <Row>
      <Form
        style={{padding: 24}}
        form={formIntent}
        onFinish={onUpdate}
        layout="inline"
      >
        <Form.Item
          label={formatText('app.systemsetting.username')}
          name="username"
          rules={[
            {
              required: true, message: formatText('app.systemsetting.inputkey'),
            }]}
        >
          <Input style={{width: 200}}/>
        </Form.Item>
        <Form.Item
          label={formatText('app.systemsetting.password')}
          name="password"
          rules={[
            {
              required: true, message: formatText('app.systemsetting.ph'),
            }]}
        >
          <Input.Password style={{width: 200}}/>
        </Form.Item>
        <Form.Item
          label={formatText('app.systemsetting.confirm')}
          name="confirm"
          rules={[
            {
              required: true, message: formatText('app.systemsetting.password.ph'),
            }]}
        >
          <Input.Password style={{width: 200}}/>
        </Form.Item>
        <Form.Item>
          <Button
            icon={<PlusOutlined/>}
            type="primary"
            htmlType="submit"
            loading={createReq.loading}
          >
            <span style={{marginLeft: 4}}>{formatText('app.core.add')}</span>
          </Button>
        </Form.Item>
      </Form>

    </Row>
  </Card>);
};

export const SystemSettingMemo = memo(SystemSetting);

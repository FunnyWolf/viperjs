import React, { memo, useState } from "react";
import {
  deleteCoreUUIDJsonAPI,
  getCoreSettingAPI, getLastestVersion,
  getServiceStatusAPI,
  postCoreSettingAPI,
  putPostmodulePostModuleConfigAPI
} from "@/services/apiv1";
import { history, useRequest } from "umi";

import { setToken } from "@/utils/authority";
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  List,
  Popover,
  Row,
  Select,
  Space,
  Switch,
  Tabs,
  Tag,
  Typography
} from "antd";
import {
  CheckOutlined,
  CloudDownloadOutlined,
  DeleteOutlined,
  DeliveredProcedureOutlined,
  LogoutOutlined,
  MailOutlined,
  MinusOutlined,
  ReloadOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { useLocalStorageState } from "ahooks";

import { reloadAuthorized } from "@/utils/Authorized";
import { formatText } from "@/utils/locales";
import { DocIcon } from "@/pages/Core/Common";

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;
import { Version } from "@/config";

const viper_version = "v1.6.4";
const viper_update_date = Version;


const buttonItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 4
    }
  }
};

const inputItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

const SystemSetting = () => {
  const [viperDebugFlag, setViperDebugFlag] = useLocalStorageState("viper-debug-flag", false);
  console.log("SystemSetting");
  return (
    <Tabs style={{ marginTop: -16 }} type="card" defaultActiveKey="system_info">
      <TabPane tab={formatText("app.systemsetting.aboutviper")} key="system_info">
        <SystemInfo />
      </TabPane>
      <TabPane tab="Quake API" key="Quake">
        <QuakeForm />
      </TabPane>
      <TabPane tab="Zoomeye API" key="Zoomeye">
        <ZoomeyeForm />
      </TabPane>
      {viperDebugFlag ? (
        <TabPane tab="FOFA API" key="FOFA">
          <FOFAForm />
        </TabPane>
      ) : null}
      <TabPane tab={formatText("app.systemsetting.serverchan")} key="serverchan">
        <ServerChanForm />
      </TabPane>
      <TabPane tab="DingDing Bot" key="dingding">
        <DingDingForm />
      </TabPane>
      <TabPane tab="Telegram Bot" key="telegram">
        <TelegramForm />
      </TabPane>
      <TabPane tab={formatText("app.systemsetting.sessionmonitor")} key="sessionmonitor">
        <SessionMonitorForm />
      </TabPane>
      <TabPane tab={formatText("app.systemsetting.networkconfig")} key="lhost">
        <LHostForm />
      </TabPane>

      {/*{viperDebugFlag ? (*/}
      {/*  <TabPane*/}
      {/*    tab={*/}
      {/*      <div className={styles.tabPanediv}>*/}
      {/*        <MailOutlined />*/}
      {/*        <span className={styles.tabPanespan}>TEST</span>*/}
      {/*      </div>*/}
      {/*    }*/}
      {/*    key="CollectSandbox"*/}
      {/*  >*/}
      {/*    <CollectSandboxMemo />*/}
      {/*  </TabPane>*/}
      {/*) : null}*/}
    </Tabs>
  );
};

export const SystemSettingMemo = memo(SystemSetting);

const SystemInfo = () => {
  const datas = [
    {
      name: "metasploit-framework",
      url: "https://github.com/rapid7/metasploit-framework/blob/master/LICENSE"
    },
    {
      name: "ant-design-pro",
      url: "https://github.com/ant-design/ant-design-pro/blob/master/LICENSE"
    },
    {
      name: "django-rest-framework",
      url: "https://github.com/encode/django-rest-framework/blob/master/LICENSE.md"
    }
  ];

  const [serviceStatusActive, setServiceStatusActive] = useState({ json_rpc: { status: false } });
  const [lastestVersion, setLastestVersion] = useState(null);
  const [lastestVersionLoading, setLastestVersionLoading] = useState(false);
  const [viperDebugFlag, setViperDebugFlag] = useLocalStorageState("viper-debug-flag", false);
  const [onlyShowSession, setOnlyShowSession] = useLocalStorageState("only-show-session", false);

  //初始化数据
  useRequest(getServiceStatusAPI, {
    onSuccess: (result, params) => {
      setServiceStatusActive(result);
    },
    onError: (error, params) => {
    }
  });

  const getLastestVersionReq = () => {
    const repoName = "Viper";
    const userName = "FunnyWolf";
    const url = `https://api.github.com/repos/${userName}/${repoName}/releases/latest`;
    setLastestVersionLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setLastestVersion(data.name);
        setLastestVersionLoading(false);
      });
  };

  const listServiceStatusReq = useRequest(getServiceStatusAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setServiceStatusActive(result);
    },
    onError: (error, params) => {
    }
  });

  //初始化数据
  const downloadlogReq = useRequest(() => getCoreSettingAPI({ kind: "downloadlog" }), {
    manual: true,
    onSuccess: (result, params) => {
    },
    onError: (error, params) => {
    }
  });


  const updatePostmodulePostModuleConfigReq = useRequest(putPostmodulePostModuleConfigAPI, {
    manual: true,
    onSuccess: (result, params) => {

    },
    onError: (error, params) => {
    }
  });

  const deleteUuidJsonReq = useRequest(deleteCoreUUIDJsonAPI, {
    manual: true,
    onSuccess: (result, params) => {

    },
    onError: (error, params) => {
    }
  });

  const loginOut = () => {
    const { query, pathname } = history.location;
    const { redirect } = query;
    setToken("guest");
    reloadAuthorized();
    // Note: There may be security issues, please note
    if (window.location.pathname !== "/user/login" && !redirect) {
      history.replace({
        pathname: "/user/login"
      });
    }
  };

  return (
    <Card style={{ marginTop: -16 }}>
      <DocIcon url="https://www.yuque.com/vipersec/help/vt9iyh" />
      <Row>
        <Descriptions size="small" style={{ marginLeft: 64 }} column={5}>
          <Descriptions.Item label={formatText("app.systemsetting.version")}>
            <Tag color="blue">{viper_update_date}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={formatText("app.systemsetting.lastversion")}>
            <Space>
              <Tag color="blue">{lastestVersion}</Tag>
              <Button
                size="small"
                style={{ width: 48 }}
                icon={<SyncOutlined />}
                onClick={() => getLastestVersionReq()}
                loading={lastestVersionLoading}
              >
              </Button>
            </Space>


          </Descriptions.Item>
          <Descriptions.Item label={formatText("app.systemsetting.updatedate")}>
            <a
              target="_blank"
              href="https://github.com/FunnyWolf/Viper/releases"
            >
              Github Releases
            </a>
          </Descriptions.Item>
          <Descriptions.Item label={formatText("app.systemsetting.documentation")}>
            <a target="_blank" href="https://www.yuque.com/vipersec">
              {formatText("app.systemsetting.documentationlink")}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label={formatText("app.systemsetting.opensourcesoftware")}>
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
                {formatText("app.systemsetting.opensourcesoftwarelink")}
              </a>
            </Popover>
          </Descriptions.Item>
        </Descriptions>
      </Row>
      <Row>
        <Descriptions size="small" style={{ marginLeft: 64, marginTop: 16 }} column={5}>
          <Descriptions.Item label={formatText("app.systemsetting.msfstatus")}>
            <Space>{serviceStatusActive.json_rpc.status ? (
              <Tag color="green">{formatText("app.core.working")}</Tag>
            ) : (
              <Tag color="red">{formatText("app.core.error")}</Tag>
            )}
              <Button
                size="small"
                style={{ width: 48 }}
                icon={<SyncOutlined />}
                onClick={() => listServiceStatusReq.run()}
                loading={listServiceStatusReq.loading}
              >
              </Button>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label={formatText("app.systemsetting.onlyshowsession")}>
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<MinusOutlined />}
              checked={onlyShowSession}
              onClick={() => {
                setOnlyShowSession(!onlyShowSession);
                location.reload();
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label={formatText("app.systemsetting.betafunction")}>
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<MinusOutlined />}
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
        <Space style={{ marginTop: 16, marginLeft: 64 }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => updatePostmodulePostModuleConfigReq.run()}
            loading={updatePostmodulePostModuleConfigReq.loading}
          >
            {formatText("app.systemsetting.reloadallmodule")}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => deleteUuidJsonReq.run()}
            loading={deleteUuidJsonReq.loading}
          >
            {formatText("app.systemsetting.deleteuuidjson")}
          </Button>
          <Button
            icon={<CloudDownloadOutlined />}
            onClick={() => downloadlogReq.run()}
            loading={downloadlogReq.loading}
          >
            {formatText("app.systemsetting.downloadlog")}
          </Button>
          <Button danger icon={<LogoutOutlined />} onClick={loginOut}>
            {formatText("app.systemsetting.logout")}
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
    () => getCoreSettingAPI({ kind: "sessionmonitor" }),
    {
      onSuccess: (result, params) => {
        setSettingsSessionMonitor(result);
        sessionMonitorForm.setFieldsValue(result);
      },
      onError: (error, params) => {
      }
    }
  );

  const updateSessionMonitorReq = useRequest(postCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSettingsSessionMonitor(result);
      sessionMonitorForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    }
  });

  const onUpdateSessionMonitor = () => {
    let params = {
      kind: "sessionmonitor",
      tag: "default",
      setting: {
        flag: !settingsSessionMonitor.flag
      }
    };
    updateSessionMonitorReq.run(params);
  };

  return (<Card style={{ marginTop: -16 }}>
    <DocIcon url="https://www.yuque.com/vipersec/help/myo3a0" />
    <Row>
      <Col xs={24} sm={16}>
        <Form {...inputItemLayout}>
          <Form.Item label={formatText("app.systemsetting.switch")}>
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<MinusOutlined />}
              checked={settingsSessionMonitor.flag}
              onClick={() => onUpdateSessionMonitor()}
            />
          </Form.Item>
        </Form>
      </Col>
      <Col span={8}>
        <Typography>
          <Paragraph>
            <Title level={4}>{formatText("app.systemsetting.howtoconfig")}</Title>
            <Text>
              {formatText("app.systemsetting.sessionmonitorreadme")}
            </Text>
            <br />
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
      {d.user + " : " + d.chat_id}
    </Option>
  ));
  //初始化数据
  const initListTelegramReq = useRequest(() => getCoreSettingAPI({ kind: "telegram" }), {
    onSuccess: (result, params) => {
      setSettingsTelegram(result);
      telegramForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    }
  });

  const updateTelegramReq = useRequest(postCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      if (params.tag === "check") {
        setUserChatIdList(result);
      } else {
        setSettingsTelegram(result);
      }
      telegramForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    }
  });

  const onUpdateTelegram = values => {
    let params = {};
    if (values.chat_id === "" || values.chat_id === undefined) {
      params = {
        kind: "telegram",
        tag: "check",
        setting: { ...values }
      };
    } else {
      params = {
        kind: "telegram",
        tag: "default",
        setting: { ...values }
      };
    }

    updateTelegramReq.run(params);
  };

  return (<Card style={{ marginTop: -16 }}>
    <Row>
      <DocIcon url="https://www.yuque.com/vipersec/help/su4tv8" />
      <Col span={16}>
        <Form onFinish={onUpdateTelegram} form={telegramForm} {...inputItemLayout}>
          <Form.Item
            label="token"
            name="token"
            rules={[
              {
                required: true,
                message: formatText("app.systemsetting.inputtoken")
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="chat_id" name="chat_id" rules={[]}>
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder={formatText("app.systemsetting.selectorinputchatid")}
              defaultValue={[]}
              optionLabelProp="label"
            >
              {chat_id_options}
            </Select>
          </Form.Item>

          <Form.Item label="proxy" name="proxy" rules={[]}>
            <Input />
          </Form.Item>
          <Row>
            <Col style={{ marginBottom: 24 }} span={4} offset={4}>
              {settingsTelegram.alive ? (
                <Badge status="processing" text={formatText("app.core.working")} />
              ) : (
                <Badge status="error" text={formatText("app.core.error")} />
              )}
            </Col>
          </Row>
          <Form.Item {...buttonItemLayout}>
            <Button
              icon={<DeliveredProcedureOutlined />}
              type="primary"
              htmlType="submit"
              loading={updateTelegramReq.loading}
            >
              {formatText("app.systemsetting.updateorgetchatid")}
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={8}>
        <Typography>
          <Paragraph>
            <Title level={4}>{formatText("app.systemsetting.howtoconfig")}</Title>
            <Text>{formatText("app.systemsetting.opentelegram")}</Text>
            <br />
            <a
              target="_blank"
              href="https://longnight.github.io/2018/12/12/Telegram-Bot-notifications"
            >
              {formatText("app.systemsetting.telegramreadme")}
            </a>
            <br />
            <Text>
              {formatText("app.systemsetting.telegramdoc_1")}
              <br />
              {formatText("app.systemsetting.telegramdoc_2")}
              <Text code>{formatText("app.systemsetting.updateorgetchatid")}</Text>
              {formatText("app.systemsetting.telegramdoc_3")}
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
  const initListDingDingReq = useRequest(() => getCoreSettingAPI({ kind: "dingding" }), {
    onSuccess: (result, params) => {
      setSettingsDingDing(result);
      dingdingForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    }
  });

  const updateDingDingReq = useRequest(postCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSettingsDingDing(result);
      dingdingForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    }
  });

  const onUpdateDingDing = values => {
    let params = {
      kind: "dingding",
      tag: "default",
      setting: { ...values }
    };
    updateDingDingReq.run(params);
  };

  return (<Card style={{ marginTop: -16 }}>
    <Row>
      <DocIcon url="https://www.yuque.com/vipersec/help/bogo5k" />
      <Col span={16}>
        <Form onFinish={onUpdateDingDing} form={dingdingForm} {...inputItemLayout}>
          <Form.Item
            label="access_token"
            name="access_token"
            rules={[
              {
                required: true,
                message: formatText("app.systemsetting.dingdingrules")
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={formatText("app.systemsetting.keyword")}
            name="keyword"
            rules={[
              {
                required: true,
                message: formatText("app.systemsetting.inputkeyword")
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Row>
            <Col style={{ marginBottom: 24 }} span={4} offset={4}>
              {settingsDingDing.alive ? (
                <Badge status="processing" text={formatText("app.core.working")} />
              ) : (
                <Badge status="error" text={formatText("app.core.error")} />
              )}
            </Col>
          </Row>
          <Form.Item {...buttonItemLayout}>
            <Button
              icon={<DeliveredProcedureOutlined />}
              type="primary"
              htmlType="submit"
              loading={updateDingDingReq.loading}
            >
              {formatText("app.core.update")}
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={8}>
        <Typography>
          <Paragraph>
            <Title level={4}>{formatText("app.systemsetting.howtoconfig")}</Title>
            <Text>{formatText("app.systemsetting.opendingding")}</Text>
            <br />
            <a target="_blank" href="https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq">
              {formatText("app.systemsetting.dingdingreadme")}
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
  const initListServerChanReq = useRequest(() => getCoreSettingAPI({ kind: "serverchan" }), {
    onSuccess: (result, params) => {
      setSettingsServerChan(result);
      serverchanForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    }
  });

  const updateServerChanReq = useRequest(postCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSettingsServerChan(result);
      serverchanForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    }
  });

  const onUpdateServerChan = values => {
    let params = {
      kind: "serverchan",
      tag: "default",
      setting: { ...values }
    };
    updateServerChanReq.run(params);
  };

  return (<Card style={{ marginTop: -16 }}>
      <Row>
        <DocIcon url="https://www.yuque.com/vipersec/help/uw2aha" />
        <Col span={16}>
          <Form onFinish={onUpdateServerChan} form={serverchanForm} {...inputItemLayout}>
            <Form.Item
              label="SendKey"
              name="sendkey"
              rules={[
                {
                  required: true,
                  message: formatText("app.systemsetting.inputsendkey")
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Row>
              <Col style={{ marginBottom: 24 }} span={4} offset={4}>
                {settingsServerChan.alive ? (
                  <Badge status="processing" text={formatText("app.core.working")} />
                ) : (
                  <Badge status="error" text={formatText("app.core.error")} />
                )}
              </Col>
            </Row>
            <Form.Item {...buttonItemLayout}>
              <Button
                icon={<DeliveredProcedureOutlined />}
                type="primary"
                htmlType="submit"
                loading={updateServerChanReq.loading}
              >
                {formatText("app.core.update")}
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={8}>
          <Typography>
            <Paragraph>
              <Title level={4}>{formatText("app.systemsetting.howtoconfig")}</Title>
              <Text>{formatText("app.systemsetting.openserverchan")}</Text>
              <br />
              <a target="_blank" href="https://sct.ftqq.com/">
                {formatText("app.systemsetting.serverchanapireadme")}
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
  const initListFOFAReq = useRequest(() => getCoreSettingAPI({ kind: "FOFA" }), {
    onSuccess: (result, params) => {
      setSettingsFOFA(result);
      fofaForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    }
  });

  const updateFOFAReq = useRequest(postCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSettingsFOFA(result);
      fofaForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    }
  });

  const onUpdateFOFA = values => {
    let params = {
      kind: "FOFA",
      tag: "default",
      setting: { ...values }
    };
    updateFOFAReq.run(params);
  };

  return (
    <Card style={{ marginTop: -16 }}>
      <DocIcon url="https://www.yuque.com/vipersec/help/mboabvam043nwd46" />
      <Row>
        <Col span={16}>
          <Form form={fofaForm} onFinish={onUpdateFOFA} {...inputItemLayout}>
            <Form.Item
              label="email"
              name="email"
              rules={[
                {
                  required: true,
                  message: formatText("app.systemsetting.inputemail")
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="key"
              name="key"
              rules={[
                {
                  required: true,
                  message: formatText("app.systemsetting.inputkey")
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Row>
              <Col style={{ marginBottom: 24 }} span={4} offset={4}>
                {settingsFOFA.alive ? (
                  <Badge status="processing" text={formatText("app.core.working")} />
                ) : (
                  <Badge status="error" text={formatText("app.core.error")} />
                )}
              </Col>
            </Row>

            <Form.Item {...buttonItemLayout}>
              <Space>
                <Button
                  icon={<DeliveredProcedureOutlined />}
                  type="primary"
                  htmlType="submit"
                  loading={updateFOFAReq.loading}
                >
                  {formatText("app.core.update")}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
        <Col span={8}>
          <Typography>
            <Paragraph>
              <Title level={4}>{formatText("app.systemsetting.howtoconfig")}</Title>
              <Text>{formatText("app.systemsetting.openfofavip")}</Text>
              <br />
              <a
                target="_blank"
                href="https://fofa.so/static_pages/api_help">{formatText("app.systemsetting.fofaapireadme")}</a>
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
  const initListQuakeReq = useRequest(() => getCoreSettingAPI({ kind: "Quake" }), {
    onSuccess: (result, params) => {
      setSettingsQuake(result);
      quakeForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    }
  });

  const updateQuakeReq = useRequest(postCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSettingsQuake(result);
      quakeForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    }
  });

  const onUpdateQuake = values => {
    let params = {
      kind: "Quake",
      tag: "default",
      setting: { ...values }
    };
    updateQuakeReq.run(params);
  };

  return (
    <Card style={{ marginTop: -16 }}>
      <DocIcon url="https://www.yuque.com/vipersec/help/hufexqh266gf76s9" />
      <Row>
        <Col span={16}>
          <Form form={quakeForm} onFinish={onUpdateQuake} {...inputItemLayout}>
            <Form.Item
              label="key"
              name="key"
              rules={[
                {
                  required: true,
                  message: formatText("app.systemsetting.inputkey")
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Row>
              <Col style={{ marginBottom: 24 }} span={4} offset={4}>
                {settingsQuake.alive ? (
                  <Badge status="processing" text={formatText("app.core.working")} />
                ) : (
                  <Badge status="error" text={formatText("app.core.error")} />
                )}
              </Col>
            </Row>
            <Form.Item {...buttonItemLayout}>
              <Space>
                <Button
                  icon={<DeliveredProcedureOutlined />}
                  type="primary"
                  htmlType="submit"
                  loading={updateQuakeReq.loading}
                >
                  {formatText("app.core.update")}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
        <Col span={8}>
          <Typography>
            <Paragraph>
              <Title level={4}>{formatText("app.systemsetting.howtoconfig")}</Title>
              <Text>{formatText("app.systemsetting.openquakevip")}</Text>
              <br />
              <a
                target="_blank"
                href="https://quake.360.cn/quake/#/help?title=%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E">
                {formatText("app.systemsetting.quakeapireadme")}
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
  const initListZoomeyeReq = useRequest(() => getCoreSettingAPI({ kind: "Zoomeye" }), {
    onSuccess: (result, params) => {
      setSettingsZoomeye(result);
      zoomeyeForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    }
  });

  const updateZoomeyeReq = useRequest(postCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setSettingsZoomeye(result);
      zoomeyeForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    }
  });

  const onUpdateZoomeye = values => {
    let params = {
      kind: "Zoomeye",
      tag: "default",
      setting: { ...values }
    };
    updateZoomeyeReq.run(params);
  };

  return (
    <Card style={{ marginTop: -16 }}>
      <DocIcon url="https://www.yuque.com/vipersec/help/mcn0wyw0sx76p859" />
      <Row>
        <Col span={16}>
          <Form form={zoomeyeForm} onFinish={onUpdateZoomeye} {...inputItemLayout}>
            <Form.Item
              label="key"
              name="key"
              rules={[
                {
                  required: true,
                  message: formatText("app.systemsetting.inputkey")
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Row>
              <Col style={{ marginBottom: 24 }} span={4} offset={4}>
                {settingsZoomeye.alive ? (
                  <Badge status="processing" text={formatText("app.core.working")} />
                ) : (
                  <Badge status="error" text={formatText("app.core.error")} />
                )}
              </Col>
            </Row>
            <Form.Item {...buttonItemLayout}>
              <Space>
                <Button
                  icon={<DeliveredProcedureOutlined />}
                  type="primary"
                  htmlType="submit"
                  loading={updateZoomeyeReq.loading}
                >
                  {formatText("app.core.update")}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
        <Col span={8}>
          <Typography>
            <Paragraph>
              <Title level={4}>{formatText("app.systemsetting.howtoconfig")}</Title>
              <Text>{formatText("app.systemsetting.openzoomeyevip")}</Text>
              <br />
              <a
                target="_blank"
                href="https://www.zoomeye.org/doc">
                {formatText("app.systemsetting.zoomeyeapireadme")}
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
    wrapperCol: { span: 16 }
  };
  const buttonLHostFormLayout = {
    wrapperCol: {
      span: 16,
      offset: 4
    }
  };

  // const [lhost, setLhost] = useState({});
  //初始化数据
  const initListLHostReq = useRequest(() => getCoreSettingAPI({ kind: "lhost" }), {
    onSuccess: (result, params) => {
      lHostForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    }
  });

  const updateLHostReq = useRequest(postCoreSettingAPI, {
    manual: true,
    onSuccess: (result, params) => {
      lHostForm.setFieldsValue(result);
    },
    onError: (error, params) => {
    }
  });

  const onUpdateLhost = values => {
    let params = {
      kind: "lhost",
      setting: { ...values }
    };
    updateLHostReq.run(params);
  };

  return (<Card style={{ marginTop: -16 }}>
    <DocIcon url="https://www.yuque.com/vipersec/help/mprur0" />
    <Row>
      <Col span={16}>
        <Form form={lHostForm}
              onFinish={onUpdateLhost}
              {...lHostFormLayout}>
          <Form.Item
            label={formatText("app.systemsetting.defaultlhost")}
            name="lhost"
            rules={[
              {
                required: true,
                message: formatText("app.systemsetting.defaultlhosttooltip")
              }
            ]}
          >
            <Input style={{ width: "80%" }} placeholder={formatText("app.systemsetting.defaultlhostplaceholder")} />
          </Form.Item>

          <Form.Item {...buttonLHostFormLayout}>
            <Button
              icon={<DeliveredProcedureOutlined />}
              type="primary"
              htmlType="submit"
              loading={updateLHostReq.loading}
            >
              {formatText("app.core.update")}
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={8}>
        <Typography>
          <Paragraph>
            <Title level={4}>{formatText("app.systemsetting.howtoconfig")}</Title>
            <Text strong>{formatText("app.systemsetting.defaultlhost")}: </Text>
            {formatText("app.systemsetting.defaultlhostdoc_1")}
            <br />
            <Text>{formatText("app.systemsetting.defaultlhostdoc_2")}</Text>
            <br />
            Nginx:<Text code>0.0.0.0:60000</Text>
            <br />
            Redis:<Text code>127.0.0.1:60004</Text>
            <br />
            Msfrpcd:<Text code>127.0.0.1:60005</Text>
            <br />
            {formatText("app.systemsetting.defaultlhostdoc_ssh")}
            <Text code>0.0.0.0:60010</Text>
          </Paragraph>
        </Typography>
      </Col>
    </Row>
  </Card>);
};

export default SystemSetting;

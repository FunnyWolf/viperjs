import React, { Fragment, useEffect, useRef, useState } from "react";
import { useModel, useRequest } from "umi";
import { useInterval } from "ahooks";
import { deleteWebNoticesAPI, getCoreCurrentUserAPI } from "@/services/apiv1";
import { BankOutlined, BellOutlined, DeleteOutlined, GlobalOutlined, ScanOutlined, SettingOutlined } from "@ant-design/icons";

import { Button, Col, ConfigProvider, FloatButton, List, Modal, Row, Space, Tabs, Tag, theme, Typography } from "antd-v5";
import GridContent from "@/components/PageHeaderWrapper/GridContent";

import { IPDomainMemo } from "@/pages/Core/IPDomain";

import { SystemSettingMemo } from "@/pages/Core/SystemSetting";
import { getToken } from "@/utils/authority";
import { formatText } from "@/utils/locales";
import { HostIP } from "@/config";
import { ProjectButton } from "@/pages/Core/Project";
import { RunWebModuleMemo } from "@/pages/Core/WebModule";
import { MyIcon } from "@/pages/Core/Common";
import { getLocale } from "@@/plugin-locale/localeExports";
import { cssCalc } from "@/utils/utils";
import moment from "moment/moment";
import { CompanyMemo } from '@/pages/Core/Company'

const { Text } = Typography;
const { TabPane } = Tabs;
let protocol = "ws://";
let webHost = HostIP + ":8002";
if (process.env.NODE_ENV === "production") {
  webHost = location.hostname + (location.port ? `:${location.port}` : "");
  protocol = "wss://";
}

const TabsOptions = () => {
  return <><Space
    style={{
      paddingTop: 1, paddingBottom: 2, paddingRight: 4,
    }}>
    <WebNotice/>
    <ProjectButton/>
  </Space>

  </>;
};

const TabsTop = () => {
  console.log("TabsBottom");
  const {
    setHeatbeatsocketalive, setWebModuleOptions,
  } = useModel("HostAndSessionModel", model => ({
    setHeatbeatsocketalive: model.setHeatbeatsocketalive, setWebModuleOptions: model.setWebModuleOptions,
  }));

  const {
    setWebjobList, setWebTaskResultList, setWebTaskResultListActive, setNotices,
  } = useModel("WebMainModel", model => ({
    setNotices: model.setNotices,
    setWebjobList: model.setWebjobList,
    setWebTaskResultList: model.setWebTaskResultList,
    setWebTaskResultListActive: model.setWebTaskResultListActive,
  }));

  let ipdomainRef = React.createRef();
  const tabActiveOnChange = activeKey => {
    switch (activeKey) {
      case "IPDomain":
        if (ipdomainRef.current === null) {
        } else {
          ipdomainRef.current.updateData();
        }
        break;
      case "SystemSetting":
        break;
      default:
    }
  };

  const tabPanedivSytle = {
    // marginLeft: '-6px', marginRight: '-6px',
  };
  const tabPanespanSytle = {
    // marginLeft: '-4px',
  };

  const listCurrentUserReq = useRequest(getCoreCurrentUserAPI, {
    manual: true, onSuccess: (result, params) => {
    }, onError: (error, params) => {
    },
  });

  const urlpatterns = "/ws/v1/websocket/websync/?";
  const urlargs = `&token=${getToken()}`;
  const socketUrl = protocol + webHost + urlpatterns + urlargs;

  const ws = useRef(null);

  const initWebSync = () => {
    try {
      listCurrentUserReq.run();
      ws.current = new WebSocket(socketUrl);
    } catch (error) {
      return;
    }

    ws.current.onopen = () => {
      setHeatbeatsocketalive(true);
    };
    ws.current.onclose = CloseEvent => {
      setHeatbeatsocketalive(false);
    };
    ws.current.onerror = ErrorEvent => {
      setHeatbeatsocketalive(false);
    };
    ws.current.onmessage = event => {
      const response = JSON.parse(event.data);

      const { module_options } = response;
      const { module_options_update } = response;

      const { jobs_update } = response;
      const { jobs } = response;

      const { task_result_update } = response;
      const { task_result } = response;

      const { notices_update } = response;
      const { notices } = response;

      if (module_options_update) {
        setWebModuleOptions(module_options.filter(item => item.BROKER.indexOf("web") === 0));
      }

      if (jobs_update) {
        setWebjobList(jobs);
      }

      if (task_result_update) {
        setWebTaskResultList(task_result);
        setWebTaskResultListActive(task_result);
      }

      if (notices_update) {
        setNotices(notices);
      }
    };
  };

  const websyncmonitor = () => {
    if (ws.current !== undefined && ws.current !== null && ws.current.readyState === WebSocket.OPEN) {
    } else {
      try {
        ws.current.close();
      } catch (error) {
      }
      try {
        ws.current = null;
      } catch (error) {
      }
      initWebSync();
    }
  };
  useInterval(() => websyncmonitor(), 3000);
  useEffect(() => {
    initWebSync();
    return () => {
      try {
        ws.current.close();
      } catch (error) {
      }
      try {
        ws.current = null;
      } catch (error) {
      }
    };
  }, []);

  return (<Tabs
    style={{ margin: 1 }}
    tabBarExtraContent={<TabsOptions/>}
    type="card"
    onChange={tabActiveOnChange}
  >
    <TabPane
      tab={<div style={tabPanedivSytle}>
        <GlobalOutlined/>
        <span style={tabPanespanSytle}>{formatText("app.webmain.tab.ipdomain")}</span>
      </div>}
      key="IPDomain"
    >
      <IPDomainMemo onRef={ipdomainRef}/>
    </TabPane>
    <TabPane
      tab={<div style={tabPanedivSytle}>
        <BankOutlined/>
        <span style={tabPanespanSytle}>{formatText("app.webmain.tab.company")}</span>
      </div>}
      key="Company"
    >
      <CompanyMemo/>
    </TabPane>
    <TabPane
      tab={<div style={tabPanedivSytle}>
        <ScanOutlined/>
        <span style={tabPanespanSytle}>{formatText("app.webmain.tab.webscan")}</span>
      </div>}
      key="WebScan"
    >
      <RunWebModuleMemo/>
    </TabPane>
    {/*<TabPane*/}
    {/*  tab={<div style={tabPanedivSytle}>*/}
    {/*    <TaskQueueTagMemo/>*/}
    {/*    <span style={tabPanespanSytle}>{formatText("app.hostandsession.tab.JobList")}</span>*/}
    {/*  </div>}*/}
    {/*  key="JobList"*/}
    {/*>*/}
    {/*  <WebRealTimeJobsMemo/>*/}
    {/*</TabPane>*/}
    <TabPane
      tab={<div style={tabPanedivSytle}>
        <SettingOutlined/>
        <span
          style={tabPanespanSytle}>{formatText("app.hostandsession.tab.SystemSetting")}</span>
      </div>}
      key="SystemSetting"
    >
      <SystemSettingMemo/>
    </TabPane>
  </Tabs>);
};
const KeyToUserIcon = {
  "0": "icon-yuanxingbaoshi",
  "1": "icon-sanjiaobaoshi",
  "2": "icon-shuidibaoshi",
  "3": "icon-liujiaobaoshi",
  "4": "icon-lingxingbaoshi",
  "5": "icon-duojiaobaoshi",
};
const WebNotice = () => {
  const [noticeModalVisible, setNoticeModalVisible] = useState(false);
  const { notices, setNotices } = useModel("WebMainModel", model => ({
    notices: model.notices, setNotices: model.setNotices,
  }));
  const [refresh, setRefresh] = useState(false);
  useInterval(() => setRefresh(!refresh), 60000);
  const {
    resizeUpHeight, resizeDownHeight, setResizeDownHeight,
  } = useModel("Resize", model => ({
    resizeUpHeight: model.resizeUpHeight, resizeDownHeight: model.resizeDownHeight, setResizeDownHeight: model.setResizeDownHeight,
  }));

  const userIconLarge = key => {
    return (<MyIcon
      type={KeyToUserIcon[key]}
      style={{
        padding: "0px 0px 0px 0px", fontSize: "16px",
      }}
    />);
  };

  const NoticesList = props => {
    const getContent = item => {
      const content = item[getLocale()];
      if (item.level === 0) {
        return (<Text style={{ color: "#49aa19", wordBreak: "break-all" }}>
          {content}
        </Text>);
      }
      if (item.level === 1) {
        return (<Text style={{ color: "#13a8a8", wordBreak: "break-all" }}>
          {content}
        </Text>);
      }
      if (item.level === 2) {
        return (<Text type="warning" style={{ wordBreak: "break-all" }}>
          {content}
        </Text>);
      }
      if (item.level === 3) {
        return (<Text type="danger" style={{ wordBreak: "break-all" }}>
          {content}
        </Text>);
      }
      if (item.level === 4) {
        return (<Text mark style={{ wordBreak: "break-all" }}>
          {content}
        </Text>);
      }
      if (item.level === 5) {
        // 提醒
        return (<Text style={{ color: "#642ab5", wordBreak: "break-all" }}>
          {content}
        </Text>);
      }
      if (item.level === 6) {
        return (<Space>
          {userIconLarge(item.userkey)}
          <Text style={{ color: "#cb2b83", wordBreak: "break-all" }}>
            {">"} {content}
          </Text>
        </Space>);
      }
      return (<Text type="warning" style={{ wordBreak: "break-all" }}>
        {content}
      </Text>);
    };
    return (<List
      id="noticescard"
      style={{
        overflow: "auto", maxHeight: cssCalc(`${resizeDownHeight} - 30px`), minHeight: cssCalc(`${resizeDownHeight} - 30px`),
      }}
      split={false}
      size="small"
      bordered
      itemLayout="horizontal"
      dataSource={props.notices}
      renderItem={item => (<List.Item style={{ padding: "0px 0px 0px 0px" }}>
        <div
          style={{
            display: "inline", marginTop: 0, marginBottom: 0,
          }}
        >
          <Tag
            color="cyan"
            style={{
              marginLeft: -1, marginRight: 4, textAlign: "center",
            }}
          >
            {moment(item.time * 1000).format("MM-DD HH:mm:ss")}
          </Tag>
          {getContent(item)}
        </div>
      </List.Item>)}
    >
      <FloatButton.BackTop/>
    </List>);
  };

  const deleteNoticesReq = useRequest(deleteWebNoticesAPI, {
    manual: true, onSuccess: (result, params) => {
      setNotices([]);
    }, onError: (error, params) => {
    },
  });

  return <>
    <Button icon={<BellOutlined/>}
            onClick={() => setNoticeModalVisible(true)}
    />
    <Modal
      // style={{ top: 20 }}
      width="40vw"
      destroyOnClose
      open={noticeModalVisible}
      footer={null}
      closable={false}
      onCancel={() => setNoticeModalVisible(false)}
    >
      <NoticesList notices={notices}/>
      <Row>
        <Col span={4}>
          <Button icon={<DeleteOutlined/>} block danger
                  onClick={() => deleteNoticesReq.run()}>
            {formatText("app.core.clear")}
          </Button>
        </Col>
      </Row>
    </Modal>
  </>;
};

const WebMain = props => {
  console.log("WebMain");
  useEffect(() => {
  }, []);

  return (<GridContent>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm, // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
        token: {
          // fontSizeSM: 16,
        }, components: {
          Table: {
            cellPaddingBlockSM: 4, headerBorderRadius: 2,
          }, Descriptions: {}, Tabs: {
            horizontalMargin: "0 0 0 0", /* 这里是你的组件 token */
          },
        },
      }}
    >
      <TabsTop/>
    </ConfigProvider>
  </GridContent>);
};
export default WebMain;

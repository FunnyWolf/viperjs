import React, { useEffect, useRef } from "react";
import { useModel, useRequest } from "umi";
import { useInterval } from "ahooks";
import { getCoreCurrentUserAPI, getWebdatabaseProjectAPI } from "@/services/apiv1";

import { CustomerServiceOutlined, SettingOutlined } from "@ant-design/icons";

import { Button, Input, Modal, Select, Space, Tabs, Typography } from "antd";
import GridContent from "@/components/PageHeaderWrapper/GridContent";

import { IPDomainMemo } from "@/pages/Core/IPDomain";

import { SystemSettingMemo } from "@/pages/Core/SystemSetting";
import { getToken } from "@/utils/authority";
import { formatText } from "@/utils/locales";
import { HostIP } from "@/config";
import { ProjectButton } from "@/pages/Core/Project";
import styles from "@/utils/utils.less";

const { Text } = Typography;
const { Paragraph } = Typography;
const { Option } = Select;
const ButtonGroup = Button.Group;
const { Search, TextArea } = Input;
const { TabPane } = Tabs;
const { confirm } = Modal;


const WebMain = props => {
  console.log("WebMain");

  useEffect(() => {
  }, []);

  return (<GridContent>
    <TabsBottom />
  </GridContent>);
};

const TabsOptions = () => {
  return <Space
    style={{
      paddingTop: 1,
      paddingBottom: 2
    }}><ProjectButton /></Space>;
};

const TabsBottom = () => {
  console.log("TabsBottom");
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
    marginLeft: "-6px", marginRight: "-6px"
  };
  const tabPanespanSytle = {
    marginLeft: "-4px"
  };

  return (<Tabs
    tabBarExtraContent={<TabsOptions />}
    type="card"
    onChange={tabActiveOnChange}
  >
    <TabPane
      tab={<div style={tabPanedivSytle}>
        <CustomerServiceOutlined />
        <span style={tabPanespanSytle}>{formatText("app.webmain.tab.ipdomain")}</span>
      </div>}
      key="IPDomain"
    >
      <div
        style={{
          marginTop: -16
        }}
      >
        <IPDomainMemo onRef={ipdomainRef} />
      </div>
    </TabPane>
    <TabPane
      tab={<div style={tabPanedivSytle}>
        <SettingOutlined />
        <span
          style={tabPanespanSytle}>{formatText("app.hostandsession.tab.SystemSetting")}</span>
      </div>}
      key="SystemSetting"
    >
      <SystemSettingMemo />
    </TabPane>
  </Tabs>);
};

export default WebMain;

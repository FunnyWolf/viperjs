import React, { useEffect } from "react";
import { Button, Col, ConfigProvider, Row, theme } from "antd-v5";
import { GlobalOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { formatText } from '@/utils/locales'
import { useRequest } from "@@/plugin-request/request";
import { getCoreCurrentUserAPI } from "@/services/apiv1";

export const Nav = props => {
  console.log("Nav");
  const listCurrentUserReq = useRequest(getCoreCurrentUserAPI, {
    manual: true, onSuccess: (result, params) => {
    }, onError: (error, params) => {
    },
  });

  useEffect(() => {
    listCurrentUserReq.run();
  }, [])

  return (<ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
      // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
      token: {
        // fontSizeSM: 16,
      },
      components: {
        Table: {
          cellPaddingBlockSM: 4, headerBorderRadius: 2,
        },
        Descriptions: {},
        Tabs: {
          horizontalMargin: "0 0 0 0", /* 这里是你的组件 token */
        },
      },
    }}
  >
    <Row style={{ margin: "32px" }} gutter={[16, 16]}>
      <Col
        span={12}>
        <Button
          icon={<GlobalOutlined style={{ fontSize: '48px' }}/>}
          style={{
            height: "90vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
          href={"#/web"}
          // target={'_blank'}
        ><span style={{ fontSize: '24px' }}>{formatText("menu.web")}</span></Button>
      </Col>
      <Col
        span={12}>
        <Button
          icon={<SafetyCertificateOutlined style={{ fontSize: '48px' }}/>}
          style={{
            height: "90vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
          href={"#/main"}
        ><span style={{ fontSize: '24px' }}>{formatText("menu.main")}</span></Button>
      </Col>
    </Row>
  </ConfigProvider>);
};

export default Nav;


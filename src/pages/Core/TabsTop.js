import { useModel } from '@@/plugin-model/useModel';
import React, { useState } from 'react';
import { useRequest } from '@@/plugin-request/request';
import { deleteWebNoticesAPI } from '@/services/apiv1';
import { useInterval } from 'ahooks';

import {
  AimOutlined,
  BellOutlined,
  CompassOutlined,
  DeleteOutlined,
  FundProjectionScreenOutlined,
  GlobalOutlined,
  ScanOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { formatText } from '@/utils/locales';
import { IPDomainMemo } from '@/pages/Core/IPDomain';
import { RunWebModuleMemo } from '@/pages/Core/WebModule';
import { SystemSettingMemo } from '@/pages/Core/SystemSetting';
import { ProjectButton } from '@/pages/Core/Project';
import { Button, Col, List, Row, Space, Tabs, FloatButton, Tag } from 'antd-v5';
import { Modal, Typography } from 'antd';
import { AssetICPMemo } from '@/pages/Core/AssetICP';
import { AssetAPPMemo } from '@/pages/Core/AssetAPP';
import { AssetMediaMemo } from '@/pages/Core/AssetMedia';
import { ClueCompanyMemo } from '@/pages/Core/ClueCompany';
import { ClueFaviconMemo } from '@/pages/Core/ClueFavicon';
import { ClueCertMemo } from '@/pages/Core/ClueCert';
import { cssCalc } from '@/utils/utils';
import moment from 'moment';
import { getLocale } from 'umi';
import { MyIcon } from '@/pages/Core/Common';

const { Text, Link } = Typography;
const { TabPane } = Tabs;

const KeyToUserIcon = {
  '0': 'icon-yuanxingbaoshi',
  '1': 'icon-sanjiaobaoshi',
  '2': 'icon-shuidibaoshi',
  '3': 'icon-liujiaobaoshi',
  '4': 'icon-lingxingbaoshi',
  '5': 'icon-duojiaobaoshi',
};

const TabsOptions = () => {
  return (
    <Space>
      <Button style={{ width: 40 }} icon={<CompassOutlined />} href={'#/nav'} target={'_blank'} />
      <WebNotice />
      <ProjectButton />
    </Space>
  );
};

export const TabsTop = () => {
  console.log('TabsTop');

  let ipdomainRef = React.createRef();
  const tabActiveOnChange = activeKey => {
    switch (activeKey) {
      case 'IPDomain':
        if (ipdomainRef.current === null) {
        } else {
          ipdomainRef.current.updateData();
        }
        break;
      case 'SystemSetting':
        break;
      default:
    }
  };

  const tabPanedivSytle = {
    marginLeft: '8px',
    marginRight: '8px',
  };
  const tabPanespanSytle = {
    // marginLeft: '-4px',
    width: 400,
  };

  return (
    <Tabs
      style={{ margin: 1 }}
      tabBarExtraContent={<TabsOptions />}
      type="card"
      onChange={tabActiveOnChange}
    >
      <TabPane
        tab={
          <div style={tabPanedivSytle}>
            <FundProjectionScreenOutlined />
            <span style={tabPanespanSytle}>总览</span>
          </div>
        }
        key="Overview"
      />
      <TabPane
        tab={
          <div style={tabPanedivSytle}>
            <AimOutlined />
            <span style={tabPanespanSytle}>线索</span>
          </div>
        }
        key="Clue"
      >
        <Tabs size="small" onChange={tabActiveOnChange}>
          <TabPane
            tab={
              <div style={tabPanedivSytle}>
                <span style={tabPanespanSytle}>{formatText('app.webmain.tab.company')}</span>
              </div>
            }
            key="company"
          >
            <ClueCompanyMemo />
          </TabPane>
          <TabPane
            tab={
              <div style={tabPanedivSytle}>
                <span style={tabPanespanSytle}>WHOIS</span>
              </div>
            }
            key="whois"
          />
          <TabPane
            tab={
              <div style={tabPanedivSytle}>
                <span style={tabPanespanSytle}>邮箱</span>
              </div>
            }
            key="email"
          />
          <TabPane
            tab={
              <div style={tabPanedivSytle}>
                <span style={tabPanespanSytle}>证书</span>
              </div>
            }
            key="cert"
          >
            <ClueCertMemo />
          </TabPane>
          <TabPane
            tab={
              <div style={tabPanedivSytle}>
                <span style={tabPanespanSytle}>Favicon</span>
              </div>
            }
            key="favicon"
          >
            <ClueFaviconMemo />
          </TabPane>
          <TabPane
            tab={
              <div style={tabPanedivSytle}>
                <span style={tabPanespanSytle}>网站标题</span>
              </div>
            }
            key="web_title"
          />
        </Tabs>
      </TabPane>
      <TabPane
        tab={
          <div style={tabPanedivSytle}>
            <GlobalOutlined />
            <span style={tabPanespanSytle}>资产</span>
          </div>
        }
        key="Asset"
      >
        <Tabs
          // type="card"
          size="small"
          onChange={tabActiveOnChange}
        >
          <TabPane
            tab={
              <div style={tabPanedivSytle}>
                <span style={tabPanespanSytle}>{formatText('app.webmain.tab.ipdomain')}</span>
              </div>
            }
            key="IPDomain"
          >
            <IPDomainMemo onRef={ipdomainRef} />
          </TabPane>
          <TabPane
            tab={
              <div style={tabPanedivSytle}>
                <span style={tabPanespanSytle}>备案</span>
              </div>
            }
            key="ICP"
          >
            <AssetICPMemo />
          </TabPane>
          <TabPane
            tab={
              <div style={tabPanedivSytle}>
                <span style={tabPanespanSytle}>移动应用</span>
              </div>
            }
            key="APP"
          >
            <AssetAPPMemo />
          </TabPane>
          <TabPane
            tab={
              <div style={tabPanedivSytle}>
                <span style={tabPanespanSytle}>社交媒体</span>
              </div>
            }
            key="Media"
          >
            <AssetMediaMemo />
          </TabPane>
        </Tabs>
      </TabPane>
      <TabPane
        tab={
          <div style={tabPanedivSytle}>
            <ScanOutlined />
            <span style={tabPanespanSytle}>{formatText('app.webmain.tab.webscan')}</span>
          </div>
        }
        key="WebScan"
      >
        <RunWebModuleMemo />
      </TabPane>
      <TabPane
        tab={
          <div style={tabPanedivSytle}>
            <SettingOutlined />
            <span style={tabPanespanSytle}>
              {formatText('app.hostandsession.tab.SystemSettingShort')}
            </span>
          </div>
        }
        key="SystemSetting"
      >
        <SystemSettingMemo />
      </TabPane>
    </Tabs>
  );
};

const WebNotice = () => {
  const [noticeModalVisible, setNoticeModalVisible] = useState(false);
  const { notices, setNotices } = useModel('WebMainModel', model => ({
    notices: model.notices,
    setNotices: model.setNotices,
  }));
  const [refresh, setRefresh] = useState(false);
  useInterval(() => setRefresh(!refresh), 60000);
  const { resizeUpHeight, resizeDownHeight, setResizeDownHeight } = useModel('Resize', model => ({
    resizeUpHeight: model.resizeUpHeight,
    resizeDownHeight: model.resizeDownHeight,
    setResizeDownHeight: model.setResizeDownHeight,
  }));

  const userIconLarge = key => {
    return (
      <MyIcon
        type={KeyToUserIcon[key]}
        style={{
          padding: '0px 0px 0px 0px',
          fontSize: '16px',
        }}
      />
    );
  };

  const NoticesList = props => {
    const getContent = item => {
      const content = item[getLocale()];
      if (item.level === 0) {
        return <Text style={{ color: '#49aa19', wordBreak: 'break-all' }}>{content}</Text>;
      }
      if (item.level === 1) {
        return <Text style={{ color: '#13a8a8', wordBreak: 'break-all' }}>{content}</Text>;
      }
      if (item.level === 2) {
        return (
          <Text type="warning" style={{ wordBreak: 'break-all' }}>
            {content}
          </Text>
        );
      }
      if (item.level === 3) {
        return (
          <Text type="danger" style={{ wordBreak: 'break-all' }}>
            {content}
          </Text>
        );
      }
      if (item.level === 4) {
        return (
          <Text mark style={{ wordBreak: 'break-all' }}>
            {content}
          </Text>
        );
      }
      if (item.level === 5) {
        // 提醒
        return <Text style={{ color: '#642ab5', wordBreak: 'break-all' }}>{content}</Text>;
      }
      if (item.level === 6) {
        return (
          <Space>
            {userIconLarge(item.userkey)}
            <Text style={{ color: '#cb2b83', wordBreak: 'break-all' }}>
              {'>'} {content}
            </Text>
          </Space>
        );
      }
      return (
        <Text type="warning" style={{ wordBreak: 'break-all' }}>
          {content}
        </Text>
      );
    };
    return (
      <List
        id="noticescard"
        style={{
          overflow: 'auto',
          maxHeight: cssCalc(`${resizeDownHeight} - 30px`),
          minHeight: cssCalc(`${resizeDownHeight} - 30px`),
        }}
        split={false}
        size="small"
        bordered
        itemLayout="horizontal"
        dataSource={props.notices}
        renderItem={item => (
          <List.Item style={{ padding: '0px 0px 0px 0px' }}>
            <div
              style={{
                display: 'inline',
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              <Tag
                color="cyan"
                style={{
                  marginLeft: -1,
                  marginRight: 4,
                  textAlign: 'center',
                }}
              >
                {moment(item.time * 1000).format('MM-DD HH:mm:ss')}
              </Tag>
              {getContent(item)}
            </div>
          </List.Item>
        )}
      >
        <FloatButton.BackTop />
      </List>
    );
  };

  const deleteNoticesReq = useRequest(deleteWebNoticesAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setNotices([]);
    },
    onError: (error, params) => {},
  });

  return (
    <>
      <Button
        icon={<BellOutlined />}
        style={{ width: 40 }}
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
        <NoticesList notices={notices} />
        <Row>
          <Col span={4}>
            <Button icon={<DeleteOutlined />} block danger onClick={() => deleteNoticesReq.run()}>
              <span style={{ marginLeft: 4 }}>{formatText('app.core.clear')}</span>
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

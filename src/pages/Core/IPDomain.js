import React, { Fragment, memo, useImperativeHandle, useState } from "react";
import moment from "moment";
import { getLocale, useRequest } from "umi";
import {
  deleteMsgrpcFileMsfAPI,
  getCoreCurrentUserAPI,
  getMsgrpcFileMsfAPI,
  postPostmodulePostModuleActuatorAPI
} from "@/services/apiv1";

import { Button, Card, Col, Modal, Row, Space, Table, Tag, Upload } from "antd";
import { CopyOutlined, SyncOutlined, UploadOutlined } from "@ant-design/icons";
import copy from "copy-to-clipboard";
import { getToken } from "@/utils/authority";
import { cssCalc, Downheight } from "@/utils/utils";
import {
  formatText, getSessionlocate, manuali18n, msgerror, msgsuccess, msgwarning
} from "@/utils/locales";
import { DocIcon, MyIcon, WebMainHeight } from "@/pages/Core/Common";
import { useModel } from "@@/plugin-model/useModel";
import { HostIP } from "@/config";
import { useEffect, useRef } from "react";
import { useInterval } from "ahooks";
import {
  CaretRightOutlined, SubnodeOutlined
} from "@ant-design/icons";
import { Dropdown, Tooltip } from "antd";

let protocol = "ws://";
let webHost = HostIP + ":8002";
if (process.env.NODE_ENV === "production") {
  webHost = location.hostname + (location.port ? `:${location.port}` : "");
  protocol = "wss://";
}

const IPDomain = props => {
  console.log("FileMsf");
  const {
    setHeatbeatsocketalive, heatbeatsocketalive
  } = useModel("HostAndSessionModel", model => ({
    setHeatbeatsocketalive: model.setHeatbeatsocketalive,
    heatbeatsocketalive: model.heatbeatsocketalive
  }));

  const {
    ipdomains, setIPDomains
  } = useModel("WebMainModel", model => ({
    ipdomains: model.ipdomains, setIPDomains: model.setIPDomains
  }));

  // useImperativeHandle(props.onRef, () => {
  //     return {
  //         updateData: () => {
  //             listFileMsfReq.run()
  //         },
  //     }
  // })

  // useRequest(getMsgrpcFileMsfAPI, {
  //     onSuccess: (result, params) => {
  //         setFileMsfListActive(result)
  //     }, onError: (error, params) => {
  //     },
  // })

  // const listFileMsfReq = useRequest(getMsgrpcFileMsfAPI, {
  //     manual: true, onSuccess: (result, params) => {
  //         setFileMsfListActive(result)
  //     }, onError: (error, params) => {
  //     },
  // })

  const portServiceRowRender = portServiceRecord => {
    const portServiceTableColumns = [
      {
        dataIndex: "ipaddress",
        width: 128,
        render: (text, portServiceRecord) => {
          const session = portServiceRecord;

          const hostwithsession = JSON.parse(
            JSON.stringify(portServiceRecord)); // deep copy
          hostwithsession.session = session;

          return (<Button
            // onClick={() => {
            //     setRunModuleModalVisable(true)
            //     setActiveHostAndSession(hostwithsession)
            // }}
            style={{
              width: 104,
              backgroundColor: "#274916",
              textAlign: "center",
              cursor: "pointer"
            }}
            size="small"
          >
            <CaretRightOutlined />
          </Button>);
        }
      }];

    return <Table
      loading={!heatbeatsocketalive}
      dataSource={portServiceRecord.portservice}
      // style={{ marginLeft: 23 }}
      size="small"
      columns={portServiceTableColumns}
      rowKey={item => item.id}
      pagination={false}
      showHeader={false}
      locale={{ emptyText: null }}
    />;
  };

  return (<Fragment>
    <DocIcon url="https://www.yuque.com/vipersec/help/yc0ipk" />
    <Row
      gutter={0}
      style={{
        // margin: 0,
      }}
    ><Col span={4}>
      <Button
        block
        icon={<SyncOutlined />}
      >
        {formatText("app.core.refresh")}
      </Button>
    </Col>
      <Col span={8}>
        <Button
          block
          icon={<SyncOutlined />}
        >
          {formatText("app.core.refresh")}
        </Button>
      </Col>
    </Row>
    <Table
      virtual
      style={{
        overflow: "auto",
        // margin: 0,
        maxHeight: cssCalc(`${WebMainHeight} - 64px`),
        minHeight: cssCalc(`${WebMainHeight} - 64px`)
      }}
      loading={!heatbeatsocketalive}
      scroll={{
        y: cssCalc(`${WebMainHeight} - 96px`)
      }}
      size="small"
      bordered
      pagination={false}
      rowKey="id"
      columns={[
        {
          title: formatText("app.filemsf.filename"),
          dataIndex: "ip",
          key: "ip",
          width: 112,
          sorter: (a, b) => a.ip >= b.ip,
          render: (text, record) => <span>{record.ip}</span>
        },
        {
          title: formatText("app.filemsf.filename"),
          dataIndex: "domain",
          key: "domain",
          width: 240,
          sorter: (a, b) => a.domain >= b.domain,
          render: (text, record) => <span>{record.domain}</span>
        },
        // {
        //     title: formatText('app.filemsf.filename'),
        //     dataIndex: 'source',
        //     key: 'source',
        //     sorter: (a, b) => a.source >= b.source,
        //     render: (text, record) => <span>{record.source}</span>,
        // },
        // {
        //     title: formatText('app.filemsf.size'),
        //     dataIndex: 'source_key',
        //     key: 'source_key',
        //     sorter: (a, b) => a.size >= b.size,
        // },
        {
          title: formatText("app.core.updatetime"),
          key: "ip",
          dataIndex: "port_and_service",
          render: (text, record) => {
            const port_and_service_tags = [];
            record.port_and_service.forEach(
              one_port_and_service => {
                // 心跳标签
                let one_tag = <Tag
                  color="orange"
                  style={{
                    textAlign: "center", cursor: "pointer"
                  }}
                >
                  {one_port_and_service.port} {one_port_and_service.service}
                </Tag>;
                port_and_service_tags.push(one_tag);
              });
            return (<div
              style={{
                display: "flex", cursor: "pointer"
              }}
            >{port_and_service_tags}
            </div>);
          }
        },
        {
          title: formatText("app.core.updatetime"),
          dataIndex: "update_time",
          key: "update_time",
          width: 118,
          sorter: (a, b) => a.update_time >= b.update_time,
          render: (text, record) => (
            <Tag color="cyan">{moment(record.update_time * 1000).format("YYYY-MM-DD HH:mm")}</Tag>)
        }]}
      expandable={{
        expandRowByClick: true,
        expandedRowRender: portServiceRowRender,
        rowExpandable: record => record.portservice.length > 0 // expandIcon: ({ expanded, onExpand, record }) => null,
      }}
      dataSource={ipdomains}
    />
  </Fragment>);
};
export const IPDomainMemo = memo(IPDomain);



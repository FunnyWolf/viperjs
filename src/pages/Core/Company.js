import { useModel } from "@@/plugin-model/useModel";
import { formatText } from "@/utils/locales";
import React, { memo, useEffect, useState } from "react";
import { useRequest } from "umi";
import { getWebdatabaseCompanyBaseInfoAPI } from "@/services/apiv1";
import { Col, Descriptions, Input, Row, Table, Tabs } from "antd-v5";
import { cssCalc } from "@/utils/utils";

const { TabPane } = Tabs;
const { Search, TextArea } = Input;
const CompanyBaseInfoDesc = (companyBaseInfoActive) => {
  return <Descriptions
    bordered
    size="small"
    layout="vertical"
    column={24}
  >
    <Descriptions.Item
      span={12}
      label="Company Name">{companyBaseInfoActive.companyName}</Descriptions.Item>
    <Descriptions.Item
      span={12}
      label="Domicile">{companyBaseInfoActive.titleDomicile}</Descriptions.Item>
    <Descriptions.Item
      span={6}
      label="Ent Type">{companyBaseInfoActive.entType}</Descriptions.Item>
    <Descriptions.Item
      span={6}
      label="Validity From">{companyBaseInfoActive.validityFrom}</Descriptions.Item>
    <Descriptions.Item
      span={6}
      label="LogoWord">{companyBaseInfoActive.logoWord}</Descriptions.Item>
    <Descriptions.Item
      span={6}
      label="Open Status">{companyBaseInfoActive.openStatus}</Descriptions.Item>
    <Descriptions.Item
      span={24}
      label="Scope">
      {companyBaseInfoActive.scope}
    </Descriptions.Item>
  </Descriptions>
}

export const Company = props => {
  console.log("Company");
  const {
    projectActive,
  } = useModel("WebMainModel", model => ({
    projectActive: model.projectActive,
  }));
  const [companyBaseInfoListTmp, setCompanyBaseInfoListTmp] = useState([])
  const [companyBaseInfoList, setCompanyBaseInfoList] = useState([])
  const [companyBaseInfoActive, setCompanyBaseInfoActive] = useState({
    entType: null,
    openStatus: null,
    logoWord: null,
    validityFrom: null,
    titleName: null,
    titleDomicile: null,
    scope: null,
    companyName: null,
    companyICP: [],
    CompanyAPP: [],
    companyWechat: [],
  })
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const listCompanyReq = useRequest(getWebdatabaseCompanyBaseInfoAPI, {
    manual: true, onSuccess: (result, params) => {
      setCompanyBaseInfoList(result);
      setCompanyBaseInfoListTmp(result);
    }, onError: (error, params) => {
    },
  });

  useEffect(() => {
    listCompanyReq.run({
      project_id: projectActive.project_id,
    });
  }, [projectActive]);

  const onCompanyBaseInfoListChange = companyBaseInfoListTmp => {
    setCompanyBaseInfoListTmp(companyBaseInfoListTmp);
  };

  const handleModuleSearch = value => {
    const reg = new RegExp(value, "gi");
    onCompanyBaseInfoListChange(companyBaseInfoList.map(record => {
      let titleNameMatch = false;
      try {
        titleNameMatch = record.titleName.match(reg)
      } catch (error) {
      }

      if (titleNameMatch) {
        return {
          ...record,
        };
      }
      return null;
    }).filter(record => !!record));
  };

  const companyBaseInfoTableColumns = [
    {
      dataIndex: "titleNameMatch", render: (text, record) => {
        let selectStyles = {};
        if (record.titleName === companyBaseInfoActive.titleName) {
          selectStyles = {
            color: "#d89614", fontWeight: "bolder",
          };
        }
        return (<div
          style={{
            display: "inline",
          }}
        >
          <a style={{ marginLeft: 4, ...selectStyles }}>{record.titleName}</a>
        </div>);
      },
    }];

  return (<Row gutter={[0, 0]}>
      <Col
        span={6}>
        <Search
          placeholder={formatText("company.companybaseinfo.search.ph")}
          onSearch={value => handleModuleSearch(value)}
        />
        <Table
          style={{
            padding: "0 0 0 0", maxHeight: cssCalc("100vh - 560px"), minHeight: cssCalc("100vh - 560px"),
          }}
          scroll={{ y: "calc(100vh - 120px)" }}
          showHeader={false}
          onRow={record => ({
            onClick: () => {
              setCompanyBaseInfoActive(record);
              setSelectedRowKeys([]);
              setSelectedRows([]);
            },
          })}
          size="small"
          bordered
          pagination={false}
          rowKey={item => item.titleName}
          rowSelection={undefined}
          columns={companyBaseInfoTableColumns}
          dataSource={companyBaseInfoListTmp}
        />
      </Col>
      <Col
        style={{
          paddingLeft: 4,
          paddingRight: 4,
        }}
        span={18}>
        <Tabs
          // style={{ margin: 1 }}
          type="card"
        >
          <TabPane
            tab={<span>Company Base Info</span>}
            key="companyBaseInfo"
          >
          </TabPane>
        </Tabs>


        {CompanyBaseInfoDesc(companyBaseInfoActive)}
        <Row gutter={4}>
          <Col span={24}>
            <Table
              style={{
                marginTop: 0,
                padding: "0 0 0 0",
                overflow: "auto",
                maxHeight: cssCalc(`100vh - 32px`),
                minHeight: cssCalc(`100vh - 32px`),
              }}
              size="small"
              bordered
              pagination={false}
              rowKey="id"
              columns={[
                {
                  title: "Company Name",
                  dataIndex: "companyName",
                  key: "companyName",
                  render: (text, record) => {
                    return text
                  },
                },
                {
                  title: "Domain",
                  dataIndex: "domain",
                  key: "domain",
                  render: (text, record) => {
                    return text
                  },
                },
                {
                  title: "Home Site",
                  dataIndex: "homeSite",
                  key: "homeSite",
                  render: (text, record) => {
                    return text
                  },
                },
                {
                  title: "ICP No",
                  dataIndex: "icpNo",
                  key: "icpNo",
                  render: (text, record) => {
                    return text
                  },
                },
                {
                  title: "Site Name",
                  dataIndex: "siteName",
                  key: "siteName",
                  render: (text, record) => {
                    return text
                  },
                },
              ]}
              dataSource={companyBaseInfoActive.companyICP}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
export const CompanyMemo = memo(Company);

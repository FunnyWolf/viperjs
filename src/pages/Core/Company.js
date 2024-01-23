import { useModel } from "@@/plugin-model/useModel";
import { formatText } from "@/utils/locales";
import React, { memo, useEffect, useState } from "react";
import { useRequest } from "umi";
import { deleteWebdatabaseCompanyBaseInfoAPI, getWebdatabaseCompanyBaseInfoAPI } from "@/services/apiv1";
import { Button, Col, Descriptions, Image, Input, Row, Space, Table, Tabs, Typography } from "antd-v5";
import { cssCalc } from "@/utils/utils";
import { DeleteOutlined } from '@ant-design/icons'

const { Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Search, TextArea } = Input;
const CompanyBaseInfoDescriptions = (companyBaseInfoActive) => {

  return <Descriptions
    style={{ padding: 4 }}
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

const CompanyICPTable = (companyBaseInfoActive) => {
  if (companyBaseInfoActive.companyICP.length === 0) {
    return null
  }

  return <TabPane
    tab={<span>ICP Info</span>}
    key="companyICP"
  >
    <Table
      style={{
        marginTop: 0, padding: "0 0 0 0", overflow: "auto", maxHeight: cssCalc(`100vh - 88px`), minHeight: cssCalc(`100vh - 88px`),
      }}
      size="small"
      bordered
      pagination={false}
      rowKey="id"
      columns={[
        {
          title: "Company Name", dataIndex: "companyName", key: "companyName", render: (text, record) => {
            return text
          },
        }, {
          title: "Domain", dataIndex: "domain", key: "domain", render: (text, record) => {
            return text
          },
        }, {
          title: "Home Site", dataIndex: "homeSite", key: "homeSite", render: (text, record) => {
            return text
          },
        }, {
          title: "ICP No", dataIndex: "icpNo", key: "icpNo", render: (text, record) => {
            return text
          },
        }, {
          title: "Site Name", dataIndex: "siteName", key: "siteName", render: (text, record) => {
            return text
          },
        }]}
      dataSource={companyBaseInfoActive.companyICP}
    />
  </TabPane>
}

const CompanyAPPTable = (companyBaseInfoActive) => {
  if (companyBaseInfoActive.companyAPP.length === 0) {
    return null
  }

  return <TabPane
    tab={<span>APP Info</span>}
    key="companyAPP"
  >
    <Table
      style={{
        // padding: "0 0 0 0",
        overflow: "auto",
        maxHeight: cssCalc(`100vh - 88px`),
        minHeight: cssCalc(`100vh - 88px`),
      }}
      size="small"
      bordered
      pagination={false}
      rowKey="id"
      columns={[
        {
          title: "APP Name", dataIndex: "name", key: "name", render: (text, record) => {
            return text
          },
        }, {
          title: "Classify", dataIndex: "classify", key: "classify", render: (text, record) => {
            return text
          },
        }, {
          title: "Logo Brief", dataIndex: "logoBrief", key: "logoBrief", render: (text, record) => {
            return text
          },
        }, {
          title: "Logo", dataIndex: "logo", key: "logo", render: (text, record) => {
            return <Image width={48} src={text}/>
          },
        }]}
      dataSource={companyBaseInfoActive.companyAPP}
    />
  </TabPane>
}

const CompanyWechatTable = (companyBaseInfoActive) => {
  if (companyBaseInfoActive.companyWechat.length === 0) {
    return null
  }
  return <TabPane
    tab={<span>Wechat Info</span>}
    key="companyWechat"
  >
    <Table
      style={{
        overflow: "auto",
        maxHeight: cssCalc(`100vh - 88px`),
        minHeight: cssCalc(`100vh - 88px`),
      }}
      size="small"
      bordered
      pagination={false}
      rowKey="id"
      columns={[
        {
          title: "Wechat Name", dataIndex: "wechatName", key: "wechatName", render: (text, record) => {
            return text
          },
        }, {
          title: "Wechat Introduction", dataIndex: "wechatIntruduction", key: "wechatIntruduction", render: (text, record) => {
            return text
          },
        }, {
          title: "Logo", dataIndex: "wechatLogo", key: "wechatLogo", render: (text, record) => {
            return <Image width={48} src={text}/>
          },
        }, {
          title: "Qrcode", dataIndex: "qrcode", key: "qrcode", render: (text, record) => {
            return <Image width={48} src={text}/>
          },
        }]}
      dataSource={companyBaseInfoActive.companyWechat}
    />
  </TabPane>
}
export const Company = props => {
  console.log("Company");
  const {
    projectActive,
  } = useModel("WebMainModel", model => ({
    projectActive: model.projectActive,
  }));
  const companyBaseInfoNull = {
    entType: null,
    openStatus: null,
    logoWord: null,
    validityFrom: null,
    titleName: null,
    titleDomicile: null,
    scope: null,
    companyName: null,
    companyICP: [],
    companyAPP: [],
    companyWechat: [],
  }
  const [companyBaseInfoListTmp, setCompanyBaseInfoListTmp] = useState([])
  const [companyBaseInfoList, setCompanyBaseInfoList] = useState([])
  const [companyBaseInfoActive, setCompanyBaseInfoActive] = useState(companyBaseInfoNull)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const listCompanyReq = useRequest(getWebdatabaseCompanyBaseInfoAPI, {
    manual: true, onSuccess: (result, params) => {
      setCompanyBaseInfoList(result);
      setCompanyBaseInfoListTmp(result);
      setCompanyBaseInfoActive(companyBaseInfoNull)
    }, onError: (error, params) => {
    },
  });

  const destoryCompanyReq = useRequest(deleteWebdatabaseCompanyBaseInfoAPI, {
    manual: true, onSuccess: (result, params) => {
      // companyBaseInfoList.filter((item, index) => {
      //     if (item.companyName === params[0].companyName) {
      //       companyBaseInfoList.splice(index, 1);
      //     }
      //   },
      // )
      // setCompanyBaseInfoList(companyBaseInfoList);
      // setCompanyBaseInfoListTmp(companyBaseInfoList);
      listCompanyReq.run({
        project_id: projectActive.project_id,
      });
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
      title: "Company Name",
      dataIndex: "titleName",
      render: (text, record) => {
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
    },
    {
      title: "ICP",
      width: 64,
      dataIndex: "companyICP_count",
      sorter: (a, b) => a.companyICP_count - b.companyICP_count,
      render: (text, record) => {
        return text;
      },
    },
    {
      title: "APP",
      width: 64,
      dataIndex: "companyAPP_count",
      sorter: (a, b) => a.companyAPP_count - b.companyAPP_count,
      render: (text, record) => {
        return text;
      },
    },
    {
      title: "Wechat",
      width: 80,
      dataIndex: "companyWechat_count",
      sorter: (a, b) => a.companyWechat_count - b.companyWechat_count,
      render: (text, record) => {
        return text;
      },
    },
  ];

  return (<Row gutter={[0, 0]}>
    <Col
      span={8}>
      <Row>
        <Search
          style={{ width: "100%" }}
          placeholder={formatText("company.companybaseinfo.search.ph")}
          onSearch={value => handleModuleSearch(value)}
        />
        {/*<Select*/}
        {/*  defaultValue="lucy"*/}
        {/*  style={{ width: "20%" }}*/}
        {/*  options={[{ value: 'lucy', label: 'Lucy' }]}*/}
        {/*/>*/}
      </Row>
      <Table
        style={{
          padding: "0 0 0 0",
          // maxHeight: cssCalc("100vh - 560px"),
          // minHeight: cssCalc("100vh - 560px"),
        }}
        scroll={{ y: "calc(100vh - 88px - 24px)" }}
        // showHeader={false}
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
        columns={companyBaseInfoTableColumns}
        dataSource={companyBaseInfoListTmp}
      />
    </Col>
    <Col
      style={{
        paddingLeft: 4, paddingRight: 4,
      }}
      span={16}>
      <Tabs
        // style={{ margin: 1 }}
        type="card"
      >
        <TabPane
          tab={<span>Base Info</span>}
          key="companyBaseInfo"
        >
          {CompanyBaseInfoDescriptions(companyBaseInfoActive)}
          <Space>
            <Button
              danger
              icon={<DeleteOutlined/>}
              onClick={() => {
                destoryCompanyReq.run({
                  companyName: companyBaseInfoActive.companyName,
                });
              }}
            >Delete</Button>
          </Space>
        </TabPane>
        {CompanyICPTable(companyBaseInfoActive)}
        {CompanyAPPTable(companyBaseInfoActive)}
        {CompanyWechatTable(companyBaseInfoActive)}
      </Tabs>
    </Col>
  </Row>);
};
export const CompanyMemo = memo(Company);

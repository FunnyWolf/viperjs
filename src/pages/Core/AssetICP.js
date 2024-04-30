import { useModel } from "@@/plugin-model/useModel";
import React, { Fragment, memo, useEffect } from "react";
import { useRequest } from "umi";
import { getWebdatabaseCompanyBaseInfoAPI } from "@/services/apiv1";
import { Button, Flex, Table } from "antd-v5";
import { cssCalc } from "@/utils/utils";
import { SearchOutlined, SyncOutlined } from '@ant-design/icons'
import { DocIcon } from '@/pages/Core/Common'

export const AssetICP = props => {
  console.log("Company");
  const {
    projectActive,
  } = useModel("WebMainModel", model => ({
    projectActive: model.projectActive,
  }));

  const listCompanyReq = useRequest(getWebdatabaseCompanyBaseInfoAPI, {
    manual: true, onSuccess: (result, params) => {

    }, onError: (error, params) => {
    },
  });

  useEffect(() => {
    handleRefresh()
  }, [projectActive]);

  const handleRefresh = () => {
    listCompanyReq.run({
      project_id: projectActive.project_id,
    });
  };

  return (<Fragment>
    <DocIcon url="https://www.yuque.com/vipersec/help/yc0ipk"/>
    <Flex justify="flex-end" align="flex-start">
      <Button
        style={{ width: 80 }}
        icon={<SearchOutlined/>}
        // onClick={() => handleOpenSearchModel()}
        // loading={listIPdomainReq.loading}
      />
      <Button
        style={{ width: 80 }}
        icon={<SyncOutlined/>}
        // onClick={() => handleRefresh()}
        // loading={listIPdomainReq.loading}
      />
    </Flex>
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
  </Fragment>);
};
export const AssetICPMemo = memo(AssetICP);

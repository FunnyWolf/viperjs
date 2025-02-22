import { useModel } from '@@/plugin-model/useModel';
import React, { Fragment, memo, useEffect, useState } from 'react';
import { useRequest } from 'umi';
import { deleteWebdatabaseCompanyICPAPI, getWebdatabaseCompanyICPAPI } from '@/services/apiv1';
import { Button, Flex, Table } from 'antd-v5';
import { cssCalc } from '@/utils/utils';
import { SyncOutlined } from '@ant-design/icons';
import { DocIcon, WebMainHeight } from '@/pages/Core/Common';
import { formatText } from '@/utils/locales';

export const AssetICP = props => {
  console.log('Company');
  const { projectActive } = useModel('WebMainModel', model => ({
    projectActive: model.projectActive,
  }));
  const [companyICPList, setCompanyICPList] = useState([]);

  const listCompanyICPReq = useRequest(getWebdatabaseCompanyICPAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setCompanyICPList(result);
    },
    onError: (error, params) => {},
  });

  const destoryCompanyICPReq = useRequest(deleteWebdatabaseCompanyICPAPI, {
    manual: true,
    onSuccess: (result, params) => {
      handleRefresh();
    },
    onError: (error, params) => {},
  });
  useEffect(
    () => {
      handleRefresh();
    },
    [projectActive]
  );

  const handleRefresh = () => {
    listCompanyICPReq.run({
      project_id: projectActive.project_id,
    });
  };

  return (
    <Fragment>
      <DocIcon url="https://www.yuque.com/vipersec/help/yc0ipk" />
      <Flex justify="flex-end" align="flex-start" style={{ paddingLeft: 1, paddingRight: 1 }}>
        {/*<Button*/}
        {/*  style={{ width: 80 }}*/}
        {/*  icon={<SearchOutlined/>}*/}
        {/*  // onClick={() => handleOpenSearchModel()}*/}
        {/*  // loading={listIPdomainReq.loading}*/}
        {/*/>*/}
        <Button
          style={{ width: 80 }}
          icon={<SyncOutlined />}
          onClick={() => handleRefresh()}
          loading={listCompanyICPReq.loading}
        />
      </Flex>
      <Table
        style={{
          overflow: 'auto',
          maxHeight: cssCalc(`${WebMainHeight} - 64px`),
          minHeight: cssCalc(`${WebMainHeight} - 64px`),
        }}
        scroll={{ y: cssCalc(`${WebMainHeight} - 64px`) }}
        size="small"
        bordered
        tableLayout="auto"
        pagination={false}
        rowKey="id"
        columns={[
          {
            title: 'Company Name',
            dataIndex: 'company_name',
            key: 'company_name',
            render: (text, record) => {
              return text;
            },
          },
          {
            title: 'ICP No',
            dataIndex: 'icpNo',
            key: 'icpNo',
            render: (text, record) => {
              return text;
            },
          },
          {
            title: 'Site Name',
            dataIndex: 'siteName',
            key: 'siteName',
            render: (text, record) => {
              return text;
            },
          },
          {
            title: 'Home Site',
            dataIndex: 'homeSite',
            key: 'homeSite',
            render: (text, record) => {
              return text;
            },
          },
          {
            title: 'Domain',
            dataIndex: 'domain',
            key: 'domain',
            render: (text, record) => {
              return text;
            },
          },
          {
            dataIndex: 'operation',
            width: 48,
            render: (text, record) => (
              <div style={{ textAlign: 'center' }}>
                <a
                  onClick={() =>
                    destoryCompanyICPReq.run({
                      project_id: projectActive.project_id,
                      company_name: record.company_name,
                      domain: record.domain,
                    })
                  }
                  style={{ color: 'red' }}
                >
                  {formatText('app.core.delete')}
                </a>
              </div>
            ),
          },
        ]}
        dataSource={companyICPList}
      />
    </Fragment>
  );
};
export const AssetICPMemo = memo(AssetICP);

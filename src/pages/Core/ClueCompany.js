import { useModel } from '@@/plugin-model/useModel';
import React, { Fragment, memo, useEffect, useState } from 'react';
import { useRequest } from 'umi';
import { deleteWebdatabaseClueCompanyAPI, getWebdatabaseClueCompanyAPI } from '@/services/apiv1';
import { Button, Flex, Table } from 'antd-v5';
import { cssCalc } from '@/utils/utils';
import { SyncOutlined } from '@ant-design/icons';
import { DocIcon, WebMainHeight } from '@/pages/Core/Common';
import { formatText } from '@/utils/locales';

export const ClueCompany = props => {
  console.log('Company');
  const { projectActive } = useModel('WebMainModel', model => ({
    projectActive: model.projectActive,
  }));
  const [companyBaseInfoList, setCompanyBaseInfoList] = useState([]);

  const listCompanyBaseInfoReq = useRequest(getWebdatabaseClueCompanyAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setCompanyBaseInfoList(result);
    },
    onError: (error, params) => {},
  });

  const destoryCompanyBaseInfoReq = useRequest(deleteWebdatabaseClueCompanyAPI, {
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
    listCompanyBaseInfoReq.run({
      project_id: projectActive.project_id,
    });
  };

  return (
    <Fragment>
      <DocIcon url="https://www.yuque.com/vipersec/help/yc0ipk" />
      <Flex justify="flex-end" align="flex-start" style={{ paddingLeft: 1, paddingRight: 1 }}>
        <Button
          style={{ width: 80 }}
          icon={<SyncOutlined />}
          onClick={() => handleRefresh()}
          loading={listCompanyBaseInfoReq.loading}
        />
      </Flex>
      <Table
        style={{
          overflow: 'auto',
          maxHeight: cssCalc(`${WebMainHeight} - 64px`),
          minHeight: cssCalc(`${WebMainHeight} - 64px`),
        }}
        tableLayout="auto"
        scroll={{ y: cssCalc(`${WebMainHeight} - 64px`) }}
        size="small"
        bordered
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
            title: 'Domicile',
            dataIndex: 'titleDomicile',
            key: 'titleDomicile',
            render: (text, record) => {
              return text;
            },
          },
          {
            title: 'Ent Type',
            dataIndex: 'entType',
            key: 'entType',
            render: (text, record) => {
              return text;
            },
          },
          {
            title: 'LogoWord',
            dataIndex: 'logoWord',
            key: 'logoWord',
            render: (text, record) => {
              return text;
            },
          },
          {
            title: 'Validity From',
            dataIndex: 'validityFrom',
            key: 'validityFrom',
            width: 108,
            render: (text, record) => {
              return text;
            },
          },
          {
            title: 'Open Status',
            dataIndex: 'openStatus',
            key: 'openStatus',
            width: 96,
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
                    destoryCompanyBaseInfoReq.run({
                      project_id: projectActive.project_id,
                      company_name: record.company_name,
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
        dataSource={companyBaseInfoList}
      />
    </Fragment>
  );
};
export const ClueCompanyMemo = memo(ClueCompany);

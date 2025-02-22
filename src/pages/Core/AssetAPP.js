import { useModel } from '@@/plugin-model/useModel';
import React, { Fragment, memo, useEffect, useState } from 'react';
import { useRequest } from 'umi';
import { deleteWebdatabaseCompanyAPPAPI, getWebdatabaseCompanyAPPAPI } from '@/services/apiv1';
import { Button, Flex, Image, Table, Typography } from 'antd-v5';
import { cssCalc } from '@/utils/utils';
import { SyncOutlined } from '@ant-design/icons';
import { DocIcon, WebMainHeight } from '@/pages/Core/Common';
import { formatText } from '@/utils/locales';

export const AssetAPP = props => {
  console.log('Company');
  const { projectActive } = useModel('WebMainModel', model => ({
    projectActive: model.projectActive,
  }));
  const [CompanyAPPList, setCompanyAPPList] = useState([]);

  const listCompanyAPPReq = useRequest(getWebdatabaseCompanyAPPAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setCompanyAPPList(result);
    },
    onError: (error, params) => {},
  });

  const destoryCompanyAPPReq = useRequest(deleteWebdatabaseCompanyAPPAPI, {
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
    listCompanyAPPReq.run({
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
          loading={listCompanyAPPReq.loading}
        />
      </Flex>
      <Table
        // style={{
        //   overflow: 'auto', maxHeight: cssCalc(`${WebMainHeight} - 64px`), minHeight: cssCalc(`${WebMainHeight} - 64px`),
        // }}
        scroll={{ y: cssCalc(`${WebMainHeight} - 96px`) }}
        size="small"
        bordered
        pagination={false}
        rowKey="id"
        tableLayout="auto"
        columns={[
          {
            title: 'APP Name',
            dataIndex: 'name',
            key: 'name',
            width: 160,
            render: (text, record) => {
              return text;
            },
          },
          {
            title: 'Classify',
            dataIndex: 'classify',
            key: 'classify',
            width: 160,
            render: (text, record) => {
              return text;
            },
          },
          {
            title: 'Logo Brief',
            dataIndex: 'logoBrief',
            key: 'logoBrief',
            render: (text, record) => {
              return (
                <Typography.Paragraph
                  ellipsis={{
                    rows: 2,
                    expandable: 'collapsible',
                  }}
                >
                  {text}
                </Typography.Paragraph>
              );
            },
          },
          {
            title: 'Logo',
            dataIndex: 'logo',
            key: 'logo',
            width: 64,
            render: (text, record) => {
              return <Image width={48} src={text} />;
            },
          },
          {
            dataIndex: 'operation',
            width: 48,
            render: (text, record) => (
              <div style={{ textAlign: 'center' }}>
                <a
                  onClick={() =>
                    destoryCompanyAPPReq.run({
                      project_id: projectActive.project_id,
                      name: record.name,
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
        dataSource={CompanyAPPList}
      />
    </Fragment>
  );
};
export const AssetAPPMemo = memo(AssetAPP);

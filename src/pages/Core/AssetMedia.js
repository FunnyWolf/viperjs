import { useModel } from '@@/plugin-model/useModel';
import React, { Fragment, memo, useEffect, useState } from 'react';
import { useRequest } from 'umi';
import { deleteWebdatabaseCompanyMediaAPI, getWebdatabaseCompanyMediaAPI } from '@/services/apiv1';
import { Button, Flex, Image, Table } from 'antd-v5';
import { cssCalc } from '@/utils/utils';
import { SyncOutlined } from '@ant-design/icons';
import { DocIcon, WebMainHeight } from '@/pages/Core/Common';
import { formatText } from '@/utils/locales';

export const AssetMedia = props => {
  console.log('Company');
  const { projectActive } = useModel('WebMainModel', model => ({
    projectActive: model.projectActive,
  }));
  const [companyMediaList, setCompanyMediaList] = useState([]);

  const listCompanyMediaReq = useRequest(getWebdatabaseCompanyMediaAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setCompanyMediaList(result);
    },
    onError: (error, params) => {},
  });

  const destoryCompanyMediaReq = useRequest(deleteWebdatabaseCompanyMediaAPI, {
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
    listCompanyMediaReq.run({
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
          loading={listCompanyMediaReq.loading}
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
        pagination={false}
        rowKey="id"
        tableLayout="auto"
        columns={[
          {
            title: 'Wechat Name',
            dataIndex: 'wechatName',
            key: 'wechatName',
            render: (text, record) => {
              return text;
            },
          },
          {
            title: 'Wechat Introduction',
            dataIndex: 'wechatIntruduction',
            key: 'wechatIntruduction',
            render: (text, record) => {
              return text;
            },
          },
          {
            title: 'Logo',
            dataIndex: 'wechatLogo',
            key: 'wechatLogo',
            width: 64,
            render: (text, record) => {
              return <Image width={48} src={text} />;
            },
          },
          {
            title: 'Qrcode',
            dataIndex: 'qrcode',
            key: 'qrcode',
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
                    destoryCompanyMediaReq.run({
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
        dataSource={companyMediaList}
      />
    </Fragment>
  );
};
export const AssetMediaMemo = memo(AssetMedia);

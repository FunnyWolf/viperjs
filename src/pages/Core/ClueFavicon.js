import { useModel } from '@@/plugin-model/useModel';
import React, { Fragment, memo, useEffect, useState } from 'react';
import { useRequest } from 'umi';
import { deleteWebdatabaseClueFaviconAPI, getWebdatabaseClueFaviconAPI } from '@/services/apiv1';
import { Button, Flex, Table } from 'antd-v5';
import { cssCalc } from '@/utils/utils';
import { CheckCircleOutlined, CheckOutlined, MinusOutlined, SyncOutlined } from '@ant-design/icons';
import { DocIcon, TimeTag, WebMainHeight } from '@/pages/Core/Common';
import { formatText } from '@/utils/locales';
import { Avatar } from 'antd';

export const ClueFavicon = props => {
  console.log('Company');
  const { projectActive } = useModel('WebMainModel', model => ({
    projectActive: model.projectActive,
  }));
  const [clueFaviconList, setclueFaviconList] = useState([]);

  const listClueFaviconReq = useRequest(getWebdatabaseClueFaviconAPI, {
    manual: true,
    onSuccess: (result, params) => {
      setclueFaviconList(result);
    },
    onError: (error, params) => {},
  });

  const destoryClueFaviconReq = useRequest(deleteWebdatabaseClueFaviconAPI, {
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
    listClueFaviconReq.run({
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
          loading={listClueFaviconReq.loading}
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
            title: 'icon',
            dataIndex: 'content',
            key: 'hash',
            render: (text, record) => {
              const src = 'data:image/png;base64,' + text;
              return <Avatar shape="square" size={24} src={src} />;
            },
          },

          {
            title: 'hash',
            dataIndex: 'hash',
            key: 'hash',
            render: (text, record) => {
              return text;
            },
          },
          {
            title: 'note',
            dataIndex: 'note',
            key: 'hash',
            render: (text, record) => {
              return text;
            },
          },
          {
            title: 'exact',
            dataIndex: 'exact',
            key: 'hash',
            render: (text, record) => {
              if (record.exact) {
                return <CheckOutlined />;
              } else {
                return <MinusOutlined />;
              }
            },
          },
          {
            title: 'update_time',
            dataIndex: 'update_time',
            key: 'hash',
            width: 108,
            render: (text, record) => {
              return TimeTag(record.update_time);
            },
          },
          {
            dataIndex: 'operation',
            width: 48,
            render: (text, record) => (
              <div style={{ textAlign: 'center' }}>
                <a
                  onClick={() =>
                    destoryClueFaviconReq.run({
                      id: record.id,
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
        dataSource={clueFaviconList}
      />
    </Fragment>
  );
};
export const ClueFaviconMemo = memo(ClueFavicon);

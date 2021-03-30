import React, { Fragment, memo } from 'react';
import { Card, Col, Row } from 'antd';
import { useModel } from 'umi';
import '@ant-design/compatible/assets/index.css';

import styles from './Network.less';
import Graphin, { Behaviors, Utils } from '@antv/graphin';
import './iconfont.css';
import fonts from './iconfont.json';

const { DragCanvas, ZoomCanvas, DragNode, ActivateRelations, ResizeCanvas, FitView } = Behaviors;
const iconLoader = () => {
  return {
    fontFamily: 'iconfont',
    glyphs: fonts.glyphs,
  };
};
const { fontFamily, glyphs } = iconLoader();

const icons = Graphin.registerFontFamily(iconLoader);


//字符串格式化函数
String.prototype.format = function() {
  let args = arguments;
  return this.replace(/\{(\d+)\}/g, function(m, i) {
    return args[i];
  });
};


const Network = () => {
  console.log('Network');
  const {
    networkData,
  } = useModel('HostAndSessionModel', model => ({
    networkData: model.networkData,
  }));
  const ranksepFunc = (node) => {
    const { id, data } = node;
    if (data.type === 'viper' || data.type === 'session') {
      return 150;
    } else {
      return 100;
    }
  };

  const formatData = (data) => {
    data.nodes.forEach(node => {
      const { id, data } = node;
      if (data.type === 'viper') {
        node.style = {
          keyshape: {
            size: 80,
            stroke: '#791a1f',
            fill: '#791a1f',
            fillOpacity: 0.2,
          },
          icon: {
            type: 'font',
            fontFamily: fontFamily,
            value: icons['v'],
            fill: '#e84749',
            size: 40,
          },
        };
      } else if (data.type === 'host') {
        node.style = {
          label: {
            fill: '#e8b339',
            value: node.id,
            fontSize: 14,
            offset: [0, 12],
          },
          keyshape: {
            size: 60,
            stroke: '#7c5914',
            fill: '#7c5914',
            fillOpacity: 0.2,
          },
          icon: {
            type: 'font',
            fontFamily: fontFamily,
            value: icons['电脑'],
            fill: '#e8b339',
            size: 35,
          },

        };
      } else if (data.type === 'session') {
        const { sessionnum, platform } = data;
        if (platform === 'windows') {
          node.style = {
            label: {
              value: node.id,
              fill: '#6abe39',
              fontSize: 14,
              offset: [0, 12],
            },
            keyshape: {
              size: 60,
              stroke: '#306317',
              fill: '#306317',
              fillOpacity: 0.2,
            },
            icon: {
              type: 'font',
              fontFamily: fontFamily,
              value: icons['windows'],
              fill: '#2b4acb',
              size: 40,
            },
            badges: [
              {
                position: 'RT',
                type: 'text',
                value: sessionnum,
                size: [20, 20],
                color: '#6abe39',
                fill: '#306317',
              },
            ],
          };
        } else {
          node.style = {
            label: {
              value: node.id,
              fill: '#6abe39',
              fontSize: 14,
              offset: [0, 12],
            },
            keyshape: {
              size: 60,
              stroke: '#306317',
              fill: '#306317',
              fillOpacity: 0.2,
            },
            icon: {
              type: 'font',
              fontFamily: fontFamily,
              value: icons['linux'],
              fill: '#d89614',
              size: 40,
            },
            badges: [
              {
                position: 'RT',
                type: 'text',
                value: sessionnum,
                size: [20, 20],
                color: '#6abe39',
                fill: '#306317',
              },
            ],
          };
        }
      }
    });


    data.edges.forEach(edge => {
      const { data } = edge;
      const { type } = data;
      if (type === 'session') {
        const { payload, alive } = data;
        edge.style = {
          label: {
            value: payload,
            fill: '#33bcb7',
            fontSize: 14,
          },
          keyshape: {
            stroke: '#138585',
            lineWidth: 4,
          },
        };

      } else if (type === 'route') {
        const { sid } = data;
        edge.style = {
          label: {
            value: ` 内网路由 SID ${sid} `,
            fill: '#3c9ae8',
            fontSize: 14,
          },
          keyshape: {
            stroke: '#164c7e',
            lineWidth: 3,
          },
        };
      } else if (type === 'scan') {
        const { method } = data;
        edge.style = {
          label: {
            value: ` 内网扫描 ${method}`,
            fill: '#f3ea62',
            fontSize: 14,
          },
          keyshape: {
            stroke: '#aa9514',
            lineWidth: 2,
            lineDash: [8, 8],
          },
        };
      } else if (type === 'online') {
        const { payload } = data;
        edge.style = {
          label: {
            value: payload,
            fill: '#e87040',
            fontSize: 14,

          },
          keyshape: {
            stroke: '#7c3118',
            lineDash: [8, 8],
            lineWidth: 2,
          },
        };
      }
    });

    data.edges = Utils.processEdges(data.edges, { poly: 100, loop: 10 });
    return data;
  };
  let data = formatData(networkData);


  return (
    <Fragment>
      <Row style={{ marginTop: -16 }}>
        <Col span={24}>
          <Card
            bodyStyle={{ padding: '0px 0px 0px 0px' }}
          >
            <div
              className={styles.networkCard}
            >
              <Graphin
                data={data}
                theme={{ mode: 'dark' }}
                layout={{
                  type: 'dagre',
                  rankdir: 'LR',
                  align: 'UL',
                  ranksepFunc: ranksepFunc,
                }}
              >
                <FitView/>
                <ActivateRelations/>
              </Graphin>
            </div>
          </Card>
        </Col>
      </Row>

    </Fragment>
  );
};
export const NetworkMemo = memo(Network);
export default NetworkMemo;

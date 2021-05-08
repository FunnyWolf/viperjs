import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Tooltip } from 'antd';
import style from './index.less';

const BlockChecbox = ({ value, onChange, list }) => (
  <div className={style.blockChecbox} key={value}>
    {list.map(item => (
      <Tooltip title={item.title} key={item.key}>
        <div className={style.item} onClick={() => onChange(item.key)}>
          <img src={item.url} alt={item.key}/>
          <div
            className={style.selectIcon}
            style={{
              display: value === item.key ? 'block' : 'none',
            }}
          >
            <LegacyIcon type="check"/>
          </div>
        </div>
      </Tooltip>
    ))}
  </div>
);

export default BlockChecbox;

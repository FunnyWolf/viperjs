import React from 'react';
import classNames from 'classnames';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import styles from './index.less';

export default function Result({
  className,
  type,
  title,
  description,
  extra,
  actions,
  ...restProps
}) {
  const iconMap = {
    error: <LegacyIcon className={styles.error} type="close-circle" theme="filled" />,
    success: <LegacyIcon className={styles.success} type="check-circle" theme="filled" />,
  };
  const clsString = classNames(styles.result, className);
  return (
    <div className={clsString} {...restProps}>
      <div className={styles.icon}>{iconMap[type]}</div>
      <div className={styles.title}>{title}</div>
      {description && <div className={styles.description}>{description}</div>}
      {extra && <div className={styles.extra}>{extra}</div>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}

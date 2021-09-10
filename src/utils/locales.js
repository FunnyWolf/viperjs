import { getLocale, useIntl } from 'umi';
import React from 'react';
import { message } from 'antd';

const formatText = (id) => {
  return useIntl().formatMessage({ id });
};

const manuali18n = (zh, en) => {
  if (getLocale() === 'en-US') {
    return en;
  } else {
    return zh;
  }
};

const msginfo = (zh, en) => {
  if (getLocale() === 'en-US') {
    message.info(en);
  } else {
    message.info(zh);
  }
};
const msgwarning = (zh, en) => {
  if (getLocale() === 'en-US') {
    message.warning(en);
  } else {
    message.warning(zh);
  }
};

const msgerror = (zh, en) => {
  if (getLocale() === 'en-US') {
    message.error(en);
  } else {
    message.error(zh);
  }
};

const msgsuccess = (zh, en) => {
  if (getLocale() === 'en-US') {
    message.success(en);
  } else {
    message.success(zh);
  }
};


export { formatText, msginfo, msgsuccess, manuali18n, msgerror, msgwarning };

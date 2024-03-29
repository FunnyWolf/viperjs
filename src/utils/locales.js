import { getLocale, setLocale, formatMessage } from "umi";
import React from "react";
import { Button, message, Table } from "antd";

const formatText = (id) => {
  return formatMessage({ id });
};

const manuali18n = (zh, en) => {
  if (getLocale() === "en-US") {
    return en;
  } else {
    return zh;
  }
};

const msginfo = (zh, en) => {
  if (getLocale() === "en-US") {
    message.info(en);
  } else {
    message.info(zh);
  }
};
const msgwarning = (zh, en) => {
  if (getLocale() === "en-US") {
    message.warning(en, 4);
  } else {
    message.warning(zh, 4);
  }
};

const msgerror = (zh, en) => {
  if (getLocale() === "en-US") {
    message.error(en, 4);
  } else {
    message.error(zh, 4);
  }
};

const msgsuccess = (zh, en) => {
  if (getLocale() === "en-US") {
    message.success(en);
  } else {
    message.success(zh);
  }
};


export { formatText, msginfo, msgsuccess, manuali18n, msgerror, msgwarning };

export const getSessionlocate = (session) => {
  if (getLocale() === "en-US") {
    return session.tunnel_peer_locate_en;
  } else {
    return session.tunnel_peer_locate_zh;
  }
};

export const getModuleName = (moduleinfo) => {
  if (getLocale() === "en-US") {
    return moduleinfo.NAME_EN;
  } else {
    return moduleinfo.NAME_ZH;
  }
};

export const getModuleDesc = (moduleinfo) => {
  if (getLocale() === "en-US") {
    return moduleinfo.DESC_EN;
  } else {
    return moduleinfo.DESC_ZH;
  }
};

export const getOptionTag = (oneOption) => {
  if (getLocale() === "en-US") {
    return oneOption.tag_en;
  } else {
    return oneOption.tag_zh;
  }
};

export const getOptionDesc = (oneOption) => {
  if (getLocale() === "en-US") {
    return oneOption.desc_en;
  } else {
    return oneOption.desc_zh;
  }
};

export const getRequestMsg = (resData) => {
  if (getLocale() === "en-US") {
    return resData.msg_en;
  } else {
    return resData.msg_zh;
  }
};
export const getResultData = (resData) => {
  if (getLocale() === "en-US") {
    return resData.data_en;
  } else {
    return resData.data_zh;
  }
};

export const getModuleResultTable = (result) => {
  const { data_zh, data_en, columns_zh, columns_en } = result;
  if (getLocale() === "en-US") {
    return <Table bordered style={{ minWidth: "25vw", maxWidth: "55vw" }} pagination={false} columns={columns_en}
                  dataSource={data_en} size="small" />;
  } else {
    return <Table bordered style={{ minWidth: "25vw", maxWidth: "55vw" }} pagination={false} columns={columns_zh}
                  dataSource={data_zh}
                  size="small" />;
  }
};
export const LangSwitch = () => {
  const lang = getLocale();
  if (lang === "en-US") {
    return <Button
      onClick={() => setLocale("zh-CN", true)}

    ><strong>中</strong></Button>;
  } else {
    return <Button
      onClick={() => setLocale("en-US", true)}

    ><strong>En</strong></Button>;
  }
};

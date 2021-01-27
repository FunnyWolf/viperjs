import { ErrorShowType, history } from 'umi';
import { getToken } from '@/utils/authority';
import { message, notification } from 'antd';
import { saveAs } from 'file-saver';
import moment from 'moment';
// moment插件设置
moment.locale('zh-cn');
moment.relativeTimeThreshold('s', 59);

// 全局提示设置器
message.config({
  // top: 100,
  duration: 2,
  maxCount: 3,
});
notification.config({
  duration: 2,
});

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
    },
  },
};

let authRoutes = {};

function ergodicRoutes(routes, authKey, authority) {
  routes.forEach(element => {
    if (element.path === authKey) {
      if (!element.authority) element.authority = []; // eslint-disable-line
      Object.assign(element.authority, authority || []);
    } else if (element.routes) {
      ergodicRoutes(element.routes, authKey, authority);
    }
    return element;
  });
}

export function patchRoutes(routes) {
  Object.keys(authRoutes).map(authKey =>
    ergodicRoutes(routes, authKey, authRoutes[authKey].authority)
  );
  window.g_routes = routes;
}

export function render(oldRender) {
  oldRender();
}

const codeMessage = {
  200: 'The server successfully returned the requested data. ',
  201: 'New or modified data succeeded. ',
  202: 'A request has entered the background queue (asynchronous task). ',
  204: 'Data deleted successfully. ',
  400: 'There was an error in the request. The server did not create or modify the data. ',
  401: 'The user does not have permission (wrong token, user name, password). ',
  403: 'The user is authorized, but access is forbidden. ',
  404: 'The request is for a non-existent record, and the server has not operated. ',
  405: 'The request method is not allowed. ',
  406: 'The format of the request is not available. ',
  410: 'The requested resource has been permanently deleted and will no longer be available. ',
  422: 'A validation error occurred while creating an object. ',
  500: 'An error occurred on the server, please check the server. ',
  502: 'Gateway error. ',
  503: 'The service is not available. The server is temporarily overloaded or maintained. ',
  504: 'Gateway timed out. ',
};

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response } = error;
  if (response && response.status) {
    const errortext = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    if (status === 401) {
      notification.error({
        message: '尚未登录或登录已过期,请重新登录.',
      });

      history.push({
        pathname: '/user/login',
      });
      return;
    }
    //下载文件特殊处理
    if (response.headers.get('Content-Type') === 'application/octet-stream' && status === 200) {
      const filename = response.headers.get('Content-Disposition');
      message.success(`${filename} ${decodeURI(response.headers.get('Message'))}`);
      return;
    }

    notification.error({
      message: `Request error ${status}: ${url}`,
      description: errortext,
    });
    return;
  } else if (!response) {
    // @ts-ignore
    const { info } = error;
    const errorMessage = info?.errorMessage;
    switch (info?.showType) {
      case ErrorShowType.SILENT:
        // do nothing
        // message.info(errorMessage);
        break;
      case ErrorShowType.WARN_MESSAGE:
        message.warn(errorMessage);
        break;
      case ErrorShowType.ERROR_MESSAGE:
        message.error(errorMessage);
        break;
      case ErrorShowType.NOTIFICATION:
        notification.open({
          message: errorMessage,
        });
        break;
      case ErrorShowType.REDIRECT:
        // @ts-ignore
        history.push({
          pathname: '/404',
        });
        // redirect to error page
        break;
      default:
        message.error(errorMessage);
        break;
    }
  } else {
    message.error(error.message || 'Request error, please retry.');
  }
  throw error;
};

export const request = {
  errorHandler,
  errorConfig: {
    adaptor: resData => {
      let success = true;
      let showType = 0;
      const code = resData.code;
      if (200 < code && code < 300) {
        message.success(resData.message);
      }
      if (300 <= code) {
        success = false;
      }
      if (300 < code && code < 400) {
        showType = 1;
      } else if (400 <= code && code < 500) {
        showType = 2;
      } else if (500 <= code) {
        showType = 3;
      }

      return {
        success: success,
        showType: showType,
        errorMessage: resData.message,
        data: resData.data,
      };
    },
  },
  requestInterceptors: [
    (url, options) => {
      if (url === '/api/v1/core/baseauth/') {
        return {
          url,
          options,
        };
      }
      const token = getToken();
      const tokenstr = `Token ${token}`;
      options.headers = {
        Authorization: tokenstr,
        Accept: 'application/json',
        'Content-Type': 'application/json;',
      };
      return {
        url,
        options,
      };
    },
  ],
  responseInterceptors: [
    (response, options) => {
      if (
        response.headers.get('Content-Type') === 'application/octet-stream' &&
        response.status === 200
      ) {
        response.blob().then(blob => {
          let filename = response.headers.get('Content-Disposition');
          filename = decodeURI(filename);
          saveAs(blob, filename);
        });
        return response;
      }
      return response;
    },
  ],
};

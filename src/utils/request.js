import { notification } from "antd";
import { getToken } from "./authority";
import { saveAs } from "file-saver";
import { history } from "umi";


const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  notification.error({
    message: `Request Error ${response.status}: ${response.url}`,
    description: response.statusText
  });
  const error = new Error(response.statusText);
  error.name = response.status;
  error.response = response;
  throw error;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(apiurl, option) {
  let url = apiurl;
  // if (isBuildForElectron) {
  //   url = `${baseUrl}${apiurl}`;
  // }
  const token = getToken();
  const tokenstr = `Token ${token}`;

  const options = {
    ...option
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */

  let defaultOptions = {};
  if (url.includes("/api/v1/core/baseauth/")) {
    defaultOptions = {};
  } else {
    defaultOptions = {
      headers: { Authorization: tokenstr }
    };
  }

  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === "POST" ||
    newOptions.method === "PUT" ||
    newOptions.method === "DELETE"
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: "application/json",
        // 'Content-Type': 'application/json; charset=utf-8',
        "Content-Type": "application/json;",
        ...newOptions.headers
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: "application/json",
        ...newOptions.headers
      };
    }
  }

  return (
    fetch(url, newOptions).then(checkStatus).then(response => {
      // 文件下载的特殊处理
      if (response.headers.get("Content-Type") === "application/octet-stream" && response.status === 200) {
        response.blob().then(blob => {
          let filename = response.headers.get("Content-Disposition");
          filename = decodeURI(filename);
          saveAs(blob, filename);
        });
        return response;
      }

      try {
        return response.json();
      } catch (err) {
        return response.text();
      }
    }).catch(e => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        // @ts-ignore
        history.push("/user/login");
        return;
      }
      // environment should not be used
      if (status === 403) {
        return;
      }
      if (status <= 504 && status >= 500) {
        return;
      }
      if (status >= 404 && status < 422) {
      }
    })
  );
}

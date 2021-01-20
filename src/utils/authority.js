// use localStorage to store the authority info, which might be sent from server in actual project.
import { formatMessage, history } from 'umi';
export function getAuthority(str) {
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['admin'];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

export function getToken() {
  let token = localStorage.getItem('antd-pro-token');
  if (token) {
    return token;
  } else {
    history.push('/user/login');
  }
  return localStorage.getItem('antd-pro-token') || 'forguest';
}

export function setToken(token) {
  return localStorage.setItem('antd-pro-token', token);
}

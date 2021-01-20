import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

// 自定义接口
export async function postCoreBaseauth(params) {
  return request('/api/v1/core/baseauth/', {
    method: 'POST',
    body: params,
  });
}

export async function getCoreHost(params) {
  return request(`/api/v1/core/host/?${stringify(params)}`);
}

export async function putCoreHost(params) {
  return request('/api/v1/core/host/', {
    method: 'PUT',
    body: params,
  });
}

export async function deleteCoreHost(params) {
  return request(`/api/v1/core/host/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function postMsgrpcSessionio(params) {
  return request('/api/v1/msgrpc/sessionio/', {
    method: 'POST',
    body: params,
  });
}

export async function putMsgrpcSessionio(params) {
  return request('/api/v1/msgrpc/sessionio/', {
    method: 'PUT',
    body: params,
  });
}

export async function deleteMsgrpcSessionio(params) {
  return request(`/api/v1/msgrpc/sessionio/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function getMsgrpcRoute(params) {
  return request(`/api/v1/msgrpc/route/?${stringify(params)}`);
}

export async function postMsgrpcRoute(params) {
  return request('/api/v1/msgrpc/route/', {
    method: 'POST',
    body: params,
  });
}

export async function deleteMsgrpcRoute(params) {
  return request(`/api/v1/msgrpc/route/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function getMsgrpcSocks(params) {
  return request(`/api/v1/msgrpc/socks/?${stringify(params)}`);
}

export async function postMsgrpcSocks(params) {
  return request('/api/v1/msgrpc/socks/', {
    method: 'POST',
    body: params,
  });
}

export async function deleteMsgrpcSocks(params) {
  return request(`/api/v1/msgrpc/socks/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function getPostlateralPortservice(params) {
  return request(`/api/v1/postlateral/portservice/?${stringify(params)}`);
}

export async function deletePostlateralPortservice(params) {
  return request(`/api/v1/postlateral/portservice/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

// 自定义接口
export async function getPostmodulePostModuleConfig(params) {
  return request(`/api/v1/postmodule/postmoduleconfig/?${stringify(params)}`);
}

export async function getPostmodulePostModuleResult(params) {
  return request(`/api/v1/postmodule/postmoduleresult/?${stringify(params)}`);
}

export async function deletePostmodulePostModuleResultHistory(params) {
  return request(`/api/v1/postmodule/postmoduleresulthistory/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function postPostmodulePostModuleActuator(params) {
  return request('/api/v1/postmodule/postmoduleactuator/', {
    method: 'POST',
    body: params,
  });
}

export async function getMsgrpcHandler(params) {
  return request(`/api/v1/msgrpc/handler/?${stringify(params)}`);
}

export async function postMsgrpcHandler(params) {
  return request('/api/v1/msgrpc/handler/', {
    method: 'POST',
    body: params,
  });
}

export async function deleteMsgrpcHandler(params) {
  return request(`/api/v1/msgrpc/handler/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function postMsgrpcPayload(params) {
  return request('/api/v1/msgrpc/payload/', {
    method: 'POST',
    body: params,
  });
}

export async function getCoreCurrentUser(params) {
  return request(`/api/v1/core/currentuser/?${stringify(params)}`);
}

export async function getMsgrpcSessionUploadDownload(params) {
  return request(`/api/v1/msgrpc/sessionuploaddownload/?${stringify(params)}`);
}

export async function getPostlateralCredential(params) {
  return request(`/api/v1/postlateral/credential/?${stringify(params)}`);
}

export async function putPostlateralCredential(params) {
  return request('/api/v1/postlateral/credential/', {
    method: 'PUT',
    body: params,
  });
}

export async function postPostlateralCredential(params) {
  return request('/api/v1/postlateral/credential/', {
    method: 'POST',
    body: params,
  });
}

export async function deletePostlateralCredential(params) {
  return request(`/api/v1/postlateral/credential/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function getMsgrpcLazyLoader(params) {
  return request(`/api/v1/msgrpc/lazyloader/?${stringify(params)}`);
}

export async function putMsgrpcLazyLoader(params) {
  return request('/api/v1/msgrpc/lazyloader/', {
    method: 'PUT',
    body: params,
  });
}

export async function deleteMsgrpcLazyLoader(params) {
  return request(`/api/v1/msgrpc/lazyloader/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function getPostlateralVulnerability(params) {
  return request(`/api/v1/postlateral/vulnerability/?${stringify(params)}`);
}

export async function deletePostlateralVulnerability(params) {
  return request(`/api/v1/postlateral/vulnerability/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function getMsgrpcFileSession(params) {
  return request(`/api/v1/msgrpc/filesession/?${stringify(params)}`);
}

export async function putMsgrpcFileSession(params) {
  return request('/api/v1/msgrpc/filesession/', {
    method: 'PUT',
    body: params,
  });
}

export async function postMsgrpcFileSession(params) {
  return request('/api/v1/msgrpc/filesession/', {
    method: 'POST',
    body: params,
  });
}

export async function deleteMsgrpcFileSession(params) {
  return request(`/api/v1/msgrpc/filesession/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function getMsgrpcFileMsf(params) {
  return request(`/api/v1/msgrpc/filemsf/?${stringify(params)}`);
}

export async function postMsgrpcFileMsf(params) {
  return request('/api/v1/msgrpc/filemsf/', {
    method: 'POST',
    body: params,
  });
}

export async function deleteMsgrpcFileMsf(params) {
  return request(`/api/v1/msgrpc/filemsf/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function getMsgrpcSession(params) {
  return request(`/api/v1/msgrpc/session/?${stringify(params)}`);
}

export async function putMsgrpcSession(params) {
  return request('/api/v1/msgrpc/session/', {
    method: 'PUT',
    body: params,
  });
}

export async function deleteMsgrpcSession(params) {
  return request(`/api/v1/msgrpc/session/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function getCoreSetting(params) {
  return request(`/api/v1/core/setting/?${stringify(params)}`);
}

export async function postCoreSetting(params) {
  return request('/api/v1/core/setting/', {
    method: 'POST',
    body: params,
  });
}

export async function getServiceStatus(params) {
  return request(`/api/v1/msgrpc/servicestatus/?${stringify(params)}`);
}

export async function getMsgrpcPortFwd(params) {
  return request(`/api/v1/msgrpc/portfwd/?${stringify(params)}`);
}

export async function postMsgrpcPortFwd(params) {
  return request('/api/v1/msgrpc/portfwd/', {
    method: 'POST',
    body: params,
  });
}

export async function deleteMsgrpcPortFwd(params) {
  return request(`/api/v1/msgrpc/portfwd/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function getMsgrpcTransport(params) {
  return request(`/api/v1/msgrpc/transport/?${stringify(params)}`);
}

export async function postMsgrpcTransport(params) {
  return request('/api/v1/msgrpc/transport/', {
    method: 'POST',
    body: params,
  });
}

export async function putMsgrpcTransport(params) {
  return request('/api/v1/msgrpc/transport/', {
    method: 'PUT',
    body: params,
  });
}

export async function deleteMsgrpcTransport(params) {
  return request(`/api/v1/msgrpc/transport/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function getCoreNetworkTopology(params) {
  return request(`/api/v1/core/networktopology/?${stringify(params)}`);
}

export async function getCoreNetworkSearch(params) {
  return request(`/api/v1/core/networksearch/?${stringify(params)}`);
}

export async function deleteMsgrpcJob(params) {
  return request(`/api/v1/msgrpc/job/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function deleteNotices(params) {
  return request(`/api/v1/core/notices/?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function postCoreNotices(params) {
  return request('/api/v1/core/notices/', {
    method: 'POST',
    body: params,
  });
}

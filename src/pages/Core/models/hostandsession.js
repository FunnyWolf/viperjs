import {
  deleteCoreHost,
  deleteMsgrpcFileSession,
  deleteMsgrpcJob,
  deleteMsgrpcPortFwd,
  deleteMsgrpcRoute,
  deleteMsgrpcSession,
  deleteMsgrpcSessionio,
  deleteMsgrpcSocks,
  deleteMsgrpcTransport,
  deleteNotices,
  deletePostlateralPortservice,
  deletePostlateralVulnerability,
  deletePostmodulePostModuleResultHistory,
  getCoreNetworkSearch,
  getMsgrpcFileSession,
  getMsgrpcPortFwd,
  getMsgrpcRoute,
  getMsgrpcSession,
  getMsgrpcSessionUploadDownload,
  getMsgrpcSocks,
  getMsgrpcTransport,
  getPostlateralPortservice,
  getPostlateralVulnerability,
  getPostmodulePostModuleConfig,
  getPostmodulePostModuleResult,
  postCoreNotices,
  postMsgrpcFileSession,
  postMsgrpcPortFwd,
  postMsgrpcRoute,
  postMsgrpcSessionio,
  postMsgrpcSocks,
  postMsgrpcTransport,
  postPostmodulePostModuleActuator,
  putCoreHost,
  putMsgrpcFileSession,
  putMsgrpcSession,
  putMsgrpcSessionio,
  putMsgrpcTransport,
} from '@/services/api';

export default {
  namespace: 'hostandsession',
  state: {
    // 自定义函数
  },

  effects: {
    * updateCoreHost({ payload, callback }, { call, put }) {
      const response = yield call(putCoreHost, payload);
      if (callback) callback(response);
    },

    * destoryCoreHost({ payload, callback }, { call, put }) {
      const response = yield call(deleteCoreHost, payload);
      if (callback) callback(response);
    },

    * createMsgrpcSessionio({ payload, callback }, { call, put }) {
      const response = yield call(postMsgrpcSessionio, payload);
      if (callback) callback(response);
    },

    * updateMsgrpcSessionio({ payload, callback }, { call, put }) {
      const response = yield call(putMsgrpcSessionio, payload);
      if (callback) callback(response);
    },
    * destoryMsgrpcSessionio({ payload, callback }, { call, put }) {
      const response = yield call(deleteMsgrpcSessionio, payload);
      if (callback) callback(response);
    },

    * listMsgrpcRoute({ payload, callback }, { call, put }) {
      const response = yield call(getMsgrpcRoute, payload);
      if (callback) callback(response);
    },
    * createMsgrpcRoute({ payload, callback }, { call, put }) {
      const response = yield call(postMsgrpcRoute, payload);
      if (callback) callback(response);
    },
    * destoryMsgrpcRoute({ payload, callback }, { call, put }) {
      const response = yield call(deleteMsgrpcRoute, payload);
      if (callback) callback(response);
    },
    * listMsgrpcSocks({ payload, callback }, { call, put }) {
      const response = yield call(getMsgrpcSocks, payload);
      if (callback) callback(response);
    },
    * createMsgrpcSocks({ payload, callback }, { call, put }) {
      const response = yield call(postMsgrpcSocks, payload);
      if (callback) callback(response);
    },
    * destoryMsgrpcSocks({ payload, callback }, { call, put }) {
      const response = yield call(deleteMsgrpcSocks, payload);
      if (callback) callback(response);
    },

    * listMsgrpcSession({ payload, callback }, { call, put }) {
      const response = yield call(getMsgrpcSession, payload);
      if (callback) callback(response);
    },
    * updateMsgrpcSession({ payload, callback }, { call, put }) {
      const response = yield call(putMsgrpcSession, payload);
      if (callback) callback(response);
    },
    * destoryMsgrpcSession({ payload, callback }, { call, put }) {
      const response = yield call(deleteMsgrpcSession, payload);
      if (callback) callback(response);
    },

    * listPostlateralPortservice({ payload, callback }, { call, put }) {
      const response = yield call(getPostlateralPortservice, payload);
      if (callback) callback(response);
    },

    * destoryPostlateralPortservice({ payload, callback }, { call, put }) {
      const response = yield call(deletePostlateralPortservice, payload);
      if (callback) callback(response);
    },

    * listPostmodulePostModuleConfig({ payload, callback }, { call, put }) {
      const response = yield call(getPostmodulePostModuleConfig, payload);
      if (callback) callback(response);
    },

    * listPostmodulePostModuleResult({ payload, callback }, { call, put }) {
      const response = yield call(getPostmodulePostModuleResult, payload);
      if (callback) callback(response);
    },

    * destoryPostmodulePostModuleResultHistory({ payload, callback }, { call, put }) {
      const response = yield call(deletePostmodulePostModuleResultHistory, payload);
      if (callback) callback(response);
    },

    * createPostmodulePostModuleActuator({ payload, callback }, { call, put }) {
      const response = yield call(postPostmodulePostModuleActuator, payload);
      if (callback) callback(response);
    },

    * listMsgrpcSessionUploadDownload({ payload, callback }, { call, put }) {
      const response = yield call(getMsgrpcSessionUploadDownload, payload);
      if (callback) callback(response);
    },

    * listPostlateralVulnerability({ payload, callback }, { call, put }) {
      const response = yield call(getPostlateralVulnerability, payload);
      if (callback) callback(response);
    },

    * destoryPostlateralVulnerability({ payload, callback }, { call, put }) {
      const response = yield call(deletePostlateralVulnerability, payload);
      if (callback) callback(response);
    },

    * listMsgrpcFileSession({ payload, callback }, { call, put }) {
      const response = yield call(getMsgrpcFileSession, payload);
      if (callback) callback(response);
    },

    * updateMsgrpcFileSession({ payload, callback }, { call, put }) {
      const response = yield call(putMsgrpcFileSession, payload);
      if (callback) callback(response);
    },

    * createMsgrpcFileSession({ payload, callback }, { call, put }) {
      const response = yield call(postMsgrpcFileSession, payload);
      if (callback) callback(response);
    },
    * destoryMsgrpcFileSession({ payload, callback }, { call, put }) {
      const response = yield call(deleteMsgrpcFileSession, payload);
      if (callback) callback(response);
    },

    * listMsgrpcPortFwd({ payload, callback }, { call, put }) {
      const response = yield call(getMsgrpcPortFwd, payload);
      if (callback) callback(response);
    },
    * createMsgrpcPortFwd({ payload, callback }, { call, put }) {
      const response = yield call(postMsgrpcPortFwd, payload);
      if (callback) callback(response);
    },
    * destoryMsgrpcPortFwd({ payload, callback }, { call, put }) {
      const response = yield call(deleteMsgrpcPortFwd, payload);
      if (callback) callback(response);
    },

    * listMsgrpcTransport({ payload, callback }, { call, put }) {
      const response = yield call(getMsgrpcTransport, payload);
      if (callback) callback(response);
    },
    * createMsgrpcTransport({ payload, callback }, { call, put }) {
      const response = yield call(postMsgrpcTransport, payload);
      if (callback) callback(response);
    },

    * updateMsgrpcTransport({ payload, callback }, { call, put }) {
      const response = yield call(putMsgrpcTransport, payload);
      if (callback) callback(response);
    },

    * destoryMsgrpcTransport({ payload, callback }, { call, put }) {
      const response = yield call(deleteMsgrpcTransport, payload);
      if (callback) callback(response);
    },

    * destoryMsgrpcJob({ payload, callback }, { call, put }) {
      const response = yield call(deleteMsgrpcJob, payload);
      if (callback) callback(response);
    },
    * createCoreNotices({ payload, callback }, { call, put }) {
      const response = yield call(postCoreNotices, payload);
      if (callback) callback(response);
    },
    * destoryNotices({ payload, callback }, { call, put }) {
      const response = yield call(deleteNotices, payload);
      if (callback) callback(response);
    },
    * listCoreNetworkSearch({ payload, callback }, { call, put }) {
      const response = yield call(getCoreNetworkSearch, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

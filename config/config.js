// https://umijs.org/config/
// import webpackPlugin from './plugin.config';
// const compactTheme = require('antd/dist/compact-theme');
import os from 'os';
import pageRoutes from './router.config';
import defaultSettings from '../src/defaultSettings';
import slash from 'slash2';

const darkThemeVars = require('antd/dist/dark-theme');

export default {
  // add for transfer to umi

  antd: {
    dark: true, // 开启暗色主题
    // compact: true, // 开启紧凑主题
  },
  dva: {
    hmr: true,
  },
  locale: {
    antd: true, // default false
    default: 'zh-CN', // default zh-CN
    baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  targets: {
    ie: 11,
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    // hack: `true;@import "${require.resolve('antd/lib/style/color/colorPalette.less')}";`,
    // ...darkThemeVars,
    // 'font-size-base': '12px',
    // 'form-item-margin-bottom': '16px',
    'layout-header-height': '28px',
    'tabs-card-height': '36px',
    'table-padding-vertical': '8px',
    'table-padding-horizontal': '8px',
    'primary-color': defaultSettings.primaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },

  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
  publicPath: './',
  history: { type: 'hash' },
  // chainWebpack: webpackPlugin,
  proxy: {
    '/api/v1/': {
      target: 'http://127.0.0.1:8002/',
      changeOrigin: true,
      ws: false,
      pathRewrite: { '^/api/v1': '/api/v1' }, // /server/api/currentUser -> /api/currentUser
    },
    '/ws/v1/': {
      target: 'ws://127.0.0.1:8002/',
      changeOrigin: true,
      ws: false,
      pathRewrite: { '^/ws/v1': '/ws/v1' },
    },
  },
};

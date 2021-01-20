export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],  },
  // app
  // <ClusterOutlined />
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      { path: '/', redirect: 'main' },
      {

        icon: 'Cluster',
        path: 'main',
        name: 'control-board',
        component: './Core/HostAndSession',
      },
      {
        icon: 'setting',
        path: 'system-setting',
        name: 'setting',
        component: './Core/SystemSetting',
      },
      {
        component: '404',
      },
    ],
  },
];

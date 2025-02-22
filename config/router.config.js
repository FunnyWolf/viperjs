export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      { path: '/', redirect: 'nav' },
      {
        icon: 'Cluster',
        path: 'nav',
        name: 'nav',
        component: './Core/Nav',
      },
      {
        icon: 'Cluster',
        path: 'main',
        name: 'main',
        component: './Core/HostAndSession',
      },
      {

        icon: 'Cluster',
        path: 'web',
        name: 'web',
        component: './Core/WebMain',
      },
      {
        component: '404',
      },
    ],
  },
];

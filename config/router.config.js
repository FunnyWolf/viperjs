export default [
    // user
    {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
            {path: '/user', redirect: '/user/login'},
            {path: '/user/login', component: './User/Login'},
        ],
    },
    // app
    {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        authority: ['admin', 'user'],
        routes: [
            {path: '/', redirect: 'main'},
            {
                icon: 'Cluster',
                path: 'main',
                name: 'control-board',
                component: './Core/HostAndSession',
            },
            {

                icon: 'Cluster',
                path: 'web',
                name: 'control-board',
                component: './Core/WebMain',
            },
            {
                component: '404',
            },
        ],
    },
];

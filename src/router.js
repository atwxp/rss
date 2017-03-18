export default [
    {
        path: '/add',
        name: 'add',
        component: require('./views/add.vue')
    },

    {
        path: '/setting',
        name: 'setting',
        component: require('./views/setting.vue')
    },

    {
        path: '/feed/:id',
        name: 'feed',
        component: require('./views/feed.vue')
    },

    {
        path: '*',
        component: require('./views/add.vue')
    }
]

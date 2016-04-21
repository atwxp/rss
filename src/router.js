define(function (require, exports, module) {

    var routerMap = function (router) {
        router.map({
            '/add': {
                component: require('./views/add.vue')  
            },
            '/search': {
                component: require('./views/search.vue')  
            },
            '/starred': {
                component: require('./views/starred.vue')
            },
            '/setting': {
                component: require('./views/setting.vue')
            },
            '/feed/:id': {
                component: require('./views/feed.vue')
            }
        });

        router.beforeEach(function (transition) {
            var toPath = transition.to.path;
            var fromPath = transition.from.path;

            console.log('page from ' + fromPath + ' to: ' + toPath);

            transition.next();
        });

        router.afterEach(function (transition) {
            console.log('成功浏览到：' + transition.to.path);
        });
    };

    module.exports = routerMap;
});

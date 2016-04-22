define(function (require, exports, module) {

    var routerMap = function (router) {
        router.map({
            '*': {
                component: require('./views/add.vue')
            },
            '/': {
                component: require('./views/add.vue')
            },
            '/add': {
                component: require('./views/add.vue')  
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

            window.scrollTo(0, 1);

            console.log('成功浏览到：' + transition.to.path);
        });
    };

    module.exports = routerMap;
});

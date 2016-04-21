var Vue = require('vue');
var VueRouter = require('vue-router');
var VueResource = require('vue-resource');

var App = require('./index.vue');

// install router
Vue.use(VueRouter);
var router = new VueRouter();
require('./router')(router);

// install resource
Vue.use(VueResource);

// Directive
// require('./directives/index', Vue);

// Filters
require('./filters/index')(Vue);

router.start(App, '#app');

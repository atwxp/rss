var Vue = require('vue');
var VueRouter = require('vue-router');
var VueResource = require('vue-resource');

var App = require('./index.vue');

// install router
Vue.use(VueRouter);
Vue.use(VueResource);

// config router
var router = new VueRouter();

router.start(App, '#app');

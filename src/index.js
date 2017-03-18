import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import App from './index.vue'
import store from './store'
import routes from './router'
import myFilter from './filters/index'

Vue.use(VueRouter)

const router = new VueRouter({
    routes
})

Vue.use(VueResource)
Vue.http.options.emulateJSON = true

myFilter(Vue)

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})
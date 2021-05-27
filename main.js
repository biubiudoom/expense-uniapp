import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import Common from '@/Common/Common'
import dd from 'node_modules/dingtalk-jsapi'
Vue.use(uView);

Vue.prototype.$Common = Common;
Vue.prototype.$dd = dd;

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

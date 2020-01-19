/*
 * @Author: Hugo16
 * @Date: 2019-12-24 13:05:15
 * @LastEditTime : 2020-01-16 12:49:30
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router';
import api from "./api/api";
import 'ant-design-vue/dist/antd.less';
import { Button, Input, Collapse, Spin, Modal, BackTop, Checkbox } from 'ant-design-vue';


Vue.use(Button);
Vue.use(Input);
Vue.use(Collapse);
Vue.use(Spin);
Vue.use(Modal);
Vue.use(BackTop);
Vue.use(Checkbox);
Vue.config.productionTip = false;

Vue.prototype.$api = api;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

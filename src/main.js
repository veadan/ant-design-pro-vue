// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

// elementui
import 'element-ui/lib/theme-chalk/index.css'
// mock
import './mock'
import '@/core/lazy_lib/components_element'
import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter'
import { Modal } from 'ant-design-vue' // global filter

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
Vue.prototype.$aconfirm = Modal.confirm

new Vue({
  router,
  store,
  created () {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')

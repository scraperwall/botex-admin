import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import CoreuiVueCharts from '@coreui/vue-chartjs'
import { iconsSet as icons } from './assets/icons/icons.js'
import Axios from 'axios'
import VuePluralize from 'vue-pluralize'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$http = Axios
Vue.prototype.$http.defaults.baseURL = process.env.VUE_APP_API_URL


Vue.config.performance = true
Vue.use(CoreuiVue)
Vue.use(CoreuiVueCharts)
Vue.use(VuePluralize)
Vue.prototype.$log = console.log.bind(console)

new Vue({
  el: '#app',
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App
  }
})

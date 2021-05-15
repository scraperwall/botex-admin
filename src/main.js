/*
botex-admin - a web UI for ScraperWall's bad bot mitigation tool botex
Copyright (C) 2021 Tobias von Dewitz <tobias@scraperwall.com>

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free 
Software Foundation, either version 3 of the License, or (at your option) any
later version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more 
details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/>.
*/

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

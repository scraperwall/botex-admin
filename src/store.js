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

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueNativeSock from 'vue-native-websocket'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    sidebarShow: 'responsive',
    sidebarMinimize: false,
    blocked: [],
    ip: {},
    requestStats: [],
    appRequestStats: [],
    blockedNetworks: [],
    blockedASNs: [],
    ips: [],
    latestIPs: [],
    stats: {},
    sums: {},
    blockedIPs: [],
    blockedIP: null,
    socket: {
      isConnected: false,
      message: '',
      reconectError: false,
    },
  },

  mutations: {
    SOCKET_ONOPEN (state, event) {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true

      // Vue.prototype.$socket.sendObj({ token: state.auth.token })
    },
    SOCKET_ONCLOSE (state, event) {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR (state, event) {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (state, message) {
      state.socket.message = message
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT (state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR (state) {
      state.socket.reconnectError = true
    },
    toggleSidebarDesktop (state) {
      const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
      state.sidebarShow = sidebarOpened ? false : 'responsive'
    },
    toggleSidebarMobile (state) {
      const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
      state.sidebarShow = sidebarClosed ? true : 'responsive'
    },
    set (state, [variable, value]) {
      state[variable] = value
    },
    setBlocked (state, blocked) {
      state.blocked = blocked
    },
    setIP (state, ipdata) {
      state.ip = ipdata

      let tMin = 0;
      let tMax = 0;
      let requestCounts = [];
      let steps = 10;

      for (var i = 0; i < steps; i++) {
          requestCounts[i] = 0
      }

      ipdata.requests.forEach(function (req) {
          if (tMin == 0 || tMin > req.timestamp) { tMin = req.timestamp }
          if (tMax == 0 || tMax < req.timestamp) { tMax = req.timestamp }
      })

      let tStep = (tMax - tMin) / steps;

      ipdata.requests.forEach(function (req) {
          let idx = ((tMin - req.timestamp) / tStep) + steps
          requestCounts[idx]++
      })

      state.requestStats = requestCounts
    },
    setRequestStats(state, stats) {
      let list = [];
      stats.forEach(function (s) {
        list.push({x: s.time, y: s.count})
      })
      state.requestStats = list
    },
    setAppRequestStats(state, stats) {
      let list = [];
      stats.forEach(function (s) {
        list.push({x: s.time, y: s.count})
      })
      state.appRequestStats = list
    },
    setBlockedNetworks(state, networks) {
      state.blockedNetworks = networks
    },
    setBlockedASNs(state, asns) {
      state.blockedASNs = asns
    },
    setIPs(state, ips) {
      state.ips = ips
    },
    addIP(state, message) {
      state.latestIPs.unshift(message.data.ipdetails)
      if (state.latestIPs.length > 200) {
        state.latestIPs.pop()
      }
    },
    removeIP(state, message) {
      for (var i = 0; i < state.latestIPs.length; i++) {
        if (state.latestIPs[i].ip == message.data) {
          state.latestIPs.slice(i, 1)
          return
        }
      }
    },
    setStats(state, stats) {
      let data = {
        total: [],
        whitelisted: [],
        blocked: [],
        human: [],
      }

      let sums = {
        total: 0,
        whitelisted: 0,
        blocked: 0,
        human: 0,
      }

      for (const [ts, s] of Object.entries(stats)) {
        data.total.push({x: ts, y: s.total})
        data.whitelisted.push({x: ts, y: s.whitelisted})
        data.blocked.push({x: ts, y: s.blocked})
        data.human.push({x: ts, y: s.human})

        sums.total += s.total
        sums.whitelisted += s.whitelisted
        sums.blocked += s.blocked
        sums.human += s.human
      }

      state.stats = data
      state.sums = sums
    },
    setBlockedIPs(state, message) {
      state.blockedIPs = message.data
    },
    addBlockedIP(state, message) {
      state.blockedIPs.unshift(message.data)
    },
  },

  actions: {
    loadBlocked ({ commit }) {
      axios.get('/blocked/ips').then((resp) => { commit('setBlocked', resp.data) })
    },
    loadIP ({ commit }, ip) {
      axios.get('/ip/' + ip).then((resp) => { commit('setIP', resp.data) })
    },
    loadRequestStats ({ commit }, { ip, steps, range }) {
      axios.get('/request-stats/' + ip + "/" + steps).then((resp) => { commit('setRequestStats', resp.data) })
      axios.get('/request-stats/' + ip + "/" + steps + "?type=app").then((resp) => { commit('setAppRequestStats', resp.data) })
    },
    loadBlockedNetworks({ commit }) {
      axios.get('/blocked/networks').then((resp) => {
        commit('setBlockedNetworks', resp.data)
      })
    },
    loadBlockedASNs({ commit }) {
      axios.get('/blocked/asns').then((resp) => {
        commit('setBlockedASNs', resp.data)
      })
    },
    loadIPsByASN({ commit }, asn) {
      axios.get('/ips?asn=' + asn).then((resp) => {
        commit('setIPs', resp.data)
      })
    },
    loadIPsByNetwork({ commit }, cidr) {
      axios.get('/ips?network=' + cidr).then((resp) => {
        commit('setIPs', resp.data)
      })
    },
    loadStats({ commit }) {
      axios.get('/stats').then((resp) => {
        commit('setStats', resp.data)
      })
    },
    blockedIPUpdated({ commit}, message) {
      commit('addBlockedIP', message)
    },
    blockedIPsUpdated({ commit }, message) {
      commit('setBlockedIPs', message)
    },
    newIP({ commit }, message) {
      commit('addIP', message)
    },
    expireIP({ commit }, message) {
      commit('removeIP', message)
    },
  },

  getters: {},
})


Vue.use(VueNativeSock, process.env.VUE_APP_WS_URL, {
  store: store,
  format: 'json',
  reconnection: true,
  reconnectionDelay: 5000,
})


export default store

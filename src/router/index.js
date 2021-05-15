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
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

const IP = () => import('@/views/ip/IP')
const LatestIPs = () => import('@/views/ip/Latest')
const IPsByASN = () => import('@/views/ip/ByASN')
const IPsByNetwork = () => import('@/views/ip/ByNetwork')

Vue.use(Router)

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'latest',
          name: 'IPs',
          component: LatestIPs,
        },
        {
          path: 'ip/:ip',
          name: 'ip-page',
          component: IP,
          props: (route) => ({
            ip: route.params.ip,
          }),
        },
        {
          path: 'asn/:asn',
          name: 'asn',
          component: IPsByASN,
          props: (route) => ({
            asn: route.params.asn,
          }),
        },
        {
          path: 'network/:cidr',
          name: 'network',
          component: IPsByNetwork,
          props: (route) => ({
            cidr: route.params.cidr,
          }),
        },
      ]
    },
  ]
}


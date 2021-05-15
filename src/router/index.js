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


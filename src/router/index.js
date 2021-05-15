import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')


// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')

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
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        }
      ]
    },
  ]
}


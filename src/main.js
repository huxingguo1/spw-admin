import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import permission from '@/directive/permission/index.js' // 权限判断指令

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import BMap from 'vue-baidu-map'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

// set ElementUI lang to EN
// mini small medium default
Vue.use(ElementUI, { locale, size: 'default' })
Vue.use(BMap, { ak: '9XN24bTuiEiMbV3MiMIcmTX8jW0Fm4lR' })
Vue.directive('permission', permission)
Vue.config.productionTip = false
// Vue.use(VueVideoPlayer)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

Vue.use(Viewer)
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})

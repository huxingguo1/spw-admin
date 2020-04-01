import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

/**
 * 判断用户是否有权限
 * @param perms
 * @param permissions
 * @returns {boolean}
 */
function hasPermission(perms, permissions) {
  if (perms.indexOf('*') >= 0) return true // admin permission passed directly
  if (!permissions) return true
  return perms.some(perm => permissions.indexOf(perm) >= 0)
}

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  // const hasToken = 'Vue_token'
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.profile.roles && to.path !== '/account/information') {
        for (var element of store.getters.profile.roles) {
          if (element.isForceComplete === 1) {
            if (!store.getters.profile.phone) {
              next({ path: '/account/information' })
              NProgress.done()
              return
            }
          }
        }
      }
      const hasPerms = store.getters.perms
      if (hasPerms) {
        if (hasPermission(store.getters.perms, to.meta.perms)) {
          next()
        } else {
          next({ path: '/403', replace: true, query: { noGoBack: true }})
        }
      } else {
        try {
          const perms = await store.dispatch('user/getInfo')
          console.log(router)
          await store.dispatch('generateRoutes', perms)
          next({ ...to, replace: true })
        } catch (error) {
          console.log(error)
          await store.dispatch('user/frontLogOut')
          Message.error('无法获取账户信息！')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

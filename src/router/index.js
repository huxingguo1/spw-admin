import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/403',
    component: () => import('@/views/error/403'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '工作台', icon: 'dashboard', affix: true, noCache: true }
    }
    ]
  }
]
/**
 * 需要动态加载的路由
 */
export const asyncRouters = [
  {
    path: '/goods',
    component: Layout,
    meta: { title: ' 商品管理', icon: 'goods', perms: ['/admin/commodity/query'] },
    children: [{
      path: 'list',
      name: 'CommodityList',
      component: () => import('@/views/goods/list'),
      meta: { title: '商品库', perms: ['/admin/commodity/query'] }
    },
    {
      path: 'type',
      name: 'CommodityType',
      component: () => import('@/views/goods/category'),
      meta: { title: '商品分类', perms: ['/admin/smmCommodityType/list'] }
    },
    {
      path: 'subclassification',
      name: 'subclassification',
      component: () => import('@/views/goods/subclassification'),
      hidden: true,
      meta: { title: '商品子分类', perms: ['/admin/smmCommodityType/list'] }
    },
    {
      path: 'info',
      name: 'CommodityInfo',
      component: () => import('@/views/goods/info'),
      meta: { title: '商品详情', perms: ['/admin/commodity/query'] },
      hidden: true
    },
    {
      path: 'add',
      name: 'CommodityAdd',
      component: () => import('@/views/goods/add'),
      meta: { title: '添加商品', perms: ['/admin/commodity/add'] }
    },
    {
      path: 'mygoods',
      name: 'mygoods',
      component: () => import('@/views/goods/mygoods'),
      meta: { title: '我的商品', perms: ['/admin/goods/query'] }
    },
    {
      path: 'mygoodsadd',
      name: 'mygoodsAdd',
      component: () => import('@/views/goods/mygoodsadd'),
      meta: { title: '上架商品', perms: ['/admin/goods/commodity/query'] }
    }
    ]
  },
  {
    path: '/order',
    component: Layout,
    meta: { title: '订单管理', icon: 'order' },
    alwaysShow: true,
    children: [{
      path: 'list',
      name: 'Order',
      meta: { title: '订单列表', perms: ['/admin/order/query'] },
      component: () => import('@/views/order/list')
    }
    ]
  },
  {
    path: '/community',
    component: Layout,
    alwaysShow: true,
    meta: { title: '社区管理', icon: 'community', perms: ['/admin/community/list'] },
    children: [{
      path: 'list',
      name: 'Community',
      meta: { title: '社区列表', perms: ['/admin/community/list'] },
      component: () => import('@/views/community/list')
    }
    ]
  },
  {
    path: '/station',
    component: Layout,
    alwaysShow: true,
    redirect: '/station/list',
    meta: { title: '服务站管理', icon: 'station', perms: ['/admin/station/list'] },
    children: [{
      path: 'list',
      name: 'Station',
      meta: { title: '服务站列表', perms: ['/admin/station/list'] },
      component: () => import('@/views/station/list')
    }
    ]
  },
  {
    path: '/volunteer',
    component: Layout,
    meta: { title: '志愿者管理', icon: 'audit2', perms: ['/admin/user/v/all', '/admin/user/v/audit/list'] },
    children: [{
      path: 'list',
      name: 'VolunteerList',
      meta: { title: '志愿者列表', perms: ['/admin/user/v/all'] },
      component: () => import('@/views/volunteer/list')
    }, {
      path: 'audit',
      name: 'VolunteerAudit',
      meta: { title: '志愿者审核', perms: ['/admin/user/v/audit/list'] },
      component: () => import('@/views/volunteer/audit')
    }, {
      path: 'profile',
      name: 'VolunteerProfile',
      meta: { title: '志愿者详情', perms: ['/admin/user/v/list', '/admin/user/v/audit/list'] },
      hidden: true,
      component: () => import('@/views/volunteer/profile')
    }
    ]
  },
  {
    path: '/user',
    component: Layout,
    alwaysShow: true,
    meta: { title: '用户管理', icon: 'user2', perms: ['/admin/user/list'] },
    children: [{
      path: 'list',
      name: 'UserList',
      meta: { title: '用户列表', perms: ['/admin/user/list'] },
      component: () => import('@/views/user/list')
    },
    {
      path: 'profile',
      name: 'UserProfile',
      meta: { title: '用户详情', perms: ['/admin/user/list'] },
      hidden: true,
      component: () => import('@/views/user/profile')
    }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: '系统管理', icon: 'system', perms: ['/admin/role/list', '/admin/manager/list'] },
    children: [
      {
        path: 'role',
        name: 'RoleManager',
        component: () => import('@/views/system/role'),
        meta: { title: '角色管理', icon: 'user-role', perms: ['/admin/role/list'] }
      },
      {
        path: 'user',
        name: 'UserManager',
        component: () => import('@/views/system/manager'),
        meta: { title: '管理员', icon: 'user', perms: ['/admin/manager/list'] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export function addAsyncRouters(routes) {
  router.addRoutes(routes)
}

export default router

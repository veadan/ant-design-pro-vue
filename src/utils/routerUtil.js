import { axios } from '@/utils/request'
// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView

  // // // 你需要动态引入的页面组件
  // analysis: () => import('@/views/dashboard/Analysis'),
  // workplace: () => import('@/views/dashboard/Workplace'),
  // monitor: () => import('@/views/dashboard/Monitor')
  // // // ...more
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

/**
 * 获取后端路由信息的 axios API
 * @returns {Promise}
 */
export const getRouterByUser = () => {
  return axios({
    url: '/admin/menu/tree',
    method: 'get'
    /* headers: {
      'Access-Token': 'xxx'
    }
    */
  })
}

/**
 * 获取路由菜单信息
 *
 * 1. 调用 getRouterByUser() 访问后端接口获得路由结构数组
 *    @see https://github.com/sendya/ant-design-pro-vue/blob/feature/dynamic-menu/public/dynamic-menu.json
 * 2. 调用
 * @returns {Promise<any>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    // ajax
    getRouterByUser().then(res => {
      const result = res
      console.log('菜单', result)
      const routers = generator(result)
      const bigRouters = [{
        path: '/',
        name: 'index',
        component: BasicLayout,
        meta: { title: '首页' },
        redirect: '/dashboard/workplace',
        children: routers
      }]
      bigRouters.push(notFoundRouter)
      console.log('bigRouters', bigRouters)
      resolve(bigRouters)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const component = item.component
    const currentRouter = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: `${parent && parent.path || ''}/${item.code}`,
      // 路由名称，建议唯一
      name: item.code,
      // 该路由对应页面的 组件
      component: item.type === 'menu' ? () => import('@/views' + component + '.vue') : constantRouterComponents[component],
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.title, icon: item.icon || undefined, hidden: item.hidden, hideHeader: item.hideHeader, keepAlive: true, permission: item.code && [ item.code ] || null }
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    currentRouter.path = currentRouter.path.replace('//', '/')
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/*
 export const generator = (routerMap, parent) => {
   return routerMap.map(item => {
     const currentRouter = {
       // 路由地址 动态拼接生成如 /dashboard/workplace
       path: `${parent && parent.path || ''}/${item.key}`,
       // 路由名称，建议唯一
       name: item.name || item.key || '',
       // 该路由对应页面的 组件
       component: constantRouterComponents[item.component || item.key],
       // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
       meta: { title: item.title, icon: item.icon || undefined, permission: item.key && [ item.key ] || null }
     }
     // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
     currentRouter.path = currentRouter.path.replace('//', '/')
     // 重定向
     item.redirect && (currentRouter.redirect = item.redirect)
     // 是否有子菜单，并递归处理
     if (item.children && item.children.length > 0) {
       // Recursion
       currentRouter.children = generator(item.children, currentRouter)
     }
     return currentRouter
   })
 }
*/

import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken, getRefreshToken, setToken } from '@/utils/auth'

axios.defaults.isRefreshing = 0
axios.defaults.retry = 4
axios.defaults.retryDelay = 1500
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  async response => {
    const res = response.data
    var config = response.config
    // if the custom code is not 200, it is judged as an error.
    if (res.code === 100001) {
      /**
       * 正在刷新token
       */
      if (axios.defaults.isRefreshing !== 0) {
        config.__retryCount = config.__retryCount || 0
        if (config.__retryCount >= config.retry) {
          return Promise.reject(res)
        }
        config.__retryCount += 1
        const backoff = new Promise(function(resolve) {
          setTimeout(function() {
            resolve()
          }, config.retryDelay || 1500)
        })
        return backoff.then(function() {
          config.headers['X-Token'] = getToken()
          return axios.request(config)
        })
      }
      /**
       * 刷新token
       */
      axios.defaults.isRefreshing = 1
      const token = getRefreshToken()
      const result = await service({
        url: '/admin/auth/token/refresh',
        method: 'post',
        params: { token }
      })
      if (result.code === 200) {
        setToken(result.data)
        axios.defaults.isRefreshing = 0
        response.config.headers['X-Token'] = getToken()
        return axios.request(config)
      } else {
        axios.defaults.isRefreshing = 0
        MessageBox.alert('您的登录已过期,请重新登录', '提示', {
          confirmButtonText: '重新登录',
          type: 'error'
        }).then(() => {
          store.dispatch('user/frontLogOut').then(() => {
            location.reload()
          })
        })
        return Promise.reject(res)
      }
    } else if (res.code === 100002 || res.code === 100003 || res.code === 200004) {
      // to re-login
      var msg = res.code !== 200004 ? '您的登录已过期,请重新登录！' : '账户已被禁用，请联系管理员！'
      MessageBox.alert(msg, '提示', {
        confirmButtonText: '重新登录',
        type: 'error'
      }).then(() => {
        store.dispatch('user/frontLogOut').then(() => {
          location.reload()
        })
      })
      return Promise.reject(res)
    } else if (res.code === 403) {
      router.push('/403')
    } else if (res.code !== 200) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5000
      })
      return Promise.reject(res)
    } else {
      return res
    }
  }, error => {
    if (error.message === 'Network Error') {
      error.message = '无法连接服务器，请稍后重试！'
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 5000
    })
    return Promise.reject(error)
  }
)

export default service

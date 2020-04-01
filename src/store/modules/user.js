import { login, logout, getInfo } from '@/api/auth'
import { getToken, setToken, removeToken, getRefreshToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  refreshToken: getRefreshToken(),
  name: '',
  avatar: '',
  perms: undefined,
  profile: {
    account: undefined,
    companyAddr: undefined,
    companyName: undefined,
    phone: undefined,
    roles: undefined,
    userState: undefined
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESH_TOKEN: (state, token) => {
    state.refreshToken = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PROFILE: (state, profile) => {
    state.profile.account = profile.account
    state.profile.userState = profile.userState
    state.profile.phone = profile.phone
    state.profile.roles = profile.roles
    state.profile.permissions = profile.permissions
    state.profile.companyAddr = profile.companyAddr
    state.profile.companyName = profile.companyName
  },
  SET_PERMS: (state, perms) => {
    state.perms = perms
  }
}

const loginHandle = async function(dispatch, commit, response) {
  const { accessToken, refreshToken, nickname, permissions } = response.data
  commit('SET_NAME', nickname)
  commit('SET_TOKEN', accessToken)
  commit('SET_REFRESH_TOKEN', refreshToken)
  commit('SET_PERMS', permissions)
  commit('SET_PROFILE', response.data)
  setToken(accessToken)
  setRefreshToken(refreshToken)
}

const actions = {
  // user login
  login({ dispatch, commit }, userInfo) {
    const { phone, password, vcode } = userInfo
    return new Promise((resolve, reject) => {
      login({ phone: phone.trim(), password: password, vcode: vcode }).then(async response => {
        loginHandle(dispatch, commit, response)
        await dispatch('generateRoutes', response.data.permissions, { root: true }) // 动态修改权限后 重绘侧边菜单
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(async response => {
        var data
        /**
         * 重新刷新token后 response多了asiox属性
         */
        const { status } = response
        if (status) {
          data = response.data.data
        } else {
          data = response.data
        }
        if (!data) {
          reject('无法获取账户信息，请重新登录！')
        }
        const { nickname, permissions } = data
        commit('SET_NAME', nickname)
        commit('SET_PERMS', permissions)
        commit('SET_PROFILE', data)
        resolve(permissions)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_REFRESH_TOKEN', '')
        removeToken()
        removeRefreshToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  frontLogOut({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_REFRESH_TOKEN', '')
      removeToken()
      removeRefreshToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


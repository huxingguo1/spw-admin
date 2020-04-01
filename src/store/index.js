import Vue from 'vue'
import Vuex from 'vuex'
import CreatePersistedState from 'vuex-persistedstate'
import getters from './getters'
import app from './modules/app'
import permission from './modules/permission'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const vuexPersisted = new CreatePersistedState({
  key: 'VuexPersisted',
  storage: window.sessionStorage,
  /**
   * 指定需要持久化的state
   */
  reducer: state => ({
  })
})

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    settings,
    user
  },
  getters,
  plugins: [vuexPersisted]
})

export default store

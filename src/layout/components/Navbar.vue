<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-popover
        placement="bottom"
        width="200"
        trigger="hover"
      >
        <div class="base-info-container" style="background: #000C17;padding: 20px 10px; height: 100px">
          <el-image :src="userAvatar" style="width:40px;height:40px;border-radius: 10px;float: left;margin: 10px 0px" fit="cover" />
          <div class="field"><span style="line-height: 30px;color: white;font-size: 16px;float: top;margin: 0px 20px;">{{ name }}</span></div>
          <div class="field"><span style="line-height: 30px;color: white;font-size: 14px;float: top;margin: 0px 20px;">{{ profile.phone }}</span></div>
        </div>
        <el-menu
          default-active="1"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :active-text-color="variables.menuText"
          @select="handleOpen"
        >
          <el-menu-item index="1">
            <i class="el-icon-s-home" />
            <span slot="title">工作台</span>
          </el-menu-item>
          <el-menu-item index="2" style="font-weight: bold;color: white">
            <i class="el-icon-switch-button" />
            <span slot="title">退出管理后台</span>
          </el-menu-item>
        </el-menu>
        <img slot="reference" src="@/assets/user.gif" class="user-avatar2">
      </el-popover>
    </div>
    <!--    <div class="console-container" @click="createApp">-->
    <!--      <el-tooltip effect="dark" content="创建应用" placement="bottom">-->
    <!--        <svg-->
    <!--          class="console"-->
    <!--          viewBox="0 0 1024 1024"-->
    <!--          xmlns="http://www.w3.org/2000/svg"-->
    <!--          width="64"-->
    <!--          height="64"-->
    <!--        >-->
    <!--          <path d="M909.7 132.6v620H114.3v-620h795.4m50-50H64.3v720h895.5v-720h-0.1zM317.9 208.3L150.8 407.4l0.2 0.2 167.1 199.2 38.3-32.1-140.3-167.3 140.2-167-38.4-32.1z m389 0l-38.3 32.1 140.2 167-140.4 167.3 38.3 32.1 167.1-199.2 0.2-0.2-167.1-199.1z m-143.5 1.2l-149 403.4 46.9 17.3 149-403.4-46.9-17.3zM957 855.8H67v50h890v-50z" fill="#97a8be" />-->
    <!--        </svg>-->
    <!--      </el-tooltip>-->
    <!--    </div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { removeToken } from '@/utils/auth' // get token from cookie
import { logout } from '@/api/auth'

import user from '@/assets/user.gif'
import variables from '@/styles/variables.scss'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      userAvatar: user
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'profile'
    ]),
    variables() {
      return variables
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // await this.$store.dispatch('LoginOut')
      removeToken()
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    createApp() {
      // this.$store.dispatch('device/openConsole')
      // if (this.$route.path !== '/device/profile') {
      //   this.$router.push({ path: '/device/list', query: { console: true }})
      // }
    },
    handleOpen(key) {
      if (key === '1' || key === 1) {
        this.$router.push('/dashboard')
      } else if (key === '2' || key === 2) {
        logout().then(response => {
          this.logout()
        })
        // this.logout()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";
  .navbar {
  height: $headerHeight;
  overflow: hidden;
  position: relative;
  background: #FFFFFF;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: $headerHeight;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .console-container {
    height: 100%;
    line-height: $headerHeight;
    float: right;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;
    .console {
      display: inline-block;
      vertical-align: middle;
      width: 28px;
      height: 28px;
      margin-right: 20px;
      &:hover {
        transform: scale(1.2,1.2);
        transition-duration: 0.3s;
      }
    }
  }

  .breadcrumb-container {
    float: left;
    line-height: $headerHeight;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: $headerHeight;

    .base-info-container{
      padding: 20px 10px;
      height: 100px;
      background: #545c64;
      .user-avatar3 {
        width: 40px;
        height: 40px;
      }
      .field{
        width: 100%;
        height: 50%;
        float: top;
      }
    }

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .user-avatar2 {
      margin-right: 30px;
      margin-top: calc((#{$headerHeight} - 40px)/2);
      position: relative;
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

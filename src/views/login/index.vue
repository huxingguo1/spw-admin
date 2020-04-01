<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <div class="logos">
          <img src="../../assets/login/logo.png" alt="" srcset="">
        </div>
        <h3 class="title">欢迎登录智慧公益</h3>
      </div>

      <el-form-item prop="phone">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="phone"
          v-model="loginForm.phone"
          style="-webkit-appearance: none;"
          placeholder="请输入手机号"
          name="phone"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="vcode">
        <span class="svg-container">
          <svg-icon icon-class="vcode" />
        </span>
        <el-input
          ref="vcode"
          v-model="loginForm.vcode"
          name="vcode"
          style="width: 50%"
          maxlength="4"
          placeholder="请输入验证码"
        />
        <el-button class="left-button" type="primary" style="min-width: 80px;border-radius: 0px; float: right; padding: 0 30px; height: 52px;" :disabled="!clickable" @click="handleSendSms">{{ sendMsg }}</el-button>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;border-radius: 0px; height: 52px; margin-top: 10px;" @click.native.prevent="handleLogin">登 录</el-button>

    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import { loginPhone } from '@/api/auth'
export default {
  name: 'Login',
  data() {
    const validatePhone = (rule, value, callback) => {
      // if (!validUsername(value)) {
      if (value.length < 6) {
        callback(new Error('清输入正确的账户！'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能小于6位！'))
      } else {
        callback()
      }
    }
    const validateVcode = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('请输入4位验证码！'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        phone: undefined,
        password: undefined,
        vcode: undefined
      },
      loginRules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        vcode: [{ required: true, trigger: 'blur', validator: validateVcode }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      sendMsg: '发送',
      clickable: true,
      timer: null,
      count: 0,
      sendPerid: 60
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.getCookie()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 设置cookie
    setCookie(phone, exdays) {
      var exdate = new Date() // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
      // 字符串拼接cookie
      window.document.cookie =
        'xy.spw.phone' + '=' + phone + ';path=/;expires=' + exdate.toGMTString()
    },
    // 读取cookie
    getCookie() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=') // 再次切割
          // 判断查找相对应的值
          if (arr2[0] === 'xy.spw.phone') {
            this.loginForm.phone = arr2[1] // 保存到保存数据的地方
          }
        }
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.setCookie(this.loginForm.phone, 7)
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    handleSendSms() {
      loginPhone(this.loginForm.phone).then(resp => {
        if (!this.timer) {
          this.count = this.sendPerid
          this.sendMsg = this.count + '秒'
          this.clickable = false
          this.timer = setInterval(() => {
            if (this.count > 0) {
              --this.count
              this.sendMsg = this.count + '秒'
            } else {
              this.sendMsg = '发送'
              this.clickable = true
              clearInterval(this.timer) // 清除定时器
              this.timer = null
            }
          }, 1000)
        }
        this.$notify.success({
          title: '成功',
          message: '验证码发送成功！'
        })
          .catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #002140;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 0px;
    color: #454545;
    &:hover {
      border: 1px solid #1890ff;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #002140;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: url('../../assets/login/backgrounds.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: calc(50vh - 320px) 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .el-button--primary{
    background-color: #fff;
    border-color: #fff;
    font-size: 20px;
    color: #1464F0;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #fff;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    float: left;
    font-size: 16px;
  }
  .el-form-item--default{
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0px;
    color: #454545;
    &:hover {
      border: 1px solid #fff;
    }
  }
  .el-input--default{
    float: left;
    margin-top: 2.5px;
    .el-input__inner{
      font-size: 16px;
    }
  }
  .title-container {
    position: relative;
    text-align: center;
    .logos{
      width: 110px;
      height: 110px;
      border-radius: 50%;
      background-color: #fff;
      margin: 20px auto;
      text-align: center;
      overflow: hidden;
      img{
        width: 84px;
        height: 87px;
        margin-top: 11.5px;
      }
    }
    .title {
      font-size: 24px;
      color: $light_gray;
      margin: 20px auto;
      text-align: center;
      font-weight: 400;
      padding-bottom: 20px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{ $t("login.title") }}</h3>
        <lang-select class="set-language" />
        <div class="login-header">
          <a :class="{active:isPassword}" @click="isPassword=true">{{ $t('login.passwordLogin') }}</a>
          <a :class="{active:!isPassword}" @click="isPassword=false">{{ $t('login.phoneLogin') }}</a>
        </div>
      </div>
      <div class="login-content">
        <div v-if="isPassword" class="item">
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              :placeholder="$t('login.username')"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
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
              :placeholder="$t('login.password')"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
        </div>
        <div v-else class="item">
          <el-form-item prop="mobile">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="mobile"
              v-model="loginForm.mobile"
              :placeholder="$t('login.mobilePhone')"
              name="mobile"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>
          <el-form-item prop="code">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              ref="code"
              v-model="loginForm.code"
              type="text"
              :placeholder="$t('login.verificationCode')"
              name="code"
              abindex="2"
              maxlength="6"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd">
              <el-button :loading="sending" :disabled="sendDisabled" size="small" @click="onSendSms">{{ sendButtonText }}</el-button>
            </span>
          </el-form-item>
        </div>
      </div>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
      >{{ $t("login.logIn") }}</el-button>

      <div class="tips">
        <span
          style="margin-right: 20px"
        >{{ $t("login.username") }}: admin</span>
        <span> {{ $t("login.password") }}: {{ $t("login.any") }}</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername, validMobile } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'

export default {
  name: 'Login',
  components: { LangSelect },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名!'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('请输入正确的用户名!'))
      } else {
        callback()
      }
    }
    const validCode = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('验证码为4为数字！'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111',
        mobile: '', // 手机号
        code: '' // 验证码
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        mobile: [
          { required: true, trigger: 'blur', validator: validateMobile }
        ],
        code: [
          { required: true, trigger: 'blur', validator: validCode }
        ]
      },
      isPassword: true, // true代表密码, false代表短信
      sending: false,
      sendDisabled: false,
      loading: false,
      timer: 0,
      passwordType: 'password',
      redirect: undefined
    }
  },
  computed: {
    sendButtonText() {
      if (this.timer === 0) {
        return '发送验证码'
      } else {
        return `${this.timer}秒后重发`
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
    timer(num) {
      if (num > 0) {
        setTimeout(() => {
          this.timer = --num
        }, 1000)
      }
    }
  },
  methods: {
    onSendSms() {
      const that = this
      this.loginWay = false
      this.$refs.loginForm.validateField('mobile', err => {
        if (!err) {
          this.sending = true
        }
        setTimeout(() => {
          that.sending = false
        }, 800)
      })
    },
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
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
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
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
      .login-header{
        margin-bottom: 30px;
        text-align: center;
        a{
          color: #fff;
          margin: 50px;
        }
        .active{
            color:#fff;
            padding-bottom: 10px;
            border-bottom: 3px solid #fff;
        }
      }
    }
    .login-content{
      .item{
          border: 0px solid #999;
          overflow: hidden;
      }
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

  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
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

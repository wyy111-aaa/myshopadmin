<template>
  <div class="login">
    <div class="login-panel">
      <div class="title">超市后台管理系统</div>
      <el-tabs
          type="border-card"
          v-model="currentTab"
          stretch>
        <el-tab-pane name="account">
          <login-account ref="accountRef"></login-account>
        </el-tab-pane>
      </el-tabs>
      <div class="account-control">
        <el-checkbox v-model="isKeepPassWord">记住密码</el-checkbox>
        <el-link type="primary">忘记密码</el-link>
      </div>
      <el-button type="primary" class="login-btn" @click="handleLogin">
        立即登录
      </el-button>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import loginAccount from './cpns/login-account.vue'

const currentTab = ref('account')
// 记住密码
const isKeepPassWord = ref(true)

// 获取账号密码登录 获取组件类型
const accountRef = ref()

const handleLogin = ()=>{
  if (currentTab.value === 'account') {
    accountRef.value.loginActive(isKeepPassWord.value)
  } else {
    console.log('手机登录')
  }
}


</script>

<style scoped lang="less">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: url('@/assets/img/login-bg.svg');

  .login-panel {
    margin-bottom: 150px;
    width: 320px;

    .title {
      text-align: center;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .icon-styles {
      position: relative;
      margin-right: 2px;

      .icon-styles-bottom {
        position: absolute;
        top: 60%;
        transform: translateY(-50%);
      }
    }

    .account-control {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
    }

    .login-btn {
      width: 100%;
      margin-top: 10px;
    }
  }
}
</style>

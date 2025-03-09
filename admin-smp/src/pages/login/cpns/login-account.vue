<template>
  <div class="login-account">
    <el-form
        ref="accountFormRef"
        :model="form"
        :rules="rules"
        label-width="60px"
        class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="username">
        <el-input
            type="text"
            clearable
            placeholder="请输入账号"
            v-model="form.username"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
            clearable
            type="password"
            placeholder="请输入密码"
            v-model="form.password"
        />
      </el-form-item>
    </el-form>
  </div>
</template> 

<script setup>
import { reactive, ref,defineExpose } from 'vue'
import localCache from '@/utils/cache.js'
import { rules } from '../config/account-config'
import useStore from '@/store'


const {login} = useStore()
const {accountLogin} = login

const form = reactive({
  username:localCache.getCache('username') ?? 'admin',
  password:localCache.getCache('password') ?? '123456'
})

// 表单检验
const accountFormRef = ref()

const loginActive = (isKeepPassWord) => {

  accountFormRef.value.validate((valid)=>{

    if(valid){
      // 是否记住密码
      if(isKeepPassWord){
        localCache.setCache('username',form.username)
        localCache.setCache('password',form.password)
      }else {
        localCache.deleteCache('username')
        localCache.deleteCache('password')
      }
      // 提交信息
      accountLogin({...form})
    }

  })
}

defineExpose({
  loginActive
})

</script>

<style scoped lang="less">

</style>

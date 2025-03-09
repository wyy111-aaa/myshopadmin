<template>
  <div class="user-info">
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar size="small">
          <img v-if="avatar" :src="avatar" alt=""/>
          <img v-else src="@/assets/img/touxiang.jpg" alt=""/>
        </el-avatar>
         <span class="small-text">{{ name }}</span>
      </span>
      <template #dropdown>
        <el-dropdown-item @click="handleExitClick">
          退出登录
        </el-dropdown-item>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
import {storeToRefs} from 'pinia'
import useStore from "@/store/index.js";
import localCache from '@/utils/cache.js'

const {login} = useStore()

const {userInfo} = storeToRefs(login)
const {avatar,name} = userInfo.value
const router = useRouter()

const handleExitClick = () => {
  localCache.deleteCache('token')
  router.push('/main')
}
</script>

<style scoped lang="less">
.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;

  .small-text {
    margin-left: 5px;
  }
}

.el-dropdown-link:focus {
  outline: none;
}
</style>

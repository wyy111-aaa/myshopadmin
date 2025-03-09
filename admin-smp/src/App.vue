<template>
  <div class="app">
    <el-config-provider :locale="locale">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>



<script setup>
import { ref } from 'vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
let locale = ref(zhCn);
</script>


<style scoped>
.app {
  height: 100%;
}
</style>

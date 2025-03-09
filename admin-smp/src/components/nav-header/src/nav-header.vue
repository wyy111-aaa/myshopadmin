<template>
  <div class="nav-header">
    <!-- 左侧收缩按钮 -->
    <div class="fold-menu" @click="handleFoldClick">
      <el-icon>
        <template v-if="!isFold">
          <!-- 展开时显示的图标 -->
          <Expand/>
        </template>

        <template v-else>
          <!-- 折叠时显示的图标 -->
          <Fold/>
        </template>
      </el-icon>
    </div>
    <!-- 导航栏右侧信息 -->
    <div class="content">
      <nav-breadcrumb :breadcrumb="breadcrumbs"/>
      <user-info/>
    </div>
  </div>
</template>

<script setup>
import {ref, defineEmits,computed} from 'vue'
import {useRoute} from 'vue-router'

import NavBreadcrumb  from "@/components/nav-breadcrumb/index.js";
import UserInfo from "@/components/user-info/index.js";

import menuList from "@/router/menuList.js";
import {pathMapBreadcrumb} from "@/utils/mapMenu.js";

const emit = defineEmits(['foldChange'])
// 是否展开
const isFold = ref(false)

const handleFoldClick = () => {
  isFold.value = !isFold.value
  emit('foldChange', isFold.value)
}

// 获取面包屑，确保面包屑导航为最新
// 定义一个计算属性
const breadcrumbs = computed(() => {
  const route = useRoute()
  // 获取当前路径
  const currentPath = route.path
  return pathMapBreadcrumb(menuList, currentPath)
})



</script>

<style scoped lang="less">
.nav-header {
  display: flex;
  width: 100%;

  .fold-menu {
    font-size: 30px;
    cursor: pointer;
  }

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    padding: 0 20px;
  }
}
</style>

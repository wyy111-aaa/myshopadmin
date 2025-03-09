<template>
  <div class="main">
    <el-container class="main-content">
      <!-- 左侧菜单   -->
      <el-aside :width="isCollapse ? '60px' : '210px'">
        <nav-menu :collapse="isCollapse"></nav-menu>
      </el-aside>

      <!--   右侧内容   -->
      <el-container class="page">
        <el-header class="page-header">
          <navHeader @foldChange="foldChange"/>
        </el-header>
        <el-main class="page-content">
          <div class="page-info">
            <router-view/>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>

import {ref} from 'vue'
import NavMenu from "@/components/nav-nemu/index.js";
import navHeader from "@/components/nav-header/index.js";


let isCollapse = ref(false)

const foldChange = (isFold) => {
  isCollapse.value = isFold
}

</script>

<style scoped lang="less">
.main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.main-content,
.page {
  height: 100%;
}

.page-content {
  height: calc(100% - 48px);

  .page-info {
    background-color: #fff;
    border-radius: 5px;
  }
}

::v-deep(.el-header,.el-footer) {
  display: flex;
  color: #333;
  text-align: center;
  align-items: center;
}

::v-deep(.el-header) {
  height: 48px !important;
}

::v-deep(.el-aside) {
  overflow-x: hidden;
  overflow-y: auto;
  line-height: 200px;
  text-align: left;
  cursor: pointer;
  background-color: #001529;
  transition: width 0.3s linear;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    display: none;
  }
}

::v-deep(.el-main) {
  color: #333;
  text-align: center;
  background-color: #f0f2f5;
}
</style>

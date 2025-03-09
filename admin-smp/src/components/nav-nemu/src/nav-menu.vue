<template>
<!-- 左侧菜单 -->
  <div class="nav-menu">
    <!--   logo -->
    <div class="logo">
      <img class="img" src="@/assets/img/aislogo.png" alt="logo"/>
      <span class="title" v-if="!collapse">超市后台管理</span>
    </div>

    <!--  菜单  -->
    <!-- :default-active  默认激活的菜单索引或标识符 -->
    <el-menu
        :default-active="defaultValue"
        class="el-menu-vertical"
        :collapse="collapse"
        :unique-opened="true"
        background-color="#0c2135"
        text-color="#b7bdc3"
        active-text-color="#0a60bd"
      >

      <!--   商品   -->
      <template v-for="item in menuList" :key="item.id">
        <el-sub-menu :index="item.id + ''">
          <template #title>
            <i class="iconfont icon-item" :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </template>
          <template v-for="subitem in item.children" :key="subitem.id">
            <el-menu-item
                :index="subitem.id + ''"
                @click="handleRoute(subitem)"
            >
              {{ subitem.name }}
            </el-menu-item>
          </template>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import {defineProps, ref} from 'vue'
import {useRouter, useRoute} from 'vue-router'
// 菜单信息
import menuList from "@/router/menuList.js";
import {pathMapMenu} from "@/utils/mapMenu.js";

const {collapse} = defineProps({
  collapse: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const route = useRoute()

// 当前路由的 地址 /main
const currentPath = route.path
let menu = pathMapMenu(menuList, currentPath)


// 返回 当前路由对象
const defaultValue = ref(menu.id + '')
const handleRoute = (item) => {
  router.push({
    // 如果item.url为null、undefined等假值，则路径设为'/not-found',反之即转到item.url
    path: item.url ?? '/not-found'
  })
}
</script>

<style scoped lang="less">
.nav-menu {
  height: 100%;
  background-color: #001529;

  .logo {
    display: flex;
    height: 28px;
    padding: 12px 10px 8px 10px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    .img {
      height: 100%;
      margin: 0 10px;
    }

    .title {
      font-size: 16px;
      font-weight: 700;
      color: white;
    }
  }

  .icon-item {
    font-size: 20px;
    margin-right: 10px;
  }

  ::v-deep(.el-menu) {
    border-right: none;
    background-color: #001529 !important;
  }

  // 目录
  ::v-deep(.el-sub-menu) {
    background-color: #001529 !important;
    // 二级菜单 ( 默认背景 )
    .el-menu-item {
      padding-left: 50px !important;
      background-color: #0c2135 !important;
    }
  }

  ::v-deep(.el-sub-menu__title) {
    background-color: #001529 !important;
  }

  // hover 高亮
  ::v-deep(.el-menu-item:hover) {
    color: #fff !important; // 菜单
  }

  ::v-deep(.el-menu-item.is-active) {
    color: #fff !important;
    background-color: #0a60bd !important;
  }
}

::v-deep(.el-menu-vertical:not(.el-menu--collapse)) {
  width: 100%;
  height: calc(100% - 48px);
}
</style>

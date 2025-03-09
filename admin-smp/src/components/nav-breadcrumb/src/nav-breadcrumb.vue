<!-- 显示当前页面的路径，快速返回之前的任意页面。
在 el-breadcrumb 中使用 el-breadcrumb-item 标签表示从首页开始的每一级。 
该组件接受一个 String 类型的参数 separator来作为分隔符。 默认值为 '/'。 -->

<template>
<div class="nav-breadcrumb">
  <el-breadcrumb separator="/">
    <template v-for="item in breadcrumb" :key="item.name">
      <el-breadcrumb-item>
        {{ item.name }}
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</div>
</template>

<script setup>
// defineProps用于组件通信中父级组件给子级组件传值，用来声明props
import {defineProps} from 'vue'
const {breadcrumb} = defineProps({
  breadcrumb:{
    type:Array,
    default:()=>[]
  }
})
</script>

<style scoped lang="less">

</style>

<template>
  <div class="address">
    <!-- 头部 -->
    <div class="search">
      <el-form :inline="true" :model="addressSearch">

        <el-form-item style="margin-left: 150px;" label="用户名">
          <el-input v-model="searchword" placeholder="请输入用户名" clearable />
        </el-form-item>

        <!-- <el-form-item label="电话号码">
          <el-input v-model="addressSearch.phone" placeholder="请输入电话号码" clearable />
        </el-form-item> -->

        <el-form-item>
          <el-button type="primary" @click="handleQuery(searchword)">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <el-table 
        :data="addressList"
        style="height: 80vh;">
          <el-table-column prop="uname" label="用户名"/>
          <el-table-column prop="phone" label="电话号码"/>
          <el-table-column prop="is_default" label="是否默认" >
            <template #default="scope">
              <span>{{ getStatus(scope.row.is_default) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="详细地址" />
          <el-table-column prop="created_at" label="创建时间">
            <template #default="scope">
               <span>{{ getDate(scope.row.created_at) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updated_at" label="修改时间" >
          <template #default="scope">
               <span>{{ getDate(scope.row.updated_at) }}</span>
            </template>
          </el-table-column>
        </el-table>
    </div>
  </div>
</template>

<script setup>
import { reactive,ref,onMounted,nextTick ,computed,watch} from "vue";
import {storeToRefs} from 'pinia'

import useStore from "@/store/index.js";
const {address} = useStore()
const {getAddressList,searchAddress} = address

const searchword=ref('')

const {addressList} = storeToRefs(address)


onMounted(async ()=>{
  await getAddressList()
  nextTick(()=>{
    // console.log(addressList.value);
  })
})
const getStatus = computed(() => (status) => {
  return status === 1 ? "默认" : "非默认"
})
const getDate = computed(() => (date) => {
  let data=''
  
  if(date==null||date=='')
    {
      console.log(date);
      data='null' }
  else{
    data=`\n${date.slice(0,4)}\n-\n${date.slice(5,7)}\n-\n${date.slice(8,10)} 
  \n${date.slice(11,19)}`
  }
  return data
})
watch(
  searchword,
  (newval,oldVal)=>{
    if(newval==""||newval==null)
    getAddressList()
    
  }
)

// 搜索
const handleQuery = (searchword) => {
  let word=searchword.trim()
  if(word==''||word==null){
     getAddressList()
  }else{
    let obj={
      uname:word
    }
    searchAddress(obj)
  }
}

</script>

<style scoped lang="less">
.address {
  width: 100%;
  height: 100%;

  .search {
    display: flex;
    padding: 20px 10px;
  }
  .content{
    display: flex;
    padding: 20px 10px;
  }
}
</style>

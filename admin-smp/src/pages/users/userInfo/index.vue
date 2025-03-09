<template>
  <div style="padding-bottom: 20px;">用户管理</div>
  <div class="user-info">
    <div class="search">
      <el-form :inline="true" :model="addressSearch">

        <el-form-item label="用户名">
          <el-input v-model="addressSearch.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="userList" style="width: 100%" height="950">
      <el-table-column fixed prop="uid" label="用户账号" width="220" />
      <el-table-column prop="uname" label="用户名" width="200" />
      
      <el-table-column prop="" label="头像" width="210" >
        <template #default="scope">
        
          <img v-if="scope.row.avatar" :src="scope.row.avatar" width="30px" height="30px" alt=""/>
          <img v-else src="@/assets/img/touxiang.jpg" width="30" height="30" alt=""/>
        </template>
    </el-table-column>
      <!-- <img src="avatar" alt="头像" /> -->
      <el-table-column prop="phone" label="电话号码" width="210" />
      <el-table-column prop="created_at" label="创建时间" width="130">
        <template #default="scope">
          <span>{{ getDate(scope.row.updated_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updated_at" label="修改时间" width="130">
        <template #default="scope">
          <span>{{ getDate(scope.row.updated_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_locked" label="是否禁用" width="130">

        <template #default="scope">
          
          <el-switch v-model="scope.row.is_locked" 
          active-color="#13ce66" inactive-color="#ff4949"
          :active-value=0
          :inactive-value=1
            @change="changeStatus($event, scope.row, scope.$index)">
          </el-switch>
        </template>
      </el-table-column>

      <!-- <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" :icon="Edit"
            style="color: rgb(53, 123, 169); background-color: white; border-color: white;"
            @click="updateCaigou(scope.row)">修改</el-button>
        </template>
      </el-table-column> -->

    </el-table>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, nextTick, reactive, watch, toRaw } from 'vue';
// storeToRefs 可以把数据转成响应式的
import { storeToRefs } from 'pinia'
// 拿到 useStore 就是状态管理的总实例
import useStore from '@/store'
import { Delete ,Edit} from '@element-plus/icons-vue'
const { user } = useStore()

// 方法 获取 es6 解构
const { getuserList,openUser,forbidUser } = user
// 参数获取 state getters 这样写
const { userList } = storeToRefs(user)
const addressSearch = reactive({
  username: '',
  phone: ''
})
onMounted(async () => {
  await getuserList()
  nextTick(() => {
    
    console.log(userList.value)
  })
})

// 代码执行 userList = [] onMounted 挂在的时候请求，数据获取 userList = [....]
// 然后在 setup 打印 userList.value 肯定没有值的，因为 setup 里面的执行 比 onMounted 执行还要提前
// 涉及生命周期了

const getDate = computed(() => (date) => {
  let data=''
  
  if(date==null||date=='')
    {
      data='null'}
  else{
    data=`\n${date.slice(0,4)}\n-\n${date.slice(5,7)}\n-\n${date.slice(8,10)} 
  \n${date.slice(11,19)}`
  }
  return data
})

// 有按钮 就不要显示字了


// 开关事件，禁用启用用户
const changeStatus = (e, row, index) => {
  console.log(e, row, index) //e返回状态，row当前行数据，index下标
  let uId = row.uid;
  let type = row.is_locked
  if(e==0){
    // 调用启用用户接口
    let obj={
      uid:uId
    }
    openUser(obj).then(res=>{
      if(res==true){
      ElMessage({
                message: '启用成功',
                type: 'success',
              })
    }else{
      ElMessage.error('启用失败')
    }
    })
  }else{
    // 调用禁用用户接口
    let obj={
      uid:uId
    }
    forbidUser(obj).then(res=>{
      if(res==true){
      ElMessage({
                message: '禁用成功',
                type: 'success',
              })
    }else{
      ElMessage.error('禁用失败')
    }
    }) 
  }
  // getuserList()
}
</script>
.search {
  display: flex;
  padding: 20px 10px;
}
<style scoped lang="less"></style>

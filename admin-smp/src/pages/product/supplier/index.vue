<template>
   <div style="padding-bottom: 20px;">供应商管理</div>
<div class="supplier">
  <div style="margin-bottom: 20px;">
      <el-input style="width: 200px;" placeholder="请输入供应商名称搜索" v-model="searchword" />
      
      <el-button  type="primary" plain @click="show2 = true" style="margin-left: 10px;margin-left: 40px;">新增供应商</el-button>
    </div>
  <el-table :data="suppilerList" height="800" style="width: 100%">
      <el-table-column fixed prop="sid" label="供应商编号" width="150" />
      <el-table-column prop="suppliername" label="供应商名称" width="290" />
      <el-table-column prop="phone" label="供应商电话" width="290" />
      <el-table-column prop="region" label="供应商地址" width="250 " />
      <el-table-column prop="created_at" label="添加时间" width="200" >
        <template #default="scope">
          <span>{{ getDate(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="updated_at" label="修改时间" width="130" >
        <template #default="scope">
          <span>{{ getDate(scope.row.created_at) }}</span>
        </template>
      </el-table-column> -->
      
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" :icon="Delete" style="color: red; background-color: white; border-color: white;" 
            @click="deleteSupplier(scope.row.sid, scope.$index)" >删除</el-button>
            
          <el-button type="primary" :icon="Edit" style="color: rgb(53, 123, 169); background-color: white; border-color: white;" 
            @click="updateCaigou(scope.row)" >修改</el-button>
          <!-- <el-button size="small" type='daner' @click="updateCaigou(scope.row)">修改订单</el-button> -->
        </template>
      </el-table-column>

    </el-table>
        <!-- 新增商品对话框 -->
    <el-dialog v-model="show2" title="新增供应商" width="40%">
      <el-form :model="suppliers" :rules="rule2" ref="ruleFormRef2">
        <el-form-item label="供应商名称" prop="name" label-width="100">
          <el-input v-model="suppliers.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商电话" prop="phone" label-width="100">
          <el-input v-model="suppliers.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商地址" prop="address" label-width="100">
          <el-input v-model="suppliers.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="show2 = false">取消</el-button>
          <el-button style="margin-left: 40px;" type="primary" @click="add(ruleFormRef2)">确定新增</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改采购商品信息 对话框 -->
    <el-dialog v-model="show3" title="修改供应商信息" width="40%">
      <el-form :model="update" :rules="rule3" ref="ruleFormRef3">
        <el-form-item label="供应商名称" prop="name" label-width="100">
          <el-input v-model="update.suppliername" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商电话" prop="price" label-width="100">
          <el-input v-model="update.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商地址" prop="num" label-width="100">
          <el-input v-model="update.region" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="show3 = false">取消</el-button>
          <el-button type="primary" @click="edit(ruleFormRef3)">确定修改</el-button>
        </span>
      </template>
    </el-dialog>
    
</div>
</template>

<script setup>
import { onMounted, ref, computed, nextTick, reactive,watch } from 'vue';
import { storeToRefs } from 'pinia'
import useStore from '@/store'

const { suppier } = useStore()
// 方法 获取 es6 解构
const {getSupplierList,handleSearch ,addsupplier,updateSupplier,delSuppier} = suppier
// 参数获取 state getters 这样写
const { suppilerList} = storeToRefs(suppier)
onMounted(() => {
  getSupplierList()
})
// 搜索
let searchword = ref('')
watch(
  searchword,
  (newval,oldVal)=>{
    console.log(newval,oldVal);
    let obj={
      suppliername: newval.trim()
    }
    
    if(newval.length <= 0){
      // getList()
      // console.log('请输入xxx');
      getSupplierList()
    }else{
      handleSearch(obj)
    }
  }
)
let show2 = ref(false)
let show3 = ref(false)
let suppliers = ref({
  name:'',
  phone:'',
  address:''
})
let update = ref({
  suppliername: '',
  phone: '',
  region: '',
  sid: '',
})
// 表单规则
// 新增供应商
const rule2 = reactive({
  name: [{
    required: true,
    message: '请填写供应商名称',
    trigger: 'blur'
  }],
  phone: [{
    required: true,
    message: '请填写供应商品电话',
    trigger: 'blur'
  }],
  address: [{
    required: true,
    message: '请填写供应商地址',
    trigger: 'blur'
  }]
})
// 修
const getDate =  computed(() =>(date) =>{
  return `\n${date.slice(0,4)}\n-\n${date.slice(5,7)}\n-\n${date.slice(8,10)} 
  \n${date.slice(11,19)}`
})

// 新增供应商
const ruleFormRef2 = ref()

const add = (formEl) => {
  if (!formEl) return;

  formEl.validate(async (valid, fields) => {
    if (valid) {
      // console.log(caigougood)
      let obj = {
        suppliername: suppliers.value.name,
        phone: suppliers.value.phone,
        region: suppliers.value.address
      }

      await addsupplier(obj).then(result => {
        console.log(result, 'result')
        if (result == true) {
          ElMessage({
            message: '添加成功',
            type: 'success',
          })
        } else {
          ElMessage.error('添加失败')
        }
        show2.value = false
      })

    } else {
      console.log('error submit!', fields)
    }
    getSupplierList();
  })
}

const deleteCaigou=()=>{
  // console.log('...')
}
// 修改采购订单信息--获取cid,并将原有信息填在信息框内
const updateCaigou = (good) => {
  // 将商品信息填入对话框，cid不显示
  update.value = good
  show3.value = true;
  // console.log(update.value)
}
// 修改商品信息
const ruleFormRef3 = ref()
const edit = (formEl) => {
  if (!formEl) { return; }
  formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log(update)
      let obj = {
        suppliername: update.value.suppliername,
        region: update.value.region,
        phone: update.value.phone,
        sid: update.value.sid
      }
      await updateSupplier(obj).then(result => {
        console.log(result, 'res')
        if (result == true) {
          ElMessage({
            message: '修改成功',
            type: 'success',
          })
        } else {
          ElMessage.error('修改失败')
        }
        show3.value = false
      })
    } else {
      console.log('error submit!', fields)
    }
    getSupplierList();
  })
}

// 删除
const deleteSupplier =(sid)=>{
  ElMessageBox.confirm(
    '您将要删除该采购商，确定要继续吗？',
    '提醒',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(()=>{
    let obj={
    sid:sid
  }
  delSuppier(obj).then(res=>{
    if(res==true){
      ElMessage({
            message: '删除成功',
            type: 'success',
          })
    }else{
      ElMessage.error('删除失败')
    }
  })
  getSupplierList();

  }).catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
  
}

</script>

<style scoped lang="less">

</style>
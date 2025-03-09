<template>
  <div style="padding-bottom: 20px;">商品管理</div>
  <div class="purchase">
    <div style="margin-bottom: 20px;">
      <el-input style="width: 200px;" placeholder="请输入商品名称搜索" v-model="searchword" />
    </div>
    <el-table :data="goodsList" style="width: 100%" height="950"  >
      <el-table-column fixed prop="gid" label="商品编号" width="150"  />
      <el-table-column prop="goodsname" label="商品名称" width="140" />
      <el-table-column prop="" label="商品图片" width="210" >
        <template #default="scope">
        
          <img v-if="scope.row.imgs" :src="scope.row.imgs" width="50px" height="50px" alt=""/>
          <img v-else src="@/assets/img/touxiang.jpg" width="30" height="30" alt=""/>
        </template>
    </el-table-column>
      
      <el-table-column prop="childrentype" label="类别" width="140" />
      <el-table-column prop="price" label="价格" width="140" />
      <el-table-column prop="description" label="详情" width="140" />
      <el-table-column prop="stock" label="库存" width="140" />
      <el-table-column prop="sales" label="销量" width="140" />
      <el-table-column prop="is_on" label="状态" width="140" >
        <template #default="scope">
          <span>{{ getStatus(scope.row.is_on) }}</span>
        </template>
      </el-table-column>
     
      <el-table-column prop="created_at" label="上架时间" width="130" >
        <template #default="scope">
          <span>{{ getDate(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cid" label="采购号" width="140" />
      <el-table-column fixed="right" label="操作" width="300">
				<template #default="scope">	
          <div class="flex justify-space-between mb-4 flex-wrap gap-4">
            <el-button  v-if="scope.row.is_on===1" 
              :type="buttons[5].type"
              text   @click="down(scope.row.gid)" 
              >{{ buttons[5].text }}
            </el-button>

            <el-button 
              v-else 
              :type="buttons[1].type"
              text
              @click="handleUp(scope.row.gid)">{{ buttons[1].text }}
            </el-button>
             
            <el-button type="primary" :icon="Edit" style="color: rgb(53, 123, 169); background-color: white; border-color: white;" 
            @click="updateGood(scope.row)" >修改</el-button>
            </div>
				</template>
			</el-table-column>  
    </el-table>
    <!-- 修改商品 -->
    <el-dialog v-model="show1" title="修改商品" width="40%">
      <el-form :model="updategood" :rules="rule1" ref="ruleFormRef3">
        <el-form-item label="商品名称" prop="goodsname" label-width="100">
          <el-input v-model="updategood.goodsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price" label-width="100">
          <el-input v-model="updategood.price" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="商品类别" prop="tid" label-width="100">
          <el-input v-model="updategood.childrentype" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="商品分类"   prop="childrenName" label-width="100">
          <div class="m-4">
            <p>商品分类</p>
            <el-cascader v-model="updategood.tid" :options="typeList" :props="props1" clearable @change="handleChange" />
           </div>
        </el-form-item>
        <el-form-item label="商品描述" prop="description" label-width="100">
          <el-input v-model="updategood.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="imgs" label-width="100">
          <el-input v-model="updategood.imgs" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="show1 = false">取消</el-button>
          <el-button type="primary" @click="edit(ruleFormRef3)">确定修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref, computed, nextTick,reactive ,watch} from 'vue'; 
import { storeToRefs } from 'pinia'
import useStore from '@/store'
import { Delete ,Edit} from '@element-plus/icons-vue'
// import console from 'console';
const { goods } = useStore()

// 方法 获取 es6 解构
const {getgoodsList ,put,gettype,handleSearch,editgood} = goods

// 参数获取 state getters 这样写
const { goodsList, typeList} = storeToRefs(goods)

onMounted(() => {
  getgoodsList (),
  gettype()
})
// 表单规则
let rule1=reactive({
  goodsname: [{
    required: true,
    message: '请填写商品名称',
    trigger: 'blur'
  }],
  imgs: [{
    required: true,
    message: '请填写商品图片地址',
    trigger: 'blur'
  }],
  description: [{
    required: true,
    message: '请填写商品描述',
    trigger: 'blur'
  }],
  tid: [{
    required: true,
    message: '请填写商品类型',
    trigger: 'blur'
  }],
  gid: [{
    required: true,
    message: '请填写订单cid',
    trigger: 'blur'
  }]
})
let show1=ref(false)
const buttons = [
  { type: '', text: 'plain' },
  { type: 'primary', text: '上架' },
  { type: 'success', text: 'success' },
  { type: 'info', text: 'info' },
  { type: 'warning', text: 'warning' },
  { type: 'danger', text: '下架' },
] 
const props1 = {
  checkStrictly: true,
  value:'tid',
  label:'typename'
}
let updategood=ref({})
let searchword=ref('')
watch(
  searchword,
  (newval,oldVal)=>{
    // console.log(newval,oldVal);
    let obj={
      searchword: newval.trim()
    }
    handleSearch(obj)
    if(newval.length <= 0){
      // getList()
      // console.log('请输入xxx');
      getgoodsList()
    }
  }
)
const getDate =  computed(() =>(date) =>{
  
  return `\n${date.slice(0,4)}\n-\n${date.slice(5,7)}\n-\n${date.slice(8,10)} 
  \n${date.slice(11,19)}`
})
const getStatus = computed(() => (status) => {
  return status === 1 ? "在售" : "下架"
})
// 下架
const down = (gid)=>{
  let obj={
    is_on:0,
    gid:gid
  }
  console.log(obj)
  put(obj).then(res=>{
    console.log(res)
    if(res.status==true){
      ElMessage({
            message: '下架成功',
            type: 'success',
         })
    }else{
      ElMessage.error('下架失败')
    }
  })
  getgoodsList ()
}
// 上架 put? => put 是关键字 time update created=> 代码核对（质量的）
const handleUp = async(gid)=>{

  let obj={
    is_on:1,
    gid:gid
  }
  let res = put(obj)
  // console.log(res);
  put(obj).then(res=>{
    console.log(res)
    if(res.status==true){
      ElMessage({
            message: '上架成功',
            type: 'success',
         })
    }else{
      ElMessage.error('上架失败')
    }
  })
  getgoodsList ()
}
// 修改商品信息,将原有信息填入对话框
const updateGood = (good)=>{
updategood.value=good
show1.value=true;
typeList.value.tid=good.tid
// console.log(good.tid)
// console.log(typeList.value.tid)
// console.log(updategood.value)
}
// 将分类tid放入caigous.tid
// const handleChange=(tid)=>{
//   let arr=[...tid]
//   console.log(arr[arr.length-1])
//   updategood.value.tid=arr[arr.length-1]
//   console.log(updategood.value.tid);
//   console.log(updategood.value)
// }
// 修改商品信息
const ruleFormRef3 = ref()
const edit = (formEl) => {
  if (!formEl) return; 
  formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log(updategood)
      let obj = {
        tid:updategood.value.tid,
        goodsname: updategood.value.goodsname,
        price: updategood.value.price,
        description:updategood.value.description,
        imgs:updategood.value.imgs,
        gid: updategood.value.gid
      }
      await editgood(obj).then(result => {
        console.log(result, 'res')
        if (result == true) {
          ElMessage({
            message: '修改成功',
            type: 'success',
          })
        } else {
          ElMessage.error('修改失败')
        }
        show1.value = false
      })
    } else {
      console.log('error submit!', fields)
    }
    getgoodsList();
  })
}
</script>

<style scoped lang="less">

</style>



<template>
  <div style="padding-bottom: 20px;">采购管理</div>
  <div class="purchase">
    
    <div style="margin-bottom: 20px;">
      <el-input style="width: 200px;" placeholder="请输入商品名称搜索" v-model="searchword" />
      
      <el-button type="primary" plain @click="show2 = true" style="margin-left: 10px;">新增采购</el-button>
    </div>
    <el-table :data="goodsBuyList" style="width: 100%" height="950">
      <el-table-column fixed prop="cid" label="采购号" width="150" />
      <el-table-column prop="goodsname" label="商品名称" width="140" />
      <el-table-column prop="price" label="单价" width="140" />
      <el-table-column prop="num" label="数量" width="140" />
      <el-table-column prop="total" label="总价" width="140" />
      <el-table-column prop="sid" label="供应商id" width="140" />
      <el-table-column prop="supplierName" label="供应商名称" width="140" />
      <el-table-column prop="buy_time" label="采购时间" width="150">
        <!-- 改变数据 -->
        <template #default="scope">
          <span>{{ getDate(scope.row.buy_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="buy_status" label="入库状态" width="80">
        <!--  自己去查一下 表格字段的嵌套插槽 -->
        <template #default="scope">
          <span>{{ getStatus(scope.row.buy_status) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="100" label="入库">
        <template #default="scope">
          <el-button v-if="scope.row.buy_status === 1" type="success" plain
            @click="getcid(scope.row.cid)">入库</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" :icon="Delete" 
           style="color: red; background-color: white; border-color: white;" 
            @click="deleteCaigou(scope.row.cid)" >删除</el-button>
            
          <el-button type="primary" :icon="Edit" style="color: rgb(53, 123, 169); background-color: white; border-color: white;" 
            @click="updateCaigou(scope.row)" >修改</el-button>
          <!-- <el-button size="small" type='daner' @click="updateCaigou(scope.row)">修改订单</el-button> -->
        </template>
      </el-table-column>

    </el-table>
    <!-- 给加到商品列表的商品添加细节 对话框-->
    <el-dialog v-model="show" title="给商品添加信息" width="40%">
      <el-form :model="caigous" :rules="rule1" ref="ruleFormRef">
        <el-form-item label="商品图片" prop="imgs" label-width="100">
          <el-input v-model="caigous.imgs" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="tid" label-width="100">
          <div class="m-4">
            <p>商品分类</p>
            <el-cascader :options="typeList" :props="props1" clearable @change="handleChange" />
           </div>
          
        </el-form-item>
        <el-form-item label="商品描述" prop="description" label-width="100">
          <el-input v-model="caigous.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="show = false">取消</el-button>
          <el-button type="primary" @click="put(ruleFormRef)">确定入库</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 新增商品对话框 -->
    <el-dialog v-model="show2" title="新增商品" width="40%">
      <el-form :model="caigougood" :rules="rule2" ref="ruleFormRef2">
        <el-form-item label="商品名称" prop="goodsname" label-width="100">
          <el-input v-model="caigougood.goodsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price" label-width="100">
          <el-input v-model="caigougood.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="num" label-width="100">
          <el-input v-model="caigougood.num" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="商品总价" prop="total" label-width="100">
          <el-input v-model="caigougood.total" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="商品供应商" prop="sid" label-width="100">
          <!-- <el-input v-model="caigougood.sid" autocomplete="off"></el-input> -->
          <el-select v-model="caigougood.sid" placeholder="请选择">
						<el-option v-for="(gys,index) in supplier" :label="gys.suppliername" :value="gys.sid" :key="index"></el-option>
					</el-select>
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
    <el-dialog v-model="show3" title="修改商品" width="40%">
      <el-form :model="updategood" :rules="rule3" ref="ruleFormRef3">
        <el-form-item label="商品名称" prop="goodsname" label-width="100">
          <el-input v-model="updategood.goodsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price" label-width="100">
          <el-input v-model="updategood.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="num" label-width="100">
          <el-input v-model="updategood.num" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="商品总价" prop="total" label-width="100">
          <el-input v-model="updategood.total" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="商品供应商" prop="suppliername" label-width="100">
          <!-- <el-input v-model="updategood.sid" autocomplete="off"></el-input> -->
          <el-select v-model="updategood.sid" placeholder="请选择">
						<el-option v-for="(gys,index) in supplier" :label="gys.suppliername" :value="gys.sid" :key="index"></el-option>
					</el-select>
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
  <!-- <el-button @click="pp">{{ show }}</el-button> -->
</template>

<script setup > 
import { onMounted, ref, computed, nextTick, reactive,watch } from 'vue';
// storeToRefs 可以把数据转成响应式的
import { storeToRefs } from 'pinia'
// 拿到 useStore 就是状态管理的总实例
import useStore from '@/store'
import { Delete ,Edit,Check} from '@element-plus/icons-vue'
// import { ElMessage, ElMessageBox } from 'element-plus'


const { goodsBuy } = useStore()

// 方法 获取 es6 解构
const { getGoodsList, handleSearch, handlePut, addetail, addgood, editgood ,gettype,getsupplier} = goodsBuy
// 参数获取 state getters 这样写
const { goodsBuyList, getTotal,typeList,supplier } = storeToRefs(goodsBuy)

// type级联
const props1 = {
  checkStrictly: true,
  value:'tid',
  label:'typename'
}

let searchword = ref('')
let show = ref(false);
let show2 = ref(false)
let show3 = ref(false)

watch(
  searchword,
  (newval,oldVal)=>{
    console.log(newval,oldVal);
    let obj={
      goodsname: newval.trim()
    }
    
    if(newval.length >0)
      {
        handleSearch(obj)
      }
    else{
      getGoodsList()
    }

    
  }
)
let caigous = ref({
  cid: '',
  imgs: '',
  description: '',
  tid: ''
})
let caigougood = ref({
  goodsname: '',
  price: '',
  num: '',
  total:'',
  sid: ''
})
let updategood = ref({
  goodsname: '',
  price: '',
  num: '',
  total: '',
  sid: '',
  cid: ''
})




// 表单规则
// 给添加到商品列表的商品添加细节
const rule1 = reactive({
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
  cid: [{
    required: true,
    message: '请填写订单cid',
    trigger: 'blur'
  }]
})
// 新增商品 
const rule2 = reactive({
  goodsname: [{
    required: true,
    message: '请填写商品名称',
    trigger: 'blur'
  }],
  price: [{
    required: true,
    message: '请填写采购商品的单价',
    trigger: 'blur'
  }],
  num: [{
    required: true,
    message: '请填写采购商品的数量',
    trigger: 'blur'
  }],
  total: [{
    required: true,
    message: '请填写采购总价',
    trigger: 'blur'
  }],
  sid: [{
    required: true,
    message: '请填写供应商id',
    trigger: 'blur'
  }]
})
// 修改采购信息
const rule3 = reactive({
  goodsname: [{
    required: true,
    message: '请填写商品名称',
    trigger: 'blur'
  }],
  price: [{
    required: true,
    message: '请填写采购商品的单价',
    trigger: 'blur'
  }],
  num: [{
    required: true,
    message: '请填写采购商品的数量',
    trigger: 'blur'
  }],
  total: [{
    required: true,
    message: '请填写采购总价',
    trigger: 'blur'
  }],
  sid: [{
    required: true,
    message: '请填写供应商id',
    trigger: 'blur'
  }],
  cid: [{
    required: true,
    message: '请填写采购商品cid',
    trigger: 'blur'
  }]
})

// 
onMounted(() => {
  getGoodsList(),
  gettype(),
  getsupplier()
})

//  levels=typeList
// 用computed来更改渲染的数据
const getStatus = computed(() => (status) => {
  return status === 1 ? "未入库" : "已入库"
})
const getDate = computed(() => (date) => {
  return `\n${date.slice(0,4)}\n-\n${date.slice(5,7)}\n-\n${date.slice(8,10)} 
  \n${date.slice(11,19)}`
})
 

// 加到商品列表--获取cid
const getcid = (cid) => {
  show.value = true;
  // console.log(cid)
  caigous.value.cid = cid
}
// 修改采购订单信息--获取cid,并将原有信息填在信息框内
const updateCaigou = (good) => {
  // 将商品信息填入对话框，cid不显示
  updategood.value = good
  // updategood.value.sid
  show3.value = true;
  console.log(updategood.value)
}

// 将商品放入goods表，且添加相应信息
const ruleFormRef = ref()
const put = (formEl) => {
  // formEl无意义，只是用于查看是否传进来了表单
  if (!formEl) { return; }
  formEl.validate(async (valid, fields) => {
    if (valid) {
      // console.log(caigous)
      // console.log(caigous.value.cid)
      let obj1 = {
        cid: caigous.value.cid
      }
      let obj2 = {
        imgs: caigous.value.imgs,
        tid: caigous.value.tid,
        description: caigous.value.description,
        cid: caigous.value.cid
      }
     
      await handlePut(obj1).then(result => {

        console.log(result, 'result')
        if (result == true) {
          addetail(obj2).then(result1 => {
            console.log(result1, 'reslut1')
            if (result1 == true) {
              ElMessage({
                message: '入库成功',
                type: 'success',
              })
            } else {
              ElMessage.error('入库失败')
            }
          })
        } else {
          ElMessage.error('入库失败')
        }
        show.value = false
      })
    } else {
      console.log('error submit!', fields)
    }
    getGoodsList();
  })

}
// 将分类tid放入caigous.tid
const handleChange=(tid)=>{
  let arr=[...tid]
  console.log(arr[arr.length-1])
  caigous.value.tid=arr[arr.length-1]
  console.log(caigous.value.tid);
}
// 新增商品
const ruleFormRef2 = ref()

const add = (formEl) => {
  if (!formEl) return;

  formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log(caigougood)
      let total1=caigougood.value.price*caigougood.value.num
      let obj = {
        goodsname: caigougood.value.goodsname,
        price: caigougood.value.price,
        num: caigougood.value.num,
        total: total1,
        sid: caigougood.value.sid
      }



      await addgood(obj).then(result => {
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
    getGoodsList();
  })
}
// 修改商品信息
const ruleFormRef3 = ref()
const edit = (formEl) => {
  if (!formEl) { return; }
  formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log(updategood)
      let total=updategood.value.price*updategood.value.num;
      let obj = {
        goodsname: updategood.value.goodsname,
        price: updategood.value.price,
        num: updategood.value.num,
        total: total,
        sid: updategood.value.sid,
        cid: updategood.value.cid
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
        show3.value = false
      })
    } else {
      console.log('error submit!', fields)
    }
    getGoodsList();
  })
}
// 删除
const deleteCaigou=()=>{
  ElMessageBox.confirm(
    '您将要删除此商品，确定要继续吗？',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}


</script>

<style scoped lang="less"></style>

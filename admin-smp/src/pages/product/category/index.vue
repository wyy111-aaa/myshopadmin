<template>
  <div class="category">
    <!--  内容  -->
    <div class="content">
      <!-- 头部 -->
      <div class="c-header">
        <div class="title">分类列表</div>
        <div class="handler">
          <el-button type="primary" @click="handleOpen">新增类型</el-button>
          <el-button @click="getAllCategoryList">
            <el-icon>
              <Refresh/>
            </el-icon>
          </el-button>
        </div>
      </div>
      <!--   表格   -->
      <el-table
          height="55vh"
          :data="categoryList"
          border
          row-key="tid"
          class="c-table">
        <el-table-column show-overflow-tooltip prop="typename" label="类别名称"/>
        <el-table-column show-overflow-tooltip prop="created_at" label="创建时间"/>
        <el-table-column show-overflow-tooltip prop="updated_at" label="修改时间"/>
        <el-table-column fixed="right" show-overflow-tooltip align="center" label="操作" width="160">
          <template #default="scope">
            <el-button @click="handleDelete(scope.row.tid,scope.row.pid,scope.row.children)" link type="danger" size="small">
              删除
            </el-button>
            <el-button @click="handleEdit(scope.row)" link type="success" size="small">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加类型 -->
    <el-dialog
        v-model="dialogVisible"
        :title="title"
        width="20%"
        close="handleClose">

      <div class="form-boxs">
        <el-form
            label-position="top"
            ref="typeFormRef"
            :model="typeForm"
            :rules="rules"
            label-width="120px">
          <el-form-item label="类型名称" prop="typename" :style="itemStyle">
            <el-input :style="itemWidthStyle" v-model.trim="typeForm.typename"/>
          </el-form-item>
          <el-form-item label="所属类型" :style="itemStyle">
            <el-select clearable :style="itemWidthStyle" v-model="typeForm.pid" placeholder="请选择所属类型">
              <template v-for="item in fatherCategoryList" :key="item.tid">
                <el-option :label="item.typename" :value="item.tid"/>
              </template>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleOK">确认</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, onMounted, reactive} from 'vue'
import {storeToRefs} from 'pinia'
import useStore from '@/store/index.js'
import {rules, itemStyle, itemWidthStyle} from './config/model.js'
import {ElMessage, ElMessageBox} from "element-plus";

const {category} = useStore()
const {getAllCategoryList, addType,delType,editType} = category

let title = ref('')
let dialogVisible = ref(false)
let typeFormRef = ref()
let thatTid = ref(null)
let thatPid = ref(null)
let thatChildren = ref(null)
const typeForm = reactive({
  typename: '',
  pid: null,
  levels: null
})

const {categoryList, fatherCategoryList} = storeToRefs(category)

onMounted(() => {
  getAllCategoryList()
})

// 打开添加遮罩层
const handleOpen = ()=>{
  title.value = '添加类型'
  dialogVisible.value = true
}

const handleEdit = (row)=>{
  title.value = '编辑类型'
  const {typename,pid,levels,tid,children} = row
  if(pid === 0){
    typeForm.typename = typename
    typeForm.pid = null
    typeForm.levels = null
  }else {
    typeForm.typename = typename
    typeForm.pid = pid
    typeForm.levels = levels
  }
  thatTid.value = tid
  thatPid.value = pid
  thatChildren.value = children

  dialogVisible.value = true
}
// 关闭遮罩层
const handleClose = () => {
  typeForm.typename = ''
  typeForm.pid = null
  typeForm.levels = null
  typeFormRef.value?.resetFields()
  thatTid.value = null
  thatChildren.value = null
  thatPid.value = null
  dialogVisible.value = false
}
// 确定数据
const handleOK = async () => {
  let valid = await typeFormRef.value?.validate()

  // 检验失败
  if (!valid) return

  if(title.value === '添加类型'){
    let info = {}
    if (typeForm.pid) {
      info = {...typeForm, levels: 2}
    } else {
      info = {...typeForm, pid: 0, levels: 1}
    }
    let flag = addType(info)
    if (!flag) return
    handleClose()
  }
  if(title.value === '编辑类型'){
    // 父类 有子类型
    if(typeForm.pid && thatPid.value === 0 && thatChildren.value){
      ElMessage({
        type: "warning",
        message: "该类型存在子类型，不可以当做其他类型的子类",
      });
      return
    }
    let info = {}
    if(typeForm.pid){
      info = {...typeForm, levels: 2,tid:thatTid.value}
    }else {
      info = {...typeForm, pid: 0, levels: 1,tid:thatTid.value}
    }
    let flag = editType(info)
    if(!flag) return
    handleClose()
  }
}

// 删除
const handleDelete = (id,pid,children) => {
  ElMessageBox.confirm("此操作将永久删除该数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(() => {
        if(pid === 0 && children){
          ElMessage({
            type: "warning",
            message: "该类型存在子类型，请清除子类型再做操作",
          });
          return
        }
        delType(id)
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "已取消删除",
        });
      });

}

</script>

<style scoped lang="less">
.category {
  background-color: white;

  .content {
    padding: 20px;

    .c-header {
      display: flex;
      height: 45px;
      padding: 0 5px;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 20px;
        font-weight: 700;
      }

      .handler {
        align-items: center;
      }
    }

    .c-table {
      width: 100%;
    }
  }
}
</style>

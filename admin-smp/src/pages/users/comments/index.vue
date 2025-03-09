<template>
  <div class="comments">
    <!--  搜索  -->
    <div class="search-box">
      <el-form :model="searchForm" :label-width="labelWidth">
        <el-row>
          <el-col v-bind="colLayout">
            <el-form-item label="用户名" :style="itemStyle">
              <el-input placeholder="请输入用户名" v-model="searchForm.uname"/>
            </el-form-item>
          </el-col>
          <el-col v-bind="colLayout">
            <el-form-item label="商品名称" :style="itemStyle">
              <el-input placeholder="请输入商品名称" v-model="searchForm.goodsname"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="s-footer">
        <div class="handle-btns">
          <el-button @click="handleReset">
            <el-icon>
              <Refresh/>
            </el-icon>
            重置
          </el-button>
          <el-button @click="handleQuery" type="primary">
            <el-icon>
              <Search/>
            </el-icon>
            搜索
          </el-button>
        </div>
      </div>
    </div>
    <!--  内容  -->
    <div class="content">
      <!-- 头部 -->
      <div class="c-header">
        <div class="title">评论列表</div>
        <div class="handler">
          <el-button @click="handleIds" :disabled="idsList.length <=0" type="danger">批量删除</el-button>
          <el-button @click="getAllCommentList(searchForm)">
            <el-icon>
              <Refresh/>
            </el-icon>
          </el-button>
        </div>
      </div>
      <!--   表格   -->
      <el-table
          height="55vh"
          :data="commentList"
          border
          row-key="mid"
          @selection-change="handleSelectionChange"
          class="c-table">
        <el-table-column align="center" label="#" type="selection" width="50"/>
        <el-table-column align="center" label="#" type="index" width="50"/>
        <el-table-column show-overflow-tooltip align="center" prop="goodsname" label="商品名称" width="200"/>
        <el-table-column show-overflow-tooltip align="center" prop="uname" label="用户名称" width="200"/>
        <el-table-column show-overflow-tooltip align="center" prop="cid" label="订单号" width="200"/>
        <el-table-column show-overflow-tooltip align="center" prop="content" label="评论内容" width="200"/>
        <el-table-column show-overflow-tooltip align="center" prop="rate" label="评分" width="80"/>
        <el-table-column show-overflow-tooltip align="center" prop="created_at" label="创建时间" width="200"/>
        <el-table-column show-overflow-tooltip align="center" prop="updated_at" label="修改时间" width="200"/>
        <el-table-column fixed="right" show-overflow-tooltip align="center" label="操作" width="120">
          <template #default="scope">
            <el-button @click="handleDelete([scope.row.mid])" link type="danger" size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import {reactive,ref, onMounted} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {storeToRefs} from 'pinia'
import useStore from '@/store/index.js'
import {colLayout, labelWidth, itemStyle} from './config/search-config.js'

const {comments} = useStore()
const {getAllCommentList, deleteComments} = comments
const {commentList} = storeToRefs(comments)

let searchForm = reactive({
  uname: '',
  goodsname: ''
})

let  idsList = ref([])

onMounted(() => {
  getAllCommentList(searchForm)
})

// 重置表单
const handleReset = () => {
  searchForm.goodsname = ''
  searchForm.uname = ''
  getAllCommentList(searchForm)
}

// 搜索
const handleQuery = () => {
  getAllCommentList(searchForm)
}

// 删除
const handleDelete = async (id) => {

  ElMessageBox.confirm("此操作将永久删除该数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(() => {
        let ids = [...id]
        deleteComments(ids)
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "已取消删除",
        });
      });
}

// 多选
const  handleSelectionChange = (val)=>{
  idsList.value = []
  val.forEach(item=>{
    idsList.value.push(item.mid)
  })
}

// 批量删除
const  handleIds = () =>{
  let flag =  handleDelete(idsList.value)
  if(!flag) return
  idsList.value = []
}


</script>

<style scoped lang="less">
.comments {

  .search-box {
    padding-top: 22px;

    .handle-btns {
      text-align: right;
      padding: 0 50px 20px 0;
    }

    .form-item {
      padding: 5px 30px;
    }
  }

  .content {
    padding: 20px;
    border-top: 20px solid #f5f5f5;

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

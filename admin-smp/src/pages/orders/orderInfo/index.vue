<template>
  <div class="comments">
    <!--  搜索  -->
    <div class="search-box">
      <el-form :model="searchForm" :label-width="labelWidth">
        <el-row>
          <el-col v-bind="colLayout">
            <el-form-item label="订单号" :style="itemStyle">
              <el-input placeholder="请输入订单号" v-model="searchForm.order_no"/>
            </el-form-item>
          </el-col>
          <el-col v-bind="colLayout">
            <el-form-item label="订单状态" :style="itemStyle">
              <el-select clearable v-model="searchForm.status" placeholder="请选择订单状态">
                <template v-for="item in statusList" :key="item.id">
                  <el-option :label="item.name" :value="item.status"/>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="colLayout">
            <el-form-item label="是否售后" :style="itemStyle">
              <el-select clearable v-model="searchForm.after_sale" placeholder="请选择售后状态">
                <template v-for="item in saleList" :key="item.id">
                  <el-option :label="item.name" :value="item.status"/>
                </template>
              </el-select>
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
        <div class="title">订单列表</div>
        <div class="handler">
          <el-button @click="handleQuery">
            <el-icon>
              <Refresh/>
            </el-icon>
          </el-button>
        </div>
      </div>
      <!--   表格   -->
      <el-table
          height="55vh"
          :data="orderList"
          row-key="order_no"
          :tree-props="{ children: 'is_children' }"
          class="c-table">
        <el-table-column type="expand" label="商品详细" width="120">
          <template #default="props">
            <div m="4" class="goods-box">
              <template v-for="item in props.row.children" :key="item.cid">
                <div class="goods-item">
                  <span class="g-name box-con-text">商品名称：{{ item.goodsname }}</span>
                  <span class="g-type box-con-text">所属类型：食品类</span>
                  <span class="g-det box-con-text">商品描述：{{ item.description }}</span>
                  <span class="g-price box-con-text">单价：￥{{ item.price }}</span>
                  <span class="g-num box-con-text">数量：{{ item.num }}</span>
                </div>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="left" show-overflow-tooltip prop="order_no" label="订单号" width="220"/>
        <el-table-column align="center" show-overflow-tooltip prop="uname" label="用户名" width="180"/>
        <el-table-column align="center" show-overflow-tooltip prop="phone" label="电话号码" width="180"/>
        <el-table-column align="center" show-overflow-tooltip prop="total" label="订单总价" width="100"/>
        <el-table-column align="center" show-overflow-tooltip prop="address" label="详细地址" width="220"/>
        <el-table-column align="center" show-overflow-tooltip prop="status" label="订单状态" width="120">
          <template #default="scope">
            <span>{{ getStatus(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="after_sale" label="售后状态" width="120">
          <template #default="scope">
            <span>{{ getSale(scope.row.after_sale) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="paytime" label="支付时间" width="180"/>
        <el-table-column align="center" show-overflow-tooltip prop="created_at" label="创建时间" width="180"/>
        <el-table-column align="center" show-overflow-tooltip prop="updated_at" label="修改时间" width="180"/>
        <el-table-column fixed="right"  align="center" label="操作" width="220">
          <template #default="scope">
            <template v-if="scope.row.status === 2">
              <el-button link @click="handleSub('确定已发货?','shipments',scope.row.order_no)" type="success" size="small">
                发货
              </el-button>
            </template>
            <template v-if="scope.row.status === 2">
              <el-button link @click="handleSub('确定取消订单么?','cancel',scope.row.order_no)" type="danger" size="small">
                取消订单
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref, onMounted, computed} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {storeToRefs} from 'pinia'
import useStore from '@/store/index.js'
import {colLayout, labelWidth, itemStyle, statusList, saleList} from './config/search-config.js'

const {orderDetails} = useStore()
const {getOrderList,updateOrderList} = orderDetails
const {orderList} = storeToRefs(orderDetails)

let searchForm = reactive({
  order_no: null,
  status: null,
  after_sale: null
})

// 订单状态
let getStatus = computed(() => (status) => {
  let name = ''
  statusList.forEach(item => {
    if (item.status === status) {
      name = item.name
    }
  })
  return name
})
// 售后状态
let getSale = computed(() => (after_sale) => {
  let name = ''
  saleList.forEach(item => {
    if (item.status.toString() === after_sale) {
      name = item.name
    }
  })
  return name
})


onMounted(() => {
  getOrderList()
})

// 重置表单
const handleReset = () => {
  searchForm.order_no = null
  searchForm.status = null
  searchForm.after_sale = null
  getOrderList()
}
// 搜索
const handleQuery = () => {
  getOrderList(searchForm)
}

// 订单状态修改
const handleSub = (tip,type,order_no)=>{
  console.log(tip,type,order_no)
  ElMessageBox.confirm(tip, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(()=>{
        if(type === 'shipments'){
          let info = {
            status:3,
            remark:"",
            order_no:order_no
          }
          updateOrderList('发货成功!',info)
        }
        if(type === 'cancel'){
          let info = {
            status:6,
            remark:"",
            order_no:order_no
          }
          updateOrderList('取消订单成功!',info)
        }
      })
      .catch(()=>{
        ElMessage({
          type: "info",
          message: "已取消该操作",
        });
      })
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

.goods-box{
  width: 100%;

  .goods-item{
    width: 100%;
    height: 40px;
    font-size: 12px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e3e0df;
    margin-bottom: 10px;

    .g-name{
      width: 140px;
      height: 36px;
      padding-right: 10px;
      padding-left: 12px;
      line-height: 36px;
    }

    .g-type{
      width: 120px;
      height: 36px;
      padding-right: 10px;
      padding-left: 10px;
      line-height: 36px;
    }

    .g-det{
      width: 220px;
      height: 36px;
      padding-right: 10px;
      padding-left: 10px;
      line-height: 36px;
    }

    .g-price{
      width: 120px;
      height: 36px;
      padding-right: 10px;
      padding-left: 10px;
      line-height: 36px;
    }
    .g-num{
      width: 120px;
      height: 36px;
      padding-right: 10px;
      padding-left: 10px;
      line-height: 36px;
    }

    &:last-child{
      border-bottom:0;
    }
  }
}

.box-con-text{
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 溢出部分隐藏 */
  text-overflow: ellipsis; /* 显示省略号 */
}
</style>

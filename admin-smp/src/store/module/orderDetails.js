import {defineStore} from 'pinia'
import {ElMessage} from 'element-plus'

import {
    getAllOrder,
    updateOrderInfo
} from '@/service/api/orderDetailsApi.js'

const orderDetailsStore = defineStore('orderDetails', {
    state: () => {
        return {
            orderList: [],
        }
    },
    getters: {},
    actions: {
        // 获取所有数据
        async getOrderList(info) {
            this.orderList = []
            try {
                let res = await getAllOrder({...info})
                if(res.code === 200){
                    this.orderList = res.data.list
                }
            } catch (e) {
                console.log('获取失败', e)
            }
        },
        // 修改订单
        async updateOrderList(tip,info){
            try {
                let res = await updateOrderInfo({...info})
                if(res.code === 200){
                    ElMessage({
                        type: "success",
                        message: tip,
                    });
                    this.getOrderList()
                }
            }catch (e){
                console.log('添加失败',e)
            }
        }
    },
    persist: {
        enabled: true //开启数据持久化
    }
})


export default orderDetailsStore

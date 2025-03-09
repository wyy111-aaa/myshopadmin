// pinia 构造器
import {
    defineStore
} from 'pinia'

import {
    goodsListApi,
    putUpApi,
    getType,
    search,
    updateGood,
} from '@/service/api/goodsApi'

const goodsStore=defineStore('goods',{
    state:() => {
        return {
            // 表格数据(名字尽量符合你想要的数据的名称)命名给我规范点（CglistRequest 啥命名）
            goodsList: [],
            typeList:[],
        }
    },
    // 计算方法 // 处理state 数据（以后只处理 state 数据，玩熟再说其他的）
    getters: {
        // 比如获取到表格的总价金额
      },
    actions:{
        async getgoodsList(){
            let res=await goodsListApi() 
            this.goodsList = res.data
            return res.status
        },
        async put(obj){
           
            let res=await putUpApi(obj)
            console.log(res) 
            return res
        },
        async gettype(){
            let res=await getType() 
            this.typeList = res.data
            // console.log(this.typeList,'type--')
            // return res.status
        },
        async handleSearch(obj){
            let res=await search(obj) 
            this.goodsList = res.data
        },
        async editgood(obj){
            let res=await updateGood(obj)
            return res.status
        },

    }
})
// 导出这个实例对象
export default goodsStore
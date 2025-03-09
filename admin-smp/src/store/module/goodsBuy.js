// 照例子抄作业

// pinia 构造器
import {
    defineStore
} from 'pinia'

import {
    CglistRequest,
    search,
    putStore,
    addgoodDeatil,
    addGood,
    updateGood,
    getType,
    getSupplier
} from '@/service/api/caigouApi';


// goodsBuy 名称或者标识，{} 内容
const goodsBuyStore = defineStore('goodsBuy', {
    // state 数据
    state: () => {
        return {
            // 表格数据(名字尽量符合你想要的数据的名称)命名给我规范点（CglistRequest 啥命名）
            goodsBuyList: [],
            typeList:[],
            supplier:[]
        }
    },
    // 计算方法 // 处理state 数据（以后只处理 state 数据，玩熟再说其他的）
    getters: {
      // 比如获取到表格的总价金额
      getTotal:(state)=>  state.goodsBuyList.reduce((pre,cur)=>{
        return pre + parseFloat(cur.total)
      },0)

    }, 
    // 请求方法
    actions: {
        // promise 返回的是这个，直接使用 es6语法糖
        async getGoodsList() {
            // 判断逻辑我就不给你写了自己后续完善
            let res = await CglistRequest()
            // state 的值是这样赋值的 this.xx = xx
            this.goodsBuyList = res.data 
        },

        // obj 参数命名记住想想怎么来写 api 也是 不想以后跟别人你冲突，就好好写命名
        async handleSearch(obj) {
            let res = await search(obj)
            this.goodsBuyList = res.data
        },
        async handlePut(obj){
            let res = await putStore(obj)
            return res.status
        },
        async addetail(obj){
            let res = await addgoodDeatil(obj)
            return res.status
        },
        async addgood(obj){
            let res=await addGood(obj)
            return res.status
        },
        async editgood(obj){
            let res=await updateGood(obj)
            return res.status
        },
        async gettype(){
            let res=await getType() 
            this.typeList = res.data
            // console.log(this.typeList,'type--')
            // return res.status
        },
        async getsupplier(){
            let res=await getSupplier()
            this.supplier=res.data
            // console.log()
        }
    }
})

// 导出这个实例对象
export default goodsBuyStore
import {defineStore} from 'pinia'

const systemStore =defineStore('system',{
    // 数据
    state:()=>{
       return {}
    },
    // 计算方法
    getters:{
        getNum(){
            return 0
        }
    },
    // 方法
    actions:{
        getNumList(){}
    }
})

export default systemStore

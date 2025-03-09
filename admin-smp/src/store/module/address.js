// pinia 构造器
import {
    defineStore
} from 'pinia'

import {
    getAllAddress,
    searchApi
} from '@/service/api/addressApi.js'


const addressStore=defineStore('address',{
    state:() => {
        return {
            addressList:[]
        }
    },
    getters:{
        
    },
    // 请求方法
    actions:{
        async getAddressList(){
            this.addressList = []
            let res = await getAllAddress()
            if(res.status === true){
                this.addressList = res.data
            }
        },
        async searchAddress(obj){
            this.addressList=[]
            console.log(obj)
            let res=await searchApi(obj)
            console.log(res)
            if(res.status===true){
                this.addressList=res.data
            }
        }
    }
})



// 导出这个实例对象
export default addressStore
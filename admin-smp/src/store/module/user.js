import {
    defineStore
} from 'pinia'

import{
    userlistRequest,
    openuserApi,
    forbiduserApi
} from '@/service/api/userApi'
const userStore = defineStore('user',{
    state:()=>{
        return {
            userList:[]
        }
    },
    getters:{

    },
    actions:{
        async getuserList(){
            let res=await userlistRequest()
            this.userList=res.data
        },
        async openUser(obj){
            let res = await openuserApi(obj)
            return res.status
        },
        async forbidUser(obj){
            let res=await forbiduserApi(obj)
            return res.status
        }
    }
})

export default userStore
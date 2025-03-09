import {
    defineStore
} from 'pinia'
import {
    getlistRequest,
    search,
    add,
    updateRequest,
    del
} from '@/service/api/supplierApi'

const supplierStore = defineStore('supplier',{
    state:()=>{
        return {
            suppilerList:[]
        }
    },
    getters:{

    },
    actions:{
           async getSupplierList(){
            let res=await getlistRequest()
            this.suppilerList=res.data
           },
           async handleSearch(obj) {
            let res = await search(obj)
            this.suppilerList = res.data
            },
            async addsupplier(obj){
                let res=await add(obj)
                return res.status
            },
            async updateSupplier(obj){
                let res=await updateRequest(obj)
                return res.status
            },
            async delSuppier(obj){
                let res=await del(obj)
                return res.status
            },
            
    },
        
})
export default supplierStore
import spmRequest from "@/service/index.js";
const suppierApi={
    getlist:'/supplier/all',
    search:'/supplier/select',
    add:'/supplier/add',
    update:'/supplier/update',
    del:'/supplier/del'
}

export function getlistRequest(){
    return spmRequest.post({
        url:suppierApi.getlist,
        showLoading:false
    })
}
export function search(word){

    return spmRequest.post({
        url:suppierApi.search,
        data:word
    })
}
export function add(data){
    return spmRequest.post({
        url:suppierApi.add,
        data 
    })
}
export function updateRequest(data){
    return spmRequest.post({
       url:suppierApi.update,
       data 
    })
}
export function del(data){
    return spmRequest.post({
        url:suppierApi.del,
        data
    })
}
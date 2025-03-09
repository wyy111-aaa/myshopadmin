import spmRequest from "@/service/index.js";

const  goodsApi={
    getgoodList:'/goods/adminshow',
    put:'goods/put',
    gettype:'/type/list',
    searchname:'goods/adminsearch',
    updategood:'/goods/update'

}

 export  function goodsListApi() {
    return spmRequest.post({
        url:goodsApi.getgoodList,
        showLoading:false
    })
}
export function putUpApi(data){
    return spmRequest.post({
      url:  goodsApi.put ,
      data
    })
}
export function getType(){
    return spmRequest.get({
        url:goodsApi.gettype
    })
}
export function search(data){
    return spmRequest.post({
        url:goodsApi.searchname,
        data
    })

}
export function updateGood(data){
    return spmRequest.post({
        url:goodsApi.updategood,
        data
    })
}

import spmRequest from "@/service/index.js";
const caigouApi = {
        getlist:'/goodsbuy/show',
        search:'/goodsbuy/search',
        putstore:'/goodsbuy/putgoodslist',
        addDetail:'/goodsbuy/adddetail',
        addgood:'/goodsbuy/add',
        updategood:'/goodsbuy/update',
        gettype:'/type/list',
        getsuppier:'/supplier/all'
}

// 获取采购列表(showLoading:false 这个配置是是否开启 loading 一般的都要在接口申请的时候 loading 下的)
export  function CglistRequest() {
    return spmRequest.post({
        url:caigouApi.getlist, 
        showLoading:false
    })
}
export function search(word){

    return spmRequest.post({
        url:caigouApi.search,
        data:word
    })
}
export function putStore(cid){
    return spmRequest.post({
        url:caigouApi.putstore,
        data:cid
    })
}
export function addgoodDeatil(detail){
   return spmRequest.post({
    url:caigouApi.addDetail,
    data:detail
   }) 
}
export function addGood(data){
    return spmRequest.post({
        url:caigouApi.addgood,
        data
    })
}
export function updateGood(data){
    return spmRequest.post({
        url:caigouApi.updategood,
        data
    })
}
export function getType(){
    return spmRequest.get({
        url:caigouApi.gettype
    })
}
export function getSupplier(){
    return spmRequest.post({
        url:caigouApi.getsuppier,
        
    })
}



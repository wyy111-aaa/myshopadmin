import spmRequest from "@/service/index.js";
const addressApi = {
    allAddress:'/address/all',
    search:'/address/selectu'
}



export const getAllAddress = ()=>{
    return spmRequest.post({
        url:addressApi.allAddress
    })
}
export const searchApi=(data)=>{
    return spmRequest.post({
        url:addressApi.search,
        data
    })
}
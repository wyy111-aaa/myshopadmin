import spmRequest from "@/service/index.js";
const userApi={
    getList:'/users/list',
    openUser:'/users/nolocked',
    forbiduser:'/users/locked'
}
export function userlistRequest(){
    return spmRequest.post({
      url:userApi.getList,
      showLoading:false
    })
}  
export function openuserApi(data){
  return spmRequest.post({
    url:userApi.openUser,
    data
  })
}
export function forbiduserApi(data){
  return spmRequest.post({
    url:userApi.forbiduser,
    data
  })
}
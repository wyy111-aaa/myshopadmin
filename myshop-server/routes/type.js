var express = require('express');
const dbUtils= require('../utils/DBUtils.js')
var router = express.Router();

//分类列表
router.get("/list", async function(request, response, next){
    try{
        //是否带条件
        let isWhere=(request.query.sw==null || request.query.sw=="")?false:true
        //查询内容
        let sw=request.query.sw
        //执行查询 
        let resultsData = await dbUtils.executeQuery(typeSqls.getlist(isWhere),
            isWhere?[sw,sw]:[])
         
        //console.log(resultsData)  
        //从新组织数据结构
        //循环第一个查询结果集
        resultsData.data[0].forEach(item=>{
            //给它添加子集属性
            item.children=[]
             
            //循环第二个结果集
            resultsData.data[1].forEach(child=>{
                if(child.pid==item.tid){
                    item.children.push(child)
                }
            })
        })
         
        resultsData.data=resultsData.data[0]
         
         
        response.send(resultsData)
         
    }catch(err){
        response.status(500).send(JSON.stringify(err))
    }
})
 // 新增分类
 router.post('/add', async  function(request, response, next) {
     try{
		 console.log(request.body.typename);
		 console.log(request.body.pid);
		 console.log(request.body.levels);
         if(request.body.typename==null || request.body.typename=="" ||
         request.body.pid==null || request.body.pid=="" ||
         request.body.levels==null || request.body.levels==""){
             //返回json数据
             response.status(500).send({
                 status:false,
                 errMsg:"缺少参数"
             })
             return;
         }
         let results = await dbUtils.executeUpdate(typeSqls.addtypeSql,
                                         [request.body.typename,
 										request.body.pid,
                                        request.body.levels])
         response.send(results)
     }catch(err){
         response.send(err)
         return;
     }
 });
 //查找要更新的分类
 router.get('/edit/:tid', async function(request, response, next) {
 	console.log(request);
 	console.log(response);
     try{
         let results = await  dbUtils.executeQuery(typeSqls.gettypeSql,[request.params.tid])
         response.send(results)
     }catch(err){
         response.status(500).send(JSON.stringify(err))
     }
  
 });
 //更新分类  分两个请求  1、查询显示   2、提交保存
 router.post('/edit', async function(request,response,next){
 	 try{
 		 if(request.body.typename==null || request.body.typename=="" ||
         request.body.pid==null || request.body.pid=="" ||
         request.body.levels==null || request.body.levels=="" ||
		 request.body.tid==null || request.body.tid==""){
 			//返回json数据
 			response.status(500).send({
 			    status:false,
 			    errMsg:"缺少参数"
 			})
 			return;
 		}
		console.log(request.body.typename)
 		let results = await dbUtils.executeUpdate(typeSqls.updatetypeSql,[
 												request.body.typename,
 												request.body.pid,
 												request.body.levels,
 												request.body.tid])
 		response.send(results)
 	 }catch(err){
         response.send(err)
         return;
     }
 });
 //分类详情
 router.get('/get/:tid', async function(request, response, next) {
 	console.log(request);
 	console.log(response);
     try{
         let results = await  dbUtils.executeQuery(typeSqls.gettypeSql,[request.params.tid])
         response.send(results)
     }catch(err){
         response.status(500).send(JSON.stringify(err))
     }
  
 }); 
 
 // 删除分类
 // router.post('/del', async  function(request, response, next) {
 //     try{
 //         console.log(request.body)
 //         if(request.body.created_at==null || request.body.created_at==""||
 //             request.body.typename==null || request.body.typename==""||
 //             request.body.levels==null || request.body.levels=="")
 //         {
 //             //返回json数据
 //             response.status(500).send({
 //                 status:false,
 //                 errMsg:"缺少参数,不能删除!"
 //             })
 //             return;
 //         }
 //         let userCode=createUserCode();
 //         console.log(userCode);
 //         let results = await dbUtils.executeUpdate(typeSqls.deltypeSql,
 //                                         [   request.body.typename,
 //                                             request.params.levels,
 //                                             request.body.created_at])
 //         response.send(results)
 //     }catch(err){
 //         response.send(err)
 //         return;
 //     }
 // });
//sql
const typeSqls={
	addtypeSql:`insert into type(typename,pid,levels,created_at)
				VALUES(?,?,?,now())`,
	updatetypeSql:`update type set typename=?,pid=?,levels=?,updated_at=now()
				  WHERE tid=?`,
	gettypeSql:`select tid,typename,pid,levels,created_at,updated_at 
	                from type 
					where tid=?`,
    getlist:function(iswhere){
            return `select tid,typename,pid,levels from type where levels=1
                        ${iswhere?"and typename like concat('%',?,'%') ":""};
                    select tid,typename,pid,levels from type where levels=2
						${iswhere?"and typename like concat('%',?,'%') ":""};`;
        }
     
     
}

module.exports = router;
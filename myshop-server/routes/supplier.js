var express = require('express');
const dbUtils= require('../utils/DBUtils.js')
var router = express.Router();
//接口已全部测试成功，但时间戳转换仍有问题

//表单参数
//request.body.标签name属性值

//url?key=值
//request.query.key

//url/:key
//request.params.key

//添加采购商信息   接口已测试成功
router.post('/add', async  function(request, response, next) {
	try{
		if(request.body.suppliername==null || request.body.suppliername==""||
		request.body.region==null || request.body.region=="" ||
		request.body.phone==null || request.body.phone=="" )
		{
			//返回json数据
			response.status(500).send({
				status:false,
				errMsg:"缺少采购商信息"
			})
			return;
		}
//suppliername,region,phone,created_at,updated_at
		let results = await dbUtils.executeQuery(purchaserSqls.addpurchaserSql,
										[request.body.suppliername,
										request.body.region,
										request.body.phone,
										request.body.created_at,
										request.body.updated_at])
		response.send(results)
	}catch(err){
		response.send(err)
		return;
	}
});
//删除采购商信息   接口已测试成功
router.post('/del', async  function(request, response, next) {
	try{
		console.log(request.body)
		if(request.body.sid==null||request.body.sid==""
			)
		{
			//返回json数据
			response.status(500).send({
				status:false,
				errMsg:"数据不存在，无法删除"
			})
			return;
		}
		let results = await dbUtils.executeUpdate(purchaserSqls.delpurchaserSql,
										[
										request.body.sid
							          ])
		response.send(results)
	}catch(err){
		response.send(err)
		return;
	}
}); 
//根据供应商姓名模糊查询采购商信息   接口测试成功，已返回数据，时间为UCT时区
router.post('/select', async  function(request, response, next) {
	try{
		console.log(request.body)
		if(
			request.body.created_at==null||request.body.created_at==""
			)
		{
			//返回json数据
			response.status(500).send({
				status:false,
				errMsg:"无法查询"
			})
			return;
	    }                                      
		let results = await dbUtils.executeQuery(purchaserSqls.selectpurchaserSql,
										[	request.body.suppliername //pamer数据错误
											// request.body.region,      //executeUpdate方法
											// request.body.phone
											])
		response.send(results)
	}catch(err){
		response.send(err)
		return;
	}
});
//根据地区模糊查询采购商信息   接口测试成功，已返回数据，时间为UCT时区2
router.post('/selectregion', async  function(request, response, next) {
	try{
		console.log(request.body)
		if(
			request.body.created_at==null||request.body.created_at==""
			)
		{
			//返回json数据
			response.status(500).send({
				status:false,
				errMsg:"无法查询"
			})
			return;
	    }                                      
		let results = await dbUtils.executeQuery(purchaserSqls.selectregionSql,
										[	 //pamer数据错误
											 request.body.region      //executeUpdate方法
											
											])
		response.send(results)
	}catch(err){
		response.send(err)
		return;
	}
});



//根据供应商电话模糊查询采购商信息  接口测试成功，已返回数据，时间为UCT时区2
router.post('/selectphone', async  function(request, response, next) {
	try{
		console.log(request.body)
		if(
			request.body.created_at==null||request.body.created_at==""
			)
		{
			//返回json数据
			response.status(500).send({
				status:false,
				errMsg:"无法查询"
			})
			return;
	    }                                      
		let results = await dbUtils.executeQuery(purchaserSqls.selectphoneSql,
										[	 request.body.phone
											])
		response.send(results)
	}catch(err){
		response.send(err)
		return;
	}
});
//调取全部的供应商信息
router.post('/all', async  function(request, response, next) {
	try{
	const allSql='select suppliername,region,created_at,updated_at from supplier ';                               
		let results = await dbUtils.executeQuery(allSql,[])
										
		response.send(results)
	}catch(err){
		response.send(err)
		return;
	}
});
// request.body.suppliername,  
//             request.body.region,  
//             request.body.phone,  
//             request.body.created_at,  
//             request.body.updated_at  
//修改采购商信息  接口已测试成功
router.post('/update', async  function(request, response, next) {
	try{
		if(
		request.body.created_at==null||request.body.created_at=="" ){
			//返回json数据
			response.status(500).send({
				status:false,
				errMsg:"数据不存在，无法修改"
			})
			return;
		}
		let results = await dbUtils.executeUpdate(purchaserSqls.updatepurchaserSql,
										[request.body.suppliername,
										 request.body.region,
										 request.body.phone,
										 request.body.sid
										])
		response.send(results)
	}catch(err){
		response.send(err)
		return;
	}
});

const purchaserSqls={
	//添加采购商信息
	addpurchaserSql:`insert  into supplier(suppliername,region,phone,created_at,updated_at) 
values (?,?,?,now(),NULL)`,
    //修改采购商信息,region=?,phone=?,updated_at=now() 
	updatepurchaserSql:`update supplier set suppliername=?,region=?,phone=?,updated_at=now() where sid=?`,	
	//删除采购商信息
	delpurchaserSql:`delete  from supplier where sid=?`,
	//根据供应商姓名模糊查询采购商信息
	selectpurchaserSql:`select suppliername,phone,region,created_at 
      from supplier 
     where suppliername like concat('%',?,'%')`,	
	 // and region=? and phone=?
//根据供应商地区模糊查询采购商信息
     selectregionSql:`select suppliername,region,created_at,updated_at 
      from supplier 
     where region like concat('%',?,'%')  `,
	 selectphoneSql:`select suppliername,region,created_at,updated_at 
                     from supplier 
                     where phone like concat('%',?,'%')  `


//根据供应商地电话查询采购商信息

}


module.exports = router;
// `select cid,goodsname, price,num,total,sid,buy_time,buy_status 
// 				from caigou  
// 				where goodsname like concat('%',?,'%')`
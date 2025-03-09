var express = require('express');
const dbUtils= require('../utils/DBUtils.js')
var router = express.Router();
let auth = require('../utils/auth.js')

// 管理员商品列表展示
router.post('/adminshow',auth,async function(req,res,next){
	try{
		let results=await dbUtils.executeQuery(goodsSqls.adminshowgoodsSql)
		// console.log(goodsSqls.showgoodsSql)
		res.send(results)
	}catch(err){
		res.send(err)
		return;
	}
})
// 前台商品列表展示
router.post('/show',auth,async function(req,res,next){
	try{
		let results=await dbUtils.executeQuery(goodsSqls.showgoodsSql)
		console.log(goodsSqls.showgoodsSql)
		res.send(results)
	}catch(err){
		res.send(err)
		return;
	}
})

// 商品详情
// router.get('/detail',async function(req,res,next){
// 	try{
// 		let params=[]
// 		params.push(req.query.gid)
// 		let results = await  dbUtils.executeQuery(goodsSqls.gooddetailSql,params)
// 		res.send(results)	
// 	}catch(err){
// 		res.status(500).send(JSON.stringify(err))
// 	}
// })
router.get('/detail/:gid',auth,async function(req,res,next){
	try{
		let results = await  dbUtils.executeQuery(goodsSqls.gooddetailSql,[req.params.gid])
		res.send(results)	
	}catch(err){
		res.status(500).send(JSON.stringify(err))
	}
})

router.post('/update',auth,async function(req,res,next){
	try{
		if(req.body.tid==''||req.body.tid==null||req.body.goodsname==''||req.body.goodsname==null
		||req.body.imgs==''||req.body.imgs==null||req.body.price==''||req.body.price==null
		||req.body.description==''||req.body.description==null||req.body.gid==''||req.body.gid==null){
			
			res.status(500).send({
				status: false,
				errMsg: "缺少参数"
			})
			
			return;
		}
		let results =await dbUtils.executeUpdate(goodsSqls.goodupdate,[req.body.tid,req.body.goodsname,
							req.body.imgs,req.body.price,req.body.description,req.body.gid])
		res.send(results)
		return;
	}catch(err){
		console.log(goodsSqls.goodupdate)
		console.log(req.body)
		res.status(500).send(JSON.stringify(err))
		// res.send(err)
	}
})



// 上架\下架商品
router.post('/put',auth,async function(req,res,next){
	try{
		if(req.body.is_on===''||req.body.is_on===null||
		   req.body.gid==''||req.body.gid==null){
			res.send({
				status:500,
				errMsg:'缺少参数'
			})
			return;
		   }
		let results=await dbUtils.executeUpdate(goodsSqls.putSql,[req.body.is_on,req.body.gid])
		res.send(results)
		return;
	}catch(err){
		res.send(err)
	}
})

// 管理员根据商品名称模糊查询
router.post('/adminsearch',auth,async function(req,res,next){
	try{
		let results= await dbUtils.executeQuery(goodsSqls.adminsearchsql, [req.body.searchword])
		res.send(results)
		return;
	}catch(err){
		res.status(500).send(JSON.stringify(err))
		// res.send(err)
	}
})
// 用户根据商品名称模糊查询
router.post('/search',auth,async function(req,res,next){
	try{
		let results= await dbUtils.executeQuery(goodsSqls.searchsql, [req.body.searchword])
		res.send(results)
		return;
	}catch(err){
		res.status(500).send(JSON.stringify(err))
		// res.send(err)
	}
})



// 管理员根据商品子类名称查询商品
router.post('/adminsearchbytype',auth,async function(req,res,next){
	try{
		
		let results=await dbUtils.executeQuery(goodsSqls.adminsearchbytype,[req.body.tid])
		res.send(results)
	}catch(err){
		console.log(req.body.tid)
		res.status(500).send(err)
		
	}
	
})





// 用户根据商品子类查询商品
router.post('/searchbytype',auth,async function(req,res,next){
	try{
		let results=await dbUtils.executeQuery(goodsSqls.searchbytype,[req.body.tid])
		res.send(results)
	}catch(err){
		console.log(req.body.tid)
		res.status(500).send(err)
		
	}
	
})

// // 商品加入购物车(我写好了这个接口)
// router.post('/tocart', async function(request, response, next) {
// 	try {

// 		if (request.body.cid == '' || request.body.cid == null) {
// 			response.status(500).send({
// 				status: false,
// 				errMsg: "缺少cid"
// 			})
// 		} else if (request.body.cid != '' && request.body.cid != null) {
// 			// 在采购商品进入商品列表前确认是否cid已在商品列表存在
// 			let results = await dbUtils.executeSql(goodsbuySqls.checkcid, [request.body.cid])
// 			//response.send(results)
// 			// console.log(results)
// 			console.log(results[0])
// 			console.log(results[0]["count(*)"])

// 			if (results[0]["count(*)"] == 1) {
// 				response.status(500).send({
// 					status: false,
// 					errMsg: "重复添加"
// 				})
// 				return;
// 			} else if (results[0]["count(*)"] == 0) {
// 				let results = await dbUtils.executeQuery(goodsbuySqls.putgoodslist, [request.body.cid,
// 					request.body.cid
// 				])
// 				response.send(results)
// 			}

// 		}
// 	} catch (err) {
// 		//response.send(err)
// 		// console.error("Error executing putgoodslist route:", err);  
// 		response.status(500).send("An error occurred while executing the request.");
// 		return;
// 	}
// })

const goodsSqls={
	adminshowgoodsSql:`SELECT g.gid,g.goodsname,t1.tid, t1.typename AS childrentype, t2.tid as pid,t2.typename AS fathertype,g.imgs,g.price,g.is_on,g.stock,g.sales,g.description,g.created_at,g.updated_at,g.cid 
					FROM goods g  
					left JOIN type t1 ON g.tid = t1.tid  
					left JOIN type t2 ON t1.pid = t2.tid  
	   `,
	showgoodsSql:`SELECT g.gid,g.goodsname,t1.tid, t1.typename AS childrentype, t2.tid as pid,t2.typename AS fathertype,g.imgs,g.price,g.is_on,g.stock,g.sales,g.description,g.created_at,g.updated_at,g.cid 
					FROM goods g  
					left JOIN type t1 ON g.tid = t1.tid  
					left JOIN type t2 ON t1.pid = t2.tid
	   where is_on=1
	  `,
	gooddetailSql:`SELECT g.gid,g.goodsname,t1.tid, t1.typename AS childrentype, t2.tid as pid,t2.typename AS fathertype,g.imgs,g.price,g.is_on,g.stock,g.sales,g.description,g.created_at,g.updated_at,g.cid 
					FROM goods g  
					left JOIN type t1 ON g.tid = t1.tid  
					left JOIN type t2 ON t1.pid = t2.tid
	  where gid=?`,
	goodupdate:`update goods 
	set tid=?,goodsname=?,imgs=?,price=?,description=?   
	where gid=?`,
	putSql:`update goods 
	set is_on=? 
	where gid=? `,
	adminsearchsql:`SELECT g.gid,g.goodsname,t1.tid, t1.typename AS childrentype, t2.tid as pid,t2.typename AS fathertype,g.imgs,g.price,g.is_on,g.stock,g.sales,g.description,g.created_at,g.updated_at,g.cid 
					FROM goods g  
					left JOIN type t1 ON g.tid = t1.tid  
					left JOIN type t2 ON t1.pid = t2.tid 
				where goodsname like concat('%',?,'%')`,
	searchsql:`SELECT g.gid,g.goodsname,t1.tid, t1.typename AS childrentype, t2.tid as pid,t2.typename AS fathertype,g.imgs,g.price,g.is_on,g.stock,g.sales,g.description,g.created_at,g.updated_at,g.cid 
					FROM goods g  
					left JOIN type t1 ON g.tid = t1.tid  
					left JOIN type t2 ON t1.pid = t2.tid
				where goodsname like concat('%',?,'%') and is_on=1`,
	// searchfu:`select g.gid`
	searchbytype:`SELECT g.gid,g.goodsname,t1.tid, t1.typename AS childrentype, t2.tid as pid,t2.typename AS fathertype,g.imgs,g.price,g.is_on,g.stock,g.sales,g.description,g.created_at,g.updated_at,g.cid 
					FROM goods g  
					left JOIN type t1 ON g.tid = t1.tid  
					left JOIN type t2 ON t1.pid = t2.tid
				where t1.tid=?  and is_on=1 `,
	adminsearchbytype:`SELECT g.gid,g.goodsname,t1.tid, t1.typename AS childrentype, t2.tid as pid,t2.typename AS fathertype,g.imgs,g.price,g.is_on,g.stock,g.sales,g.description,g.created_at,g.updated_at,g.cid 
					FROM goods g  
					left JOIN type t1 ON g.tid = t1.tid  
					left JOIN type t2 ON t1.pid = t2.tid
				where t1.tid=? `
}

module.exports = router;
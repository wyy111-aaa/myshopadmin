var express = require('express');
const {
	param
} = require('express/lib/request');
const dbUtils = require('../utils/DBUtils.js')
var router = express.Router();
// 引入中间件
let auth = require('../utils/auth.js')


// 展示采购列表
router.post('/show',auth, async function(request, response, next) {
	try {
		// console.log(response.body)
		let results = await dbUtils.executeQuery(goodsbuySqls.showGoodsbuySql)
		response.send(results)
	} catch (err) {
		response.send(err)
		return;
	}
});

// 模糊查询，根据采购的商品名称来查询
router.post('/search', auth,async function(request, response, next) {
	try {
		let results = await dbUtils.executeQuery(goodsbuySqls.searchsql, [request.body.goodsname])
		// console.log(request.body.goodsname)
		response.send(results)
	} catch (err) {
		response.send(err)
		return;
	}
})

// router.post('/:id',async (req,res)=>{
// 	// 演示
// 	// let {goodsname,goodsname,price} = req.body
// 	let id = req.params.id

// 	// http://xxx.com/1
// 	// 1 就是 参数

// 	// '/goodsbuy/1'接口访问

// 	// 解构赋值出来,如果没有值 直接 为 null
// 	// 直接 申请接口 写 sql

// 	// let res = await dbUtils.executeUpdate(sql,{goodsname,goodsname,price})
// 	// sql where id = id

// })

// 更改采购商品
router.post('/update', auth,async function(request, response, next) {
	try {
		if (request.body.goodsname == '' || request.body.goodsname == null ||
			request.body.price == '' || request.body.price == null ||
			request.body.num == '' || request.body.num == null ||
			request.body.total == '' || request.body.total == null ||
			request.body.sid == '' || request.body.sid == null ||
			request.body.cid == '' || request.body.cid == null) {

			//返回json数据
			response.status(500).send({
				status: false,
				errMsg: "缺少参数"
			})
			return;
		}

		let results = await dbUtils.executeUpdate(goodsbuySqls.updatesql, [request.body.goodsname, request
			.body.price,
			request.body.num, request.body.total, request.body.sid, request.body.cid
		])
		response.send(results)
	} catch (err) {
		response.send(err)
		return;
	}
})

// 新增采购商品
router.post('/add', auth,async function(request, response, next) {
	try {
		if (request.body.goodsname == '' || request.body.goodsname == null ||
			request.body.price == '' || request.body.price == null ||
			request.body.num == '' || request.body.num == null ||
			request.body.total == '' || request.body.total == null ||
			request.body.sid == '' || request.body.sid == null) {
			//返回json数据
			response.status(500).send({
				status: false,
				errMsg: "缺少参数"
			})
			return;
		}
		let results = await dbUtils.executeUpdate(goodsbuySqls.addsql, [request.body.goodsname, request.body.price,
			request.body.num, request.body.total, request.body.sid, request.body.cid])
		response.send(results)

	} catch (err) {
		response.send(err)
		return;
	}

})

// 放入库存，即放入商品列表
router.post('/putgoodslist',auth, async function(request, response, next) {
	try {

		if (request.body.cid == '' || request.body.cid == null) {
			response.status(500).send({
				status: false,
				errMsg: "缺少cid"
			})
		} else if (request.body.cid != '' && request.body.cid != null) {
			// 在采购商品进入商品列表前确认是否cid已在商品列表存在
			let results = await dbUtils.executeSql(goodsbuySqls.checkcid, [request.body.cid])
			//response.send(results)
			// console.log(results)
			console.log(results[0])
			console.log(results[0]["count(*)"])

			if (results[0]["count(*)"] == 1) {
				response.status(500).send({
					status: false,
					errMsg: "重复添加"
				})
				return;
			} else if (results[0]["count(*)"] == 0) {
				let results = await dbUtils.executeQuery(goodsbuySqls.putgoodslist, [request.body.cid,
					request.body.cid
				])
				// response.send(results)
				response.status(200).send({
					status:true,
					msg:'加入成功'
				})
			}

		}
	} catch (err) {
		//response.send(err)
		// console.error("Error executing putgoodslist route:", err);  
		response.status(500).send("An error occurred while executing the request.");
		return;
	}
})

// 根据cid给添加到商品列表的采购商品添加图片、商品类别、描述
router.post('/adddetail',auth, async function(request, response, next) {
	try {

		if (request.body.imgs == '' || request.body.imgs == null ||
			request.body.tid == '' || request.body.tid == null ||
			request.body.description == "" || request.body.description == null ||
			request.body.cid == '' || request.body.cid == null) {
			response.status(500).send({
				status: false,
				errMsg: "缺少参数"
			})
			return;
		}
		let results = await dbUtils.executeUpdate(goodsbuySqls.adddetail, [request.body
			.tid, request.body.imgs, request.body.description, request.body.cid])
			response.status(200).send({
				stauts:true,
				msg:'添加信息成功'
			})
	} catch (err) {
		response.send(err);
		return;
	}
})

// 根据cid删除采购数据
router.post('/del',auth, async function(req, res, next) {
	try {
		// let cid = req.params.cid
		
		let results = await dbUtils.executeUpdate(goodsbuySqls.delsql,[req.body.cid])
		if(results){
			res.status(200).send({
				status:true,
				msg:'删除成功'
			})
		}
		
	} catch (err) {
		res.send(err)
		return;
	}
})


const goodsbuySqls = {
	// 采购表展示
	showGoodsbuySql: `select c.cid,c.goodsname, c.price,c.num,c.total,c.sid,s.supplierName,c.buy_time,c.buy_status
				from caigou c
				LEFT JOIN   
    			supplier s ON c.sid = s.sid;`,
	// 根据采购商品模糊查询
	searchsql: `select c.cid,c.goodsname, c.price,c.num,c.total,c.sid,s.supplierName,c.buy_time,c.buy_status
				from caigou c
				LEFT JOIN   
				supplier s ON c.sid = s.sid
				where goodsname like concat('%',?,'%')`,
	// 修改数据
	updatesql: `update caigou 
				set goodsname=?,price=?,num=?,total=?,sid=?
				where cid=? `,
	// 新增采购商品，buy_status默认为1（）
	addsql: `insert into caigou(goodsname,price,num,total,sid) 
			values(?,?,?,?,?) `,

	// 检查即将进入商品列表的商品cid是否重复
	checkcid: `select count(*) from goods where cid=? `,
	//将采购商品放入商品列表，商品图片、商品类别、商品描述为空
	putgoodslist: `INSERT INTO goods (goodsname,price,stock,cid)  
					SELECT goodsname,price,num,cid  
					FROM caigou  
					WHERE cid=?;
					UPDATE caigou
					SET buy_status = 2  
					WHERE cid=?;
					`,
	// 根据cid给添加到商品列表的采购商品添加图片、商品类别、描述
	adddetail: `update goods
				set tid=?,imgs=?,description=?  
				where cid=?`,
	delsql:  `delete from caigou 
			where cid=? `
			

}
module.exports = router;
var express = require('express');
const dbUtils = require('../utils/DBUtils.js')
var router = express.Router();

//添加地址信息 添加地址时系统默认is_default=0（即非默认地址）修改时可将非默认地址改为默认地址，也可将默认地址改为非默认地址
//地址信息中除默认地址之外的信息由一个接口完成，默认地址设置为一个接口，取消默认为一个接口，修改地址这一块共需要三个接口
//默认的地址只能有一个！！
//删除不管是否默认都可删除

//添加地址信息        接口已测试成功
// insert into address(user_id,phone,uname,is_default,address,created_at)
//  values(user_id=?,phone=?,uname=?,0,address=?,NOW())
router.post('/add', async function (request, response, next) {
	try {
		if (request.body.user_id == null || request.body.user_id == "" ||
			request.body.phone == null || request.body.phone == "" ||
			request.body.uname == null || request.body.uname == "" ||
			request.body.address == null || request.body.address == ""

		) {
			//返回json数据
			response.status(500).send({
				status: false,
				errMsg: "数据不完整，无法添加"
			})
			return;
		}

		let results = await dbUtils.executeUpdate(addressSqls.addSql,
			[
				request.body.user_id,
				request.body.phone,
				request.body.uname,

				request.body.address,

			])
		response.send(results)
	} catch (err) {
		response.send(err)
		return;
	}
});

// update address set user_id=?,phone=?,uname=?,address=?,updated_at=NOW()
//                          where address_id=?
//修改地址信息中除是否默认之外的信息    接口已测试成功
router.post('/update', async function (request, response, next) {
	try {
		console.log(request.body)
		if (request.body.address_id == null || request.body.address_id == "") {
			//返回json数据
			response.status(500).send({
				status: false,
				errMsg: "数据不存在，无法修改"
			})
			return;
		}

		//user_id=?,phone=?,uname=?,address=?,updated_at=NOW()
		let results = await dbUtils.executeUpdate(addressSqls.updateaddressSql,
			[
				request.body.user_id,
				request.body.phone,
				request.body.uname,
				request.body.address,
				request.body.address_id,
			])
		response.send(results)
	} catch (err) {
		response.send(err)
		return;
	}
});

//设置默认set   接口测试成功
router.post('/set', async function (request, response, next) {
	try {
		const addressId = request.body.address_id;
		const uid = request.body.user_id;
		const updateQuery = 'UPDATE address SET is_default = 0 WHERE user_id=?;UPDATE address SET is_default = 1 WHERE user_id=? and address_id=?';
		const results = await dbUtils.executeUpdate(updateQuery, [uid, uid, addressId]);
		response.send(results);
	} catch (err) {
		console.error("Error setting default address:", err); // 记录错误以供调试  
		response.send(err)
		return;
	}
});

//取消默认cancel   接口测试成功
router.post('/cancel', async function (request, response, next) {
	try {
		const cancelSql = 'UPDATE address SET is_default =0  WHERE address_id=? and user_id=?  ;';
		let results = await dbUtils.executeUpdate(cancelSql, [request.body.address_id, request.body.user_id])

		response.send(results);
		console.log(results)

	} catch (err) {
		response.send(err)
		return;
	}
});

//删除地址信息   接口已测试成功
router.post('/del', async function (request, response, next) {
	try {
		console.log(request.body)
		if (request.body.address_id == null || request.body.address_id == "") {
			//返回json数据
			response.status(500).send({
				status: false,
				errMsg: "数据不存在，无法删除"
			})
			return;
		}
		let results = await dbUtils.executeUpdate(addressSqls.deladdressSql,
			[request.body.address_id])
		response.send(results)
		if (rusults.address_id == null) {
			response.send('删除成功')
		}
	} catch (err) {
		response.send(err)
		return;
	}
});
//根据用户电话模糊查询   接口已测试成功
router.post('/select', async function (request, response, next) {
	try {
		console.log(request.body)
		if (
			request.body.phone == null || request.body.phone == ""
		) {
			//返回json数据
			response.status(500).send({
				status: false,
				errMsg: "数据不存在，无法查询"
			})
			return;
		}
		let results = await dbUtils.executeQuery(addressSqls.seladdressSql,
			[request.body.phone])
		response.send(results)
	} catch (err) {
		response.send(err)
		return;
	}
});
//根据用户姓名模糊查询   接口已测试成功
router.post('/selectu', async function (request, response, next) {
	try {
		console.log(request.body)
		if (
			request.body.uname == null || request.body.uname == ""
		) {
			//返回json数据
			response.status(500).send({
				status: false,
				errMsg: "数据不存在,无法查询"
			})
			return;
		}
		let results = await dbUtils.executeQuery(addressSqls.selunameSql,
			[request.body.uname])
		response.send(results)
	} catch (err) {
		response.send(err)
		return;
	}
});
//调取全部的地址
router.post('/all', async function (request, response, next) {
	try {
		const allsql = 'SELECT address_id,user_id,uname,phone,address,is_default,updated_at,created_at from address';
		let results = await dbUtils.executeQuery(allsql, [])
		response.send(results)
	} catch (err) {
		response.send(err)
		return;
	}
});

const addressSqls = {
	addSql: `insert into address(user_id,phone,uname,is_default,address,created_at)
    values(?,?,?,0,?,NOW())`,
	updateaddressSql: `update address set user_id=?,phone=?,uname=?,address=?,updated_at=NOW()
                         where address_id=?`,

	Sql: `select count(address_id) as count from address where is_default=1`,

	canSql: `select is_default from address where address_id=?`,
	// cancelSql:`update address set is_default=0,updated_at=NOW()
	//                         where address_id=?`,
	deladdressSql: `delete  from address where address_id=?`,
	seladdressSql: `SELECT address_id,user_id,uname,phone,address,is_default,created_at,updated_at
                   from address
                     where phone like concat('%',?,'%')`,
	selunameSql: `SELECT address_id,user_id,uname,phone,address,is_default,created_at,updated_at
                   from address
                     where uname like concat('%',?,'%')`
}
module.exports = router;
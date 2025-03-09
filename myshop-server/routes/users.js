var express = require('express');
const dbUtils= require('../utils/DBUtils.js')
var router = express.Router();


// 添加
router.post('/add', async  function(request, response, next) {
    try{
        if(request.body.uname==null || request.body.uname==""||
        request.body.upwd==null || request.body.upwd=="" ||
        request.body.avatar==null || request.body.avatar=="" ||
        request.body.phone==null || request.body.phone=="" ||
        request.body.role==null || request.body.role=="" ||
        request.body.is_locked==null || request.body.is_locked=="" ||
        request.body.name==null || request.body.name==""||
		 request.body.created_at==null || request.body.created_at==""){
            //返回json数据
            response.status(500).send({
                status:false,
                errMsg:"缺少参数"
            })
            return;
        }
        let results = await dbUtils.executeQuery(usersSqls.addUsersSql,
                                        [request.body.uname,
                                        request.body.upwd,
                                        request.body.avatar,
                                        request.body.phone,
                                        request.body.role,
                                        request.body.is_locked,
                                        request.body.name,
										request.body.created_at])
        response.send(results)
    }catch(err){
        response.send(err)
        return;
    }
});

// 删除
router.post('/del', async  function(request, response, next) {
    try{
        console.log(request.body)
        if(request.body.uid==null || request.body.uid==""||
            request.body.is_locked==null || request.body.is_locked==""||
            request.body.role==null || request.body.role=="")
        {
            //返回json数据
            response.status(500).send({
                status:false,
                errMsg:"缺少参数"
            })
            return;
        }
        let results = await dbUtils.executeUpdate(usersSqls.delUsersSql,
                                        [   request.body.is_locked,
                                            request.params.is_locked,
                                            request.body.uid])
        response.send(results)
    }catch(err){
        response.send(err)
        return;
    }
});

// 根据uid获取用户信息
router.get('/get/:uid', async function(request, response, next) {
    try{
        let results = await  dbUtils.executeQuery(usersSqls.getUserSql,[request.params.uid])
        response.send(results)
    }catch(err){
        response.status(500).send(JSON.stringify(err))
    }
 
});

// 修改用户信息
router.post('/update', async  function(request, response, next) {
    try{
        console.log(request.body)
        if(request.body.uid==null || request.body.uid==""||
            request.body.uname==null || request.body.uname==""||
			request.body.phone==null||request.body.phone==""||
            request.body.avatar==null||request.body.avatar==""||
            request.body.upwd==null||request.body.upwd==""        )
        {
            //返回json数据
            response.status(500).send({
                status:false,
                errMsg:"缺少参数"
            })
            return;
        }
        let results = await dbUtils.executeUpdate(usersSqls.updateUsersSql,
                                        [   request.body.uname,
                                            request.body.avatar,
											request.body.phone,
                                            request.body.upwd,
                                            request.body.uid ])
        response.send(results)
    }catch(err){
        response.send(err)
        return;
    }
});

// 用户列表
router.post('/list',async function(req,res,next){
    try{
        let results =await dbUtils.executeQuery(usersSqls.showlist)
        res.send(results);
    }catch(err){
        res.send(err)
    }
})


// 禁用用户
router.post('/locked',async function(req,res,next){
    try{
    if(req.body.uid==""||req.body.uid==null)
    {
        res.status(500).send({
            status:false,
            errMsg:'填写uid'
        })
        return;
    }
    let results= await dbUtils.executeUpdate(usersSqls.lockedsql,[req.body.uid])
    res.send(results)
    }catch(err){
        res.send(err)
    }
})


// 解除禁用
// 禁用用户
router.post('/nolocked',async function(req,res,next){
    try{
    if(req.body.uid==""||req.body.uid==null)
    {
        res.status(500).send({
            status:false,
            errMsg:'填写uid'
        })
        return;
    }
    let results= await dbUtils.executeUpdate(usersSqls.nolocked,[req.body.uid])
    res.send(results)
    }catch(err){
        res.send(err)
    }
})

const usersSqls={
   loginSql:`select uid,uname,upwd,avatar,phone,role,created_at,updated_at,name
               from users
               where is_locked=0 and uname=? and upwd=?`,
    addUsersSql:`insert  into users(uname,upwd,avatar,phone,role,is_locked,created_at,name,) 
    values (?,?,?,?,?,0,now(),?)`,
    updateUsersSql:`update users set uname=?,avatar=?,phone=?,upwd=?   where uid=?`,
    delUsersSql:`update users set is_locked=?,updated_at=now() where uid=?`,
    // changePwd:`update users upwd=? where uid=? and upwd=?`,
    getUserSql:`select uid,uname,avatar,phone,role,created_at,updated_at
                   from users where uid=?`,
    showlist:`select uid,uname,avatar,phone,role,created_at,updated_at,is_locked from users`,
    lockedsql:`update users set is_locked=1  where uid=? `,
    nolocked:`update users set is_locked=0  where uid=?`
   }


module.exports = router;
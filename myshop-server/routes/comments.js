var express = require('express');
const dbUtils= require('../utils/DBUtils.js')
var router = express.Router();
 
const app = express();  
//前后台均可查看所有的评价列表
//增删改查  在前端：前台可增加和查询评价，已评价的内容不可删除；
//前台个人使用订单编号查询  前台商场使用商品编号查询评论
               // 1
// 前台商城和个人均使用好评、中评、差评分类查询评价 使用选择是否有图片来查看评论
                 // 2 good   3 middle    4 bad                5
	
//后台：管理员只能查询
//后台使用用户编号模糊查询     使用选择是否有图片来查看评论           
                               // 6          7       8                  
//添加评价信息
router.post('/add', async  function(request, response, next) {
  try{
		if(
		request.body.gid==null || request.body.gid=="" ||
		request.body.uid==null || request.body.uid=="" ||
		request.body.cid==null || request.body.cid==""||
		request.body.content==null || request.body.content==""||
		request.body.rate==null || request.body.rate=="" 
		 ){
			//返回json数据
			response.status(500).send({
				status:false,
				errMsg:"缺少参数"
			})
			return;
		}
		let results = await dbUtils.executeQuery(commentsSqls.addcommentsSql, 
										[request.body.gid,
										request.body.uid,
										request.body.cid,
										request.body.content,
										request.body.rate,
										request.body.created_at
										])
		response.send(results)
	}catch(err){
		response.send(err)
		return;
	}
});
//前后台查看所有的评价列表
router.post('/sql', async function(request, response, next) {  
     try{
	  const results = await dbUtils.executeQuery(commentsSqls.Sql, []);  
  
        if (results == null || results.length == 0) {  
            response.status(500).send({  
                status: false,  
                errMsg: "没有评价记录"  
            });  
            return;  
        }  
  
        response.send(results);  
    } catch (err) {  
        response.send(err);  
    }  
});
//用户在前台使用订单编号查询
router.post('/uselect', async function(request, response, next) {  
    try {  
        if (!request.body.cid) {  
            response.status(500).send({  
                status: false,  
                errMsg: "请求中没有包含订单编号"  
            });  
            return;  
        }  
  
        const results = await dbUtils.executeQuery(commentsSqls.uselectSql, [request.body.cid]);  
  
        if (results == null || results.length == 0) {  
            response.status(500).send({  
                status: false,  
                errMsg: "没有找到与该订单编号相关的记录"  
            });  
            return;  
        }  
  
        response.send(results);  
    } catch (err) {  
        response.send(err);  
    }  
});
//前台商城使用商品编号查询
router.post('/uorderselect', async function(request, response, next) {  
    try {  
        if (!request.body.gid) {  
            response.status(500).send({  
                status: false,  
                errMsg: "请求中没有包含商品编号"  
            });  
            return;  
        }    
        const results = await dbUtils.executeQuery(commentsSqls.uorderselectSql, [ 
            request.body.gid]);  
  
        if (results == null || results.length == 0) {  
            response.status(500).send({  
                status: false,  
                errMsg: "没有找到与该商品编号相关的记录"  
            });  
            return;  
        }  
  
        response.send(results);  
    } catch (err) {  
        response.send(err);  
    }  
});
//前台使用好评查询，后台也可以使用
router.post('/goodselect', async function(request, response, next) {  
     try {  
    
        let results = await dbUtils.executeQuery(commentsSqls.goodSql, []);  
        response.send(results);   
    } catch (err) {  
         response.send(err); 
    }  
});
//前台使用中评查询，后台也可以使用
router.post('/middleselect', async function(request, response, next){
 try {   
        let results = await dbUtils.executeQuery(commentsSqls.middleSql, []);  
        response.send(results);   
    } catch (err) {  
         response.send(err); 
    }  
});
//前台使用差评查询,后台也可以使用   已测试成功
router.post('/badselect', async function(request, response, next) {  
    try {  
       
       let results = await dbUtils.executeQuery(commentsSqls.badSql, []);    
        response.send(results);   
    } catch (err) {  
         response.send(err); 
    }  
});
//前台使用有图片来查看评论 已测试成功
router.post('/imgselect', async  function(request, response, next) {
	try{	
		let results = await dbUtils.executeQuery(commentsSqls.imgselectSql,[])
		response.send(results)
	}catch(err){
		response.send(err)
		return;
	}
});

//管理员在后台使用用户编号模糊查询   已查询成功
router.post('/mselect', async  function(request, response, next) {  
					 try{  
					 if(request.body.uid == null || request.body.uid == ""){  
					 //返回json数据  
					 response.status(500).send({  
					 status:false,  
					 errMsg:"用户编号为空"  
					 })  
					 return;  
					 }  
			
   let results = await dbUtils.executeQuery(commentsSqls.mselectSql,  
												 [request.body.uid])  
										
					response.send(results)  							   
					if (results == null){  
					response.status(500).send({  
					status:false,  
					errMsg:"该用户编号不存在"  
						})  
					return;  
					 }  
				}catch(err){  
					response.send(err)  
				    return;  
					}  
			});		

							






const commentsSqls={
	addcommentsSql:`INSERT INTO comments(gid, uid,cid,content, rate,created_at) 
                    VALUES ( ?, ?, ?, ?,?, now())`,   
	Sql:`SELECT comments.mid,comments.gid,comments.uid,uname,cid,rate,content,imgs,comments.created_at,comments.updated_at
                FROM  comments  
                LEFT JOIN users ON comments.uid = users.uid`,						   
							   
	//用户在前台使用订单编号查询
	uselectSql:`SELECT comments.mid,comments.gid,comments.uid,uname,cid,rate,content,imgs,comments.created_at,comments.updated_at
                FROM  comments  
                LEFT JOIN users ON comments.uid = users.uid
                WHERE cid=?`,
	uorderselectSql:`SELECT comments.mid,comments.gid,comments.uid,uname,cid,rate,content,imgs,comments.created_at,comments.updated_at
                     FROM  comments  
                     LEFT JOIN users ON comments.uid = users.uid
                      WHERE gid=?`,
	goodSql:`SELECT comments.mid,comments.gid,comments.uid,uname,cid,rate,content,imgs,comments.created_at,comments.updated_at
                     FROM  comments  
                     LEFT JOIN users ON comments.uid = users.uid
                    WHERE rate=1`,				   
	middleSql:`SELECT comments.mid,comments.gid,comments.uid,uname,cid,rate,content,imgs,comments.created_at,comments.updated_at
                     FROM  comments  
                     LEFT JOIN users ON comments.uid = users.uid
                    WHERE rate=2`,
	badSql:`SELECT comments.mid,comments.gid,comments.uid,uname,cid,rate,content,imgs,comments.created_at,comments.updated_at
                     FROM  comments  
                     LEFT JOIN users ON comments.uid = users.uid
                    WHERE rate=3`,
	imgselectSql:`SELECT comments.mid,comments.gid,comments.uid,uname,cid,rate,content,imgs,comments.created_at,comments.updated_at
                     FROM  comments  
                     LEFT JOIN users ON comments.uid = users.uid
                      WHERE imgs IS NOT NULL`,				   
	mselectSql:`SELECT  c.mid,c.gid,c.uid,u.uname,c.cid,c.rate,c.content,c.imgs,c.created_at,c.updated_at  
                FROM comments c  
                LEFT JOIN users u ON c.uid = u.uid  
                WHERE c.uid LIKE CONCAT('%', ?, '%')`
}



module.exports = router;
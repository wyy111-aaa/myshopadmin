//导入 2个模块
//生成token
const jwt = require('jsonwebtoken');
//解析token
const {expressjwt: expressJWT} = require('express-jwt');
 
 
//jwt配置
const jwtConfig= {
    //密钥：自定义
  secretKey: 'zhang_jwttoken',
    //加密方式
    //HS256 使用同一个「secret_key」进行签名与验证 
  algorithms:['HS256'],
  unlessPath:["/users/login", "/users/register","/index/*"]
};
 
//解析配置
const jwtAuth = expressJWT({secret:jwtConfig.secretKey,
                            algorithms:jwtConfig.algorithms,
                            //获取请求中 头部或url带的token值
                            getToken: function fromHeaderOrQuerystring(req) {
                                  if (
                                    req.headers.authorization &&
                                    req.headers.authorization.split(" ")[0] === "Bearer"
                                  ) {
                                    return req.headers.authorization.split(" ")[1];
                                  } else if (req.query && req.query.token) {
                                    return req.query.token;
                                  }
                                  return null;
                                }
                    })      
                .unless({path:jwtConfig.unlessPath}); 
 
 
//生成token
const tokenStr=(users)=>{
    return `Bearer ${jwt.sign(users,jwtConfig.secretKey , {
            expiresIn: '1d', 
            // 有效期一天 1d
    })}`
}
 
module.exports = {jwtAuth,tokenStr};
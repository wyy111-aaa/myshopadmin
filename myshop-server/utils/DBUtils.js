const mysql = require("mysql")


//数据库配置

// 数据库配置

const dbConfig = {
	host: '39.104.18.139',
	port: 3306,
	user: 'stu',
	password: 'stu111',
	database: '四班9组',
	multipleStatements: true,
}



// const dbConfig={
// 	host:"localhost",
// 	port:3306,
// 	user:"root",
// 	password:"123456",
// 	database:"四班9组"
// }



//访问数据库的工具类
class DBUtils {

	//建立程序和数据库的连接，
	getConn() {
		//mysql.createConnection() 返回一个连接对象，桥  
		return mysql.createConnection(dbConfig)
	}

	//执行增删改查的通用方法
	executeSql(sql, params = []) {
		return new Promise((resolve, reject) => {
			//1、建立连接
			let conn = this.getConn();
			//2、执行命令
			conn.query(sql, params, (error, results) => {
				if (error) {
					reject(error);
				} else {
					//console.log(results)
					resolve(JSON.parse(JSON.stringify(results)));
				}
				conn.end();
			})
		})

	}

	//通用增删改
	executeUpdate(sql, params = []) {
		return new Promise((resolve, reject) => {
			//1、建立连接
			let conn = this.getConn();
			//2、执行命令
			conn.query(sql, params, (error, results) => {
				console.log(sql)

				if (error) {
					reject({
						status: false,
						errMsg: error
					});
				} else {
					//
					let rs = JSON.parse(JSON.stringify(results))
					console.log(rs)
					if (rs.affectedRows >= 1) {
						resolve({
							status: true,
						});
					} else {
						resolve({
							status: false,
							errMsg: "执行有误"
						});
					}

				}
				conn.end();
			})
		})

	}

	//通用查询
	executeQuery(sql, params = []) {
		return new Promise((resolve, reject) => {
			//1、建立连接
			let conn = this.getConn();
			//2、执行命令
			conn.query(sql, params, (error, results) => {
				console.log(sql)
				if (error) {
					reject({
						status: false,
						errMsg: error
					});
				} else {
					let rs = JSON.parse(JSON.stringify(results))
					console.log(rs)
					resolve({
						status: true,
						data: rs
					});
				}
				conn.end();
			})
		})
	}
}

module.exports = new DBUtils()
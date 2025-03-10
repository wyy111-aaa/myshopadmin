/**
 * @param {Array} data
 */
function toTree(data) {
	
   // 如果不是数组停止执行
  if(!Array.isArray(data)) return

  // 删除 所有 children,以防止多次调用
  data.forEach(item => {
    delete item.children;
  });

  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  let map = {};

  data.forEach(function (item) {
    map[item.tid] = item;
  });

  let val = [];

  data.forEach(item => {
    // 以当前遍历项的 pid,去map对象中找到索引的 id
    let parent = map[item.pid];

    // 如果找到索引，那么说明此项不在顶级当中, 
	// 那么需要把此项添加到，他对应的父级中
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      //如果没有在map中找到对应的索引ID,当前的item添加到 val 结果集中，作为顶级
      val.push(item);
    }
  })
  
  return val;
}

module.exports = toTree
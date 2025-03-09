let firstMenu = {
    id: 11,
    name: '采购信息',
    url: '/main/product/purchase',
    type: 2
}

/**
 *
 * @param menuList
 * @param currentPath
 */

// 从给定的菜单列表 (menuList) 中找到与当前路径 (currentPath) 匹配的菜单项
export function pathMapMenu(menuList, currentPath) {
    // arr 用于存储所有子菜单项
    // newArr 用于存储与当前路径匹配的菜单项
    let arr = []
    let newArr = []
    for (let i = 0; i < menuList.length; i++) {
        if (menuList[i].type === 1) {
            for (let j = 0; j < menuList[i].children.length; j++) {
                arr.push(menuList[i].children[j])
            }
        }
    }
    if (arr) {
        newArr = arr.filter(item => item.url === currentPath)
    }
    if (newArr) {
        return newArr[0]
    }
    return {}
}

// 从给定的菜单列表 (menuList) 中生成一个面包屑导航路径 (breadcrumb)，基于当前的路径 (currentPath)。
export function pathMapBreadcrumb(menuList, currentPath){
    const breadcrumb = []
    // 遍历 menuList 并根据 currentPath 构建面包屑导航的。
    Loop(menuList, currentPath,breadcrumb)
    return breadcrumb
}

// 递归函数，用于遍历 menuList 并构建面包屑导航。
export function Loop(menuList, currentPath,breadcrumb){
    for (const menu of menuList) {
        if(menu.type === 1){
            let findMenu = Loop(menu.children,currentPath)
            if(findMenu && breadcrumb){
                breadcrumb.push({ name: menu.name })
                breadcrumb.push({ name: findMenu.name })
            }
        }else if(menu.type === 2 && menu.url === currentPath){
            return menu
        }
    }
}


export {firstMenu}

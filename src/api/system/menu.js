import request from '@/utils/request'

// 获取菜单列表
export function getMenuList(data) {
  return request({
    url: '/system/api/v1/admin/menu/getMenuList',
    method: 'post',
    data: data
  })
}
// 获取菜菜单下拉树
export function getMenuTree() {
  return request({
    url: '/system/api/v1/admin/menu/getMenuOptionList',
    method: 'get'
  })
}
// 新增菜单信息
export function addMenu(data) {
  return request({
    url: '/system/api/v1/admin/menu/insert',
    method: 'post',
    data: data
  })
}
// 修改菜单信息
export function updateMenu(data) {
  return request({
    url: '/system/api/v1/admin/menu/update',
    method: 'post',
    data: data
  })
}
// 修改菜单信息
export function delMenu(menuId) {
  return request({
    url: `/system/api/v1/admin/menu/delete?menuId=${menuId}`,
    method: 'post'
  })
}

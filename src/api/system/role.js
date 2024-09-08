import request from '@/utils/request'

// 获取角色列表
export function getRoleList(data) {
  return request({
    url: '/system/api/v1/admin/role/getPageRoleList',
    method: 'post',
    data: data
  })
}
// 获取菜单下拉树
export function getMenuTreeselect(data) {
  return request({
    url: '/system/api/v1/admin/menu/getAllMenuList',
    method: 'get'
  })
}
// 新增角色
export function addRole(data) {
  return request({
    url: '/system/api/v1/admin/role/insert',
    method: 'post',
    data: data
  })
}
// 更新角色
export function updateRole(data) {
  return request({
    url: '/system/api/v1/admin/role/update',
    method: 'post',
    data: data
  })
}
// 获取当前角色下面的菜单权限
export function getRole(roleId) {
  return request({
    url: `/system/api/v1/admin/role/getRoleInfoByCode/${roleId}`,
    method: 'get'
  })
}

// 获取当前角色下面的菜单权限
export function delRole(roleIdList) {
  return request({
    url: '/system/api/v1/admin/role/delete',
    method: 'post',
    data: { roleIdList: roleIdList }
  })
}

// 修改角色状态
export function changeRoleStatus(roleId, status) {
  return request({
    url: `/system/api/v1/admin/role/updateStatusRole/${roleId}/${status}`,
    method: 'post'
  })
}

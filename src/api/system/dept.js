import request from '@/utils/request'

// 获取部门信息列表
export function getDeptList(data) {
  return request({
    url: '/system/api/v1/admin/sysDept/getDeptList',
    method: 'post',
    data: data
  })
}

// 获取部门信息树形结构
export function getDeptTree() {
  return request({
    url: '/system/api/v1/admin/sysDept/getAllDeptList',
    method: 'get'
  })
}

// 增加部门信息
export function addDept(data) {
  return request({
    url: '/system/api/v1/admin/sysDept/insert',
    method: 'post',
    data: data
  })
}

// 修改部门信息
export function updateDept(data) {
  return request({
    url: '/system/api/v1/admin/sysDept/update',
    method: 'post',
    data: data
  })
}

// 删除部门信息
export function delDept(deptId) {
  return request({
    url: `/system/api/v1/admin/sysDept/delete?deptId=${deptId}`,
    method: 'post'
  })
}

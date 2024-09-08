import request from '@/utils/request'

// 获取数据字典类型列表
export function getDictType(data) {
  return request({
    url: '/system/api/v1/admin/sysDict/getDictPage',
    method: 'post',
    data: data
  })
}
// 新增数据字典类型
export function addDictType(data) {
  return request({
    url: '/system/api/v1/admin/sysDict/insert',
    method: 'post',
    data: data
  })
}
// 更新数据字典类型
export function updateDictType(data) {
  return request({
    url: '/system/api/v1/admin/sysDict/update',
    method: 'post',
    data: data
  })
}
// 删除数据字典类型
export function delDictType(data) {
  return request({
    url: '/system/api/v1/admin/sysDict/delete',
    method: 'post',
    data: data
  })
}

// 获取数据字典类型item数据列表
export function getDictTypeItem(data) {
  return request({
    url: '/system/api/v1/admin/sysDictItem/getDictDateListByTypeCode',
    method: 'post',
    data: data
  })
}
// 新增数据字典类型item数据
export function addDictTypeItem(data) {
  return request({
    url: '/system/api/v1/admin/sysDictItem/insert',
    method: 'post',
    data: data
  })
}
// 更新数据字典类型item数据
export function updateDictTypeItem(data) {
  return request({
    url: '/system/api/v1/admin/sysDictItem/update',
    method: 'post',
    data: data
  })
}
// 删除数据字典类型item数据
export function delDictTypeItem(data) {
  return request({
    url: '/system/api/v1/admin/sysDictItem/delete',
    method: 'post',
    data: data
  })
}

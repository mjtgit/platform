import request from '@/utils/request'

// 获取系统配置类型列表
export function getConfigType(data) {
  return request({
    url: '/system/api/v1/admin/sysConfig/getConfigPage',
    method: 'post',
    data: data
  })
}
// 新增系统配置类型
export function addConfigType(data) {
  return request({
    url: '/system/api/v1/admin/sysConfig/insert',
    method: 'post',
    data: data
  })
}
// 更新系统配置类型
export function updateConfigType(data) {
  return request({
    url: '/system/api/v1/admin/sysConfig/update',
    method: 'post',
    data: data
  })
}
// 删除系统配置类型
export function delConfigType(data) {
  return request({
    url: '/system/api/v1/admin/sysConfig/delete',
    method: 'post',
    data: data
  })
}

// 获取系统配置类型item数据列表
export function getConfigTypeItem(data) {
  return request({
    url: '/system/api/v1/admin/sysConfigItem/getConfigItemPage',
    method: 'post',
    data: data
  })
}
// 新增系统配置类型item数据
export function addConfigTypeItem(data) {
  return request({
    url: '/system/api/v1/admin/sysConfigItem/insert',
    method: 'post',
    data: data
  })
}
// 更新系统配置类型item数据
export function updateConfigTypeItem(data) {
  return request({
    url: '/system/api/v1/admin/sysConfigItem/update',
    method: 'post',
    data: data
  })
}
// 删除系统配置类型item数据
export function delConfigTypeItem(data) {
  return request({
    url: '/system/api/v1/admin/sysConfigItem/delete',
    method: 'post',
    data: data
  })
}

import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/admin/manager/list',
    method: 'post',
    data
  })
}
export function queryManagerInfo(uid) {
  return request({
    url: '/admin/manager/info',
    method: 'post',
    params: { uid }
  })
}
export function enableUser(uid) {
  return request({
    url: '/admin/manager/enable',
    method: 'post',
    params: { uid }
  })
}
export function disableUser(uid) {
  return request({
    url: '/admin/manager/disable',
    method: 'post',
    params: { uid }
  })
}
export function createUser(data) {
  return request({
    url: '/admin/manager/add',
    method: 'post',
    data
  })
}
export function queryRoleNames(uid) {
  return request({
    url: '/admin/role/names',
    method: 'post',
    params: { uid }
  })
}
export function deleteUser(id) {
  return request({
    url: '/admin/manager/delete',
    method: 'post',
    params: { id }
  })
}
export function update(data) {
  return request({
    url: '/admin/manager/update',
    method: 'post',
    data
  })
}

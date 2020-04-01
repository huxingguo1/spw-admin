import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/admin/role/list',
    method: 'post',
    data
  })
}
export function queryAllRoles() {
  return request({
    url: '/admin/role/all',
    method: 'post'
  })
}

export function update(data) {
  return request({
    url: '/admin/role/name/update',
    method: 'post',
    data
  })
}
export function createRole(name) {
  return request({
    url: '/admin/role/add',
    method: 'post',
    params: { name }
  })
}
export function deleteRole(rid) {
  return request({
    url: '/admin/role/delete',
    method: 'post',
    params: { rid }
  })
}
export function updatePermission(data) {
  return request({
    url: '/admin/permissions/add',
    method: 'post',
    data
  })
}

export function queryManagerByRoleName(name, state) {
  return request({
    url: '/admin/role/user/query',
    method: 'post',
    params: { name, state }
  })
}


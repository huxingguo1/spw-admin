import request from '@/utils/request'
export function list(data) {
  return request({
    url: '/admin/permissions/all',
    method: 'post',
    data
  })
}

export function queryRolePermissions(rid) {
  return request({
    url: '/admin/permissions/role',
    method: 'post',
    params: { rid }
  })
}

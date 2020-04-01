import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: '/admin/user/list',
    method: 'post',
    data
  })
}

export function queryUserProfile(uid) {
  return request({
    url: '/admin/user/info',
    method: 'post',
    params: { uid }
  })
}

export function enableUser(uid) {
  return request({
    url: '/admin/user/enable',
    method: 'post',
    params: { uid }
  })
}

export function disableUser(uid) {
  return request({
    url: '/admin/user/disable',
    method: 'post',
    params: { uid }
  })
}

export function userCount() {
  return request({
    url: '/admin/user/count',
    method: 'post'
  })
}

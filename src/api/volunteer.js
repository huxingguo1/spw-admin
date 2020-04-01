import request from '@/utils/request'

export function queryList(data) {
  return request({
    url: '/admin/user/v/list',
    method: 'post',
    data
  })
}
export function queryAll(data) {
  return request({
    url: '/admin/user/v/all',
    method: 'post',
    data
  })
}

export function queryAuditList(data) {
  return request({
    url: '/admin/user/v/audit/list',
    method: 'post',
    data
  })
}

export function auditPass(uid) {
  return request({
    url: '/admin/user/v/audit/pass',
    method: 'post',
    params: { uid }
  })
}

export function auditRefuse(uid) {
  return request({
    url: '/admin/user/v/audit/refuse',
    method: 'post',
    params: { uid }
  })
}

export function volunteetprofile(uid) {
  return request({
    url: '/admin/user/v/profile',
    method: 'post',
    params: { uid }
  })
}

export function unauditVolunteerCount() {
  return request({
    url: '/admin/user/v/count',
    method: 'post'
  })
}

export function enableVolunteer(uid) {
  return request({
    url: '/admin/user/v/enable',
    method: 'post',
    params: { uid }
  })
}

export function disableVolunteer(uid) {
  return request({
    url: '/admin/user/v/disable',
    method: 'post',
    params: { uid }
  })
}

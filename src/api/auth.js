import request from '@/utils/request'

export function login(data) {
  // url: '/admin/auth/login/security',
  return request({
    url: '/admin/auth/login',
    method: 'post',
    params: data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/user/profile',
    method: 'post',
    params: { token }
  })
}

export function refreshToken(token) {
  return request({
    url: '/admin/auth/token/refresh',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/auth/logout',
    method: 'post'
  })
}

export function loginPhone(phone) {
  return request({
    url: '/admin/auth/login/sms',
    method: 'post',
    params: { phone }
  })
}

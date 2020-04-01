import request from '@/utils/request'

export function listProvince() {
  return request({
    url: '/cs/region/province/list',
    method: 'post'
  })
}

export function listCity(id) {
  return request({
    url: '/cs/region/city/list',
    method: 'post',
    params: { id }
  })
}

export function listDistrict(id) {
  return request({
    url: '/cs/region/district/list',
    method: 'post',
    params: { id }
  })
}

export function listStreet(id) {
  return request({
    url: '/cs/region/street/list',
    method: 'post',
    params: { id }
  })
}

export function queryAddress(data) {
  return request({
    url: '/cs/region/address',
    method: 'post',
    data
  })
}

export function queryAddressInfo(data) {
  return request({
    url: '/cs/region/query',
    method: 'post',
    data
  })
}


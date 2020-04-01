import request from '@/utils/request'
export function commodityQuery(data) {
  return request({
    url: '/admin/commodity/query',
    method: 'post',
    data
  })
}
export function createProperty(data) {
  return request({
    url: '/admin/attribute/add',
    method: 'post',
    data
  })
}
export function commodityState(id, isNoPutaway) {
  return request({
    url: '/admin/commodity/state',
    method: 'post',
    params: { id, isNoPutaway }
  })
}

export function queryAll(data) {
  return request({
    url: '/admin/commodity/count/query',
    method: 'post',
    data
  })
}
